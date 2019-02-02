import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emotion: '',
      input: ""
    };
  }

  analyzeFace(input) {
    axios
      .post("/face", { input: input })
      .then(res => {
        console.log("successfully analyzed face");
        console.log("this is the res after analyzing the face: ", res.data);
        this.setState({
            emotion: res.data
        })
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
          <h4>Face Analysis</h4>
          Paste link to face...HUMAN ONLY PLEASE:{" "}
          <input
            value={this.state.input}
            onChange={e => {
              this.setState({ input: e.target.value });
            }}
          />
          <button
            onClick={() => {
              this.analyzeFace(this.state.input);
            }}
          >
            {" "}
            ANALYZE FACE!{" "}
          </button>
          <img
            src={this.state.input}
          />
          <h2>This person is {this.state.emotion}</h2>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
