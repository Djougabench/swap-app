import React, { useState } from "react";
import useEthersProvider from "../hooks/UseEthersProvider";
import ConnectWalletButton from "./ConnectWalletButton";
import Header from "./Header";
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

function BuyForm(props) {
  const { account, provider } = useEthersProvider();
  const [isLoading, setIsloading] = useState(false);

  const [value, setValue] = useState("0");

  return (
    <Box mt="10rem">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <VStack>
            <Text>
              <chakra.span fontWeight="bold">Balance : </chakra.span>
              <chakra.span>{props.balanceEth} </chakra.span>
              <chakra.span fontWeight="bold"> Eth</chakra.span>
            </Text>
            <Center
              pb={["2rem", "2rem", "3rem", "2rem"]}
              px={["1.7rem", "5rem", "4rem", "8rem"]}
              mx={["2rem", "2rem", "2rem", "4rem"]}
              color="black"
              borderRadius="15"
            >
              <NumberInput
                onChange={setValue}
                value={value}
                min={0}
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
              <chakra.span>{props.wariTokenBalance}</chakra.span>
              <chakra.span fontWeight="bold"> Wari</chakra.span>
            </Text>
            <Center
              pb={["2rem", "2rem", "1rem", "1rem"]}
              px={["1.7rem", "5rem", "6rem", "8rem"]}
              mx={["2rem", "2rem", "2rem", "4rem"]}
              color="black"
              borderRadius="15"
            >
              <NumberInput value={value * 100} clampValueOnBlur={false}>
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
                onClick={() => props.buyTokens(value)}
                mx="1rem"
                size="lg"
                height="45px"
                width="270px"
                border="2px"
              >
                {props.buyIsLoading ? (
                  <Text>... purchasing</Text>
                ) : (
                  <Text>Swap</Text>
                )}
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

export default BuyForm;
