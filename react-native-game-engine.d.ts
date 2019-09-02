// Project: https://github.com/bberak/react-native-game-engine
// TypeScript Version: 3.5

declare module "react-native-game-engine" {
    import * as React from "react";
    import { StyleProp, ViewStyle, ScaledSize } from "react-native";
  
    interface DefaultRendererOptions {
      state: any;
      screen: ScaledSize;
    }
  
    export function DefaultRenderer(defaultRendererOptions: DefaultRendererOptions): any;
  
    export class DefaultTimer {}
  
    interface TouchProcessorOptions {
      triggerPressEventBefore: number;
      triggerLongPressEventAfter: number;
    }
  
    export function DefaultTouchProcessor (touchProcessorOptions?: TouchProcessorOptions): any;
  
    export interface GameEngineProperties {
      systems?: any[];
      entities?: {} | Promise<any>;
      renderer?: any;
      touchProcessor?: any;
      timer?: any;
      running?: boolean;
      onEvent?: any;
      style?: StyleProp<ViewStyle>;
      children?: React.ReactNode;
    }
  
    export class GameEngine extends React.Component<GameEngineProperties> {}
  
    interface GameLoopUpdateEventOptionType {
      touches: any[];
      screen: ScaledSize;
      time: {
        current: number;
        previous: number;
        delta: number;
        previousDelta: number;
      };
    }
  
    export interface GameLoopProperties {
      touchProcessor?: any;
      timer?: any;
      running?: boolean;
      onUpdate?: (args?: GameLoopUpdateEventOptionType) => void;
      style?: StyleProp<ViewStyle>;
      children?: React.ReactNode;
    }
  
    export class GameLoop extends React.Component<GameLoopProperties> {}
  }
  
