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

- Node/Deno and npm/yarn: https://nodejs.org/en/download/
- Golang: [ethclient](http://github.com/ethereum/go-ethereum/ethclient)
- JavaScript/TypeScript: [ethers.js](https://github.com/ethers-io/ethers.js/)/web3.js

### Installation

- Setup an ethermint node/daemon with `ethermintd`
  - Set [gas price](https://ethermint.dev/quickstart/binary.html#configuring-the-node) in app.toml
  - Set [Pruning of State](https://medium.com/codechain/ethereums-state-trie-pruning-45ea73ed2c78#:~:text=In%20state%20trie%20pruning%2C%20it,the%20DB%20are%20not%20pruned.)
  - Set "chain-id" [ethermindcli config](https://ethermint.dev/quickstart/binary.html#client-configuration)
- Run Node
  - Start daemon with `./init.sh`
  - Start RPC Server with `ethermintcli rest-server --laddr "tcp://localhost:8545" --unlock-key mykey --chain-id ethermint-1 --trace`
  - Create and add key to [Manage Key](https://ethermint.dev/quickstart/run_node.html#key-management)


## Usage

TODO

## Observations

- Node setup on macOS Catalina fails at ```$ make install``` and throws deprication errors:
  ```rc
  # github.com/keybase/go-keychain
  cgo-gcc-prolog:203:11: warning: 'SecTrustedApplicationCreateFromPath' is deprecated: first deprecated in macOS 10.15 - No longer supported [-Wdeprecated-declarations]
  /Library/Developer/CommandLineTools/SDKs/MacOSX10.15.sdk/System/Library/Frameworks/Security.framework/Headers/SecTrustedApplication.h:59:10: note: 'SecTrustedApplicationCreateFromPath' has been explicitly marked deprecated here
  ```
- Node setup On Linux Ubuntu required manually adding binaries to $PATH
- [ethermintd config](https://ethermint.dev/quickstart/binary.html#client-configuration) doc seems outdated. Instead, the `config` is available with ```$ ethermintcli config```
- [Key Management](https://ethermint.dev/quickstart/run_node.html#key-management) doc seems outdated. Instead use 'ethermintcli'.
- [Using the CLI](https://ethermint.dev/quickstart/interact_node.html#using-the-cli) doc seems outdated. Instead use 'ethermintcli'.

