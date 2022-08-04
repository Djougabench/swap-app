import React, { useState, useEffect } from "react";
import "./App.css";
import {
  Center,
  Flex,
  VStack,
  useToast,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Text,
} from "@chakra-ui/react";

import Header from "./components/Header";
import EthSwapContract from "./abis/EthSwap.json";
import WariTokenContract from "./abis/WariToken.json";
import { ethers } from "ethers";
import useEthersProvider from "./hooks/UseEthersProvider";
import BuyForm from "./components/BuyForm";
import SellForm from "./components/SellForm";
import Footer from "./components/Footer";

function App() {
  const { account, provider } = useEthersProvider();
  const [isLoading, setIsloading] = useState(false);
  const [buyIsLoading, setBuyIsLoading] = useState(false);
  const [sellIsLoading, setSellIsLoading] = useState(false);
  const [ethSwapBalance, setEthBalance] = useState("0");
  const [wariTokenBalance, setwariTokenBalance] = useState("0");

  const [balanceEth, setBalanceEth] = useState("0");

  const toast = useToast();

  const wariTokenAddress = "0xB96492dD09465b5384CAfA87ac0Eb1b70Ed7a0Fd";
  const ethSwapAddress = "0x76Ed2538672e547D9048ccF5cf66cDCE3F927635";

  useEffect(() => {
    if (account) {
      getDatas();
    }
  }, [account]);

  const getDatas = async () => {
    setIsloading(true);

    //Balance wallet msg.sender
    let ethBalance = await provider.getBalance(account);
    let balanceEth = ethers.utils.formatEther(ethBalance);
    setBalanceEth(balanceEth);

    //load ethSwap contract
    const ethSwapData = new ethers.Contract(
      ethSwapAddress,
      EthSwapContract.abi,
      provider
    );

    if (ethSwapData) {
      let ethSwapBalance = await provider.getBalance(ethSwapAddress);
      ethSwapBalance = ethSwapBalance.toString();
      setEthBalance(ethSwapBalance);
    } else {
      window.alert("EthSwap contract not deployed to detected network.");
    }

    //load wariToken contract
    const contractWari = new ethers.Contract(
      wariTokenAddress,
      WariTokenContract.abi,
      provider
    );

    if (contractWari) {
      let wariTokenB = await contractWari.balanceOf(account);
      let wariTokenBalance = ethers.utils.formatEther(wariTokenB.toString());
      setwariTokenBalance(wariTokenBalance);
    } else {
      window.alert("Token contract not deployed to detected network.");
    }
    setIsloading(false);
  };

  const buyTokens = async (etherAmount) => {
    const signer = provider.getSigner();
    const contractEth = new ethers.Contract(
      ethSwapAddress,
      EthSwapContract.abi,
      signer
    );

    let amount = ethers.utils.parseEther(etherAmount).toString();
    let overrides = {
      value: amount,
    };

    try {
      let transaction = await contractEth.buyTokens(overrides);
      setBuyIsLoading(true);
      await transaction.wait();
      setBuyIsLoading(false);

      toast({
        description: "congratulation you got  your tokens!",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      getDatas();
    } catch {
      toast({
        description: "oops an error occured!",
        status: "error",
      });
    }
  };

  const sellTokens = async (etherAmount) => {
    const signerWari = provider.getSigner();
    const contractWari = new ethers.Contract(
      wariTokenAddress,
      WariTokenContract.abi,
      signerWari
    );

    const signerEth = provider.getSigner();
    const contractEth = new ethers.Contract(
      ethSwapAddress,
      EthSwapContract.abi,
      signerEth
    );

    let tokenWariAmount = ethers.utils.parseEther(etherAmount);

    try {
      await contractWari.approve(ethSwapAddress, tokenWariAmount);

      let transaction = await contractEth.sellTokens(tokenWariAmount);
      setSellIsLoading(true);
      await transaction.wait();
      setSellIsLoading(false);
      console.log("transaction", transaction);
      toast({
        description: "congratulation you have sold your tokens!",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      getDatas();
    } catch {
      toast({
        description: "oops an error occured!",
        status: "error",
      });
    }
  };

  return (
    <>
      <Flex
        fontfamilly="Arial, sans-serif"
        flexDir="column"
        alignItems="stretch"
      >
        <Header />
      </Flex>
      <Flex
        align="center"
        justify="center"
        flexDir="column"
        w="100%"
        flex={1}
      ></Flex>
      <Center>
        <VStack width={700}>
          <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
              <Tab>
                <Text fontWeight="bold">BUY</Text>
              </Tab>
              <Tab>
                <Text fontWeight="bold">SELL</Text>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <BuyForm
                  getDatas={getDatas}
                  buyTokens={buyTokens}
                  balanceEth={balanceEth}
                  wariTokenBalance={wariTokenBalance}
                />
              </TabPanel>
              <TabPanel>
                <SellForm
                  getDatas={getDatas}
                  sellTokens={sellTokens}
                  buyIsLoading={buyIsLoading}
                  balanceEth={balanceEth}
                  wariTokenBalance={wariTokenBalance}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Center>
      <Footer />
    </>
  );
}

export default App;
