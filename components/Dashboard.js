import { useMoralis,useChain } from "react-moralis";
import { VscChromeClose } from "react-icons/vsc";
import uuid from "react-uuid";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import swal from "sweetalert";
import { BsFillHouseFill } from "react-icons/bs";
import { FcKey } from "react-icons/fc";
import { ImUser } from "react-icons/im";
import Polygon from '../images/Polygon.svg'
import{RiLogoutCircleRFill} from 'react-icons/ri'

function Dashboard() {
  const router = useRouter();
  const { user, logout, Moralis } = useMoralis();
  const {chainId, chain} = useChain();
  const [rooms, setrooms] = useState([]);
  const [refresh, setrefresh] = useState(false);
  const [modal, setmodal] = useState(false);
  const [roomname, setroomname] = useState();
  const username = user.attributes.username;
  console.log(chain)

  //GETTING ROOMS WHERE USER IS A MEMBER

  const getrooms = async () => {
    let samplearray = [];
    const chatrooms = Moralis.Object.extend("ChatRooms");
    const query = new Moralis.Query(chatrooms);
    query.equalTo("people", username);

    const results = await query.find();

    for (let i = 0; i < results.length; i++) {
      // This does not require a network access.
      let roomdetail = results[i].attributes;

      samplearray.push(roomdetail);
    }
    setrooms(samplearray);
    console.log(samplearray);
  };

  //USEEFFECT-ENABLING WEB3-PROVIDER
console.log(rooms)
  useEffect(async () => {
    getrooms();
    console.log(user);
  }, [refresh]);

  console.log(rooms);

  const Modalopener = () => {
    setmodal(true);
  };

  //CREATEING CHAT ROOM FUNCTION

  const CreateRoom = async (e) => {
    e.preventDefault();
    if (confirm(`Do you really want to create a Room with title ${roomname}`)) {
      const ChatRooms = Moralis.Object.extend("ChatRooms");
      const chatRoom = new ChatRooms();
      chatRoom.set("title", roomname);
      chatRoom.set("creator", user.attributes.username);
      chatRoom.set("uid", uuid());
      chatRoom.set("people", [user.attributes.username]);
      chatRoom.save();
      setroomname();
      setmodal(false);
      swal({
        title: "Room Created!",
        icon: "success",
        button: "OK",
      });
    } else {
      pass;
    }
  };

  //USER-LOGOUT

  const logoutuser = () => {
    swal({
      title: "Are you sure you want to logout?",
      icon: "warning",
      buttons: {
        cancel: true,
        confirm: "logout",
      },
    }).then((data) => {
      if (data) {
        logout();
      } else {
        return;
      }
    });
  };

  return (
    <div className="h-screen w-screen  bg-gradient-to-r from-indigo-400 to-white bg-blend-soft-light relative">
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

      <div className="flex items-center justify-center w-full bg-yellow-400 pb-2 relative">
        <div
          className="w-[200px] h-[200px]  bg-white mt-4 mb-4 shadow-xl  flex items-center rounded-full flex-col justify-center cursor-pointer hover:border-8"
          onClick={Modalopener}
        >
          <BsFillHouseFill className="h-[30px] w-[30px] text-blue-500 " />
          <p className="mt-4  font-[Quantico] font-semibold text-sm text-center">
            CREATE DECENTRALIZED CHAT ROOM
          </p>
        </div>

        <p className="absolute top-3 shadow-lg rounded-full cursor-pointer font-[Quantico]   bg-white text-md right-10 px-4 py-1">
          <FcKey className="inline-block mr-2  object-contain" /> PUBLICKEY:
          <br />
          {user.attributes.ethAddress}
        </p>
        <p className="absolute top-20 mt-1 shadow-lg align-middle   rounded-full cursor-pointer font-[Quantico]   bg-white text-md right-10 px-4 py-1">
          <ImUser className="inline-block mr-2  object-contain text-blue-500" />{" "}
          USER-NAME: {user.attributes.username}
        </p>
        <div className="bg-white left-5 w-[300px] h-[150px] rounded absolute flex flex-col justify-around align-middle  shadow-2xl">
          <Image
            className="object-contain bg-indigo-200"
            src={`https://avatars.dicebear.com/api/avataaars/${user.attributes.username}.svg`}
            height="40px"
            width="40px"
          />
          
     
          <h1 className="text-center font-[Quantico]">{chain.name}</h1>
          <Image src={Polygon} objectFit="contain" width="30px" height="30px"/>
          <h1 className="text-center font-[Quantico]">{chainId}</h1>
        </div>
      </div>

      <button
        onClick={logoutuser}
        className="bg-yellow-300 rounded-full px-7 py-2 bottom-5 absolute right-[40px] font-[Lekton] font-bold z-40"
      >
        Logout <RiLogoutCircleRFill className="inline"/>
      </button>
      <div className="w-full h-auto top-[200px] absolute z-100 flex justify-start align-top p-10">
        {rooms ? (
          rooms.map((room) => {
            return (
              <>
                <div
                  onClick={() => router.push("/Rooms/" + room.uid)}
                  className="w-[300px] h-[150px] rounded-md bg-white shadow-2xl mt-3 flex items-center flex-col justify-center cursor-pointer ml-4 overflow-hidden relative"
                >
                  <p className="font-[Quantico] text-lg ">{room.title}</p>
                  <p className="font-[Lekton] text-sm">{room.uid}</p>
                  <Image
                    className="object-contain pt-4 rounded-full"
                    src={`https://avatars.dicebear.com/api/initials/${room.title}.svg`}
                    height="50px"
                    width="50px"
                  />
                  <div className="rounded-full bg-yellow-400 h-[80px] w-[80px] absolute -right-8 -bottom-9"></div>
                </div>
              </>
            );
          })
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Dashboard;