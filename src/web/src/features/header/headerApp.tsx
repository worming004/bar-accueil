import { useState } from "react";
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.bar.craftlabit.be');
//const pb = new PocketBase('http://localhost:8090');

function HeaderApp(props: { userIsAuthenticated: boolean }) {

  const [password, setPassword] = useState('');
  async function handleLogin() {
    const { token, record } = await pb.collection('users').authWithPassword("bar", password);
    alert(token);
  }

  function handlePasswordValue(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value)
  }
  return (
    <div>
      <h1>User is authenticated: {props.userIsAuthenticated}</h1>
      <input type="password" name="password" onChange={handlePasswordValue} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default HeaderApp;
