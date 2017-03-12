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
    return <div>City Component: {this.state.city}, {this.state.country}</div>
  }
}

class Temp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temp: ""
    };
  }

componentDidMount() {
  let reqUri = "http://api.openweathermap.org/data/2.5/weather?q="
            + this.props.cityProp
            + ","
            + this.props.countryProp
            + "&units=metric&APPID=491b6536b887951b55f654ad8b721733";
  axios.get(reqUri)
      .then(response => {
      this.setState({
        temp: response.data.main.temp
      });
    }).catch(function (error) {
      console.log("error axios-get2: " + error);
    });
  }

  render() {
    return <div>Temp component: city-prop: {this.props.cityProp} country-prop: {this.props.countryProp} temp-state: {this.state.temp}</div>
  }
}

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "",
      country: ""
    };
  }

  onCityReceived(city, country) {
    this.setState({city: city, country: country})
  }

  render() {
    return <div>
        <City
          callbackParent={(city, country) => this.onCityReceived(city, country)}
        />
        {this.state.city !== "" && this.state.country !== "" ? <Temp cityProp={this.state.city} countryProp={this.state.country}></Temp> : null}
      </div>;
  }
};

render(<Application />, document.getElementById('container'));
