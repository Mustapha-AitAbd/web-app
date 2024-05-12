import React, { useState } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { message } from 'antd';

const AddHardwareProvider = ({ onCreate }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [HardwareKeyApi,setHardwareKeyApi]= useState('')
  const [Model,setModel]= useState('')
  const [Marque,setMarque]= useState('')
  



  const handleSubmit = async (event) => {
    const HardwareProviderdata = {
      HardwareKeyApi: HardwareKeyApi,
      Model: Model,
      Marque: Marque,
    };
    

    try {
      const response = await fetch( `${process.env.REACT_APP_API_KEY}/hardwareProvider/create`, {
        method: "POST",
        headers: {
          'Content-type': 'application/json',
          'authorization':  JSON.parse(localStorage.getItem('login'))?.token
        },
        body: JSON.stringify(HardwareProviderdata),
      });
      
      const data = await response.json();
     
      console.log(data); // handle response data here
    } catch (error) {
      console.error(error);
      
    }
    message.success('Processing complete!')
  };
 

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };
  return (
    <>
      <Button type="primary" style={{marginLeft: 18, borderRadius : 16, backgroundColor: '#fff', color: 'black' ,border: '1px solid #000', marginTop: 10}} onClick={showModal}>Add New Hardware Provider</Button>
      <Modal
        title="Create a new item"
        visible={visible}
        onOk={handleCancel}
        onCancel={handleCancel}
      >
      <Form form={form} onFinish={handleSubmit}>
      <Form.Item
        label="HardwareKeyApi"
        name="HardwareKeyApi"
        rules={[{ required: true, message: 'Vous avez oublié de remplir le champ.' }]}
      >
        <Input name="HardwareKeyApi"  value={HardwareKeyApi} onChange={(event) => setHardwareKeyApi(event.target.value)}  />
      </Form.Item>
      <Form.Item
        label="Model"
        name="Model"
        rules={[{ required: true, message: 'Vous avez oublié de remplir le champ.' }]}
      >
        <Input name="Model" value={Model} onChange={(event) => setModel(event.target.value)} />
      </Form.Item>
      <Form.Item
        label="Marque"
        name="Marque"
        rules={[{ required: true, message: 'Vous avez oublié de remplir le champ.' }]}
      >
        <Input name="Marque" value={Marque} onChange={(event) => setMarque(event.target.value)} />
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

export default AddHardwareProvider;
