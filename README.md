# ethermint-simple-smart-contract

`ethermint-simple-smart-contract` is an exercise to deploy a simple smart
contract with [Ethermint](https://github.com/tharsis/ethermint).

It includes running an ethermint node, deploying a local ERC20 token smart
contract and writing a client-side program to query and transfer token balances
on the deployed smart contract.

_For more information on ethermint, please refer to the [ethermint
documentation](https://ethermint.dev/)_

- [ethermint-simple-smart-contract](#ethermint-simple-smart-contract)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage](#usage)
    - [Deploy contracts](#deploy-contracts)
    - [Run Tests](#run-tests)
    - [Interact with the contract](#interact-with-the-contract)
    - [Adding a new contracts](#adding-a-new-contracts)
  - [Observations](#observations)


## Getting Started

The project's architecture consists of a **client** and an **Ethermintd node**.
The Ethermintd node represents the EVM blockchain that the client can interact
with. The client
[deploys/migrates](https://ethereum.org/en/developers/docs/smart-contracts/deploying/) contracts on the blockchain in order for them to be available to users of the
Ethermint network. Once a contract is deployed to the network the client allows
you to interact with that contract.

You can use frameworks like [Truffle](https://www.trufflesuite.com/) or
[Hardhat](https://hardhat.org/) to 1) define smart contracts, 2) connect to the
node network using the network config, 3) deploy contracts, 4) run tests and 5)
interact with the deployed contract. I considered the following implementation
options:
  - Truffle: Deploy contract with `truffle migrate --network development` or use
    ethers.js/web3.js to deploy and interact with contract
  - Hardhat: Deploy and interact with contracts
  - Geth: Interact with deployed contract using the geth console

### Prerequisites

- [Node/Deno and npm/yarn](https://nodejs.org/en/download/)
- [jq](https://stedolan.github.io/jq/download/)
- [Go 1.16+](https://golang.org/dl/)
- [JavaScript/TypeScript:
  web3.js](https://web3js.readthedocs.io/en/v1.4.0/getting-started.html)
- [truffle 5.1.44](https://www.trufflesuite.com/)

### Installation
1. Install npm packages (e.g. solidity linter solhint):
   ```
   $ npm install
   ```

2. Setup and start a local `Ethermintd node` following the instructions in the
   [Ethermint docs](https://ethermint.dev/quickstart/installation.html). Before
   starting the node, set the [client
   config](https://ethermint.dev/quickstart/binary.html#client-configuration) to
   run a local testnet:
   ```json
   {
   "chain-id": "ethermint_9000-1",
   "keyring-backend": "test",
   "output": "text",
   "node": "tcp://localhost:26657",
   "broadcast-mode": "sync"
   }
   ```

3. Git clone this repository into your desired location to get the client:

   ```bash
   $ git clone https://github.com/danburck/ethermint-simple-smart-contract
   $ cd ethermint-simple-smart-contract
   ```

4. Configure the `truffle-config` in the project root to connect to your
   ethereum development client/node (EVM RPC HTTP server)

   ```js
   networks: {
      // Useful for testing. The `development` name is special - truffle uses it by default
      // if it's defined here and no other network is specified at the command line.
      // You should run a client (like ganache-cli, geth or parity) in a separate terminal
      // tab if you use this network and you must also set the `host`, `port` and `network_id`
      // options below to some value.
      //
      development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
   ```

## Usage

Define new smart ontracts at `/contracts` and tests at `/tests`. The project comes implemented with an ERC20 Token smart contract.

### Deploy contracts

1. Compile all contracts:

   ```bash
   $ truffle compile
   ```

2. Deploy the contract to node network using:

   ```bash
   $ truffle migrate --network development
   ```

### Run Tests

[Truffle tests](https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript) are based on [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/). To compile and run the all unit tests, run:

```bash
$ truffle test --network development
```

### Interact with the contract

Run the `erc20.js` script to deploy the ERC20 token smart contract and invoke balance queries and token transfers:

   ```bash
   $ node scripts/erc20.js
   ```

Find a log of query results and transfer receipts, including information such as `contract`, `address`, `gasUsed`, `totalSupply`, `balances` and more.

### Adding a new contracts
To add new contracts follow the following steps:

```bash
  # Add a new contract
  $ touch contracts/MyContract.sol

  # Write a new Contract

  # Compile your contract.
  $ truffle compile

  # Create unit tests
  $ touch test/my_contract.js

  # Run tests

  # Migrate your contract
  $ truffle migrate

  # Write a script to interact with your contract
  $ touch scripts/my_contract.js
```

## Observations

- Node setup on macOS Catalina throws [deprication
  errors](https://github.com/tharsis/ethermint/issues/505) errors at  ```$ make
  install```

- [Adding genesis account throws
  errors](https://ethermint.dev/guides/localnet/single_node.html#adding-genesis-accounts):

  Documentation could be more clear by removing the code:

  ```bash
  ethermintd add-genesis-account my_validator 10000000000aphoton --keyring-backend test
  ```

  and only including

  ```bash
  ethermintd add-genesis-account my_validator 1000000000stake,10000000000aphoton --keyring-backend=test
  ```

  Also it would be more clear to add the gentx command:

  ```bash
  ethermintd gentx my_validator 1000000stake --keyring-backend=test --chain-id=$CHAINID
  ```

  and movig the a hint to [configure the
  node](https://ethermint.dev/quickstart/binary.html#configuring-the-node) from
  the [initialize
  section](https://ethermint.dev/guides/localnet/single_node.html#initialize-the-chain)
  to [run
  testnet](https://ethermint.dev/guides/localnet/single_node.html#run-testnet)

- [`ethermintd tx bank
  send`](https://ethermint.dev/quickstart/interact_node.html#using-the-cli)
  command should include fees:

  ```bash
  ethermintd tx bank send $MY_KEY $RECIPIENT 20000aphoton --chain-id=$CHAINID --keyring-backend=test --fees='1aphoton'
  ```

- Connecting hardhat to the node throws an errors with the following
  `hardhat.config`:

  ```js
  module.exports = {
    networks: {
      hardhat: {
      },
      development: {
        url: "localhost:8545",
        chainID: "ethermint_9000-1",
      },
    },
    solidity: "0.8.4",
  };
  ```

  Running any command, e.g.

  ```bash
  npx hardhat accounts --network development
  ```

  throws the following error:

  ```
  An unexpected error occurred:

  TypeError: Only HTTP(S) protocols are supported
      at getNodeRequestOptions (/Users/danielburckhardt/code/hardhat-test/node_modules/node-fetch/lib/index.js:1309:9)
      at /Users/danielburckhardt/code/hardhat-test/node_modules/node-fetch/lib/index.js:1410:19
      at new Promise (<anonymous>)
      at fetch (/Users/danielburckhardt/code/hardhat-test/node_modules/node-fetch/lib/index.js:1407:9)
      at HttpProvider._fetchJsonRpcResponse (/Users/danielburckhardt/code/hardhat-test/node_modules/hardhat/src/internal/core/providers/http.ts:140:30)
      at HttpProvider.request (/Users/danielburckhardt/code/hardhat-test/node_modules/hardhat/src/internal/core/providers/http.ts:55:29)
      at GanacheGasMultiplierProvider._isGanache (/Users/danielburckhardt/code/hardhat-test/node_modules/hardhat/src/internal/core/providers/gas-providers.ts:302:30)
      at GanacheGasMultiplierProvider.request (/Users/danielburckhardt/code/hardhat-test/node_modules/hardhat/src/internal/core/providers/gas-providers.ts:291:23)
      at EthersProviderWrapper.send (/Users/danielburckhardt/code/hardhat-test/node_modules/@nomiclabs/hardhat-ethers/src/internal/ethers-provider-wrapper.ts:13:20)
      at Object.getSigners (/Users/danielburckhardt/code/hardhat-test/node_modules/@nomiclabs/hardhat-ethers/src/internal/helpers.ts:23:20)
  ```