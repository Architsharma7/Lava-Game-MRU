const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3001;
import _ from "lodash";
import { registerUser } from "./rollup";

app.use(express.json());
app.use(cors());

let apiRequestSent = false;
let debouncedHandler: _.DebouncedFunc<(req, res) => void>;

const resetApiRequestSent = () => {
  apiRequestSent = false;
};

const handleRequest = (req, res) => {
  const { score, walletAddress, lives } = req.body;
  if (!apiRequestSent) {
    console.log("Received score:", score);
    console.log("Received address:", walletAddress);
    console.log("Received lives:", lives);
    res.send("Score received successfully");
    apiRequestSent = true;
    setTimeout(resetApiRequestSent, 3000);
  }
};

debouncedHandler = _.debounce(handleRequest, 3000);

app.post("/game-end", (req, res) => {
  try {
    debouncedHandler(req, res);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/register", async (req, res) => {
  try {
    const { walletAddress } = await req.body;
    console.log(walletAddress);
    if (walletAddress) {
      const registrationResult = await registerUser(walletAddress);
      if (registrationResult) {
        res.json({ status: "success" });
      } else {
        res.status(400).send("Registration failed");
      }
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
