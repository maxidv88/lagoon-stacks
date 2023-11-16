"use client";

import { useState, useContext } from "react";
import { openContractCall } from "@stacks/connect";

import { UserContext } from "../UserContext";
import { StacksTestnet, StacksDevnet } from "@stacks/network";
import { uintCV, listCV, tupleCV, bufferCV } from "@stacks/transactions";
import redstone from 'redstone-api';
import { Buffer } from 'buffer';


export default function HermeticaForm() {
  const { userData, userSession } = useContext(UserContext);
  console.log(userData)

  const buildTransaction = async (e) => {
    const priceData = await redstone.getPrice("BTC", "USD", {
      verifySignature: true,
    });
  
    console.log("btc price:"+priceData.value);
    //console.log("btc timestamp:"+priceData.timestamp); // the exact timestamp of the price
    //console.log("signature"+priceData.liteEvmSignature); // the signature of the price
    console.log(priceData)
    const price = BigInt(parseFloat(priceData.value) * 1e12);
    //const price = Math.floor(priceData.value);
    //const price = parseFloat(priceData.value).toString(2);
    const timestamp = priceData.timestamp;
    const signatureHex = priceData.liteEvmSignature;
    const signatureBuffer = Buffer.from(signatureHex.substring(2), 'hex');
    const symbol = priceData.symbol;
    const symbolBuffer = Buffer.alloc(32)
    symbolBuffer.write(symbol, 'ascii')
    //console.log("signatureBuffer:"+signatureBuffer.length)
    //console.log("symbolBuffer:"+symbolBuffer.length)
    

    const entries = [
      tupleCV({symbol: bufferCV(symbolBuffer), value: uintCV(price) })
    ]


    const functionArgs = [
      uintCV(timestamp),
      listCV(entries),
      bufferCV(signatureBuffer)
    ]

    const options = {
      contractAddress: 'ST1DSH0G45GZGGDJP3YVDEXTY4X2ZA89CKB5CZ6PK',
      contractName: 'hermetica-sbtc-erko-comptroller-v0-1',
      functionName: 'settle',
      functionArgs,
      appDetails: {
        name: 'My App',
        icon: window.location.origin + '/my-app-logo.svg',
      },
      onFinish: data => {
        console.log('Stacks Transaction:', data.stacksTransaction);
        console.log('Transaction ID:', data.txId);
        console.log('Raw transaction:', data.txRaw);
      },
    };

    const testnetAddress = userData.profile.stxAddress.testnet;
    console.log(testnetAddress)
    await openContractCall(options);

  }
  
  

  

  return (
    <form className="flex items-center justify-center space-x-4">
      <h2 className="text-2xl">Settle</h2>
      <button
        className="px-6 py-2 bg-orange-500 rounded hover:bg-orange-600 focus:outline-none"
        onClick={(e) => {
          e.preventDefault();
          buildTransaction();
        }}
      >
      Settle
      </button>
    </form>
  );
}