pragma solidity 0.8.3;

contract SimpleStorage {
  uint256 data;
  string ipfsHash;
  Job[] jobs;
  uint256[] primitives;

  struct Job {
    address to;
    uint256 amount;
  }

  event DataSet(address from, uint256 data);
  event HashSet(address from, string ipfsHash);

  function set(uint256 x) public {
    data = x;
    emit DataSet(msg.sender, x);
  }

  function get() public view returns (uint256) {
    return data;
  }

  function setHash(string calldata x) public {
    ipfsHash = x;
    emit HashSet(msg.sender, x);
  }

  function getHash() public view returns (string memory) {
    return ipfsHash;
  }

  // Structs array

  function addJob(bytes calldata _data) public {
    Job memory job = abi.decode(_data, (Job));
    jobs.push(job);
  }

  function getJobs() public view returns (Job[] memory) {
    return jobs;
  }

  // Primitives array

  function addSimple(uint256 element) public {
    return primitives.push(element);
  }

  function getSimple() public view returns (uint256[] memory) {
    return primitives;
  }

}
