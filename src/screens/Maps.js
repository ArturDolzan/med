import React, {Component} from 'react'
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;

const initialRegion = {
  latitude: -28.7156098,
  longitude: -49.3009995,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}

class Maps extends Component {
    
    mapView = null;

    state = {
        latitude: null,
        longitude: null,
        error:null
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
           (position) => {
            
             this.setState({
               latitude: position.coords.latitude,
               longitude: position.coords.longitude,
               error: null,
             });
             
             const region = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              };
              this.setRegion(region);

           },
           (error) => this.setState({ error: error.message }),
           { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
         );
    }

    setRegion(region) {
        this.mapView.animateToRegion(region, 2000)
    }

    onMapReady = () => {
        //console.log('PRONTO')
    }

    render() {
        return(
            <MapView ref = {(ref)=>this.mapView=ref} 
                provider={PROVIDER_GOOGLE}
                style={{flex: 1}}
                onMapReady={this.onMapReady}
                initialRegion={initialRegion}
                showsUserLocation
                showsMyLocationButton={false}>

            </MapView>
        )
    }
} 

export default Maps