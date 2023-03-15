import React, { Component } from 'react'
import { View, Text, Image, Dimensions, ToastAndroid } from 'react-native'
import { Camera } from "expo-camera"
import * as MediaLibrary from 'expo-media-library'
import * as SecureStore from 'expo-secure-store'
import * as Location from 'expo-location'

import CircleButton from './CircleButton'
import rotateImg from "./rotate.png"
import addImg from "./add.png"

class CameraScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hasCameraPermission: null,
            type: Camera.Constants.Type.back,
            photoUri: "",
            photoShown: false,
            htw: 1
        };
    }

    async componentDidMount() {
        let { status } = await Camera.requestCameraPermissionsAsync()
        this.setState({ hasCameraPermission: status == 'granted' })
    }

    render() {
        const { hasCameraPermission } = this.state
        if (hasCameraPermission == null) {
            return <View />
        } else if (hasCameraPermission == false) {
            return <Text>brak dostępu do kamery</Text>
        } else {
            let takenPhoto = null
            if (this.state.photoShown) {
                takenPhoto = <View style={{ position: 'absolute', top: 25, left: Dimensions.get('screen').width / 2 - 50, height: 100 * this.state.htw + 4, width: 104, borderWidth: 2, borderStyle: 'solid', borderColor: 'red' }}><Image source={{ uri: this.state.photoUri }} style={{ height: 100 * this.state.htw, width: 100 }} /></View>
            }
            else {
                takenPhoto = null
            }
            return (
                <View style={{ flex: 1 }}>
                    <Camera
                        ref={ref => {
                            this.camera = ref
                        }}
                        style={{ flex: 1 }}
                        type={this.state.type}>
                        <View style={{
                            flex: 1,
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            alignItems: 'flex-end'
                        }}>
                            {takenPhoto}
                            <CircleButton size={50} img={rotateImg} f={() => this.rotateCamera()} />
                            <CircleButton size={100} img={addImg} f={() => this.takePhoto()} />
                        </View>
                    </Camera>
                </View>
            )
        }
    }

    rotateCamera() {
        this.setState({
            type: this.state.type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back,
        })
    }

    async takePhoto() {
        if (this.camera) {
            let foto = await this.camera.takePictureAsync();
            let asset = await MediaLibrary.createAssetAsync(foto.uri);
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                alert("Permission to access location was denied.");
            }
            else{
                let location = await Location.getCurrentPositionAsync()
                let photosLocations = JSON.parse(await SecureStore.getItemAsync("photosLocations"))
                if(photosLocations == null)
                    photosLocations = {}
                photosLocations[asset.id] = {latitude: location.coords.latitude, longitude: location.coords.longitude}
                await SecureStore.setItemAsync("photosLocations", JSON.stringify(photosLocations))
            }
            ToastAndroid.showWithGravity(
                "Photo saved.",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
            this.setState({ photoUri: asset.uri, photoShown: true, htw: asset.height / asset.width })
        }
    }
}

export default CameraScreen;
