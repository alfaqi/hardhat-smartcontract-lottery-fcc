const networkConfig = {
  4: {
    name: "rinkeby",
    vrfCoordinatorV2: "",
    entranceFee: 0,
    gasLane: 0,
    callbackGasLimit: 0,
    interval: 0,
  },
  31337: {
    name: "hardhat",
    subscriptionId: "588",
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
    interval: "30",
    entranceFee: ethers.utils.parseEther("0.01"), // 0.01 ETH
    callbackGasLimit: "500000", // 500,000 gas
  },
};

const developmentChains = ["localhost", "hardhat"];

module.exports = {
  networkConfig,
  developmentChains,
};
