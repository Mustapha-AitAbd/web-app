import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { message } from 'antd';
const { TextArea } = Input;

const Addposition = (props) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [base64, setBase64] = useState('')
  const [id,setId]= useState('')
  const [email,setEmail]= useState('')
  const [phoneNumber,setPhoneNumber]= useState('')

    useEffect(() => {
    async function fetchData() {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_KEY}/support`,{
                method:'POST',
                headers: {
                  'Content-type': 'application/json',
                  'authorization':  JSON.parse(localStorage.getItem('login'))?.token
                },
            });
            const data = await response.json();
            
            
            setId(data?._id)
            setEmail(data?.email)
            setPhoneNumber(data?.phoneNumber)
        } catch (error) {
            console.error(error);
        }
    }
    fetchData();
}, []);


  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      _id: id,
      email: email,
      phoneNumber: phoneNumber,
    };
    fetch(`${process.env.REACT_APP_API_KEY}/support/modify`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'authorization':  JSON.parse(localStorage.getItem('login'))?.token
        },
        body: JSON.stringify(data)

      })
      .then(response => response.text())
      .then(data => {
        message.success(data)
        console.log('Success:', data);
        
      })
      .catch((error) => {
        console.error('Error:', error);
      });
     
      
    }

  

 

  const showModal = () => {
    setVisible(true);
  }

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };
  return (
    <>
      <button type="primary" style={{fontSize: 15,width: 130,height: 31,padding: "5px 15px",border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10,marginRight: 10,marginTop: 10,color: "black",display: "flex",justifyContent: "center",alignItems: "center"}} onClick={showModal}>Edit</button>
      <Modal
        title="Edit Support"
        visible={visible}
        onOk={handleCancel}
        footer={[
            <Button key="submit" type="primary" htmlType="submit" onClick={handleCancel}>
              Cancel
            </Button>
            ]}
      >
      <form  onSubmit={handleSubmit} >
     
        <label className='label-vehiculedetails'>Email</label><br />
        <input name="email" className='input-vehiculedetails' value={email} onChange={(event) => setEmail(event.target.value)} /><br /><br />
      
        <label className='label-vehiculedetails'>Phone Number</label><br />
        <input name="phoneNumber" className='input-vehiculedetails' type='text' value={phoneNumber} onChange={(event) => { setPhoneNumber(event.target.value); }} /><br /><br />
     
      
        <button className='my-button' type="submit" >Edit</button>
      
    </form>
      </Modal>
    </>
  );
};

export default Addposition;
