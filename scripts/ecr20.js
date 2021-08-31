const { ConsoleErrorListener } = require("antlr4/error/ErrorListener");
const IteratorClose = require("es-abstract/2015/IteratorClose");
const { toArray } = require("lodash");
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const BasicToken = require("../build/contracts/BasicToken")

/**
 * @dev Get the first account
 * @return The first account
 */
async function getFirstAccount() {
  const currentAccounts = await web3.eth.getAccounts();
  return currentAccounts[0];
}

/**
 * @dev Create a new account
 * @return The address of the account
 */
async function createAccount() {
  const account = await web3.eth.accounts.create().address;
  return account;
}

/**
 * @dev Deplay a contract in order to interact with it on a ethereum blockchain.
 * When you create a new contract object you give it the json interface of the
 * respective smart contract and web3 will auto convert all calls into low level
 * ABI calls over RPC for you.
 * @param contractData The compiled smart contract artifact
 * @param sender The sender of the contract, who also pays the gas fees
 * @param args The arguments which get passed to the constructor on deployment
 * @return The contract instance
 */
async function deploy(contractData, sender, args=[]) {
  // Instantiate a new contract with all its methods and events defined in its
  //  json interface object. Web3 then auto converts all calls into low level
  //  ABI calls over RPC.
  const contract = new web3.eth.Contract(contractData.abi);
  return contract
    .deploy({
      data: contractData.bytecode,
      arguments: args,
    })
    .send({
      from: sender,
      gas: 2000,
      gasPrice: 1
    })
    .then(function(contractInstance) {
      console.log(
        `Deployed contract ${contractData.contractName},
        Address: contractInstance.options.address`
      );
      return contractInstance;
    })
    .catch(function(err) {
      console.log(err);
      process.exit();
    });
}

/**
 * @dev Invokes some example interactions with the samrt contract
 * @param token The deployed ERC20 token contract instance
 * @return The contract instance
 */
async function interact(token, from) {
  const totalSupply = await token.methods.totalSupply().send({
    from: from,
    gas: 400000,
    gasPrice: 1,
  })
  console.log(`Total supply of tokens: ${totalSupply}`);

  const balance = await token.methods.balanceOf(from).send({
    from: from,
    gas: 400000,
    gasPrice: 1,
  })
  console.log(`Account balance of Sender: ${balance}`);

  await token.methods.transfer(to, value).send({
    from: from,
    gas: 400000,
    gasPrice: 1,
  })
  console.log(`Account balance of sender: ${balance}`);
  console.log(`Account balance of receiver: ${balance}`);
}

/**
 * @dev Runs the script to deploy and interact with the smart contract
 */
async function main() {
  const from = await getFirstAccount();
  const to = await createAccount();

  let basicToken = await deploy(BasicToken, from);
  interact(basicToken, from);
}

// main();


/////////////////////////////////////////////
//               DEBUGGER                  //
/////////////////////////////////////////////
// getFirstAccount();
// createAccount();
// const from = await getFirstAccount();
const _totalSupply = 1000000000000000;
const _name = "Dan Coin";
const _decimals = 18;
const _symbol = "DAN";

// deployContract(
//   BasicToken,
//   '0x76DF6C3072c98446a60B48cB8b639B444B39E136',
//   [
//     _totalSupply,
//     _name,
//     _decimals,
//     _symbol
//   ]
// );



// TODO Interaction script
