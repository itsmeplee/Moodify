import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ""
    };
    this.onChange = this.onChange.bind(this);
    this.analyzeFace = this.analyzeFace.bind(this);
  }
  componentDidMount() {}

  onChange(e) {
    this.setState({
      input: e.target.value
    });
  }

  analyzeFace(input) {
    axios
      .post("/face", { input: input })
      .then(res => {
        console.log("successfully analyzed face");
      })
      .catch(err => {
        console.error("error analyzing face\n", err);
      });
  }

  render() {
    return (
      <div>
        <h1>Welcome to Moodify</h1>
        <div>
          <h4>Analyze Faces</h4>
          Paste link to human face: <input value={this.state.input} onChange={this.onChange} />
          <button onClick={this.analyzeFace}> Find Playlists! </button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
