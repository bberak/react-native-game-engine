import DefaultRenderer from "./DefaultRenderer";
import DefaultTimer from "./DefaultTimer";
import DefaultTouchProcessor from "./DefaultTouchProcessor";
import GameEngine from "./GameEngine";
import GameLoop from "./GameLoop";

export {
  GameLoop as BasicGameLoop, GameEngine as ComponentEntitySystem,
  GameEngine as ComponentEntitySystems, DefaultRenderer,
  DefaultTimer, DefaultTouchProcessor, GameEngine, GameLoop
};

// export new ts functions from here
export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}

