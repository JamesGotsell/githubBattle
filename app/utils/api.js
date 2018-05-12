const axios = require('axios');

const id = 'YOUR_ClIENT_ID';
const sec = 'YOUR_SECRET';

const params = `?client_i${id}&client_secret=${sec}`;

function getProfile(username) {
  return axios.get(`https://api.github.com/users/${username}`)
    .then(((users) => users.data))
}

function getRepos(username) {
  return axios.get(`https://api.github.com/users/'${username}/repos`)
}

function getStarCount(repos) {
  return repos.data.reduce((count, { stargazers_count }) => count + stargazers_count, 0)
}

function calculateScore({ followers }, repos) {
  return (followers * 3) + getStarCount(repos)
}

function handleError() {
  console.warn(error);
  return null;
}

function getUserData(player) {
  return Promise.all([
    getProfile(player),
    getRepos(player)
  ]).then(([profile, repos]) => ({
    profile,
    score: calculateScore(profile, repos)
  }))
}

function sortPlayers(players) {
  return players.sort((a, b) => b.score - a.score)
}

module.exports = {

  battle: function (players) {
    return Promise.all(players.map(getUserData))
      .then(sortPlayers)
      .catch(handleError)
  },
  fetchPopularRepos(language) {
    const encodedURI = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`);

    return Promise.get(encodedURI)
      .then(function (response) {
        return response.data.items;
      });
  },
  fetchQuote() {
    const encodedURI = window.encodeURI('http://loremricksum.com/api/?paragraphs=1&quotes=1');

    return Promise.get(encodedURI).then((({ data }) => data.items))
  }
};