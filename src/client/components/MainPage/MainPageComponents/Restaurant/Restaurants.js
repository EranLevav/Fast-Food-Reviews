import React, {Component} from "react"
import {connect} from "react-redux"
import LoginActions from "../../../Login/actions"
import AppActions from "../../../App/actions"
import MainActions from "../../actions"
import GoogleMapReact from 'google-map-react'
import PlaceCard from '../GenericComponents/PlaceCard'
import SearchBar from '../GenericComponents/SearchBar'
import Marker from './Marker'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import Loader from 'react-loader-spinner'


import './Restaurant.scss'

class Restaurants extends Component {

    constructor(props) {
        super(props);
        this.state = {
          searchResults: [],
          mapLoaded: false,
        };
      } 
  
  componentDidMount() {
      this.props.OpenLoadingScreen();
      geocodeByAddress(this.props.location)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
          const {lat, lng} = latLng;
          this.props.setLanLngEventHandler(lat, lng);
      });  
  }


  // Runs once when the Google Maps library is ready
  // Initializes all services that we need
  apiHasLoaded = ((map, mapsApi) => {
    this.setState({
      map,
      mapsApi,
      // autoCompleteService: new mapsApi.places.AutocompleteService(),
      placesService: new mapsApi.places.PlacesService(map),
    });

    this.handleSearch();
  });

    // find restaurants & cafes
    handleSearch = (() => {
        const { mapsApi, placesService } = this.state;
        const filteredResults = [];
        
        // Create places query 
        const placesQuery = {
          location: new mapsApi.LatLng(this.props.lat, this.props.lng),
          types: ['restaurant','meal_takeaway'], // List of types
          radius: 20000, // in Meters. 20km
          rankBy: mapsApi.places.RankBy.DISTANCE,
        };
        
        // search for restaurants.
        placesService.textSearch(placesQuery, ((response) => {
        // Only look at the nearest top 10.
        const responseLimit = Math.min(10, response.length);
        console.log("this is response:" , response);
        // Calculate traveling time for each location
        for (let idx = 0; idx < responseLimit; idx ++) {
          const placeQuery = response[idx];
          const { name } = placeQuery;
          const address = placeQuery.formatted_address;
          const latLng = placeQuery.geometry.location;
          const lat = latLng.lat();
          const lng = latLng.lng();
          let photoUrl = '';
          let openNow = false;
          if (placeQuery.opening_hours) {
              openNow = placeQuery.opening_hours.isOpen; // e.g true/false
          }
          if (placeQuery.photos && placeQuery.photos.length > 0) {
              photoUrl = placeQuery.photos[0].getUrl();
          }
          filteredResults.push({ name, address, openNow, photoUrl, lat,lng,});
        }                                   
        // Finally, Add results to state
        this.setState({ searchResults: filteredResults,
                        mapLoaded: true });
     })); 
    });

    render() {
      console.log(`Successfully loading: ${this.props.isLoading}`); 
      console.log(`Successfully got latitude SIGN_IN_SUCCESS: ${this.props.lat} and longitude: ${this.props.lng}`); 
        return (
            <div>
              <div style={{ height: '80vh', width: '120vh'}}>
                <div className="restaurant-searchbars">
                  <SearchBar placeholder={'Search by restaurant name'}
                             onChange={(event) => this.doSearch('name', event)}
                             defaultValue={this.props.search_by_name_value}
                             isIconDisplayed={false}
                  />
                  <div className="restaurant-border" />
                  <SearchBar placeholder={'Search by restaurant location'}
                             onChange={(event) => this.doSearch('location', event)}
                             defaultValue={this.props.search_by_location_value}
                             isIconDisplayed={true}
                  />
                </div>
                <h1>Restaurants near you</h1>
                {/* TODO: Search Button */}
                {this.props.isLoading ? 
                  <Loader className="loader" type="Oval" color="Blue"/> :
                  <GoogleMapReact
                      bootstrapURLKeys={{
                          key: 'process.env.REACT_APP_KEY',
                          libraries: ['places', 'directions']
                          }}
                      defaultZoom={14}
                      defaultCenter={{ lat: this.props.lat , lng: this.props.lng }}
                      onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)} // "maps" is the mapApi. Bad naming but that's their library.
                    >
                  {this.state.mapLoaded && 
                      this.state.searchResults.map((result, key) => (
                      <Marker lat={result.lat} 
                              lng = {result.lng}
                              name = {result.name}
                              icon = {result.photoUrl}
                              color="red"
                      />))
                  }
                  <Marker
                      lat={this.props.lat}
                      lng={this.props.lng}
                      name="Your Location"
                      color="blue"
                  />
                  </GoogleMapReact>}
                  {/* ''} */}
                </div>

              {/* Results section */}
              {console.log(this.state.searchResults.length)}
              {console.log(this.state.searchResults)}
              <div className="grid-restaurant">
                {this.state.searchResults.map((result, key) => (
                          <PlaceCard history={this.props.history}
                                     setReviews={(restaurant_name) => this.props.searchReviewsByRestaurantName(restaurant_name)}
                                     info={result} 
                                     key={key} 
                                     className="grid-user-item"/>
                ))}
              </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        location: state['login'].get('location'),
        isLoading: state['app'].get('isLoading'),
        lat: state['login'].get('lat'),
        lng: state['login'].get('lng'),

    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setLanLngEventHandler: (lan, lng) => {
            dispatch(LoginActions.setLatLngAction(lan,lng));
            dispatch(AppActions.closeLoadingScreen());
        },
        searchReviewsByRestaurantName: (restaurant_name) => {
            dispatch(MainActions.searchReviewsByRestaurantName(restaurant_name))
        },
        OpenLoadingScreen: () => {
            dispatch(AppActions.OpenLoadingScreen());
        },
        closeLoading: () => {
            dispatch(AppActions.closeLoadingScreen());
        },
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Restaurants);
