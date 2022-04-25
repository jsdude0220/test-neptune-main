import React, { useEffect } from "react";
import {
  Box,
  Text,
  Stack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  HStack,
  Spacer,
  IconButton,
  Icon,
  useToast
} from "@chakra-ui/react";
import BigNumber from "bignumber.js";
import { hooks, metaMask } from "../utils/connectors/metaMask";
import { MdOutlineContentCopy } from "react-icons/md";
import {
  BasicChainInformation,
  CHAINS,
  ExtendedChainInformation,
  isExtendedChainInformation,
} from "../utils/chains";
import { shortAddr } from "../utils/utils";
import useBalances from "../utils/hooks/useBalances";
import { formatEther } from "@ethersproject/units";
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useError } =
  hooks;

export default function WalletModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const toast = useToast();
  const chainId = useChainId();
  const accounts = useAccounts();
  const error = useError();
  const isActivating = useIsActivating();
  const isActive = useIsActive();

  const provider = useProvider();

  const balances = useBalances(provider, accounts);

  const onDisconnect = () => {
    metaMask.deactivate();
  };

  const onConnect = () => {
    if (isActivating) {
      return;
    }

    metaMask.activate();
  };

  const onClipboard = () => {
    if(accounts && accounts.length > 0){
      window.navigator.clipboard.writeText(accounts[0]);
      toast({
        title: 'Copied Wallet Address ' + accounts[0],
        description: "",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }     

  };

  useEffect(()=>{
    if(error && error.message && toast){
      toast({
        title: 'Failed to Connect',
        description: error.message,
        status: 'error',
        duration: 6000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  let chain: undefined | BasicChainInformation | ExtendedChainInformation;
  let nativeCurrency:
    | {
        name: string;
        symbol: string;
        decimals: number;
      }
    | undefined;
  if (chainId) {
    chain = CHAINS[chainId];
    if (isExtendedChainInformation(chain)) {
      nativeCurrency = chain.nativeCurrency;
    }
  }

  let balance =
    balances && balances.length > 0
      ? new BigNumber(formatEther(balances[0])).toPrecision(4)
      : "";
  if (balance) {
    let remains = balance.split(".");
    if (remains && remains.length > 1 && remains[1].replaceAll("0", "") == "") {
      balance = remains[0];
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Wallet Details</ModalHeader>
        <ModalCloseButton _focus={{ outline: "none" }} />
        <ModalBody>
          {isActive ? (
            <Stack gap={3} px={10}>
              <HStack>
                <Text color={"gray"} fontSize="sm">
                  KEY
                </Text>
                <Spacer />
                <Text color={"gray"} fontSize="sm">
                  VALUE
                </Text>
              </HStack>
              <HStack>
                <Text color={"gray"} fontSize="md">
                  Account
                </Text>
                <Spacer />
                <Text color={"gray"} fontSize="md">
                  <IconButton
                    colorScheme="blue"
                    aria-label=""
                    variant={"ghost"}
                    _focus={{ outline: "none" }}
                    onClick={onClipboard}
                    icon={
                      <Icon
                        as={MdOutlineContentCopy}
                        color="gray"
                        w={5}
                        h={5}
                      />
                    }
                  />
                  {accounts ? shortAddr(accounts[0]) : ""}
                </Text>
              </HStack>
              <HStack>
                <Text color={"gray"} fontSize="md">
                  Chain ID
                </Text>
                <Spacer />
                <Text color={"gray"} fontSize="md">
                  {chainId}
                </Text>
              </HStack>
              <HStack>
                <Text color={"gray"} fontSize="md">
                  Balance
                </Text>
                <Spacer />
                <Text color={"gray"} fontSize="md">
                  {balance}&nbsp;
                  {nativeCurrency && nativeCurrency.symbol}
                </Text>
              </HStack>
            </Stack>
          ) : (
            <Box mt={5}>
              <Text color={"red.700"} fontSize="md">
                Wallet not connected. Please click the &quot;Connect Now&quot; button bellow.
              </Text>
            </Box>
          )}
        </ModalBody>

        {isActive ? (
          <Stack gap={2} p={10}>
            <Button colorScheme="red" mr={3} onClick={onDisconnect}>
              Disconnect
            </Button>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
          </Stack>
        ) : (
          <HStack gap={2} p={5}>
            <Button
              colorScheme="blue"
              flex={1}
              onClick={onConnect}
              isLoading={isActivating}
            >
              Connect Now
            </Button>
            <Button variant="ghost" flex={1} mr={3} onClick={onClose}>
              Cancel
            </Button>
          </HStack>
        )}
      </ModalContent>
    </Modal>
  );
}
