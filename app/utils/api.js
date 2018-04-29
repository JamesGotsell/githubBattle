var axios = require('axios');

var id = 'YOUR_ClIENT_ID';
var sec = 'YOUR_SECRET';

var params = '?client_i' + id + '&client_secret=' + sec;

function getProfile(username) {
  return axios.get('https://api.github.com/users/' + username)
    .then(function (users) {
      return users.data
    })
}

function getRepos(username) {
  return axios.get('https://api.github.com/users/' + username + '/repos')
}

function getStarCount(repos) {
  return repos.data.reduce(function (count, repo) {
    return count + repo.stargazers_count
  }, 0)
}

function calculateScore(profile, repos) {
  var followers = profile.followers;
  var totalStars = getStarCount(repos)
  return (followers * 3) + totalStars
}

function handleError() {
  console.warn(error);
  return null;
}

function getUserData(player) {
  return axios.all([
    getProfile(player),
    getRepos(player)
  ]).then(function (data) {
    var profile = data[0]
    var repos = data[1]
    return {
      profile: profile,
      score: calculateScore(profile, repos)
    }
  })
}

function sortPlayers(players) {
  return players.sort(function (a, b) {
    return b.score - a.score;
  })
}

module.exports = {

  battle: function (players) {
    return axios.all(players.map(getUserData))
      .then(sortPlayers)
      .catch(handleError)
  },
  fetchPopularRepos: function (language) {
    var encodedURI = window.encodeURI('https://api.github.com/search/repositories?q=stars:>1+language:' + language + '&sort=stars&order=desc&type=Repositories');

    return axios.get(encodedURI)
      .then(function (response) {
        return response.data.items;
      });
  },
  fetchQuote: function () {
    var encodedURI = window.encodeURI('http://loremricksum.com/api/?paragraphs=1&quotes=1');

    return axios.get(encodedURI)
      .then(function (response) {
        console.log(response)
        return response.data.data[0];
      });
  }
};