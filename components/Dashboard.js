import {FiPlus} from 'react-icons/fi'
import {MoralisProvider, useMoralis} from 'react-moralis'
import {VscChromeClose} from 'react-icons/vsc'
import uuid from 'react-uuid'
import {useState,useEffect} from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'


function Dashboard() {
  const router = useRouter()
  const { user, logout,Moralis } = useMoralis();
  const[rooms,setrooms]=useState([])
  const[refresh,setrefresh]=useState(false)
  const [modal, setmodal] = useState(false);
  const [roomname, setroomname] = useState();
  const username =user.attributes.username
  console.log(username)


const getrooms= async()=>{
    let samplearray=[]
    const chatrooms = Moralis.Object.extend("ChatRooms")
    const query = new Moralis.Query(chatrooms)
    query.equalTo("people",username)
    
    const results = await query.find()
    
    for (let i = 0; i < results.length; i++) {
        // This does not require a network access.
        let roomdetail = results[i].attributes

        samplearray.push(roomdetail)
      }
    setrooms(samplearray)
    console.log(samplearray)
   
}


useEffect(() => {
    getrooms();



}, [refresh])

console.log(rooms)






  const Modalopener = () => {
    setmodal(true);
  };
  //create New Chat Room

  const CreateRoom = async (e) => {
    e.preventDefault();
    if(confirm(`Do you really want to create a Room with title ${roomname}`)){
        const ChatRooms = Moralis.Object.extend("ChatRooms")
        const chatRoom= new ChatRooms();
        chatRoom.set('title',roomname)
        chatRoom.set('creator',user.attributes.username)
        chatRoom.set('uid',uuid())
        chatRoom.set('people',[user.attributes.username])
        chatRoom.save();
        setmodal(false)
        setrefresh(!refresh)


    }else{
        pass
    }
  };






  //user logout
  const logoutuser = () => {
    if (confirm("Do you really want to logout ?")) {
      logout();
    } else {
      console.log("login reverted");
    }
  };

  return (
    <div className="h-screen w-screen bg-blue-300 relative">
      <div
        className={` w-full h-screen  flex items-center justify-center fixed z-20 backdrop-blur-md ${
          modal ? "visible" : "hidden"
        }`}
      >
        <VscChromeClose
          onClick={() => setmodal(false)}
          className="left-8 top-8 absolute text-black font-bold w-[30px] h-[30px] cursor-pointer"
        />

        <div className="bg-white w-[400px] h-[300px] rounded">
          <form onSubmit={CreateRoom} class=" shadow-md rounded px-8 pt-6 pb-8">
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2 text-center"
                for="username"
              >
                ROOM NAME
              </label>
              <input
                onChange={(e) => setroomname(e.target.value)}
                autoComplete="off"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Enter Room Name"
              />
            </div>
            <div class="flex items-center justify-between">
              <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline "
                type="submit"
              >
                CREATE ROOM
              </button>
            </div>
          </form>
          <p className="text-sm ml-9 mt-1 font-[Lekton]">
            {" "}
            CREATOR PUBLIC ADDRESS : <br /> {user.attributes.ethAddress}
          </p>
        </div>
      </div>

      <div className='flex items-center justify-center w-full bg-yellow-100 pb-2'>
        <div
          className="w-[150px] h-[150px] rounded bg-white mt-4 shadow-lg  flex items-center flex-col justify-center cursor-pointer hover:border-2"
          onClick={Modalopener}
        >
          <FiPlus className="h-[30px] w-[30px] text-blue-500 " />
          <p className="mt-2 font-[Lekton] font-semibold">ADD ROOM</p>
        </div>
       </div>
       



      <button
        onClick={logoutuser}
        className="bg-white rounded-full px-7 py-2 bottom-5 absolute right-[40px] font-[Lekton] font-bold z-40"
      >
        Logout
      </button>
      <div className='w-full h-auto top-[200px] absolute z-100 flex justify-start align-top p-10'>
     
           
           {rooms?rooms.map((room)=>{
                return(<>
                <div onClick={()=>router.push('/Rooms/'+room.title)} className='w-[300px] h-[150px] rounded-md bg-white shadow-lg  flex items-center flex-col justify-center cursor-pointer ml-4 overflow-hidden relative'>
                    <p className='font-[brown]'>{room.title}</p>
                    <p className='font-[Lekton] text-sm'>{room.uid}</p>
                    <Image className="object-contain pt-4 rounded-full" src={`https://avatars.dicebear.com/api/initials/${room.title}.svg`} height="50px" width="50px"/>
                    <div className='rounded-full bg-yellow-200 h-[80px] w-[80px] absolute -right-8 -bottom-9'></div>
    
    
                </div>
                
                
                </>)
            }):(<></>)}
    
    
    

      </div>






    </div>
  );
}

export default Dashboard;