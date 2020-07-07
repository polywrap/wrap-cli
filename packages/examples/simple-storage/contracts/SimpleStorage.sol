pragma solidity >=0.4.22 <0.7.0;

contract SimpleStorage {
  uint data;

  event DataSet(address from);

  function set(uint x) public {
    data = x;
    emit DataSet(msg.sender);
  }

  function get() public view returns (uint) {
    return data;
  }
}
