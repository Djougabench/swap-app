import React, { useState } from "react";

import {
  Flex,
  Text,
  Button,
  chakra,
  Spinner,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { hasMetamask } from "../utils/HasMetamask";
import useEthersProvider from "../hooks/UseEthersProvider";
import Identicon from "identicon.js";

const Header = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { account, setAccount, provider } = useEthersProvider();
  const toast = useToast();

  const connectWallet = async () => {
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
    <Flex
      align="center"
      flexDir={["column", "column", "row", "row"]}
      my="md"
      px={["sm", "sm", "lg", "lg"]}
      p="2rem"
    >
      <Text fontSize="2rem" fontWeight={900} letterSpacing={2}></Text>
      <Flex align="center" justify="flex-end" flex={1}>
        {isLoading ? (
          <Spinner />
        ) : account ? (
          <>
            <Flex
              flexDir="column"
              align={["center", "center", "flex-end", "flex-end"]}
            >
              <Badge
                colorScheme="green"
                fontWeight="bold"
                fontSize={["0.5rem", "0.6rem", "0.8rem", "1rem"]}
                p="0.8rem"
                color="green"
              >
                Connected :
                <chakra.span fontWeight="bold" color="orange" ml="0.5">
                  {account.substring(0, 6)}...
                  {account.substring(account.length - 4, account.length)}
                </chakra.span>
              </Badge>
            </Flex>
            <Flex
              flexDir="row"
              align={["center", "center", "flex-end", "flex-end"]}
            >
              <img
                className="ml-2"
                width="50"
                height="50"
                src={`data:image/png;base64,${new Identicon(
                  account,
                  30
                ).toString()}`}
                alt=""
              />
            </Flex>
          </>
        ) : (
          <Button
            variant="outline"
            colorScheme="gregreenen"
            color="white"
            bg="blue"
            size="lg"
            height={["45px", "45px", "45px", "50px"]}
            width={["140px", "140px", "150px", "200px"]}
            fontSize={["0.70rem", "0.80rem", "1rem", "1rem"]}
            onClick={() => connectWallet()}
          >
            Connect Wallet
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
