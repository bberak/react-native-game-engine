import React, { Component } from "react";
import { StatusBar, View, StyleSheet, ScrollView } from "react-native";
import { ComponentEntitySystem } from "../react-native-game-engine";
import { ParticleSystem, ParticleSystemReactNativeSvg } from "./renderers";
import {
  SpawnParticles,
  Gravity,
  Wind,
  Motion,
  DegenerateParticles
} from "./systems";
import Title from "./title";
import Heading from "./heading";
import BackButton from "./backButton";
import Item from "./item";

export default class TableOfContents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      heading: props.contents.heading,
      items: props.contents.items,
      animation: "fadeInRight"
    };
  }

  componentWillReceiveProps = newProps => {
    if (newProps.sceneVisible) this.refs.engine.stop();
    else this.refs.engine.start();
  };

  onItemPress = async data => {
    if (data.items) {
      let refs = [this.state.heading, "back"].concat(
        this.state.items.map(x => x.heading)
      );
      let tasks = refs
        .map(r => this.refs[r])
        .filter(r => r)
        .map(r => r.fadeOutLeft(400));

      await Promise.all(tasks);

      this.setState({
        heading: data.heading,
        items: data.items,
        parent: Object.assign({}, this.state),
        animation: "fadeInRight"
      });
    } else if (data.onPress) {
      data.onPress();
    }
  };

  onBackPress = async () => {
    if (this.state.parent) {
      let parent = this.state.parent;
      let backButton = this.refs["back"];
      let refs = [this.state.heading].concat(
        this.state.items.map(x => x.heading)
      );
      let tasks = refs
        .map(r => this.refs[r])
        .filter(r => r)
        .map(r => r.fadeOutRight(400))
        .concat([backButton.fadeOutLeft(400)]);

      await Promise.all(tasks);

      this.setState({
        heading: parent.heading,
        items: parent.items,
        parent: null,
        animation: "fadeInLeft"
      });
    }
  };

  render() {
    let backButton = this.state.parent
      ? <BackButton
          key={"back"}
          ref={"back"}
          onPress={this.onBackPress}
          animation={"fadeInLeft"}
        />
      : null;

    return (
      <ComponentEntitySystem
        ref={"engine"}
        systems={[SpawnParticles, Gravity, Wind, Motion, DegenerateParticles]}
        entities={{
          "particle-system-01": {
            origin: [0, -50],
            particles: [],
            renderable: ParticleSystemReactNativeSvg
          }
        }}
      >

        <StatusBar hidden={false} />

        <ScrollView contentContainerStyle={css.container}>

          <Title />

          <View style={css.headingContainer}>

            {backButton}

            <Heading
              animation={this.state.animation}
              key={this.state.heading}
              ref={this.state.heading}
              value={this.state.heading}
            />

          </View>

          {this.state.items.map((x, i) => {
            return (
              <Item
                key={x.heading}
                ref={x.heading}
                value={x.heading}
                animation={this.state.animation}
                delay={++i * 75}
                onPress={_ => this.onItemPress(x)}
              />
            );
          })}

        </ScrollView>

      </ComponentEntitySystem>
    );
  }
}

const css = StyleSheet.create({
  container: {
    alignSelf: "center",
    alignItems: "center"
  },
  headingContainer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 15,
    alignSelf: "center",
    flexDirection: "row"
  }
});
