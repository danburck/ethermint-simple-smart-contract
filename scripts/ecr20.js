const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const BasicToken = require("../build/contracts/BasicToken")

// TODO Implement Deployment script

/**
 * @dev Get the first account
 * @return The first account
 */
async function getCurrentAccount() {
  const currentAccounts = await web3.eth.getAccounts();
  return currentAccounts[0];
}

async function createAccount() {
  const account = await web3.eth.accounts.create();
  console.log(account)
  return account;
}

async function deployContract(contractData, sender, args=[]) {

}

// DEBUG
getCurrentAccount();
createAccount();


// TODO Interaction script
