pragma solidity ^0.5.11;

import "./ERC20Basic.sol";

/**
 * @title ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
contract ERC20 is ERC20Basic {

	function name() public view returns (string memory);
	function symbol() public view returns (string memory);
	function decimals() public view returns (uint8);

	function allowance(
		address owner,
		address spender
	)
		public view returns (uint256);

	function transferFrom(
		address from,
		address to,
		uint256 value
	)
		public returns (bool);

	function approve(
		address spender,
		uint256 value
	)
		public returns (bool);

	event Approval(
		address indexed owner,
		address indexed spender,
		uint256 value
	);
}