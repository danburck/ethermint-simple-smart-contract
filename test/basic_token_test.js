const { expect } = require("chai");
const { assert } = require("console");

const BasicToken = artifacts.require("BasicToken");

/*
	TODO Table Driven Testing
	Go: https://www.codementor.io/@cyantarek15/how-table-driven-tests-makes-writing-unit-tests-exciting-and-fun-in-go-15g1wzdf7g
	Js: https://medium.com/fsmk-engineering/table-driven-tests-in-javascript-c0c9305110ce
 */
contract('BasicToken', accounts => {
	const from = accounts[0]
	let basicToken
	const _totalSupply = 1000000000000000;
	const _name = "Dan Coin";
	const _decimals = 18;
	const _symbol = "DAN";

	before(async () => {
		basicToken = await BasicToken.new(
			_totalSupply,
			_name,
			_decimals,
			_symbol
		)
	})

	describe('#name', async() => {
		it('should return the name', async() => {
			const name = await basicToken.name();
			expect(name).to.be.equal(_name);
		});
	});

	describe('#synbol', async() => {
		it('should return the symbol', async() => {
			const symbol = await basicToken.symbol();
			expect(symbol).to.be.equal(_symbol);
		});
	});

	describe('#decimals', async() => {
		it('should return the decimals', async() => {
			const decimals = await basicToken.decimals();
			expect(decimals.toNumber()).to.be.equal(_decimals);
		});
	});

	describe('#totalSupply', async() => {
		it('should return the totalSupply', async() => {
			const totalSupply = await basicToken.totalSupply();
			expect(totalSupply.toNumber()).to.be.eq(_totalSupply);
		});
	});

	describe('#balanceOf', async() => {
		it('should return the amount of tokens owned by account', async() => {
			const balance = await basicToken.balanceOf(from)
			expect(balance.toNumber()).to.be.eq(_totalSupply);
		});
	});


	// TODO Test Query and transfer of tokens
})
