import { StateMachine } from "@stackr/sdk/machine";
import genesisState from "../genesis-state.json";
import { transitions } from "./transitions";
import { GAME } from "./state";

const STATE_MACHINES = {
  LavaGame: "lava-game",
};

const gameStateMachine = new StateMachine({
  id: STATE_MACHINES.LavaGame,
  stateClass: GAME,
  initialState: genesisState.state,
  on: transitions,
});

export { STATE_MACHINES, gameStateMachine };
