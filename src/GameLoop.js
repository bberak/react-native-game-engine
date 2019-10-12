import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import DefaultTimer from "./DefaultTimer";
import DefaultTouchProcessor from "./DefaultTouchProcessor";

export default function GameLoop(props) {
  let timer = props.timer || new DefaultTimer();
  timer.subscribe(updateHandler);
  let touches = [];
  let screen = Dimensions.get("window");
  let previousTime = null;
  let previousDelta = null;
  let touchProcessor = props.touchProcessor(touches);

  useEffect(() => {
    if (props.running) start();

    return () => {
      stop();
      timer.unsubscribe(updateHandler);
      if (touchProcessor.end) touchProcessor.end();
    };
  }, []);

  useEffect(() => {
    if (props.running) start();
    else stop();
  }, [props.running]);

  const start = () => {
    touches.length = 0;
    previousTime = null;
    previousDelta = null;
    timer.start();
  };

  const stop = () => {
    timer.stop();
  };

  const updateHandler = currentTime => {
    let args = {
      touches: touches,
      screen: screen,
      time: {
        current: currentTime,
        previous: previousTime,
        delta: currentTime - (previousTime || currentTime),
        previousDelta: previousDelta
      }
    };

    if (props.onUpdate) props.onUpdate(args);

    touches.length = 0;
    previousTime = currentTime;
    previousDelta = args.time.delta;
  };

  const onLayoutHandler = () => {
    screen = Dimensions.get("window");
    forceUpdate();
  };

  const onTouchStartHandler = e => {
    touchProcessor.process("start", e.nativeEvent);
  };

  const onTouchMoveHandler = e => {
    touchProcessor.process("move", e.nativeEvent);
  };

  const onTouchEndHandler = e => {
    touchProcessor.process("end", e.nativeEvent);
  };

  return (
    <View
      style={[css.container, props.style]}
      onLayout={onLayoutHandler}
      onTouchStart={onTouchStartHandler}
      onTouchMove={onTouchMoveHandler}
      onTouchEnd={onTouchEndHandler}
    >
      {props.children}
    </View>
  );
}

GameLoop.defaultProps = {
  touchProcessor: DefaultTouchProcessor({
    triggerPressEventBefore: 200,
    triggerLongPressEventAfter: 700
  }),
  running: true
};

const css = StyleSheet.create({
  container: {
    flex: 1
  }
});
