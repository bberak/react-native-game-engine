import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import DefaultTimer from "./DefaultTimer";
import DefaultRenderer from "./DefaultRenderer";
import DefaultTouchProcessor from "./DefaultTouchProcessor";

const getEntitiesFromProps = props =>
  props.initState ||
  props.initialState ||
  props.state ||
  props.initEntities ||
  props.initialEntities ||
  props.entities;

const isPromise = obj => {
  return !!(
    obj &&
    obj.then &&
    obj.then.constructor &&
    obj.then.call &&
    obj.then.apply
  );
};

export default function GameEngine(props) {
  const [entities, setEntities] = useState(null);

  let timer = props.timer || new DefaultTimer();
  timer.subscribe(updateHandler);
  let touches = [];
  let screen = Dimensions.get("window");
  let previousTime = null;
  let previousDelta = null;
  let events = [];
  let touchProcessor = props.touchProcessor(touches);

  useEffect(() => {
    async function loadEntities(){
      let entities = getEntitiesFromProps(props);
  
      if (isPromise(entities)) entities = await entities;
  
      await setEntities(entities || {});
    }

    loadEntities();

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

  const clear = () => {
    touches.length = 0;
    events.length = 0;
    previousTime = null;
    previousDelta = null;
  };

  const start = () => {
    clear();
    timer.start();
    dispatch({ type: "started" });
  };

  const stop = () => {
    timer.stop();
    dispatch({ type: "stopped" });
  };

  const swap = async newEntities => {
    if (isPromise(newEntities)) newEntities = await newEntities;

    await setEntities(newEntities || {});
    clear();
    dispatch({ type: "swapped" });
  };

  const publish = e => {
    dispatch(e);
  };

  const publishEvent = e => {
    dispatch(e);
  };

  const dispatch = e => {
    setTimeout(() => {
      events.push(e);
      if (props.onEvent) props.onEvent(e);
    }, 0);
  };

  const dispatchEvent = e => {
    dispatch(e);
  };

  const updateHandler = currentTime => {
    let args = {
      touches: touches,
      screen: screen,
      events: events,
      dispatch: dispatch,
      time: {
        current: currentTime,
        previous: previousTime,
        delta: currentTime - (previousTime || currentTime),
        previousDelta: previousDelta
      }
    };

    let newState = props.systems.reduce(
      (state, sys) => sys(state, args),
      entities
    );

    touches.length = 0;
    events.length = 0;
    previousTime = currentTime;
    previousDelta = args.time.delta;
    setEntities(newState);
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
    >
      <View
        style={css.entityContainer}
        onTouchStart={onTouchStartHandler}
        onTouchMove={onTouchMoveHandler}
        onTouchEnd={onTouchEndHandler}
      >
        {entities ? props.renderer(entities, screen) : null}
      </View>

      <View
        pointerEvents={"box-none"}
        style={[
          css.childrenContainer,
          { width: screen.width, height: screen.height }
        ]}
      >
        {props.children}
      </View>
    </View>
  );
}

GameEngine.defaultProps = {
  systems: [],
  entities: {},
  renderer: DefaultRenderer,
  touchProcessor: DefaultTouchProcessor({
    triggerPressEventBefore: 200,
    triggerLongPressEventAfter: 700
  }),
  running: true
};

const css = StyleSheet.create({
  container: {
    flex: 1
  },
  entityContainer: {
    flex: 1,
    //-- Looks like Android requires bg color here
    //-- to register touches. If we didn't worry about
    //-- 'children' (foreground) components capturing events,
    //-- this whole shenanigan could be avoided..
    backgroundColor: "transparent"
  },
  childrenContainer: {
    top: 0,
    left: 0,
    position: "absolute"
  }
});
