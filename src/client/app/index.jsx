import React from 'react';
import {render} from 'react-dom';
import axios from 'axios';

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "city not set",
      country: "country not set",
      temp: "temp not set"
    };
  }
  componentDidMount() {
    this.clientInfo()
  }
  weatherInfo() {
    axios.get("http://api.openweathermap.org/data/2.5/weather?q=" + this.state.city + "," + this.state.country + "&units=metric&APPID=3c95b8b52fbaa600c02df827c3ca246c")
      .then(response => {
      this.setState({
        temp: response.data.main.temp
      });
    }).catch(function (error) {
      console.log("error axios-get2: " + error);
    });
  }
  clientInfo() {
    axios.get("http://ipinfo.io")
      .then(response => {
      this.setState({
        city: response.data.city,
        country: response.data.country
      });
      this.weatherInfo();
    }).catch(function (error) {
      console.log("error axios-get1: " + error);
    });
  }
  render() {
    var fah = Math.round( (Number(this.state.temp) * 9)/5 + 32 );
    return <div>{this.state.city}, {this.state.country}, {this.state.temp}&#176;C / {fah} &#176;F</div>
  }
};

render(<Application />, document.getElementById('container'));
