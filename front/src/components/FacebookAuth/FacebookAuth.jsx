import React from "react";
import FacebookLogin from "react-facebook-login";

const FacebookAuth = () => {
  const responseFacebook = (response) => {
    window.location.href = "https://elmarsa.mr:3000/api/facebook";
  };

  return (
    <FacebookLogin
      appId="1654657981818114"
      autoLoad={false}
      fields="name,email,picture"
      callback={responseFacebook}
      icon="fa-facebook"
    />
  );
};

export default FacebookAuth;
