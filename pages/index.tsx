import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Image,
  Input,
  Stack,
  Button,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";

import { metaMask } from "../utils/connectors/metaMask";
import WalletModal from "../components/wallet_modal";
import TokenData from "../types/token-data";
import { NEP, BUSD } from "../utils/tokens";




const Home: NextPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [from, setFrom] = useState<TokenData>(NEP);
  const [to, setTo] = useState<TokenData>(BUSD);

  const [fromVal, setFromVal] = useState<number>(0);
  const [toVal, setToVal] = useState<number>(0);

  useEffect(() => {
    void metaMask.connectEagerly();
  }, []);

  const onCheckWalletDetail = () => {
    setOpenModal(true);
  };

  const onSwitch = () => {
    let tempTo = { ...to };
    setTo(from);
    setFrom(tempTo);

    let tempFromVal= fromVal;
    setFromVal(toVal);
    setToVal(tempFromVal);

  };

  const onChangeFrom = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const val: number = parseFloat (e.target.value);
    setFromVal(val);
    setToVal(getDestinationValue(from, to, val));
  }

  const onChangeTo = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const val:number = parseFloat(e.target.value);
    setToVal(val)
    setFromVal(getDestinationValue(to, from, val))
  }


  const getDestinationValue = (from: TokenData, to: TokenData, fromAmount: number):number=>{
    if(fromAmount <= 0){
      return 0;
    }
    return Math.round( to.tokenPriceUSD / from.tokenPriceUSD * fromAmount * 100) / 100;
  }

  return (
    <Box w={"100vw"} h="100vh" textAlign={"center"} bg="#0d1230cc">
      <Box margin={"auto"} p={10}>
        <Flex flexDir={"row"} alignItems="center" justify={"center"} my={10}>
          <Image
            src="./img/logo.png"
            objectFit={"cover"}
            alt="logo"
            w={"80px"}
            h={"80px"}
            mr={5}
            rounded="full"
          />
          <Text fontSize={"4xl"} my={"20px"} color="white" textTransform={'uppercase'}>
            Neptune Mutual
          </Text>
        </Flex>
        <Box
          rounded={10}
          bg="white"
          boxShadow="md"
          w={450}
          px={10}
          py={10}
          m={"auto"}
        >
          <Stack gap={1}>
            <Text fontSize={"2xl"} mb={6} fontWeight="bold" textAlign={"left"}>
              Crypto Converter
            </Text>
            <Text fontSize={"sm"} color="gray" textAlign={"left"}>
              {from.symbol}
            </Text>
            <Input
              variant="outline"
              placeholder={from.symbol}
              type='number'
              value={fromVal.toString()}
              onChange={onChangeFrom}
              min={0}
            />
            <Box textAlign={"center"} my={1}>
              <IconButton
                colorScheme="blue"
                aria-label=""
                variant={"ghost"}
                _focus={{ outline: "none" }}
                onClick={onSwitch}
                icon={
                  <Icon
                    as={HiOutlineSwitchHorizontal}
                    color="gray"
                    w={5}
                    h={5}
                  />
                }
              />
            </Box>
            <Text fontSize={"sm"} color="gray" textAlign={"left"}>
              {to.symbol}
            </Text>
            <Input
              variant="outline"
              placeholder={to.symbol}
              type={"number"}
              mb={"12px !important"}
              value={toVal.toString()}
              onChange={onChangeTo}
              min={0}
            />
            <Button
              colorScheme="facebook"
              variant="solid"
              _focus={{ outline: "none" }}
              onClick={onCheckWalletDetail}
            >
              Check Wallet Details
            </Button>
          </Stack>
        </Box>
      </Box>
      <WalletModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      />
    </Box>
  );
};

export default Home;
