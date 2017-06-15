import React, { Component } from "react";
import { View, PanResponder, Text } from "react-native";
import Timer from "./timer";

export default class ComponentEntitySystem extends Component {
  constructor(props) {
    super(props);
    this.state = props.initState || props.initialState || props.entities || {};
    this.systems = props.systems || [];
  }

  componentWillMount() {
    this.timer = new Timer();
    this.timer.start();
    this.timer.subscribe(this.update);
    this.gestures = [];
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        //-- Serialize evt into a new object, so you don't have to call persist()
        //-- and sacrifice performance
        evt.persist(); 
        this.gestures.push([evt, gestureState]);
      },
      onPanResponderMove: (evt, gestureState) => {
        //-- Serialize evt into a new object, so you don't have to call persist()
        //-- and sacrifice performance
        evt.persist(); 
        this.gestures.push([evt, gestureState]);
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {},
      onPanResponderTerminate: (evt, gestureState) => {},
      onShouldBlockNativeResponder: (evt, gestureState) => true
    });
  }

  componentWillUnmount() {
    this.timer.stop();
    this.timer.unsubscribe(this.update);
  }

  update = () => {
    let newState = this.state;

    for (let i = 0, len = this.systems.length; i < len; i++) {
      newState = this.systems[i](newState, this.gestures);
    }

    this.gestures.length = 0;
    this.setState(newState);
  };

  render() {
    const defaultStyles = {
      flex: 1
    };
    return (
      <View
        style={[defaultStyles, this.props.style]}
        {...this.panResponder.panHandlers}
      >
        {this.props.children}

        {Object.keys(this.state)
          .filter(key => this.state[key].renderable)
          .map(key => {
            let entity = this.state[key];
            if (typeof entity.renderable === "object")
              return <entity.renderable.type key={key} {...entity} />
            else if (typeof entity.renderable === "function")
              return <entity.renderable key={key} {...entity} />;
          })}

      </View>
    );
  }
}
