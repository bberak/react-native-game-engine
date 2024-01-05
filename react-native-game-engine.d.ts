// Project: https://github.com/bberak/react-native-game-engine
// TypeScript Version: 3.5

declare module "react-native-game-engine" {
  import * as React from "react";
  import { ScaledSize } from "react-native";
  import { GameLoopProperties } from './src/GameLoop';
  import { GameEngineProperties, GameEngineUpdateEventOptionType } from './src/GameEngine';
  import { TouchProcessorOptions, TouchEvent, TouchEventType } from './src/DefaultTouchProcessor';

  // some custom type?
  export type GameEngineSystem = (entities: any, update: GameEngineUpdateEventOptionType) => any;

  export function DefaultRenderer(entities, screen, layout: ScaledSize): any;
  export function DefaultTouchProcessor(touchProcessorOptions?: TouchProcessorOptions): TouchProcesser;
  
  // TODO: Make functions instead of classes
  export class DefaultTimer { }
  export class GameEngine extends React.Component<GameEngineProperties> { }
  export class GameLoop extends React.Component<GameLoopProperties> { }

  // declare new ts functions here so we can use them in our code w/ the correct types
  export declare function multiply(a: number, b: number): Promise<number>;

}

