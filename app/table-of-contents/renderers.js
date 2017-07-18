import React, { Component, PureComponent } from "react";
import { StyleSheet, View, ART, Dimensions } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";

const { Surface, Group, Shape } = ART;
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

class Particle extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const size = HEIGHT * 0.002 * this.props.size
    const x = this.props.position[0] - size / 2;
    const y = this.props.position[1] - size / 2;
    return (
      <View
        style={
          {
            borderRadius: size,
            position: "absolute",
            left: x,
            top: y,
            width: size,
            height: size,
            backgroundColor: this.props.color
          }
        }
      />
    );
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
          <Particle
            key={i}
            position={p.position}
            color={p.color}
            size={p.size}
          />
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

class ParticleSystemReactNativeSvgWithRects extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Svg height={HEIGHT} width={WIDTH}>
        {this.props.particles.map((p, i) => {
          return (
            <Rect
              key={i}
              x={p.position[0]}
              y={p.position[1]}
              width={p.size}
              height={p.size}
              fill={p.color}
            />
          );
        })}
      </Svg>
    );
  }
}

export {
  Particle,
  ParticleSystem,
  ParticleSystemReactNativeART,
  ParticleSystemReactNativeSvg,
  ParticleSystemReactNativeSvgWithRects
};
