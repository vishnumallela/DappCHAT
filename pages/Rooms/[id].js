import { useRouter } from 'next/router'
import {useEffect} from 'react'
const Web3EthContract = require('web3-eth-contract');
import{ContractABI,ContractAddress} from '../../utils/constants'

function Room() {
    const router = useRouter()
    const { id } = router.query


useEffect(() => {
    const contract = new Web3EthContract(ContractABI,ContractAddress);

   
   
    if(contract){
        console.log(contract)
    }
    
}, [])







    return (
        <div>
            <h1>room page here</h1>
        </div>
    )
}

export default Room


