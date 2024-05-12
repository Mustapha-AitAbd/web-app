import React, { useState } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { message } from 'antd';

const Addposition = ({ onCreate }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [base64, setBase64] = useState('')
  const [zoneName,setZoneName]= useState('')
  const [zoneType,setZoneType]= useState('')
  const [zoneImage,setZoneImage]= useState('')
  const [latitude,setLatitude]= useState('')
  const [longitude,setLongitude]= useState('')



  const handleSubmit = async (event) => {
    const zonedata = {
      zoneName: zoneName,
      zoneType: zoneType,
      zoneImage: base64,
      latitude: latitude,
      longitude: longitude
    };
    
    try {
      const response = await fetch(`${process.env.API_KEY}/zone/create`, {
        method: "POST",
        headers: {
          'Content-type': 'application/json',
          'authorization':  JSON.parse(localStorage.getItem('login'))?.token
        },
        body: JSON.stringify(zonedata),
      });
      
      const data = await response.json();
      message.success('Processing complete!')
      console.log(data); 
    } catch (error) {
      console.error(error);
      message.error('Processing incomplete!')
    }
  };
 

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        onCreate(values);
        form.resetFields();
        setVisible(false);
        window.location.reload();
      })
      .catch(errorInfo => {
        console.log('Failed:', errorInfo);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  function encodeImageFileAsURL(imageFile) { // fonction pour mettre image en bease64
    const reader = new FileReader();
    reader.onloadend = function() {
      const base64String = reader.result;
      console.log(base64String);
      setBase64(base64String)
    }
    reader.readAsDataURL(imageFile);
  }
  function handleImageUpload(event) {
    const imageFile = event.target.files[0];
    encodeImageFileAsURL(imageFile);
  }

  return (
    <>
      <button type="primary" style={{fontSize: 15,width: 130,height: 31,padding: "5px 15px",border: "1px solid hsl(0, 0%, 80%)",borderRadius: 10,marginRight: 10,marginTop: 10,color: "black",display: "flex",justifyContent: "center",alignItems: "center"}} onClick={showModal}>Add Zone</button>
      <Modal
        title="Create a new item"
        visible={visible}
        footer={[
          <Button key="submit" type="primary" htmlType="submit" onClick={handleCancel}>
            Cancel
          </Button>
          ]}
      >
      <Form form={form} onFinish={handleSubmit}>
      <Form.Item
        label="zone Name"
        name="zoneName"
        rules={[{ required: true, message: 'Vous avez oublié de remplir le champ.' }]}
      >
        <Input name="zoneName"  value={zoneName} onChange={(event) => setZoneName(event.target.value)}  />
      </Form.Item>
      <Form.Item
        label="zone Type"
        name="zoneType"
        rules={[{ required: true, message: 'Vous avez oublié de remplir le champ.' }]}
      >
        <Input name="zoneType" value={zoneType} onChange={(event) => setZoneType(event.target.value)} />
      </Form.Item>
      <Form.Item
        label="Zone Image"
        name="zoneImage"
        rules={[{ required: true, message: 'Vous avez oublié de remplir le champ.' }]}
      >
        <Input name="zoneImage" type='file' value={zoneImage} onChange={(event) => { handleImageUpload(event); setZoneImage(event.target.value); }} />
      </Form.Item>
      <Form.Item
        label="longitude"
        name="longitude"
        rules={[{ required: true, message: 'Vous avez oublié de remplir le champ.' }]}
      >
        <Input name="longitude" value={longitude} onChange={(event) => setLongitude(event.target.value)} />
      </Form.Item>
      <Form.Item
        label="latitude "
        name="latitude"
        rules={[{ required: true, message: 'Vous avez oublié de remplir le champ.' }]}
      >
        <Input name="latitude"  value={latitude} onChange={(event) => setLatitude(event.target.value)}/>
      </Form.Item>
      

      <Form.Item>
        <Button type="primary" htmlType="submit" onClick={() => {message.success('Processing complete!')}}>
          Submit
        </Button>
      </Form.Item>
    </Form>
      </Modal>
    </>
  );
};

export default Addposition;
