import React from 'react'
import '../Styles/login.css'
import { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import Link from 'antd/es/typography/Link';



export default function EditPasswordForLogin() {
  const [password, setPassword] = useState('');
  const [newpassword, setNewpassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const navigate = useNavigate();

 

  function handleSubmitRent(event) {

    if( password === null || password === '' || newpassword === ''|| newpassword === null|| confirmpassword === ''|| confirmpassword === null ){
      message.error('Please fill all the fields');
      return;
    } else if(newpassword !== confirmpassword){
      message.error('Password not match');
      return;
    }

    
    navigate('/login');

    
    let dataUser = {
      credentials:{
        
      }
     
      
    };
    console.log(dataUser);
    
    
  }

  return (
    <>
   
    <main>
    <section className="section-login">
      <div className="section-main">
        
        <div className="section-login-2">
          <div className="section-login-2-main">
            <h3 className="section-login-2-title" style={{fontSize: 28}}>Edit Password</h3>
            <form className="section-login-2-form">
              <div className="login-form-1">
                <label htmlFor="input-email">Password</label>
                <p style={{fontSize: 10}}>Please check your inbox to retrieve your password</p>
                <input type="text" id="input-email" onChange={(event) => setPassword(event.target.value)} required />
              </div>
              <div className="login-form-1">
                <label htmlFor="input-email">New Password</label>
                <input type="text" id="input-email" onChange={(event) => setNewpassword(event.target.value)} required />
              </div>
              <div className="login-form-1">
                <label htmlFor="input-email">Confirm Password</label>
                <input type="text" id="input-email" onChange={(event) => setConfirmpassword(event.target.value)} required />
              </div>
             
              <div className="login-form-4">
              <Link href="/forgotpassword">Rest Password ?</Link>
              </div>
              <div className="login-form-submit-btn">
                <button onClick={handleSubmitRent}>Submit</button>
              </div>
              <div className="login-form-5">
                
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>

  </>
);
}
