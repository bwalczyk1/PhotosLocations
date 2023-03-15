import React, { Component } from 'react'
import MapView, { Marker } from "react-native-maps"
import * as SecureStore from 'expo-secure-store'
import * as MediaLibrary from 'expo-media-library'

class Map extends Component {
    constructor(props){
        super(props)
        this.state = {photos: [], locations: {}}
        this.updateFunction = null
    }

    componentDidMount(){
        this.updateFunction = this.props.navigation.addListener('focus', () => {
            this.getData()
        });

        this.getData()
    }

    componentWillUnmount(){
        this.getData()
    }

    render(){
        let startLatitude, startLongitude
        if(this.props.route.params != undefined){
            startLatitude = this.props.route.params.latitude
            startLongitude = this.props.route.params.longitude
        }
        else if(this.state.photos.length > 0){
            startLatitude = this.state.locations[this.state.photos[0].id].latitude
            startLongitude = this.state.locations[this.state.photos[0].id].longitude
        }
        else{
            startLatitude = 50
            startLongitude = 20
        }
        return (
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: startLatitude,
                    longitude: startLongitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                }}
            >
                {this.state.photos.map((photo) => {
                    return <Marker
                        key={photo.id}
                        coordinate={{
                        latitude: this.state.locations[photo.id].latitude,
                        longitude: this.state.locations[photo.id].longitude,
                        }}
                        onPress={() => this.props.navigation.navigate("bigPhoto", { id: photo.id, uri: photo.uri, htw: photo.height / photo.width })}
                    />
                })}
            </MapView>
        )
    }

    async getData() {
        let { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('brak uprawnień do czytania image-ów z galerii')
        }
        let obj = await MediaLibrary.getAssetsAsync({
            first: 100,
            album: "-2075821635",
            mediaType: 'photo'
        })
        obj.assets.sort((img1, img2) => (parseInt(img1.id) < parseInt(img2.id)) ? 1 : -1)

        let photosLocations = JSON.parse(await SecureStore.getItemAsync("photosLocations"))
        if(photosLocations == null)
            photosLocations = {}
        this.setState({ photos: obj.assets.filter(photo => Object.keys(photosLocations).includes(photo.id)), locations: photosLocations})
    }
}

export default Map