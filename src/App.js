import React from "react";
import './App.css';
import {
  InfoWindow,
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import Geocode from "react-geocode";
import Info from "./components/info";
import AutoComplete from "react-google-autocomplete";


Geocode.setApiKey("AIzaSyA9AgvcjyeJ52dDJgdnTWZVwalW8HCmHL8");

class App extends React.Component {

  state = {
    address: "",
    city: "",
    area: "",
    state: "",
    mapPosition: {
      lat: 0,
      lng: 0
    },
    markerPosition: {
      lat: 0,
      lng: 0
    }  
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        mapPosition: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        markerPosition: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      }, () => {

        Geocode.fromLatLng(position.coords.latitude, position.coords.longitude)
        .then(response => {
          
          const address = response.results[0].formatted_address,
                addressArray = response.results[0].address_components,
                city = this.getCity(addressArray),
                area = this.getArea(addressArray),
                state = this.getState(addressArray);
    
          this.setState({
              address: (address) ? address: "",
              city: (city) ? city : "",
              area: (area) ? area : "",
              state: (state) ? state : "",
          })      
        })
      })
    })
  }


  getCity = (addressArray) => {
    let city = "";
    for (let index = 0; index < addressArray.length; index++) {
      if(addressArray[index].types[0] && "administrative_area_level_2" === addressArray[index].types[0]) {
        city = addressArray[index].long_name;
        return city;
      }
    }
  }

  getArea = (addressArray) => {
    let area = "";
    for (let index = 0; index < addressArray.length; index++) {
      if(addressArray[index].types[0]) {
        for(let j = 0; j < addressArray.length; j++) {
          if("sublocality_level_1" === addressArray[index].types[j] || "locality" === addressArray[index].types[j]) {
            area = addressArray[index].long_name;
            return area;
          }
        }
      }
    }
  }

  getState = (addressArray) => {
    let state = "";
    for (let index = 0; index < addressArray.length; index++) {
        if(addressArray[index].types[0] && "administrative_area_level_2" === addressArray[index].types[0]) {
          state = addressArray[index].long_name;
          return state;
        }
    }
  }
  onMarkerDragEnd = (event) => {
    let newLng = event.latLng.lng();
    let newLat = event.latLng.lat();

    Geocode.fromLatLng(newLat, newLng)
    .then(response => {
      
      const address = response.results[0].formatted_address,
            addressArray = response.results[0].address_components,
            city = this.getCity(addressArray),
            area = this.getArea(addressArray),
            state = this.getState(addressArray);

      this.setState({
          address: (address) ? address: "",
          city: (city) ? city : "",
          area: (area) ? area : "",
          state: (state) ? state : "",
          mapPosition: {
            lat: newLat,
            lng: newLng
          },
          markerPosition: {
            lat: newLat,
            lng: newLng
          },   
      })      
    })
  }

  onPlaceSelected = (place) => {

    const address = place.formatted_address,
          addressArray = place.address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray),
          latValue = place.geometry.location.lat(),
          lngValue = place.geometry.location.lng();

    this.setState({
       address: (address) ? address: "",
       city: (city) ? city : "",
       area: (area) ? area : "",
       state: (state) ? state : "",
       mapPosition: {
          lat: latValue,
          lng: lngValue
       },
       markerPosition: {
          lat: latValue,
          lng: lngValue
       },   
        })      
  }

  render() {

    const {address, city, area, state, mapPosition, markerPosition} = this.state;

    const MapWithAMarker = withScriptjs(withGoogleMap(props =>
      <GoogleMap
        defaultZoom={8}
        defaultCenter={mapPosition}
      >
        <Marker
          draggable={true}
          onDragEnd={this.onMarkerDragEnd}
          position={markerPosition}
        >
          <InfoWindow>
            <div>{address}</div>
          </InfoWindow>
        </Marker>
        <AutoComplete
           style={{width: "100%", height: "40px", paddingLeft: "5px", marginTop: "2px"}}
           types={['regions']}
           onPlaceSelected={this.onPlaceSelected}
        />
      </GoogleMap>
    ));


    return (

      <div>
        <Info address={address} city={city} area={area} state={state}/>
        <MapWithAMarker
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA9AgvcjyeJ52dDJgdnTWZVwalW8HCmHL8&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `370px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </div>
    );

  }
}

export default App;
