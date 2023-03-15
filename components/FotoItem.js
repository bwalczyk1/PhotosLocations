import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image } from 'react-native';

import addImg from "./add.png"

class FotoItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: this.props.selected
        };
    }

    render() {
        let innerView = <View style={{position: 'relative'}}><Text style={{color: 'white', position: 'absolute', right: 10, top: this.props.height-25}}>{this.props.id}</Text></View>
        if(this.state.selected)
            innerView = <View style={{position: 'relative'}}><Image source={addImg} style={{height: this.props.height, width: this.props.width, position: 'absolute', top: 0, left: 0}}/><Text style={{color: 'white', position: 'absolute', right: 10, top: this.props.height-25}}>{this.props.id}</Text></View>
        return (
            <TouchableOpacity 
                style={{
                    width: this.props.width,
                    marginTop: 10/this.props.cols,
                    marginLeft: 10/this.props.cols
                }}
                onPress={() => this.props.d()}
                onLongPress={() => this.changeState()}
            >
                <ImageBackground
                    style={{
                        height: this.props.height
                    }}
                    imageStyle={{borderRadius: 20}}
                    source={{ uri: this.props.uri }}
                >
                    {innerView}
                </ImageBackground>
            </TouchableOpacity>
        )
    }

    changeState() {
        this.setState({selected: !this.state.selected})
        this.props.f()
    }
}

export default FotoItem;
