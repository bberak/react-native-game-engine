import React, { PureComponent } from "react";
import { StyleSheet, View, ART, Dimensions } from "react-native";

const { Surface, Group, Shape } = ART;

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

class Particle extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const x = this.props.position[0] - 10 / 2;
    const y = this.props.position[1] - 10 / 2;
    return <View style={[css.particle, { left: x, top: y }]} />;
  }
}

class ParticleSystem extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>

        {this.props.particles.map((p, i) => <Particle key={i} position={p.position} />)}

      </View>
    );
  }
}

class ParticleSystemReactArt extends PureComponent {
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

const css = StyleSheet.create({
  particle: {
    width: 10,
    height: 10,
    borderRadius: 10 * 2,
    backgroundColor: "#FF7373",
    position: "absolute"
  }
});

export { Particle, ParticleSystem, ParticleSystemReactArt };
