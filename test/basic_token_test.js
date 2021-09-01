const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const BasicToken = artifacts.require("BasicToken");
const truffleAssert = require("truffle-assertions");

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

  before( async () => {
    basicToken = await BasicToken.new(...ARGS);
    to = await web3.eth.accounts.create().address;
  })

  describe("#constructor", async () => {
    it("should a basic token instance ", async () => {
      assert.instanceOf(basicToken, BasicToken);
    });
  });

  describe("#name", async () => {
    it("should return the name", async() => {
      const name = await basicToken.name();
      expect(name).to.be.equal(NAME);
    });
  });

  describe("#symbol", async () => {
    it("should return the symbol", async() => {
      const symbol = await basicToken.symbol();
      expect(symbol).to.be.equal(SYMBOL);
    });
  });

  describe("#decimals", async () => {
    it("should return the decimals", async() => {
      const decimals = await basicToken.decimals();
      expect(decimals.toNumber()).to.be.equal(DECIMALS);
    });
  });

  describe("#totalSupply", async () => {
    it("should return the totalSupply", async() => {
      const totalSupply = await basicToken.totalSupply();
      expect(totalSupply.toNumber()).to.be.eq(TOTAL_SUPPLY);
    });
  });

  describe("#balanceOf", async () => {
    it("should return the amount of tokens owned by account", async() => {
      const balance = await basicToken.balanceOf(from);
      expect(balance.toNumber()).to.be.eq(TOTAL_SUPPLY);
    });
  });

  describe("#transfer", () => {
    describe("is successful", () => {
      const tx = () => basicToken.transfer(to, VALUE);

      it("should return a transfer object", async() => {
        const obj = await tx();
        assert.containsAllKeys(obj, ['tx', 'receipt', 'logs']);
      });

      it("should emit a transfer event", async() => {
        const obj = await tx();
        truffleAssert.eventEmitted(obj, "Transfer", (ev) => {
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

    describe("is not successful", () => {
      const tx = () => basicToken.transfer(to, VALUE);

      it("should not eturn a transfer object", async() => {
        const obj = await tx();
        assert.containsAllKeys(obj, ['tx', 'receipt', 'logs']);
      });

      it("should emit a transfer event", async() => {
        const obj = await tx();
        truffleAssert.eventEmitted(obj, "Transfer", (ev) => {
          return(
            ev.from === from &&
            ev.to === to &&
            ev.value.toNumber() === VALUE
          )
        });
      });

      it.only("should not increase the recipient balance", async() => {
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
  });





  // TODO Table Driven Testing & FIXTRURES
  // Go: https://www.codementor.io/@cyantarek15/how-table-driven-tests-makes-writing-unit-tests-exciting-and-fun-in-go-15g1wzdf7g
  // Js: https://medium.com/fsmk-engineering/table-driven-tests-in-javascript-c0c9305110ce


    // describe("is not succesful", async() => {
    //   // TODO How to test failing contracts?
    //   it("should not emit a Transfer Event", async() => {
    //     const to = await web3.eth.accounts.create().address;
    //     const value = TOTAL_SUPPLY + 1000;
    //     let tx = await basicToken.transfer(to, value);

    //     truffleAssert.eventNotEmitted(tx, "Transfer");
    //   });
    // })
  });
})
