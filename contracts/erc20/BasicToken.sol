pragma solidity ^0.5.11;

import "./ERC20.sol";
import "../helpers/MassTransferERC20.sol";


/**
* @title BasicToken contract
* @dev Implements EIP20 token standard:
* @dev https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
* @author https://github.com/alesanro
* @author Refactored by https://github.com/danburck
**/
contract BasicToken is ERC20 {

  event ErrorMessage(uint code, string message);

  uint256 constant private MAX_UINT256 = 2**256 - 1;
  mapping (address => uint256) public balances;
  mapping (address => mapping (address => uint256)) public allowed;

  /**
   * NOTE:
   * The following variables are OPTIONAL vanities. One does not have to include
   * them. They allow one to customise the token contract & in no way influences
   * the core functionality. Some wallets/interfaces might not even bother to
   * look at this information.
   **/
  string public _name;
  uint8 public _decimals;
  string public _symbol;
  uint256 public _totalSupply;

  /**
   * @dev Contract constructor. Function is invoked by TODO
   *    - Gives the creator all initial tokens
   *    - Updates total supply
   * 		- Sets the values for name, symbol, and decimals. All three of these
   * 			values are immutable: they can only be set once during construction.
   * @param _initialAmount The initial supply of tokens
   * @param _tokenName The name of the token
   * @param _decimalUnits the decimal unit of the token
   * @param _tokenSymbol The symbol of the token
   */
  constructor(
    uint256 _initialAmount,
    string memory _tokenName,
    uint8 _decimalUnits,
    string memory _tokenSymbol
  ) public {
    balances[msg.sender] = _initialAmount;
    _totalSupply = _initialAmount;
    _name = _tokenName;
    _decimals = _decimalUnits;
    _symbol = _tokenSymbol;
  }

  /**
   * @dev Returns the name of the token.
   * @return The name of the token.
   */
  function name() public view returns (string memory) {
    return _name;
  }

  /**
   * @dev Returns the symbol of the token, usually a shorter version of the
   * 		name.
   * @return The symbol of the token.
   */
  function symbol() public view returns (string memory) {
    return _symbol;
  }

  /**
   * @dev Returns the number of decimals used to get its user representation.
   * 		- E.g. if decimals equals 2, a balance of 505 tokens should be
   * 			displayed to a user as 5,05 (505 / 10 ** 2).
   * @return The number of decimals
   */
  function decimals() public view returns (uint8) {
    return _decimals;
  }

  /**
   * @dev Get the amount of tokens in existence.
   * @return the amount of tokens in existence.
   */
  function totalSupply() public view returns (uint256) {
    return _totalSupply;
  }

  /**
   * @dev Moves amount tokens from the caller’s account to recipient.
   * @dev Emits a Transfer event.
   * @param _to The address of the account to transfer tokens to
   * @param _value The amount of tokens
   * @return Boolean value indicating whether the operation succeeded.
   */
  function transfer(
    address _to,
    uint256 _value
  )
    public returns (bool success)
  {
    require(balances[msg.sender] >= _value);
    balances[msg.sender] -= _value;
    balances[_to] += _value;
    emit Transfer(msg.sender, _to, _value); //solhint-disable-line indent, no-unused-vars
    return true;
  }

  /**
   * @dev Moves amount of tokens from sender to recipient using the allowance
   * 		mechanism. The amount is then deducted from the caller’s allowance.
   * @dev	Emits a Transfer event.
   * @param _from The address of the sender
   * @param _to The address of the recipient
   * @param _value The amount of tokens
   * @return Boolean value indicating whether the operation succeeded.
   */
  function transferFrom(
    address _from,
    address _to,
    uint256 _value
  )
    public returns (bool success)
  {
    uint256 allowance = allowed[_from][msg.sender];
    require(balances[_from] >= _value && allowance >= _value);
    balances[_to] += _value;
    balances[_from] -= _value;
    if (allowance < MAX_UINT256) {
      allowed[_from][msg.sender] -= _value;
    }
    emit Transfer(_from, _to, _value); //solhint-disable-line indent, no-unused-vars
    return true;
  }

  /**
   * @dev Get the amount of tokens owned by account
   * @param _owner The address of the owner
   * @return The amount of tokens owned by account
   */
  function balanceOf(
    address _owner
  )
    public view returns (uint256 balance)
  {
    return balances[_owner];
  }

  /**
   * @dev Sets the allowance amount of spender over the caller’s tokens.
   * @param _spender The address of the owner
   * @param _value value of the amount
   * @return Boolean value indicating whether the operation succeeded.
   */
  function approve(
    address _spender,
    uint256 _value
  )
    public returns (bool success)
  {
    allowed[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value); //solhint-disable-line indent, no-unused-vars
    return true;
  }

  /**
   * @dev Returns the remaining number of tokens that spender will be allowed
   * 		to spend on behalf of owner through transferFrom. This is zero by
   *		default. This value changes when approve or transferFrom are called.
   * @param _owner The address of the owner
   * @param _spender The address of the spender
   * @return remaining number of tokens that spender will be allowed to spend
   * 		on behalf of owner through transferFrom.
   */
  function allowance(
    address _owner,
    address _spender
  )
    public view returns (uint256 remaining)
  {
    return allowed[_owner][_spender];
  }

  /**
   * @dev Moves amounts of tokens from the caller’s account to several
   * 		recipients.
   * @param addresses The address[] of the accounts to transfer tokens to
   * @param values The amount[] of tokens
   * @return Boolean value indicating whether the operation succeeded.
   */
  function massTransfer(
    address[] calldata addresses,
    uint[] calldata values
  )
    external returns (uint errorCode, uint count)
  {
    require(addresses.length == values.length);

    uint success = 0;
    for (uint idx = 0; idx < addresses.length && gasleft() > 110000; idx++) {
      uint value = values[idx];
      if (!transfer(addresses[idx], value)) {
        revert("no transfer");
      }
      success++;
    }

    return (1, success);
  }
}