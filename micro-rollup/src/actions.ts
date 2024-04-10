import { ActionSchema, SolidityType } from "@stackr/sdk";

export const createAccountSchema = new ActionSchema("createAccount", {
  address: SolidityType.ADDRESS,
});

export const gameSchema = new ActionSchema("game", {
  address: SolidityType.ADDRESS,
  score: SolidityType.UINT,
  lives: SolidityType.UINT,
});

export const leaderboardSchema = new ActionSchema("leaderboard", {
  address: SolidityType.ADDRESS,
  score: SolidityType.UINT,
});

export const schemas = {
  create: createAccountSchema,
  updateScore: gameSchema,
  updateLeaderboard: leaderboardSchema,
};
