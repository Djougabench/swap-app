import React, { useEffect, useState } from "react";

import {
  Text,
  Button,
  Spinner,
  Center,
  Box,
  chakra,
  NumberInput,
  NumberInputStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
} from "@chakra-ui/react";
import ConnectWalletButton from "./ConnectWalletButton";
import useEthersProvider from "../hooks/UseEthersProvider";

function SellForm(props) {
  const { account } = useEthersProvider();
  const [isLoading, setIsloading] = useState(false);
  const [value, setValue] = useState("0");

  useEffect(() => {
    if (account) {
      props.getDatas();
    }
  }, [account]);

  return (
    <Box mt="10rem">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <VStack>
            <Text>
              <chakra.span fontWeight="bold">Balance : </chakra.span>
              <chakra.span>{props.wariTokenBalance} </chakra.span>
              <chakra.span fontWeight="bold"> Wari</chakra.span>
            </Text>
            <Center
              pb={["2rem", "2rem", "3rem", "2rem"]}
              px={["1.7rem", "5rem", "6rem", "8rem"]}
              mx={["2rem", "2rem", "2rem", "4rem"]}
              color="black"
              borderRadius="15"
            >
              <NumberInput
                value={value}
                min={0}
                onChange={setValue}
                clampValueOnBlur={false}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Center>
          </VStack>
          <VStack>
            <Text>
              <chakra.span fontWeight="bold">Balance : </chakra.span>
              <chakra.span>{props.balanceEth}</chakra.span>
              <chakra.span fontWeight="bold"> Eth</chakra.span>
            </Text>

            <Center
              pb={["2rem", "2rem", "1rem", "1rem"]}
              px={["1.7rem", "5rem", "6rem", "8rem"]}
              mx={["2rem", "2rem", "2rem", "4rem"]}
              color="black"
              borderRadius="15"
            >
              <NumberInput min={0} value={value / 100} clampValueOnBlur={false}>
                <NumberInputField />
                <NumberInputStepper></NumberInputStepper>
              </NumberInput>
            </Center>
            <Text>
              <chakra.span fontSize={["0.8rem"]}>Exchange Rate : </chakra.span>
              <chakra.span fontSize={["0.8rem"]}>1 ETH = 100 Warri</chakra.span>
            </Text>
          </VStack>

          {account ? (
            <Center pb={["2rem", "2rem", "3rem", "8rem"]}>
              <Button
                variant="outline"
                bg="green"
                color="white"
                onClick={() => props.sellTokens(value)}
                mx="1rem"
                size="lg"
                height="45px"
                width="270px"
                border="2px"
              >
                swap
              </Button>
            </Center>
          ) : (
            <ConnectWalletButton />
          )}
        </>
      )}
    </Box>
  );
}

export default SellForm;
