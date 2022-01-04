import { useRouter } from 'next/router'
import {useMoralis} from 'react-moralis'
import {useEffect,useState} from 'react'
import { ethers } from "ethers";
import{ContractABI,ContractAddress} from '../../utils/constants'

function Room() {
    const {user} = useMoralis();
    const router = useRouter()
    const { id } = router.query
    const [provider, setProvider] = useState({})


    useEffect(async () => {
      if (
        typeof window.ethereum !== "undefined" ||
        typeof window.web3 !== "undefined"
      ) {
        // Web3 browser user detected. You can now use the provider.
        const accounts = await window.ethereum.enable();
        // const curProvider = window['ethereum'] || window.web3.currentProvider

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
      }
    }, []);
    const signer = provider.getSigner();

    const SendTransaction = async () => {
      const amount = ethers.utils.parseEther("0");
      const contract = new ethers.Contract(
        ContractAddress,
        ContractABI,
        signer
      );
      const hash = await contract
        .addToBlockchain(
          "0xd63C78192d82081Ae02C1b0DF146f0295710451D",
          amount,
          "hello world",
          "1st message"
        )
        .then((hash) => {
          console.log(hash);
        });
    };







    return (
        <div>
          
          <h1>Room Page</h1>
        </div>
    )
}

export default Room


