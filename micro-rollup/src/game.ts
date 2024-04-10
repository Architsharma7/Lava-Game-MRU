import { MicroRollup } from "@stackr/sdk";
import { stackrConfig } from "../stackr.config.ts";

import { createAccountSchema, schemas } from "./actions.ts";
import { gameStateMachine } from "./machines.stackr.ts";

type GameMachine = typeof gameStateMachine;

const mru = await MicroRollup({
  config: stackrConfig,
  actionSchemas: [createAccountSchema, ...Object.values(schemas)],
  stateMachines: [gameStateMachine],
  isSandbox: true,
});

await mru.init();

export { GameMachine, mru };
