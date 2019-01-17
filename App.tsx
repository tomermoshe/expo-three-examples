import React, { Component } from 'react';
import './src/setup/dom-element';
import { Minecraft } from './src/minecraft/minecrft';
import { Button, View, Text } from 'react-native';
// import './dom-parser'
import './src/setup/three';
import { Teapot } from './src/teapot/teapot';

export default class App extends Component {
  state = { example: undefined };
  render() {
    const { example } = this.state;
    return !example ? (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, margin: 20 }}>Choose an Example:</Text>
        {this.renderButton('Teapot')}
        {this.renderButton('Minecraft')}
      </View>
    ) : (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, zIndex: 1 }}>{examplesMap.get(example)}</View>
        <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
          <Button title={'X'} onPress={() => this.setState({ example: undefined })} />
        </View>
      </View>
    );
  }

  renderButton = (title: string) => {
    return (
      <View style={{ width: '80%', margin: 15 }}>
        <Button title={title} onPress={() => this.setState({ example: title })} />
      </View>
    );
  };
}

const examplesMap = new Map([['Teapot', <Teapot />], ['Minecraft', <Minecraft />]]);
