pragma solidity ^0.5.11;

import "../erc20/ERC20.sol";

/**
* @title MassTransferERC20 contract
* @dev TODO
**/
contract MassTransferERC20 is ERC20 {
	function massTransfer(
    address[] calldata addresses,
    uint[] calldata values
  )
    external returns (uint errorCode, uint count);
}