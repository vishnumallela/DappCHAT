import { useRouter } from 'next/router'
import {useMoralis,useMoralisQuery,useChain} from 'react-moralis'
import {useEffect,useState} from 'react'
import { ethers } from "ethers";
import{ContractABI,ContractAddress} from '../../utils/constants'
import Web3 from 'web3';
import{BsFillPlusCircleFill} from 'react-icons/bs'



function Room() {
  const router = useRouter();
  const { id } = router.query;
  
  const[text,settext]= useState("Hello");
  const { user, Moralis } = useMoralis();
  const [roomdetails, setroomdetails] = useState();
  const [provider, setProvider] = useState({});
  const userName=user?.get("username");
  const userEthadd = user?.get("ethAddress")
  const[add,setadd]=useState();

  //Fetching live data of Room messages based on room id
  
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
        id,
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

  const AddtoRoom = async () => {
    if(!add) return null;
    const ChatRooms = Moralis.Object.extend("ChatRooms");
    const query = new Moralis.Query(ChatRooms);
    query.equalTo("uid", id);
    const result = await query.first();
    result.addUnique("people",add);
    result.save();
    alert("User Added")



  };


















   
  
    
  return <div className='w-full h-[100vh] bg-white'>
    <div className='w-[30%] h-full bg-blue-200'>
      <input type="text" onChange={(e)=>setadd(e.target.value)} placeholder='Enter UserName' className='mt-10 ml-4 rounded-md py-2 pl-2 pr-40 focus:outline-none'/>
      <button onClick={AddtoRoom} class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-3">Add <BsFillPlusCircleFill className='inline align-middle'/>
      </button>




      </div>


   




   
    
  </div>;
}

export default Room;


