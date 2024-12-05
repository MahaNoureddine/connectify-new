import React from "react";
import emailjs from 'emailjs-com';
import { auth } from "../firebase";

const SendEmail = (e) => {
  e.preventDefault(); // Prevent form from submitting the default way

  const userEmail = auth.currentUser?.email;
alert(userEmail);
  const data = {
    email_from: 'noureddinemaha7@gmail.com', // Manually set the email_from
    email_to: userEmail,
    message: 'This is a test message'         // You can add any other field here
  };

  // Send the email using send() instead of sendForm
  emailjs.send('service_7tmkmjq', 'template_a0rt6wd', data, '3EB7ENA0DlM4VNSYr')
    .then((result) => {
      alert("check your email");
    })
    .catch((error) => {
      console.log('Error sending email:', error.text);
    });
};

const EmailForm = () => {
  return (
    <div>
      <h1>Are you sure ?</h1>
      <h2>Confirm your Payment ,and reveive an e-mail
      </h2>
      
      <form onSubmit={SendEmail}>
        {/* No need for any input fields */}
        <button type="submit">Confirm</button>
        
      </form>
    </div>
  );
};

export default EmailForm;
