// Project: https://github.com/bberak/react-native-game-engine
// TypeScript Version: 3.5

declare module "react-native-game-engine" {
    import * as React from "react";
    import { StyleProp, ViewStyle, ScaledSize } from "react-native";
  
    export function DefaultRenderer(entities: any[], screen: ScaledSize, layout:LayoutRectangle): Component;
  
    export class DefaultTimer {
      loop: (time:number) => void;
      start: () => void;
      stop: () => void;
      subscribe: (callback: () => void) => void;
      unsubscribe: (callback: () => void) => void;
    }
  
    interface TouchProcessorOptions {
      triggerPressEventBefore: number;
      triggerLongPressEventAfter: number;
      moveThreshold: number;
    }
  
    export function DefaultTouchProcessor (touchProcessorOptions?: TouchProcessorOptions): any;

    export interface TimeUpdate {
      current: number;
      delta: number;
      previous: number;
      previousDelta: number;
    }

    export interface GameEngineUpdateEventOptionType {
      dispatch: (event: any) => void;
      events: Array<any>;
      screen: ScaledSize;
      time: TimeUpdate;
      touches: Array<TouchEvent>;
    }
  
    export type GameEngineSystem = (entities: any, update: GameEngineUpdateEventOptionType) => any;
    
    interface GameEngineEntity {
      [key:string]: any;
      renderer?: JSX.Element | React.ComponentClass<any. any>;
    }

    type GameEngineEntities = Record<string | number, GameEngineEntity>;
    
    export interface GameEngineProperties {
      systems?: any[];
      entities?: {} | Promise<any>;
      renderer?: any;
      touchProcessor?: any;
      timer?: DefaultTimer | any;
      running?: boolean;
      onEvent?: any;
      style?: StyleProp<ViewStyle>;
      children?: React.ReactNode;
    }
  
    export class GameEngine extends React.Component<GameEngineProperties> {
      dispatch: (event:any) => void;
      start: () => void;
      stop: () => void;
      swap: ({}:any | Promise) => void | Promise<void>
    }

    export type TouchEventType = 'start' | 'end' | 'move' | 'press' | 'long-press';
  
    export interface TouchEvent {
      event: {
        changedTouches: Array<TouchEvent>;
        identifier: number;
        locationX: number;
        locationY: number;
        pageX: number;
        pageY: number;
        target: number;
        timestamp: number;
        touches: Array<TouchEvent>;
      };
      id: number;
      type: TouchEventType;
      delta?: {
        locationX: number;
        locationY: number;
        pageX: number;
        pageY: number;
        timestamp: number;
      }
    }

    interface GameLoopUpdateEventOptionType {
      touches: TouchEvent[];
      screen: ScaledSize;
      time: TimeUpdate;
    }
  
    export interface GameLoopProperties {
      touchProcessor?: any;
      timer?: DefaultTimer | any;
      running?: boolean;
      onUpdate?: (args: GameLoopUpdateEventOptionType) => void;
      style?: StyleProp<ViewStyle>;
      children?: React.ReactNode;
    }
  
    export class GameLoop extends React.Component<GameLoopProperties> {
      start: () => void;
      stop: () => void;
    }
  }
  
