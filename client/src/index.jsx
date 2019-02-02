import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emotion: '',
      input: "",
      playlists: []
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

  searchPlaylists(mood) {
      axios.post("/search", {emotion: mood})
      .then(res => {
          console.log("successfully searched playlists");
          console.log(res.data['playlists']['items']);
          this.setState({
              playlists: res.data['playlists']['items']
          })
      })
      .catch(err => {
          console.error("error getting playlists\n", err);
      })
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
        <div>
            <button onClick={() => {this.searchPlaylists(this.state.emotion)}}>Search for Playlists</button>
        </div>
        <div>
            <ul>
                {this.state.playlists.map((playlist) => {
                    return <li><a href={playlist.external_urls.spotify}>{playlist.name}</a></li>
                })}
            </ul>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
