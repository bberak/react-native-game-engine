import React, { Component } from "react";
import {
  StatusBar,
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { ComponentEntitySystem } from "../react-native-game-engine";
import { ParticleSystem } from "./renderers";
import {
  SpawnParticles,
  Gravity,
  Wind,
  Motion,
  DegenerateParticles
} from "./systems";
import Title from "./title";
import * as Animatable from "react-native-animatable";

export default class TableOfContents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      heading: props.contents.heading,
      items: props.contents.items
    };
  }

  onItemPress = async data => {
    if (data.items) {
      let tasks = [this.refs[this.state.heading].fadeOutLeft(400)].concat(
        this.state.items.map(x => this.refs[x.heading].fadeOutLeft(400))
      );

      await Promise.all(tasks);

      this.setState({
        heading: data.heading,
        items: data.items,
        parent: Object.assign({}, this.state)
      });
    } else {
      //-- Mount the associated scene
    }
  };

  onBackPress = async () => {};

  render() {
    return (
      <ComponentEntitySystem
        ref={"engine"}
        systems={[SpawnParticles, Gravity, Wind, Motion, DegenerateParticles]}
        entities={{
          "particle-system-01": {
            origin: [0, -50],
            particles: [],
            renderable: ParticleSystem
          }
        }}
      >

        <StatusBar hidden={false} />

        <ScrollView contentContainerStyle={css.container}>

          <Title />

          <Animatable.View
            key={this.state.heading}
            ref={this.state.heading}
            animation={"fadeInRight"}
            style={css.headingContainer}
          >
            <Text style={css.headingText}>
              {this.state.heading
                .substring(
                  this.state.heading.indexOf(".") + 1,
                  this.state.heading.length
                )
                .trim()
                .toUpperCase()}
            </Text>
          </Animatable.View>

          {this.state.items.map((x, i) => {
            return (
              <TouchableOpacity
                key={x.heading}
                onPress={_ => this.onItemPress(x)}
              >
                <Animatable.Text
                  delay={++i * 75}
                  animation={"fadeInRight"}
                  style={css.itemText}
                  ref={x.heading}
                >
                  {x.heading}
                </Animatable.Text>
              </TouchableOpacity>
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
    borderBottomWidth: 3,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 15,
    alignSelf: "center"
  },
  headingText: {
    backgroundColor: "transparent",
    letterSpacing: 5,
    color: "#000",
    fontSize: 20,
    lineHeight: 30,
    fontWeight: "bold",
  },
  itemText: {
    backgroundColor: "transparent",
    fontSize: 20,
    lineHeight: 50,
    color: "#000"
  }
});
