const { ethers } = require("hardhat");
var chai = require("chai");
const { expect } = require("chai");

function tokens(n) {
  return ethers.utils.parseEther(n);
}

describe("  Contract  ", () => {
  before(async () => {
    [this.deployer, this.investor, ...this.addrs] = await ethers.getSigners();
  });
  console.log(ethers.getSigners());

  describe("WariToken deployement", async () => {
    it("should deploy the WariToken smart contract sucessfully", async () => {
      this.wariToken = await hre.ethers.getContractFactory("WariToken");
      console.log("    Deploy WariToken contract");
      this.deployedContractWari = await this.wariToken.deploy();
    });
    it("should have a name", async () => {
      const name = "Wari Token";
      expect(await this.deployedContractWari.name()).to.equal(name);
    });
  });

  describe("EthSwap deployement", async () => {
    it("should deploy the Ethwap smart contract sucessfully", async () => {
      this.ethSwap = await hre.ethers.getContractFactory("EthSwap");
      console.log("    Deploy EthSwap contract");
      this.deployedContractEth = await this.ethSwap.deploy(
        this.deployedContractWari.address
      );
    });
    it("should have a name", async () => {
      const name = "EthSwap Exchange";
      expect(await this.deployedContractEth.name()).to.equal(name);
    });

    it("ethSwap contract should have tokens", async () => {
      const wariToken = this.deployedContractWari;
      const ethSwap = this.deployedContractEth;
      await wariToken.transfer(ethSwap.address, tokens("1000000"));
      let balance = await wariToken.balanceOf(ethSwap.address);
      expect(await balance).to.equal(tokens("1000000"));
    });
  });

  let overrides = {
    value: tokens("1"),
  };

  describe("buyTokens()", async () => {
    before(async () => {
      //purchase token before each example
      await this.deployedContractEth
        .connect(this.investor)
        .buyTokens(overrides);
    });

    it("Allows user to instantly purchase tokens from ethSwap for a fixed price", async () => {
      //check investor token balance after purchasse
      let investorBalance = await this.deployedContractWari.balanceOf(
        this.investor.address
      );

      expect(await investorBalance).to.equal(tokens("100"));
    });

    //check EthSwapBalance after purchasse
    let ethSwapBalance;
    ethSwapBalance = await this.deployedContractWari.balanceOf(
      this.deployedContractEth.address
    );
    expect(await ethSwapBalance).to.equal(tokens("999900"));

    ethSwapBalance = await ethers.provider.getBalance(
      this.deployedContractEth.address
    );

    expect(ethSwapBalance).to.equal(ethers.utils.parseEther("1"));

    /* HERE  CREATE THE REVERT TEST FOR BUYING TOKENS*/

    describe("TokensPurchased Events", async () => {
      it("Should emit a TokensPurchased event", async () => {
        await expect(
          this.deployedContractEth.connect(this.investor).buyTokens(overrides)
        )
          .to.emit(this.deployedContractEth, "TokensPurchased")
          .withArgs(
            this.investor.address,
            this.deployedContractWari.address,
            tokens("100"),
            BigInt("100")
          );
      });
    });
  });

  describe("sellTokens()", async () => {
    before(async () => {
      //investor must approve tokens before the purchase
      await this.deployedContractWari
        .connect(this.investor)
        .approve(this.deployedContractEth.address, tokens("100"));
    });

    it("Allows user to instantly sell tokens from ethSwap for a fixed price", async () => {
      //investor sell the tokens
      await this.deployedContractEth
        .connect(this.investor)
        .sellTokens(tokens("100"));
    });
    it("check investor token balance after  selling tokens, it should equal 0 ", async () => {
      //check investor token balance after  selling tokens
      let investorBalance = await this.deployedContractWari.balanceOf(
        this.investor.address
      );
      expect(await investorBalance).to.equal(tokens("0"));
    });
    it("check EthSwapBalance   after selling tokens", async () => {
      //check EthSwapBalance   after selling tokens
      let ethSwapBalance;
      ethSwapBalance = await this.deployedContractWari.balanceOf(
        this.deployedContractEth.address
      );
      expect(await ethSwapBalance).to.equal(tokens("1000000"));
    });
    it("check EthSwapBalance of Ether  after selling tokens", async () => {
      //check EthSwapBalance of Ether  after selling tokens
      ethSwapBalance = await ethers.provider.getBalance(
        this.deployedContractEth.address
      );
      expect(ethSwapBalance).to.equal(ethers.utils.parseEther("0"));
    });

    /* describe("TokensSold Events", async () => {
      it("Should emit a TokensSold event", async () => {
        await expect(
          this.deployedContractEth
            .connect(this.investor)
            .sellTokens(tokens("100"))
        )
          .to.emit(this.deployedContractEth, "TokensSold")
          .withArgs(
            this.investor.address,
            this.deployedContractWari.address,
            tokens("100"),
            BigInt("100")
          );
      });
    });*/

    ///FAILLURE TEST : investor can't sell more thoken than they have
    /*describe("Failure test ", async () => {
      it("should reverted ", async () => {
        await expect(
          this.deployedContractEth
            .connect(this.investor)
            .sellTokens(ethers.utils.parseEther("500"))
        ).to.be.revertedWith("Not enough Tokens");
      });
    });*/
  });
});
