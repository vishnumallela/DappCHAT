import '../styles/globals.css'
import { MoralisProvider } from "react-moralis";

function MyApp({ Component, pageProps }) {
  return(
    <MoralisProvider appId="X1kjfvCnv9RUp3lObqaASmiAUemk7f4BWYEqz93f" serverUrl="https://jsqt0b2c1cyr.usemoralis.com:2053/server">
     <Component {...pageProps} />
     </MoralisProvider>
      )
}

export default MyApp
