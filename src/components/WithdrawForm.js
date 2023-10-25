"use client";

import { useState, useContext } from "react";
import {
  DevEnvHelper,
  sbtcWithdrawHelper,
  sbtcWithdrawMessage,
  TESTNET,
  WALLET_00,
  TestnetHelper,
} from "sbtc";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import * as btc from "@scure/btc-signer";
import { openSignatureRequestPopup } from "@stacks/connect";

import { UserContext } from "../UserContext";
import { StacksTestnet, StacksDevnet } from "@stacks/network";

export default function WithdrawForm() {
  const { userData, userSession } = useContext(UserContext);
  const [satoshis, setSatoshis] = useState("");
  const [signature, setSignature] = useState("");
  console.log(userData)
  
  const testnet = new DevEnvHelper();

  const handleInputChange = (event) => {
    setSatoshis(event.target.value);
  };

  const signMessage = async (e) => {
    e.preventDefault();
    const bitcoinAccountA = await testnet.getBitcoinAccount(WALLET_00);
    const btcAddress = bitcoinAccountA.wpkh.address;
    const message =
      sbtcWithdrawMessage({
        //network: TESTNET,
        amountSats: satoshis,
        bitcoinAddress: btcAddress,
      });

    openSignatureRequestPopup({
      message,
      userSession,
      network: new StacksDevnet(),
      onFinish: (data) => {
        setSignature(data.signature);
      },
    });
  };

  const buildTransaction = async (e) => {
    e.preventDefault();
    // const testnet = new TestnetHelper();
    //const testnet = new DevEnvHelper();
    const bitcoinAccountA = await testnet.getBitcoinAccount(WALLET_00);
    const btcAddress = bitcoinAccountA.wpkh.address;
    const btcPublicKey = bitcoinAccountA.publicKey.buffer.toString();
    const sbtcWalletAddress = bitcoinAccountA.tr.address;

    let utxos = await testnet.fetchUtxos(
      btcAddress
    );

    // get sBTC deposit address from bridge API
    const response = await fetch(
      "https://bridge.sbtc.tech/bridge-api/testnet/v1/sbtc/init-ui"
    );
    const data = await response.json();

    const tx = await sbtcWithdrawHelper({
      //network: TESTNET,
      sbtcWalletAddress: sbtcWalletAddress,
      bitcoinAddress: btcAddress,
      amountSats: satoshis,
      signature,
      feeRate: await testnet.estimateFeeRate("low"),
      fulfillmentFeeSats: 2000,
      utxos,
      bitcoinChangeAddress: btcAddress,
    });
    const psbt = tx.toPSBT();
    const requestParams = {
      publicKey: btcPublicKey,
      hex: bytesToHex(psbt),
    };
    const txResponse = await window.btc.request("signPsbt", requestParams);
    const formattedTx = btc.Transaction.fromPSBT(
      hexToBytes(txResponse.result.hex)
    );
    formattedTx.finalize();
    const finalTx = await testnet.broadcastTx(formattedTx);
    console.log(finalTx);
  };

  return (
    <form className="flex items-center justify-center space-x-4">
      <input
        type="number"
        placeholder="Amount of BTC to deposit"
        className="w-1/3 px-4 py-2 text-gray-300 bg-gray-700 rounded focus:outline-none focus:border-orange-500"
        value={satoshis}
        onChange={handleInputChange}
      />
      <button
        className="px-6 py-2 bg-orange-500 rounded hover:bg-orange-600 focus:outline-none"
        onClick={(e) => {
          signature ? buildTransaction(e) : signMessage(e);
        }}
      >
        {signature ? "Broadcast Withdraw Tx" : "Sign Withdraw Tx"}
      </button>
    </form>
  );
}