import '../styles/globals.css'
import { MoralisProvider } from "react-moralis";

function MyApp({ Component, pageProps }) {
  return(
    <MoralisProvider appId="koICUFX5maGFFUrTOdnmHgJRTc0MqlH4sJbFmZhP" serverUrl="https://parxrmvsvoe1.usemoralis.com:2053/server">
     <Component {...pageProps} />
     </MoralisProvider>
      )
}

export default MyApp
