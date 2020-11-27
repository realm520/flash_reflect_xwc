pragma solidity ^0.6.2;
pragma experimental ABIEncoderV2;
import './interfaces/IERC20.sol';

contract XwcChange {
  
  address public admin;
  address xwcToken;
  struct ChangeRecord {
    string xwcAddr;
    uint amount;
  }
  mapping(address => ChangeRecord[]) internal changeRecords;
  
  event Change(uint amount, string xwcAddr);
  
  constructor(address xwcAddr_) public {
    xwcToken = xwcAddr_;
    admin = msg.sender;
  }

  function getRecord(address caller) public view returns (ChangeRecord[] memory) {
    return changeRecords[caller];
  }
  
  function change(uint amount, string memory xwcAddr) public returns (uint256) {
    bool success = IERC20(xwcToken).transferFrom(msg.sender, admin, amount);
    require(success, 'TRANSFER_FAILED');
    ChangeRecord memory record = ChangeRecord(xwcAddr, amount);
    changeRecords[msg.sender].push(record);
    emit Change(amount, xwcAddr);
    return amount;
  }
}
