import { State } from "@stackr/sdk/machine";
import { BytesLike, ZeroHash, solidityPackedKeccak256 } from "ethers";
import { MerkleTree } from "merkletreejs";

export type GameState = {
  address: string;
  score: number;
  lives: number;
}[];

export type LeaderboardState = {
  address: string;
  score: number;
}[];

export type GameVariable = {
  game: GameState;
  leaderboard: LeaderboardState;
};

export class BetterMerkleTree {
  public merkleTreeGame: MerkleTree;
  public merkleTreeLeaderboard: MerkleTree;
  public gameleaves: GameState;
  public leaderboardleaves: LeaderboardState;

  constructor(game: GameState, leaderboard: LeaderboardState) {
    let { merkleTreeGame, merkleTreeLeaderboard } = this.createTree(
      game,
      leaderboard
    );

    this.merkleTreeGame = merkleTreeGame;
    this.merkleTreeLeaderboard = merkleTreeLeaderboard;
    this.gameleaves = game;
    this.leaderboardleaves = leaderboard;
  }

  createTree(game: GameState, leaderboard: LeaderboardState) {
    const hashedLeavesGame = game.map((leaf) => {
      return solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [leaf.address, leaf.score, leaf.lives]
      );
    });
    let merkleTreeGame = new MerkleTree(hashedLeavesGame);

    const hashedLeavesLeaderboard = leaderboard.map((leaf) => {
      return solidityPackedKeccak256(
        ["address", "uint256"],
        [leaf.address, leaf.score]
      );
    });
    let merkleTreeLeaderboard = new MerkleTree(hashedLeavesLeaderboard);

    return { merkleTreeGame, merkleTreeLeaderboard };
  }
}

export class GAME extends State<GameVariable, BetterMerkleTree> {
  constructor(state: GameVariable) {
    super(state);
  }

  transformer() {
    return {
      wrap: () => {
        return new BetterMerkleTree(this.state.game, this.state.leaderboard);
      },
      unwrap: (wrappedState: BetterMerkleTree) => {
        return {
          game: wrappedState.gameleaves,
          leaderboard: wrappedState.leaderboardleaves,
        };
      },
    };
  }

  getRootHash(): BytesLike {
    if (this.state.game.length === 0 && this.state.leaderboard.length === 0) {
      return ZeroHash;
    }
    if (this.state.game.length !== 0 && this.state.leaderboard.length === 0) {
      return this.transformer().wrap().merkleTreeGame.getRoot();
    }
    if (this.state.game.length === 0 && this.state.leaderboard.length !== 0) {
      return this.transformer().wrap().merkleTreeLeaderboard.getRoot();
    }
    return solidityPackedKeccak256(
      ["bytes", "bytes"],
      [
        this.transformer().wrap().merkleTreeGame.getHexRoot(),
        this.transformer().wrap().merkleTreeLeaderboard.getHexRoot(),
      ]
    );
  }
}
