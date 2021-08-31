const { ConsoleErrorListener } = require("antlr4/error/ErrorListener");
const IteratorClose = require("es-abstract/2015/IteratorClose");
const { toArray } = require("lodash");
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const BasicToken = require("../build/contracts/BasicToken")

// Customize the script by changing the constant default values
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
/**
 * @dev Get the first account
 * @return The first account
 */
const getFirstAccount = async() => {
  const currentAccounts = await web3.eth.getAccounts();
  return currentAccounts[0];
}

/**
 * @dev Create a new account
 * @return The address of the account
 */
const createAccount = async() => {
  const account = await web3.eth.accounts.create().address;
  return account;
}

/**
 * @dev Deplay a contract in order to interact with it on a ethereum blockchain.
 * When you create a new contract object you give it the json interface of the
 * respective smart contract and web3 will auto convert all calls into low level
 * ABI calls over RPC for you.
 * @param contractData The compiled smart contract artifact
 * @param from The sender of the contract, who also pays the gas fees
 * @param args The arguments which get passed to the constructor on deployment
 * @return The contract instance
 */
const deploy = async(contractData, from, args=[]) => {
  // Instantiate a new contract with all its methods and events defined in its
  //  json interface object. Web3 then auto converts all calls into low level
  //  ABI calls over RPC.
  const contract = new web3.eth.Contract(contractData.abi);
  return contract
    // Deploy the contract to the blockchain. After successful deployment the
    // promise will resolve with a new contract instance.
    .deploy({
      data: contractData.bytecode,
      arguments: args,
    })
    // Send a they deploymnet transaction to the contract and execute its method
    .send({
      from: from,
      gas: 4000000,
      gasPrice: 1
    })
    .then(function(contractInstance) {
      console.log(
        `\n********* DEPLOYED: ********* \n` +
        `Deployed contract: ${contractData.contractName} \n` +
        `Address: ${contractInstance.options.address}`
      );
      return contractInstance;
    })
    .catch(function(err) {
      console.log(err);
      process.exit();
    });
}

/**
 * @dev Queries and logs the the total supply for tokens
 * @param token The deployed ERC20 token contract instance
 * @param from The sender of the contract
 * @return The total supply of tokens
 */
const queryTotalSupply = async(from, token) => {
  await token.methods.totalSupply().call({
    from: from,
    gas: 4000000,
    gasPrice: 1,
  })
  .then(function(totalSupply) {
    console.log(
      `\n********* QUERY ********* \n` +
      `Total supply of tokens: ${totalSupply} ${SYMBOL}`
    );
    // return totalSupply;
  })
  .catch(function(err) {
    console.log(err);
    process.exit();
  });
}

/**
 * @dev Queries and logs the balance of the sender of the contract
 * @param token The deployed ERC20 token contract instance
 * @param from The sender of the contract
 * @return The balance of the sender
 */
const queryBalanceOf = async(from, token) => {
  await token.methods.balanceOf(from).call({
    from: from,
    gas: 4000000,
    gasPrice: 1,
  })
  .then(function(balance) {
    console.log(
      `\n********* QUERY ********* \n` +
      `Address: ${from} \n` +
      `Balance: ${balance} ${SYMBOL}`
    );
    return balance;
  })
  .catch(function(err) {
    console.log(err);
    process.exit();
  });
}

/**
 * @dev Moves tokens from sender to receiver
 * @param token The deployed ERC20 token contract instance
 * @param from The sender of the contract
 * @param to The receiver of the transferred token
 * @param value The amount of transferred tokens
 * @return The contract instance
 */
const transfer = async(token, from, to, value) => {
  await token.methods.transfer(to, value).send({
    from: from,
    gas: 4000000,
    gasPrice: 1,
  })
  .on('transactionHash', function(hash){ })
  .on('confirmation', function(confirmationNumber, receipt){})
  .on('receipt', function(receipt){
    // console.log(receipt);
    console.log(
      `\n********* TRANSFER RECEIPT: ********* \n` +
      `Gas used: ${receipt.gasUsed} \n` +
      `From: ${from} \n` +
      `Block number: ${receipt.blockNumber}`
    );
  })
  // If there's an out of gas error the second parameter is the receipt.
  .on('error', console.error);

}

/**
 * @dev Runs the script to deploy and interact with the smart contract
 */
const main = async() =>  {
  // Get accounts
  const from = await getFirstAccount();
  const to = await createAccount();

  // Deploy ECR 20 Token smart contract
  let token = await deploy(BasicToken, from, ARGS);

  // Interactions with the smart contract
  await queryTotalSupply(from, token);
  await queryBalanceOf(from, token);
  await transfer(token, from, to, VALUE);
  await queryBalanceOf(from, token);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

module.exports = {
  getFirstAccount,
  createAccount,
  deploy,
  queryTotalSupply,
  queryBalanceOf,
  transfer
};