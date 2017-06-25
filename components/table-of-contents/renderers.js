import React, { Component, PureComponent } from "react";
import { StyleSheet, View, ART, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";

const { Surface, Group, Shape } = ART;
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

class Particle extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const x = this.props.position[0] - this.props.size / 2;
    const y = this.props.position[1] - this.props.size / 2;
    return <View style={[css.particle, { left: x, top: y, width: this.props.size, height: this.props.size, backgroundColor: this.props.color }]} />;
  }
}

//-- Performs best on physical device (iPad Mini 2)
class ParticleSystem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        {this.props.particles.map((p, i) => (
          <Particle key={i} position={p.position} size={p.size} color={p.color} />
        ))}
      </View>
    );
  }
}

class ParticleSystemReactNativeART extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const data = this.props.particles.map(
      p => `M${p.position[0]},${p.position[1]}a5,5 0 1,0 10,0a5,5 0 1,0 -10,0`
    );

    return (
      <Surface width={WIDTH} height={HEIGHT}>
        <Group x={0} y={0}>
          <Shape d={data.join(" ")} fill="#FF7373" />
        </Group>
      </Surface>
    );
  }
}

//-- Performs best on simulator
class ParticleSystemReactNativeSvg extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const data = this.props.particles.map(
      p => `M${p.position[0]},${p.position[1]}a5,5 0 1,0 10,0a5,5 0 1,0 -10,0`
    );

    return (
      <Svg height={HEIGHT} width={WIDTH}>
        <Path d={data.join(" ")} fill="#FF7373" />
      </Svg>
    );
  }
}

const css = StyleSheet.create({
  particle: {
    width: 10,
    height: 10,
    backgroundColor: "#FFF",
    position: "absolute"
  }
});

export {
  Particle,
  ParticleSystem,
  ParticleSystemReactNativeART,
  ParticleSystemReactNativeSvg
};
