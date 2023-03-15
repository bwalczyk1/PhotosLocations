import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, ToastAndroid } from 'react-native'
import * as MediaLibrary from "expo-media-library"
import * as Sharing from 'expo-sharing'
import * as SecureStore from 'expo-secure-store'

class BigPhoto extends Component {
    render() {
        return (
            <View>
                <Image
                    style={{
                        width: Dimensions.get('screen').width - 20,
                        height: (Dimensions.get('screen').width - 20) * this.props.route.params.htw,
                        marginTop: 10,
                        marginLeft: 10,
                        borderRadius: 20
                    }}
                    source={{ uri: this.props.route.params.uri }}
                />
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        height: Dimensions.get('screen').height - (Dimensions.get('screen').width) * this.props.route.params.htw - 77
                    }}
                >
                    <TouchableOpacity onPress={() => this.sharePhoto()}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'deeppink' }}>SHARE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.deletePhoto()}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'deeppink' }}>DELETE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.showOnMap()}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'deeppink' }}>SHOW ON MAP</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    async sharePhoto() {
        let obj = await Sharing.shareAsync(this.props.route.params.uri)
    }
    async deletePhoto() {
        await MediaLibrary.deleteAssetsAsync(this.props.route.params.id)

        let photosLocations = JSON.parse(await SecureStore.getItemAsync("photosLocations"))
        if(photosLocations == null)
            photosLocations = {}
        if(Object.keys(photosLocations).includes(this.props.route.params.id)){
            let newPhotosLocations = {}
            for(let key of Object.keys(photosLocations)){
                if(key != this.props.route.params.id)
                    newPhotosLocations[key] = photosLocations[key]
            }
            await SecureStore.setItemAsync("photosLocations", JSON.stringify(newPhotosLocations))
        }

        this.props.navigation.goBack()
    }
    
    async showOnMap(){
        let photosLocations = JSON.parse(await SecureStore.getItemAsync("photosLocations"))
        if(photosLocations == null)
            photosLocations = {}
        if(Object.keys(photosLocations).includes(this.props.route.params.id))
            this.props.navigation.navigate("map", photosLocations[this.props.route.params.id])
        else
            ToastAndroid.showWithGravity(
                'No location associated with this photo.',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            )
    }
}

export default BigPhoto