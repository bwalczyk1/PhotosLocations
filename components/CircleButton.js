import React, { Component } from 'react';
import { TouchableOpacity, Image } from 'react-native';


class CircleButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <TouchableOpacity 
        style={{
            height: this.props.size, 
            width: this.props.size,
            borderRadius: this.props.size/2,
            backgroundColor: "rgba(100, 100, 100, 0.5)",
            marginBottom: 100-this.props.size/2
        }}
        onPress={() => this.props.f()}>
        <Image source={this.props.img} style={{height: this.props.size, width: this.props.size}}/>
      </TouchableOpacity>
    );
  }
}

export default CircleButton;
