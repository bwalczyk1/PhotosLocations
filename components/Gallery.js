import React, { Component } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, ToastAndroid } from 'react-native';
import * as MediaLibrary from 'expo-media-library'
import * as SecureStore from 'expo-secure-store'

import FotoItem from './FotoItem'

class Gallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: [],
            cols: 1,
            selectedPhotos: []
        }
        this.updateFunction = null
    }

    componentDidMount = () => {
        this.updateFunction = this.props.navigation.addListener('focus', () => {
            this.makeRequest()
        });

        this.makeRequest()
    }

    componentWillUnmount() {
        this.makeRequest()
    }

    render() {
        let fs = 8
        return (
            <View
                style={{
                    height: Dimensions.get('screen').height - 95,
                    width: Dimensions.get('screen').width
                }}
            >
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        marginTop: 10
                    }}
                >
                    <TouchableOpacity onPress={() => this.changeCols()}>
                        <Text style={{ fontWeight: 'bold', fontSize: fs, color: 'deeppink' }}>
                            GRID / LIST
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("cameraScreen")}>
                        <Text style={{ fontWeight: 'bold', fontSize: fs, color: 'deeppink' }}>
                            OPEN CAMERA
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.deleteSelectedPhotos()}>
                        <Text style={{ fontWeight: 'bold', fontSize: fs, color: 'deeppink' }}>
                            REMOVE SELECTED
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("map")}>
                        <Text style={{ fontWeight: 'bold', fontSize: fs, color: 'deeppink' }}>
                            OPEN MAP
                        </Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    numColumns={this.state.cols}
                    key={this.state.cols}
                    data={this.state.photos}

                    renderItem={({ item }) =>
                        <FotoItem
                            selected={this.state.selectedPhotos.includes(item)}
                            cols={this.state.cols}
                            d={() => this.props.navigation.navigate("bigPhoto", { id: item.id, uri: item.uri, htw: item.height / item.width })}
                            f={() => this.changeImgSelection(item)}
                            id={item.id}
                            uri={item.uri}
                            width={(Dimensions.get('screen').width - 10 / this.state.cols) / this.state.cols - 10 / this.state.cols}
                            height={(Dimensions.get('screen').width - 10 / this.state.cols) / this.state.cols - 10 / this.state.cols}
                        />
                    }
                />
            </View>
        );
    }

    changeCols() {
        if (this.state.cols == 1) {
            this.setState({ cols: 5 })
        }
        else {
            this.setState({ cols: 1 })
        }
    }

    changeImgSelection(item) {
        let tempArr = []
        let photoIsIncluded = false
        for (let photo of this.state.selectedPhotos) {
            if (photo.id == item.id)
                photoIsIncluded = true
            else
                tempArr.push(photo)
        }
        if (!photoIsIncluded)
            tempArr.push(item)
        this.setState({ selectedPhotos: tempArr })
    }

    async deleteSelectedPhotos() {
        if (this.state.selectedPhotos.length > 0) {
            let idsArr = []
            for (let photo of this.state.selectedPhotos)
                idsArr.push(photo.id)
            await MediaLibrary.deleteAssetsAsync(idsArr)

            let photosLocations = JSON.parse(await SecureStore.getItemAsync("photosLocations"))
            if(photosLocations == null)
                photosLocations = {}
            let newPhotosLocations = {}
            for(let key of Object.keys(photosLocations)){
                if(!idsArr.includes(key))
                    newPhotosLocations[key] = photosLocations[key]
            }
            await SecureStore.setItemAsync("photosLocations", JSON.stringify(newPhotosLocations))

            this.makeRequest()
            ToastAndroid.showWithGravity(
                'Selected photos deleted.',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
        }

    }

    async makeRequest() {
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
        this.setState({ photos: obj.assets })
    }
}

export default Gallery;
