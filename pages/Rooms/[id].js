import { useRouter } from 'next/router'
import {useMoralis,useMoralisQuery,useChain} from 'react-moralis'
import {useEffect,useState} from 'react'
import { ethers } from "ethers";
import{ContractABI,ContractAddress} from '../../utils/constants'


function Room() {
  const router = useRouter();
  const { id } = router.query;
  
  const[text,settext]= useState("Hello");
  const { user, Moralis } = useMoralis();
  const [roomdetails, setroomdetails] = useState();
  const [provider, setProvider] = useState({});
  const userName=user?.get("username");
  const userEthadd = user?.get("ethAddress")
  
  const { data, error, isLoading } = useMoralisQuery("Messages", query =>query.equalTo("roomID",id).ascending("createdAt"),[],{live:true},);

  
  

  
  

 
  




  useEffect(async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    const chatrooms = await Moralis.Object.extend("ChatRooms");
    const query = new Moralis.Query(chatrooms);
    query.equalTo("uid", id);
    const result = await query.find();
    setroomdetails(result);
  }, []);


//FUNCTION FOR SENDING MESSAGE TRANSACTION-   **IMPORTANT**  -

const SendTransaction = async () => {
    if(!text && !user) return null;
    const signer = provider.getSigner();

    const amount = ethers.utils.parseEther("0");
    const contract = new ethers.Contract(ContractAddress, ContractABI, signer);
    const hash = await contract
      .addToBlockchain(
        userEthadd,
        amount,
        text,
        `${userEthadd+amount+text+id}`,
      )
      .then((hash) => {
        console.log(hash);
        const Messages = Moralis.Object.extend("Messages");
        const message = new Messages();
        message.set("message", text);
        message.set("sender", userEthadd);
        message.set("roomID", id);
        message.set("username", userName);
        message.save();
      })
      .catch((error) => console.log(error));
  };

  return <div>
   
    
  </div>;
}

export default Room;


