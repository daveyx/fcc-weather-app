import React from 'react';
import {render} from 'react-dom';
import axios from 'axios';

class City extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "",
      country: ""
    };
  }

  componentDidMount() {
    axios.get("http://ipinfo.io")
      .then(response => {
      this.setState({
        city: response.data.city,
        country: response.data.country
      });
      this.props.callbackParent(this.state.city, this.state.country)
    }).catch(function (error) {
      console.log("error axios-get1: " + error);
    });
  }

  render() {
    return <div className="city">{this.state.city}, {this.state.country}</div>
  }
}

class Temp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temp: "",
      tempDesc: ""
    };
  }

componentDidMount() {
  let reqUri = "http://api.openweathermap.org/data/2.5/weather?q="
            + this.props.cityProp
            + ","
            + this.props.countryProp
            + "&units=metric&APPID=491b6536b887951b55f654ad8b721733";
  //console.log(reqUri);
  axios.get(reqUri)
      .then(response => {
      this.setState({
        temp: response.data.main.temp,
        tempDesc: response.data.weather[0].main
      });
      this.props.callbackParent(this.state.tempDesc);
    }).catch(function (error) {
      console.log("error axios-get2: " + error);
    });
  }

  render() {
    return <div>
            <div className="temp">{this.state.temp}</div>
            <div className="tempDesc">{this.state.tempDesc}</div>
          </div>;
  }
}

class Icon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    let desc = this.props.tempDescProp.toLowerCase();
    let className = "";
    switch (desc) {
      case 'drizzle':
        className= "showers";
        break;
      case 'clouds':
        className= "cloudy";
        break;
      case 'rain':
        className= "rain";
        break;
      case 'snow':
        className= "snow";
        break;
      case 'clear':
        className= "day-sunny";
        break;
      case 'thunderstom':
        className= "thunderstorm";
        break;
      default:
    }
    return <div className="icon"><i className={`wi wi-${className}`}></i></div>;
  }
}

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "",
      country: "",
      tempDesc: ""
    };
  }

  onCityReceived(city, country) {
    this.setState({city: city, country: country})
  }

  onTempReceived(tempDesc) {
    this.setState({tempDesc: tempDesc});
  }

  render() {
    return <div>
        <City
          callbackParent={(city, country) => this.onCityReceived(city, country)}
        />
      {this.state.city !== "" && this.state.country !== "" ?
        <Temp cityProp={this.state.city} countryProp={this.state.country}
          callbackParent={(tempId) => this.onTempReceived(tempId)}>
        </Temp> : null}
      {this.state.tempDesc !== "" ?
        <Icon tempDescProp={this.state.tempDesc}></Icon> : null}
      </div>;
  }
};

render(<Application />, document.getElementById('container'));
