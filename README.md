# React Native Game Engine &middot; [![npm version](https://badge.fury.io/js/react-native-game-engine.svg)](https://badge.fury.io/js/react-native-game-engine)

Some React Native ⚡ components that make it easier to construct interactive scenes using the familiar ```update``` + ```draw``` lifecycle used in the development of many games ✨

## Table of Contents 📗

- [Quick Start](#quick-start)
- [FAQ](#faq)
- [Using the BasicGameLoop Component](#using-the-basicgameloop-component)
  - [Behind the Scenes](#behind-the-scenes)
  - [Where is the Draw Function?](#where-is-the-draw-function?)
- [Package for Game Development](#packages-for-game-development)

## Quick Start

## FAQ

- Is React Native Game Engine suitable for production quality games?
- Do you know of any apps that currently utilize this library?
- How do I manage physics?
- Do I have a choice of renderers?
- The ```React Native Game Engine``` doesn't give me sensor data out of the box - what gives?
- Is this compatible with Android and iOS?
- Won't this kind of be harsh on the old battery?

## The Game Loop

The game loop 🔁 is a common pattern in game development and other interactive programs. It loosely consists of two main functions that get called over and over again: ```update``` and ```draw```. 

The ```update``` function is responsible for calculating the next state of your game. It updates all of your game objects, taking into consideration physics, ai, movement, input, health/fire/damage etc. We can consider this the *logic* of your game.

Once the ```update``` function has done its thing - the ```draw``` function is responsible for taking the current state of the game and rendering it to the screen. Typically, this would include drawing characters, scenery and backgrounds, static or dynamic objects, bad guys, special effects and HUD etc.

Ideally, both functions complete within **16ms**, and we start the next iteration of the loop until some loop-breaking condition is encountered: *pause, quit, game over etc*. This might seem like a lot of processing overhead, but unlike regular applications, games are highly interactive and ever changing. The game loop affords us full control over scenes - even when no user input or external events have fired.

## The Game Loop vs React Native

A typical React Native app will only redraw itself when ```this.setState()``` is called on a component with some new state (for lack of better words). Often times, this is a direct response to user input (button press, keystroke, swipe) or other event (websocket callback, push notificaiton etc).

This works perfectly fine (and is even ideal) for a business-oriented app - but it doesn't give the developer fine grained control to create highly interactive and dynamic scenes.

> Unlike most other software, games keep moving even when the user isn’t providing input. If you sit staring at the screen, the game doesn’t freeze. Animations keep animating. Visual effects dance and sparkle. If you’re unlucky, that monster keeps chomping on your hero.

> This is the first key part of a real game loop: it processes user input, but doesn’t wait for it. The loop always keeps spinning - **[Robert Nystrom](http://gameprogrammingpatterns.com/game-loop.html)**

That said, React Native and game loops are not mutually exclusive, and we can use ```React Native Game Engine``` to bridge the two paradigms.

## Using the BasicGameLoop Component

Firstly, install the package to your project: 

```npm install --save react-native-game-engine```

Then import the BasicGameLoop component: 

```import { BasicGameLoop } from "react-native-game-engine"```

Let's code a basic scene with a single moveable game object. Add this into your ```index.ios.js``` (or ```index.android.js```):

```
import React, { PureComponent } from "react";
import { AppRegistry, StyleSheet, Dimensions, View } from "react-native";
import { BasicGameLoop } from "react-native-game-engine";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const RADIUS = 25;

export default class BestGameEver extends PureComponent {
  constructor() {
    super();
    this.state = {
      x: WIDTH / 2 - RADIUS,
      y: HEIGHT / 2 - RADIUS
    };
  }

  updateHandler = ({ touches, screen, time }) => {
    let move = touches.find(x => x.type === "move");
    if (move) {
      this.setState({
        x: this.state.x + move.delta.pageX,
        y: this.state.y + move.delta.pageY
      });
    }
  };

  render() {
    return (
      <BasicGameLoop style={styles.container} onUpdate={this.updateHandler}>

        <View style={[styles.player, { left: this.state.x, top: this.state.y }]} />

      </BasicGameLoop>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  player: {
    position: "absolute",
    backgroundColor: "pink",
    width: RADIUS * 2,
    height: RADIUS * 2,
    borderRadius: RADIUS * 2
  }
});

AppRegistry.registerComponent("BestGameEver", () => BestGameEver);
```

### Behind the Scenes

- The ```BasicGameLoop``` starts a timer ⏰ using ```requestAnimationFrame(fn)```. Effectively, this is our game loop.
- Each iteration through the loop, the ```BasicGameLoop``` will call the function passed in via ```props.onUpdate```.
- Our ```updateHandler``` looks for any ```move``` touches that were made between now and the last time through the loop.
- If found, we update the position of our lone game object using ```this.setState()```.

### Where is the Draw Function?

Nice observation! Indeed, there is none. The logic of our scene is processed in the ```updateHandler``` function, and our drawing is handled by our component's out-of-the-box ```render()``` function.

All we've done here is hookup a timer to a function that fires every **~16ms**, and used ```this.setState()``` to force React Native to diff the changes in our scene and send them across the bridge to the host device. ```React Native Game Engine``` only takes care of the game timing and input processing for us.

## Building Complex scenes with Component-Entity-Systems

Typically, game developers have used OOP to implement complex game objects and scenes. Each game object is instantiated from a class, and polymorphism allows code re-use and behaviors to be extended through inheritance. As class hierarchies grow, it becomes increasingly difficult to create new types of game entities without duplicating code or seriously re-thinking the entire class hierarchy.

```
               [GameEntity]
                    |
                    |
                [Vehicle]
               /    |    \
              /     |     \
             /      |      \
            /       |       \ 
   [Terrestrial] [Marine] [Airborne]
           |        |        |
           |        |        |
         [Tank]   [Boat]   [Jet]
```
> How do we insert a new terrestrial and marine-based vehicle - say a Hovercraft - into the class hierarchy?

One way to address these problems is to favor composition over inheritance. With this approach, we break out the attributes and behaviours of our various game entities into decoupled, encapsulated and atomic components. This allows us to be really imaginative with the sorts of game entities we create because we can easily compose them with components from disparate domains and concerns.

```
[Tank]               [Boat]                [Hovercraft]
   |                    |                       | 
   |--[@Position]       |-- [@Position]         |-- [@Position]
   |                    |                       |
   |-- [@LandSpeed]     |-- [@Lift]             |-- [@Lift] 
                                                |
                                                |-- 
 
```

Now let's try a cooler example:

```
```

Some great CES resources:

- [Gamedev.net article](https://www.gamedev.net/articles/programming/general-and-gameplay-programming/understanding-component-entity-systems-r3013/)
- [Intro to Entity Systems](https://github.com/junkdog/artemis-odb/wiki/Introduction-to-Entity-Systems)

## Upcoming Improvements

## Awesome Packages for Game Development

The following is a list of invaluable packages when it comes to coding interactive scenes. Please feel free to nominate others:

- [React Native Animatable](https://github.com/oblador/react-native-animatable)
- [React Motion](https://github.com/chenglou/react-motion)
- [Matter JS](https://github.com/liabru/matter-js) (beware has some DOM code)
- [React Game Kit](https://github.com/FormidableLabs/react-game-kit)
- [React Native SVG](https://github.com/react-native-community/react-native-svg)
- [React Native Linear Gradient](https://github.com/react-native-community/react-native-linear-gradient)
- [React Native Sensors](https://github.com/react-native-sensors/react-native-sensors)