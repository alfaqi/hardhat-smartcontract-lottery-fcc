const {
  developmentChains,
  networkConfig,
} = require("../../helper-hardhat-config");
const { assert, expect } = require("chai");
const { getNamedAccounts, deployments, ethers } = require("hardhat");
describe("Raffler", () => {
  let raffle, vrfCoordinatorV2Mock, deployer, entranceFee, interval;
  let chainId, response;
  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    chainId = network.config.chainId;
    entranceFee = networkConfig[chainId]["entranceFee"];
    vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
    raffle = await ethers.getContract("Raffle", deployer);
    interval = networkConfig[chainId]["interval"];
  });

  /**
   * address vrfCoordinatorV2, // contract address /done
   * uint256 entranceFee, /done
   * bytes32 gasLane,
   * uint64 subscriptionId,
   * uint32 callbackGasLimit,
   * uint256 interval  /done
   */
  describe("Constructor", () => {
    it("init raffle contract", async () => {
      response = await raffle.getRaffleState();
      expect(response.toString()).to.equal("0");

      response = await raffle.getInterval();
      expect(response.toString()).to.equal(interval);
    });
  });

  describe("Enter raffle", () => {
    // beforeEach(async () => {
    //   await raffle.enterRaffle({ value: entranceFee });
    // });
    it("reverts when you don't pay enough", async () => {
      await expect(raffle.enterRaffle()).to.be.reverted;
    });

    it("records player when they enter", async () => {
      const response = await raffle.enterRaffle({ value: entranceFee });
      const player = await raffle.getPlayer(0);
      expect(player).to.equal(deployer);
    });

    it("emits event on enter", async () => {
      await expect(raffle.enterRaffle({ value: entranceFee })).to.emit(
        raffle,
        "RaffleEnter"
      );
    });

    // it("doesn't allow entrance when raffle is calculating", async () => {
    //   await raffle.enterRaffle({ value: entranceFee });
    //   await network.provider.send("evm_increaseTime", [Number(interval) + 1]);
    //   await network.provider.request({ method: "evm_mine", p: [] });
    //   await raffle.performUpkeep([]);
    //   await expect(raffle.enterRaffle({ value: entranceFee })).to.be.reverted;
    // });

    it("doesn't allow entrance when raffle is calculating", async () => {
      await raffle.enterRaffle({ value: entranceFee });
      // for a documentation of the methods below, go here: https://hardhat.org/hardhat-network/reference
      await network.provider.send("evm_increaseTime", [Number(interval) + 1]);
      await network.provider.request({ method: "evm_mine", params: [] });
      // we pretend to be a keeper for a second
      await raffle.performUpkeep([]); // changes the state to calculating for our comparison below
      await expect(
        raffle.enterRaffle({ value: entranceFee })
      ).to.be.revertedWith(
        // is reverted as raffle is calculating
        "Raffle__RaffleNotOpen"
      );
    });
  });
});
