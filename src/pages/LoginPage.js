import React from 'react'
import '../Styles/login.css'
import { useState } from 'react';
import { message } from 'antd';
import { Navigate } from 'react-router-dom';
import Link from 'antd/es/typography/Link';



export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState(false);
  const [store, setStore] = useState({});
 

  function handleSubmitRent(event) {

    if( email === null || email === '' || password === null || password === '' ){
      message.error('Please fill all the fields');
      return;
    }

    event.preventDefault();
    
    let dataUser = {
      credentials:{
        username: email,
        password: password
      }
     
      
    };
    console.log(dataUser);
    
    fetch(`${process.env.REACT_APP_API_KEY}/user/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataUser)

    })
    .then(async (response) =>{ 
      const data = await response.json();
      console.log("data :", data);
      if(response.status === 200){
        localStorage.setItem('login', JSON.stringify(
          {
            token : data?.token,
            login: true,
            user: data?.user
          }
        ));
        let store = JSON.parse(localStorage.getItem('login'));
        if(store.login && store){
          setLogin(true);
          setStore(store);
        }
        message.success(data.message);
        console.log(store);
       console.log('Success:', data.message);
      }else{
        message.error(data.message);
        
      }
    })
    .catch((error) => {
      message.error(error.message);
      console.error('Error:', error);
    });

  }

  return (
    <>
    {login ? <Navigate to="/" /> :
    <main>
    <section className="section-login">
      <div className="section-main">
        
        <div className="section-login-2">
          <div className="section-login-2-main">
            <h1 className="section-login-2-title">Login</h1>
            <form className="section-login-2-form">
              <div className="login-form-1">
                <label htmlFor="input-email">Email</label>
                <input type="text" id="input-email" onChange={(event) => setEmail(event.target.value)} required />
              </div>
              <div className="login-form-3">
                <label htmlFor="input-password">Password</label>
                <input type="password" id="input-password" onChange={(event) => setPassword(event.target.value)} required />
              </div>
              <div className="login-form-4">
               <Link href="/forgotpassword">Forgot Password?</Link>
              </div>
              <div className="login-form-submit-btn">
                <button onClick={handleSubmitRent}>Login</button>
              </div>
              <div className="login-form-5">
                
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>
 }
  </>
);
}
