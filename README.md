# ethermint-simple-smart-contract

`ethermint-simple-smart-contract` is an exercise to deploy a simple smart contract with [Ethermint](https://github.com/tharsis/ethermint).

It includes running an ethermint node, deploying a local ERC20 token smart contract and writing a client-side program to query and transfer token balances on the deployed smart contract.

_For more information on ethermint, please refer to the [ethermint documentation](https://ethermint.dev/)_

- [ethermint-simple-smart-contract](#ethermint-simple-smart-contract)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage](#usage)
  - [Observations](#observations)


## Getting Started

TODO

### Prerequisites

- [Node/Deno and npm/yarn](https://nodejs.org/en/download/)
- Golang: [ethclient](http://github.com/ethereum/go-ethereum/ethclient)
- JavaScript/TypeScript: [ethers.js](https://github.com/ethers-io/ethers.js/)/web3.js
- [Go 1.16+](https://golang.org/dl/)
- [jq](https://stedolan.github.io/jq/download/)

### Installation

- Setup and run an local `ethermint` node
  - Install [`ethermintd` binaries](https://ethermint.dev/quickstart/installation.html#install-binaries)
  - Setup a [single `ethermintd` validator node](https://ethermint.dev/guides/localnet/single_node.html#manual-localnet) that runs a network locally for development
  - Configure the node ([gas price](https://ethermint.dev/quickstart/binary.html#configuring-the-node), [Pruning of State](https://medium.com/codechain/ethereums-state-trie-pruning-45ea73ed2c78#:~:text=In%20state%20trie%20pruning%2C%20it,the%20DB%20are%20not%20pruned.) and [client config](https://ethermint.dev/quickstart/binary.html#client-configuration))
  - Run [local node Testnet](https://ethermint.dev/guides/localnet/single_node.html#run-testnet)


## Usage

TODO

## Observations

- Node setup on macOS Catalina fails at ```$ make install``` and throws [deprication errors](https://github.com/tharsis/ethermint/issues/505)


- [Adding genesis account throws errors](https://ethermint.dev/guides/localnet/single_node.html#adding-genesis-accounts):
  ```
  Error: failed to get address from Keybase: my_validator.info: key not found [cosmos/cosmos-sdk@v0.43.0/crypto/keyring/keyring.go:465]
  ```



- `ethermintd tx bank send` dosnt work