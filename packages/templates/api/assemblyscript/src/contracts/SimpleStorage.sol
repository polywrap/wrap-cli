pragma solidity 0.8.3;

contract SimpleStorage {
  uint data;

  event DataSet(address from);

  function set(uint256 x) public {
    data = x;
    emit DataSet(msg.sender);
  }

  function get() public view returns (uint256) {
    return data;
  }
}
