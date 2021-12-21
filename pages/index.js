import Head from 'next/head'
import{useMoralis} from 'react-moralis'
import Dashboard from '../components/Dashboard';
import Login from './Login'


export default function Home() {
  const{isAuthenticated,authenticate,user} = useMoralis()

if(!isAuthenticated) return <Login/>;
  return <Dashboard/>
 

}
