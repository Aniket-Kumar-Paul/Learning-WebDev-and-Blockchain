import { useWeb3Contract } from 'react-moralis';
import { abi, contractAddresses } from '../constants';
import { useMoralis } from 'react-moralis';
import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import { useNotification } from '@web3uikit/core';

const LotteryEntrance = () => {
    // https://github.com/MoralisWeb3/react-moralis#useweb3contract
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis() // get chainId and name variable chainIdHex as it is in hex format
    const chainId = parseInt(chainIdHex)
    const raffleAddress = (chainId in contractAddresses)
        ? (contractAddresses[chainId][0])
        : (null)
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()

    // runContractFunction can both send transactions and read state
    // const { data, error, runContractFunction, isFetching, isLoading } = useWeb3Contract({..})
    const { runContractFunction: enterRaffle } =
        useWeb3Contract({
            abi: abi,
            contractAddress: raffleAddress,
            functionName: "enterRaffle",
            params: {},
            msgValue: entranceFee
        });

    const { runContractFunction: getEntranceFee } =
        useWeb3Contract({
            abi: abi,
            contractAddress: raffleAddress,
            functionName: "getEntranceFee",
            params: {},
        });

    const { runContractFunction: getNumberOfPlayers } =
        useWeb3Contract({
            abi: abi,
            contractAddress: raffleAddress,
            functionName: "getNumberOfPlayers",
            params: {},
        });

    const { runContractFunction: getRecentWinner } =
        useWeb3Contract({
            abi: abi,
            contractAddress: raffleAddress,
            functionName: "getRecentWinner",
            params: {},
        });

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee({ onError: (error) => console.log(error) })).toString() // in wei
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        setEntranceFee(entranceFeeFromCall)
        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            // try to read the raffle entrance fee
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1) // wait for the transaction to go through
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = function () {
        dispatch({ // pop up notification
            type: "success",
            message: "Transaction Complete :)",
            title: "Transaction Notification",
            position: "topR",
            icon: React.ReactElement
        })
    }

    return (
        <div>
            Ayyo Welcome to Lotterry Entrance!
            {raffleAddress
                ? (
                    <div>
                        <button
                            onClick={async function () {
                                await enterRaffle({
                                    onSuccess: handleSuccess, // we get these functions onsuccess etc. due to the runContractFunction 
                                    onError: (error) => console.log(error)
                                })
                            }}>
                            Enter Raffle
                        </button>
                        <div>
                            Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
                        </div>
                        <div>
                            Players: {numPlayers}
                        </div>
                        <div>
                            Recent Winner: {recentWinner}
                        </div>
                    </div>
                ) : (
                    <div>
                        No Raffle Address Detected
                    </div>
                )
            }

        </div>
    )
}

export default LotteryEntrance