pragma solidity 0.8.5;

contract StructArg {

  struct Struct { 
      string str;
      uint256 unsigned256;
      uint256[] unsigned256Array;
   }

  function method(Struct memory _arg) returns (string, uint256) {
    uint256 total = _arg.unsigned256;

    for (uint256 i = 0; i < _arg.unsigned256Array.length; ++i) {
      total += _arg.unsigned256Array[i];
    }

    return (_arg.str, total);
  }
}
