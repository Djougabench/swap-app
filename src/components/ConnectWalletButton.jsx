import React, { useState } from "react";

import { Button, Spinner, Center, useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import { hasMetamask } from "../utils/HasMetamask";
import useEthersProvider from "../hooks/UseEthersProvider";

const ConnectWalletButton = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { account, setAccount, provider } = useEthersProvider();
  const toast = useToast();

  const ConnectIt = async () => {
    if (!hasMetamask()) {
      toast({
        description: "please install metamask browser extension and retry",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } else {
      setIsLoading(true);
      if (provider) {
        let network = await provider.getNetwork();
        if (network.chainId !== 1) {
          const resultAccount = await provider.send("eth_requestAccounts", []);
          setAccount(ethers.utils.getAddress(resultAccount[0]));
          setIsLoading(false);
          toast({
            description: "your wallet has been successfully connected!",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        } else {
          setAccount(null);
          setIsLoading(false);
          toast({
            description: "PLease swich to main Ethereum Network on Metamask",
          });
        }
      }
    }
  };

  return (
    <Center pb={["2rem", "2rem", "3rem", "8rem"]}>
      {isLoading ? (
        <Spinner />
      ) : (
        <Button
          variant="outline"
          bg="blue"
          color="white"
          mx="1rem"
          size="lg"
          height="45px"
          width="270px"
          border="2px"
          onClick={() => ConnectIt()}
        >
          Connect Wallet
        </Button>
      )}
    </Center>
  );
};

export default ConnectWalletButton;
