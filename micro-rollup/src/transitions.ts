import { Transitions, STF } from "@stackr/sdk/machine";
import { GAME, BetterMerkleTree as StateWrapper } from "./state";

// --------- Utilities ---------
const findIndexOfAccountGame = (state: StateWrapper, address: string) => {
  return state.gameleaves.findIndex((leaf) => leaf.address === address);
};

const findIndexOfAccountLeaderboard = (
  state: StateWrapper,
  address: string
) => {
  return state.leaderboardleaves.findIndex((leaf) => leaf.address === address);
};

type CreateInput = {
  address: string;
};

type GameInput = {
  address: string;
  score: number;
  lives: number;
};

type LeaderboardInput = {
  address: string;
  score: number;
};

// --------- State Transition Handlers ---------
const create: STF<GAME, CreateInput> = {
  handler: ({ inputs, state }) => {
    const { address } = inputs;
    if (state.gameleaves.find((leaf) => leaf.address === address)) {
      throw new Error("Account already exists");
    }
    state.gameleaves.push({
      address,
      score: 0,
      lives: 3,
    });
    return state;
  },
};

const updateScore: STF<GAME, GameInput> = {
  handler: ({ inputs, state }) => {
    const { address, score, lives } = inputs;
    const index = findIndexOfAccountGame(state, address);
    if (index === -1) {
      throw new Error("Account does not exist");
    }
    if (lives > 0) {
      throw new Error("Game not finished yet");
    }
    state.gameleaves[index].score += score;
    return state;
  },
};

const updateLeaderboard: STF<GAME, LeaderboardInput> = {
  handler: ({ inputs, state }) => {
    const { address, score } = inputs;
    const gameindex = findIndexOfAccountGame(state, address);
    const leaderboardindex = findIndexOfAccountLeaderboard(state, address);

    if (gameindex !== -1 && state.gameleaves[gameindex].lives === 0) {
      const newLeaderboardEntry = { address, score };
      if (leaderboardindex !== -1) {
        if (score > state.leaderboardleaves[leaderboardindex].score) {
          state.leaderboardleaves[leaderboardindex].score = score;
        }
      } else {
        state.leaderboardleaves.push(newLeaderboardEntry);
      }
      if (state.leaderboardleaves.length > 1) {
        state.leaderboardleaves.sort((a, b) => b.score - a.score);
      }
    }

    return state;
  },
};

export const transitions: Transitions<GAME> = {
  create,
  updateScore,
  updateLeaderboard,
};
