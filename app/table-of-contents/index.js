import React, { Component } from "react";
import { StatusBar, View, StyleSheet, ScrollView, Image } from "react-native";
import { ComponentEntitySystem } from "../react-native-game-engine";
import { ParticleSystem } from "./renderers";
import {
  SpawnParticles,
  Gravity,
  Wind,
  Sprinkles,
  Motion,
  DegenerateParticles
} from "./systems";
import Title from "./title";
import Heading from "./heading";
import BackButton from "./backButton";
import Item from "./item";
import LinearGradient from "react-native-linear-gradient";
import Logo from "./images/logo.png"

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

  onBackPress = async ev => {
    if (this.state.parent) {
      this.refs.engine.publishEvent({
        type: "back-pressed",
        x: ev.nativeEvent.pageX,
        y: ev.nativeEvent.pageY
      });

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
      <LinearGradient
        colors={["#271E77", "#C96DD8"]}
        style={css.linearGradient}
      >

        <ComponentEntitySystem
          ref={"engine"}
          systems={[
            SpawnParticles,
            Gravity,
            Wind,
            Sprinkles,
            Motion,
            DegenerateParticles
          ]}
          entities={{
            "particle-system-01": {
              particles: [],
              renderable: ParticleSystem
            }
          }}
        >
          <StatusBar hidden={false} barStyle={"light-content"} />

          <ScrollView contentContainerStyle={css.container}>

            <Image style={css.logo} source={Logo} />
            <View
              style={[
                css.headingContainer,
                { marginLeft: backButton ? -50 : 0 }
              ]}
            >

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

      </LinearGradient>
    );
  }
}

const css = StyleSheet.create({
  linearGradient: {
    flex: 1
  },
  logo: {
    marginTop: "20%",
    marginBottom: "10%"
  },
  container: {
    alignSelf: "center",
    alignItems: "center",
    width: "100%"
  },
  headingContainer: {
    alignItems: "center",
    marginTop: "4.5%",
    marginBottom: "2.25%",
    alignSelf: "center",
    flexDirection: "row"
  }
});