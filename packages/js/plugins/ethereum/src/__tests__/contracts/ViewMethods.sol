pragma solidity 0.8.5;

contract ViewMethods {

  // bool
  function getBool() public view returns (bool) {
    return true;
  }

  // int / uint
  function getUint8() public view returns (uint8) {
    return 5;
  }

  function getUint256() public view returns (uint256) {
    return 2**256 - 1;
  }

  function getInt8() public view returns (int8) {
    return -5;
  }

  function getInt256() public view returns (int256) {
    return (2**256 / -2) + 1;
  }

  // address
  function getAddress() public view returns (address) {
    return 0xdeAdbeeF3A5632f8A64D10B04Bf7e633A04bFb97;
  }

  // bytes1-32
  function getBytes1() public view returns (bytes1) {
    return 0xFF;
  }

  function getBytes32() public view returns (bytes32) {
    return 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
  }

  // bytes
  function getBytes() public view returns (bytes memory) {
    return "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt";
  }

  // string
  function getString() public view returns (string memory) {
    return "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt";
  }

  // enum
  enum Enum { Foo, Bar, Baz }

  function getEnum() public view returns (Enum) {
    return Enum.Bar;
  }

  // arrays
  function getArray1D() public view returns (uint8[6] memory) {
    return [1, 2, 3, 6, 5, 4];
  }

  function getArray2D() public view returns (uint8[3][2] memory) {
    return [
      [1, 2, 3],
      [6, 5, 4]
    ];
  }

  function getArray3D() public view returns (uint8[3][3][2] memory) {
    return [
      [
        [1, 1, 1],
        [2, 2, 2],
        [3, 3, 3]
      ],
      [
        [6, 6, 6],
        [5, 5, 5],
        [4, 4, 4]
      ]
    ];
  }

  // struct
  struct Struct {
    string foo;
    uint256 bar;
    Enum baz;
  }

  function getStruct() public view returns (Struct memory) {
    return Struct(
      getString(),
      getUint256(),
      getEnum()
    );
  }

  // multi-value
  function getMultiUnamed() public view returns (
    uint8[6] memory,
    string memory,
    Struct memory
  ) {
    return (
      getArray1D(),
      getString(),
      getStruct()
    );
  }

  function getMultiNamed() public view returns (
    Struct memory obj,
    uint8[6] memory array1d,
    string memory str
  ) {
    return (
      getStruct(),
      getArray1D(),
      getString()
    );
  }

  function getMultiMixed() public view returns (
    string memory,
    Struct memory obj,
    uint8[6] memory
  ) {
    return (
      getString(),
      getStruct(),
      getArray1D()
    );
  }
}
