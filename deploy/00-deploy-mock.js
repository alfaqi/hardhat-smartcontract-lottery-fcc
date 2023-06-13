const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const BASE_FEE = 0;
const GAS_PRICE_LIMIT = 0;
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const args = [BASE_FEE, GAS_PRICE_LIMIT];

  if (developmentChains.includes(network.name))
    log("Deploying VRFCoordinatorV2");
  await deploy("VRFCoordinatorV2Mock", {
    from: deployer,
    args: args,
    log: true,
  });
  log("Mocks Deployed!");
  log("-----------------------------------------");
};

module.exports.tags = ["all", "mocks"];
