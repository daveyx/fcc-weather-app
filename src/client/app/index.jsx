import React from 'react';
import {render} from 'react-dom';
import axios from 'axios';

/*
  City Component
*/
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
      console.log(this.state.city + " - " + this.state.country);
      this.props.callbackParent(this.state.city, this.state.country)
    }).catch(function (error) {
      console.log("error axios-get1: " + error);
    });
  }

  render() {
    if (this.state.city && this.state.country) {
      return <div className="city">{this.state.city}, {this.state.country}</div>
    } else {
      return  <div>
                <div className="city">
                  Sorry! Your location can not detected by this app.
                </div>
                <div>
                  This app uses ipinfo.io for detect the location<br /><br />
                  Maybe this app will support a manual weather search in the future.<br />
                  Please check back later.
                </div>
              </div>
    }
  }
}

/*
  Temp Component
*/
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
    let temp = Number(this.state.temp);
    if (this.props.tempUnitProp === "F") {
      temp = Math.round( (Number(this.state.temp) * 9)/5 + 32 )
    }
    return <div>
            <div className="temp">{temp}&#176;{this.props.tempUnitProp}</div>
            <div className="tempDesc">{this.state.tempDesc}</div>
          </div>;
  }
}

/*
  Icon Component
*/
class Icon extends React.Component {
  constructor(props) {
    super(props);
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

/*
  Button Component
*/
class Button extends React.Component {
  constructor(props) {
    super(props);
  }
  onClick() {
    let unit = this.props.tempUnitProp === "C" ? "F" : "C";
    this.props.tempUnitChanged(unit);
  }
  render() {
    let unit = this.props.tempUnitProp === "C" ? "F" : "C";
    return <button type="button" onClick={(e) => {this.onClick(e)}}>Show &#176;{unit}</button>
  }
}

/*
  Application Component
*/
class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "",
      country: "",
      tempDesc: "",
      tempUnit: "C"
    };
  }

  onCityReceived(city, country) {
    this.setState({city: city, country: country})
  }

  onTempReceived(tempDesc) {
    this.setState({tempDesc: tempDesc});
  }

  onTempUnitChanged(tempUnit) {
    this.setState({tempUnit: tempUnit});
  }

  render() {
    return <div>
        <City
          callbackParent={(city, country) => this.onCityReceived(city, country)}
        />
      {this.state.city !== "" && this.state.country !== "" ?
        <Temp cityProp={this.state.city} countryProp={this.state.country} tempUnitProp={this.state.tempUnit}
          callbackParent={(tempId) => this.onTempReceived(tempId)}>
        </Temp> : null}
      {this.state.tempDesc !== "" ?
        <div>
        <Icon tempDescProp={this.state.tempDesc}></Icon>
        <Button tempUnitProp={this.state.tempUnit} tempUnitChanged={(tempUnit) => this.onTempUnitChanged(tempUnit)} /></div> : null}
      </div>;
  }
};

render(<Application />, document.getElementById('container'));
