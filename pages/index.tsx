import type { GetServerSideProps, NextPage } from 'next'
import { FormEvent, useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import { parseCookies } from 'nookies';
import Styles from '../styles/Home.module.css';
import { withSSRGuest } from '../utils/withSSRGuest';

const Home: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { isAuthenticated, signIn, broadcastAuth } = useContext(AuthContext);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const data = {
      email,
      password
    }

    await signIn(data);


  }

  return (
    <form onSubmit={handleSubmit} className={Styles.container}>
      <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      <button type='submit'>Entrar</button>
    </form>
  )
}

export default Home

export const getServerSideProps = withSSRGuest(async (ctx) => {

  return {
    props: {}
  }

});