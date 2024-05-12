import React from 'react'
import { useState } from 'react';
export default function Formdetails() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Submitted form:', { firstName, lastName, email });
  return (
    <form onSubmit={handleSubmit}>
    <label htmlFor="firstName">First Name:</label>
    <input
      type="text"
      id="firstName"
      name="firstName"
      value={firstName}
      onChange={(event) => setFirstName(event.target.value)}
    />

    <label htmlFor="lastName">Last Name:</label>
    <input
      type="text"
      id="lastName"
      name="lastName"
      value={lastName}
      onChange={(event) => setLastName(event.target.value)}
    />

    <label htmlFor="email">Email:</label>
    <input
      type="email"
      id="email"
      name="email"
      value={email}
      onChange={(event) => setEmail(event.target.value)}
    />

  </form>
);
}
}
