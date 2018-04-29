var React = require('react');
var api = require('../utils/api');

class QoutePage extends React.Component {

  constructor(props) {
    super();
    this.state = {
      Quote: '',
    };
    this.updateQoute = this.updateQoute.bind(this);
  }
  componentDidMount() {
    this.updateQoute()
  }
  updateQoute() {
    api.fetchQuote().then(function (response) {
      console.log(response)
      this.setState(function () {
        return {
          Quote: response
        }
      });
    }.bind(this));
  }

  render() {
    return (
      <div>
        <header>
          <h1>Rick and morty qoute page</h1>
        </header>
        <div>
          {this.state.Quote}
        </div>
      </div>
    )
  }
}

module.exports = QoutePage; 