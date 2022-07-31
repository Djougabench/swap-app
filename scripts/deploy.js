const hre = require("hardhat");

async function main() {
  //Deploy WariToken
  const WariToken = await hre.ethers.getContractFactory("WariToken");
  const wariToken = await WariToken.deploy();
  await wariToken.deployed();

  // Deploy EthSwap
  const EthSwap = await hre.ethers.getContractFactory("EthSwap");
  const ethSwap = await EthSwap.deploy(wariToken.address);
  await ethSwap.deployed();

  //Transfer all tokens to  to EthSwap (1 million)
  await wariToken.transfer(ethSwap.address, "1000000000000000000000000"); //await token.transfer(toAddress,toWei('100')

  console.log("ethSwap deployed to:", ethSwap.address);
  console.log("wariToken deployed to:", wariToken.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
