import React from 'react'
import '../Styles/login.css'
import { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import Link from 'antd/es/typography/Link';



export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

 

  function handleSubmitRent(event) {

    if( email === null || email === ''  ){
      message.error('Please fill all the fields');
      return;
    }
    navigate('/editpassword');

    
    let dataUser = {
      credentials:{
        username: email,
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
            <h3 className="section-login-2-title" style={{fontSize: 28}}>Reset Password</h3>
            <form className="section-login-2-form">
              <div className="login-form-1">
                <label htmlFor="input-email">Email</label>
                <input type="text" id="input-email" onChange={(event) => setEmail(event.target.value)} required />
              </div>
             
              <div className="login-form-4">
              <Link href="/login">Login ?</Link>
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
