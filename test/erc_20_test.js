const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const BasicToken = artifacts.require("BasicToken");
const { deploy, interact } = require("../scripts/erc20.js");

contract("BasicToken", accounts => {
	const from = accounts[0];
	const _totalSupply = 1000000000000000;
	const _name = "Dan Coin";
	const _decimals = 18;
	const _symbol = "DAN";
	const args = [
		_totalSupply,
		_name,
		_decimals,
		_symbol
	];

	before(async () => {

	})

	// TODO: Test #deploy, #interact
	describe("#deploy", async() => {
		it.only("should return the contract instance if successfull ", async() => {
			// const from = await getFirstAccount();
			tx = await deploy(BasicToken, from, args);
			console.log(tx);
			// expect(tx).to.be.equal("sth");
		});
	});
})
