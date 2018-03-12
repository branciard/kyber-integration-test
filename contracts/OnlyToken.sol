pragma solidity ^0.4.11;

import "./ERC20Interface.sol";

contract OnlyToken
{
  event Deposits(address addSender, address addThis, uint256 amount);
  ERC20 token;
  //constructor
  function OnlyToken(address _tokenAddress) public payable 
  {
      token = ERC20(_tokenAddress);
  }
  // external
  function deposit(uint256 _amount) public returns (bool)
  {
      require(token.transferFrom(msg.sender, address(this), _amount));
      //m_accounts[msg.sender].stake = m_accounts[msg.sender].stake.add(_amount);
      Deposits(msg.sender, this, _amount);
      return true;
  }

  function showBalance() public view returns (uint)
  {
      return token.balanceOf(this);
  }
}
