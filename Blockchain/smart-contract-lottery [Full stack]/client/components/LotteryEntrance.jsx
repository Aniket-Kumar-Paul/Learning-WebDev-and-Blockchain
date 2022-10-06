import { useWeb3Contract } from 'react-moralis';
import { abi, contractAddress } from '../constants';

const LotteryEntrance = () => {
    // https://github.com/MoralisWeb3/react-moralis#useweb3contract
    const { data, error, runContractFunction, isFetching, isLoading } =
        useWeb3Contract({
            abi: ,
            contractAddress: ,
            functionName: "",
            params: {},
            msgValue:
        });

    return (
        <div>LotteryEntrance</div>
    )
}

export default LotteryEntrance