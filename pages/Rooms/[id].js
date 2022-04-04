import { useRouter } from 'next/router'
import {useMoralis,useMoralisQuery} from 'react-moralis'
import {useEffect,useState} from 'react'
import { ethers } from "ethers";
import{ContractABI,ContractAddress} from '../../utils/constants'
import Web3 from 'web3';
import{BsFillPlusCircleFill} from 'react-icons/bs'
import Image from "next/image";
import {GrSend} from 'react-icons/gr' 



function Room() {
  const router = useRouter();
  const { id } = router.query;

  const [text, settext] = useState("Hello");
  const { user, Moralis } = useMoralis();
  const [roomdetails, setroomdetails] = useState([]);
  const [provider, setProvider] = useState({});
  const userName = user?.get("username");
  const userEthadd = user?.get("ethAddress");
  const [add, setadd] = useState();

  //Fetching live data of Room messages based on room id

  const { data, error, isLoading } = useMoralisQuery("Messages",(query) => query.equalTo("roomID", id).ascending("createdAt").greaterThan("createdAt",new Date(Date.now()-1000*60*15)),
    [],
    { live: true }
  );

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

  const SendTransaction = async (e) => {
    e.preventDefault();
    if (!text && !user) return null;
    const signer = provider.getSigner();

    const amount = ethers.utils.parseEther("0");
    const contract = new ethers.Contract(ContractAddress, ContractABI, signer);
    const hash = await contract
      .addToBlockchain(userEthadd, amount, text, id)
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
    if (!add) return null;
    const ChatRooms = Moralis.Object.extend("ChatRooms");
    const query = new Moralis.Query(ChatRooms);
    query.equalTo("uid", id);
    const result = await query.first();
    result.addUnique("people", add);
    result.save();
    alert("User Added");
  };

  return (
    <div className="w-full h-[100vh] bg-white flex">
      {roomdetails.length ? (
        <>
          <div className="w-[30%] h-full bg-blue-200">
            <input
              type="text"
              onChange={(e) => setadd(e.target.value)}
              placeholder="Enter UserName"
              className="mt-10 ml-4 rounded-md py-2 pl-2 pr-40 focus:outline-none "
            />
            <button
              onClick={AddtoRoom}
              class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-3"
            >
              Add <BsFillPlusCircleFill className="inline align-middle" />
            </button>

            <h1 className="font-bold ml-10 mt-3 tracking-wider">
              PARTICIPANTS {roomdetails[0].attributes.people.length}
            </h1>

            <div className="flex-col w-full ml-4 mt-4">
              {roomdetails[0].attributes.people.map((item, index) => {
                return (
                  <>
                    <div className="flex align-middle my-2 bg-white p-2 rounded-md w-[70%] shadow-md">
                      <Image
                        className="object-contain p-5 inline-block rounded-full bg-yellow-400"
                        src={`https://avatars.dicebear.com/api/avataaars/${item}.svg`}
                        height="30px"
                        width="30px"
                      />
                      <h1 className="ml-2 font-[Quantico]">{item}</h1>
                    </div>{" "}
                  </>
                );
              })}
            </div>
          </div>

          <div className="bg-yellow-400 w-[70%] h-full relative flex flex-col items-center justify-between">
           
           
           <div className='w-[80%] rounded-md flex-grow mt-4 bg-white'>
           

           </div>
           
           
           
           
           
           
           
            <div className="bottom-5  mt-4 mb-2 left-[35%]">
              <form onSubmit={SendTransaction}>
                <input
                  className="  outline-none rounded-lg border-2 px-20 border-red-500 py-2 "
                  type="text"
                  onChange={(e) => settext(e.target.value)}
                />
                <button  type ="submit" className="ml-2 bg-blue-300 px-8 py-2 rounded-md text-black font-bold shadow-md">
                  SEND <GrSend className="inline" />
                </button>
              </form>
            </div>
          </div>
        </>
      ) : (
        <h1>LOading...</h1>
      )}
    </div>
  );
}

export default Room;


