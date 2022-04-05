import { useMoralis } from "react-moralis";
import Image from 'next/image'
import Logo from '../images/Dapp.png'





function Login() {
  const { authenticate,enableWeb3 } = useMoralis();

  const handleclick = (e) => {
    e.preventDefault();
    authenticate({ signingMessage: "DappCHAT-authentication" });
    enableWeb3();
};
  return (
    <div className=" flex flex-col items-center justify-center w-full h-screen bg-[#e0e0e0] relative">
      <div className="w-[900px] h-[900px] absolute ml-10 z-4">
        <Image src={Logo} className="object-contain" />
      </div>

      <button
        class="bg-white hover:bg-indigo-400 hover:text-white text-black font-semibold  py-2 px-8 rounded inline-flex items-center shadow-2xl z-10  transition-all"
        onClick={handleclick}
      >
        <span>LOG IN WITH METAMASK</span>
        <span></span>
        <img
          className="ml-2 h-5 w-5"
          src="https://docs.metamask.io/metamask-fox.svg"
        />
      </button>
       <p className="absolute bottom-[409px] font-[Lekton]">
        DEVELOPED BY VISHNU MALLELA & NARENDRA UNDER SUPERVISION OF DR.JAGALINGAM.P{" "}
      </p> 
      <p className="absolute bottom-[380px] font-[Lekton]"> © DAPP CHAT </p>
    </div>
  );
}

export default Login;
