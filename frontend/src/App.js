import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";

function App() {
  const [bought, setBought] = useState('');
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  provider.send("eth_requestAccounts", []);

  const signer = provider.getSigner()
  const contractAddress = "0x5251F1eF64e14F9240B1b08666E9db8401a9f0D6";
  const ABI = 
'[{"inputs":[{"internalType":"string","name":"proposalName","type":"string"},{"internalType":"string","name":"proposalTime","type":"string"},{"internalType":"uint256","name":"proposalRatio","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"chairperson","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"voter","type":"address"}],"name":"giveRightToVote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"proposal","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"time","type":"string"},{"internalType":"uint256","name":"ratio","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"voterBought","outputs":[{"internalType":"uint256","name":"amount_","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"voterClaimed","outputs":[{"internalType":"uint256","name":"amount_","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"voters","outputs":[{"internalType":"uint256","name":"weight","type":"uint256"},{"internalType":"bool","name":"voted","type":"bool"},{"internalType":"uint256","name":"bought","type":"uint256"},{"internalType":"uint256","name":"claimed","type":"uint256"}],"stateMutability":"view","type":"function"}]'
  const contract = new ethers.Contract(contractAddress, ABI, signer);

  const getBought = async () => {
    try {
      const bought = await contract.voterBought();
      setBought(parseInt(bought));
    } catch (error) {
      console.log("getStoredPrice Error: ", error);
    }
  }

  async function buy() {
    try {
      const transaction = await contract.vote(10);
      await transaction.wait();
      await getBought();
    } catch (error) {
      console.log("buy Error: ", error);
    }

  }

  getBought()
  .catch(console.error)

  return (
    <div className="container">
      <div className="row mt-5">

        <div className="col">
          <h3>Bought</h3>
          <p>You have bought {bought}</p>
        </div>

        <div className="col">
          <h3>Buy</h3>
          <button type="submit" className="btn btn-dark" 
onClick={buy}>Buy</button>
        </div>
      </div>
    </div>
  );
}

export default App;