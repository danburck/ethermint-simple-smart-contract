const { expect } = require("chai");
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const BasicToken = artifacts.require("BasicToken");
const {
  getFirstAccount,
  createAccount,
  displayDecimal,
  deploy,
  queryTotalSupply,
  queryBalanceOf,
  transfer
} = require("../scripts/erc20.js");

contract("BasicToken", accounts => {
  const from = accounts[0];
  const TOTAL_SUPPLY = 1000000000000000;
  const NAME = "Dan Coin";
  const DECIMALS = 18;
  const SYMBOL = "DAN";
  const VALUE = 2000000;
  const ARGS = [
    TOTAL_SUPPLY,
    NAME,
    DECIMALS,
    SYMBOL
  ]

  before(async () => {

  })

  describe("#displayDecimal", async() => {
    it("should return a decimal", async() => {
      let value = 100000000000000;
      expect(displayDecimal(value)).to.be.equal(value / 10 ** DECIMALS);
    })
  })

  // TODO: Test #deploy, #interact
  describe("#deploy", async() => {
    it("should return the contract instance if successfull ", async() => {
      // const from = await getFirstAccount();
      tx = await deploy(BasicToken, from, args);
      console.log(tx);
      // expect(tx).to.be.equal("sth");
    });
  });
})
