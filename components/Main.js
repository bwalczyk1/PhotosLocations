import React, { Component } from 'react';
import { Text, Dimensions, TouchableOpacity } from 'react-native';

class Main extends Component {
    constructor(props) {
        super(props);
            this.state = {
        };
    }

    render() {
        return (
            <TouchableOpacity
                style={{
                    backgroundColor: 'deeppink',
                    height: Dimensions.get('screen').height,
                    display: 'flex',
                    justifyContent: 'center'
                }}
                onPress={() => this.props.navigation.navigate("gallery")}>
                <Text style={{ color: 'white', alignSelf: 'center', fontSize: 30, textAlign: 'center' }}>
                    Bartosz Walczyk
                </Text>
                <Text style={{ color: 'white', alignSelf: 'center', fontSize: 90, textAlign: 'center', fontWeight: 'bold', marginBottom: 40 }}>
                    Photos Locations App
                </Text>
                <Text style={{ color: 'white', alignSelf: 'center', fontSize: 30, textAlign: 'center' }}>
                    take photos
                </Text>
                <Text style={{ color: 'white', alignSelf: 'center', fontSize: 30, textAlign: 'center' }}>
                    share them
                </Text>
                <Text style={{ color: 'white', alignSelf: 'center', fontSize: 30, textAlign: 'center' }}>
                    view them in gallery
                </Text>
                <Text style={{ color: 'white', alignSelf: 'center', fontSize: 30, textAlign: 'center' }}>
                    find them on the map
                </Text>
            </TouchableOpacity>
        );
    }
}

export default Main;
