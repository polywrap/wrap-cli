module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  if (hre.network.name === "localhost") {
    throw Error(
      "Please use deploy:contract:local script if you want to test locally!"
    );
  }
  
  await deploy("Delegator", {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: true,
  });
};
