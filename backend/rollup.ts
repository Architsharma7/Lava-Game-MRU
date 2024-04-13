import { Wallet } from "ethers";

export type GameType = {
  address: string;
  score: number;
  lives: number;
};

export type LeaderboardType = {
  address: string;
  score: number;
};

const domain = {
  name: "Stackr MVP v0",
  version: "1",
  chainId: 69420,
  verifyingContract: "0x6c2638b203Cd0e905cbE0B5B7f9be0151cdAb290",
  salt: "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
};

export const registerUser = async (address: string) => {
  try {
    const actionName = "create";
    const responseforeip = await fetch(
      `http://localhost:3000/getEIP712Types/${actionName}`
    );
    console.log("responseforeip", responseforeip)
    const eip712Types = (await responseforeip.json()).eip712Types;
    const inputs = { address };
    console.log("eiptypes", eip712Types);
    const wallet = Wallet.createRandom();
    const signature = await wallet.signTypedData(domain, eip712Types, inputs);
    console.log(`Signature: ${signature}`);

    const body = JSON.stringify({
      msgSender: wallet.address,
      signature: signature,
      inputs: inputs,
    });

    const res = await fetch(`http://localhost:3000/${actionName}`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    console.log(`Response: ${JSON.stringify(json, null, 2)}`);
    return { ack: json };
  } catch (error) {
    console.log(error);
  }
};

export const updateScore = async (data: GameType) => {
  try {
    const actionName = "updateScore";
    const date = new Date();
    const responseforeip = await fetch(
      `http://localhost:3000/getEIP712Types/${actionName}`
    );
    const eip712Types = (await responseforeip.json()).eip712Types;
    const inputs = { timestamp: Math.round(date.getTime() / 1000), ...data };
    console.log("eiptypes", eip712Types);
    const wallet = Wallet.createRandom();
    const signature = await wallet.signTypedData(domain, eip712Types, inputs);
    console.log(`Signature: ${signature}`);

    const body = JSON.stringify({
      msgSender: wallet.address,
      signature: signature,
      inputs: inputs,
    });

    const res = await fetch(`http://localhost:3000/${actionName}`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    console.log(`Response: ${JSON.stringify(json, null, 2)}`);
    return { ack: json };
  } catch (error) {
    console.log(error);
  }
};

export const updateLeaderboard = async (data: LeaderboardType) => {
  try {
    const actionName = "updateLeaderboard";
    const date = new Date();
    const responseforeip = await fetch(
      `http://localhost:3000/getEIP712Types/${actionName}`
    );
    const eip712Types = (await responseforeip.json()).eip712Types;
    const inputs = { timestamp: Math.round(date.getTime() / 1000), ...data };
    console.log("eiptypes", eip712Types);
    const wallet = Wallet.createRandom();
    const signature = await wallet.signTypedData(domain, eip712Types, inputs);
    console.log(`Signature: ${signature}`);

    const body = JSON.stringify({
      msgSender: wallet.address,
      signature: signature,
      inputs: inputs,
    });

    const res = await fetch(`http://localhost:3000/${actionName}`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    console.log(`Response: ${JSON.stringify(json, null, 2)}`);
    return { ack: json };
  } catch (error) {
    console.log(error);
  }
};
