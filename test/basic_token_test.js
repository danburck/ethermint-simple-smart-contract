const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const BasicToken = artifacts.require("BasicToken");
const truffleAssert = require("truffle-assertions");
const _ = require("lodash");

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
  ];
  let basicToken;

  before(async () => {
    basicToken = await BasicToken.new(...ARGS);
    to = await web3.eth.accounts.create().address;
  });

  describe("#constructor", async () => {
    it("should return a basic token instance ", async () => {
      assert.instanceOf(basicToken, BasicToken);
    });
  });

  const getterTests = [
    {
      name: "name",
      params: [],
      number: false,
      actual: NAME
    },
    {
      name: "symbol",
      params: [],
      number: false,
      actual: SYMBOL
    },
    {
      name: "decimals",
      params: [],
      number: true,
      actual: DECIMALS
    },
    {
      name: "totalSupply",
      params: [],
      number: true,
      actual: TOTAL_SUPPLY
    },
    {
      name: "balanceOf",
      params: [from],
      number: true,
      actual: TOTAL_SUPPLY
    }
  ]

  getterTests.forEach((test) => {
    describe(`#${test.name}`, () => {
      it(`should return the ${test.name}`, async() => {
        let expected = await basicToken[test.name](...test.params);
        test.number && (expected = expected.toNumber());
        expect(expected).to.be.equal(test.actual);
      });
    });
  })

  describe("#transfer", () => {
    describe("is successful", () => {
      const tx = () => basicToken.transfer(to, VALUE);

      it("should return a receipt with status true", async() => {
        const result = await tx();
        expect(result.receipt.status).to.be.true;
      });

      it("should emit a transfer event", async() => {
        const result = await tx();
        truffleAssert.eventEmitted(result, "Transfer", (ev) => {
          return(
            ev.from === from &&
            ev.to === to &&
            ev.value.toNumber() === VALUE
          )
        });
      });

      it("should increase the recipient balance", async() => {
        const balanceBefore = await basicToken.balanceOf(to);
        await tx();
        const balanceAfter = await basicToken.balanceOf(to);
        expect(balanceAfter.toNumber()).to.be.equal(
          balanceBefore.toNumber() + VALUE
        );
      });

      it("should decrease the callers balance", async() => {
        const balanceBefore = await basicToken.balanceOf(from);
        await tx();
        const balanceAfter = await basicToken.balanceOf(from);
        expect(balanceAfter.toNumber()).to.be.equal(
          balanceBefore.toNumber() - VALUE
        );
      });
    });

    describe("is unsuccessful", () => {
      const tx = () => basicToken.transfer(to, TOTAL_SUPPLY + 10000);

      it("should should revert with an error", async () => {
        await truffleAssert.reverts(
          tx(),
          'Transaction'
        );
      })

      it("should not emit a Transfer Event", async() => {
        const result = await tx().catch((error) => error);
        expect(result.logs).to.be.undefined;
      });

      it("should return a receipt with status false", async() => {
        const result = await tx().catch((error) => error);
        expect(result.receipt.status).to.be.false;
      });

      it("should not increase the recipient balance", async() => {
        const balanceBefore = await basicToken.balanceOf(to);
        await tx().catch((error) => error);
        const balanceAfter = await basicToken.balanceOf(to);
        expect(balanceAfter.toNumber()).to.be.equal(balanceBefore.toNumber());
      });

      it("should not decrease the callers balance", async() => {
        const balanceBefore = await basicToken.balanceOf(from);
        await tx().catch((error) => error);
        const balanceAfter = await basicToken.balanceOf(from);
        expect(balanceAfter.toNumber()).to.be.equal(balanceBefore.toNumber());
      });
    });
  });
})