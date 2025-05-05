import React from "react";
import FacebookLogin from "react-facebook-login";

const FacebookAuth = () => {
  const responseFacebook = (response) => {
    window.location.href = "https://localhost:3000/api/api/auth/facebook";
  };

  return <FacebookLogin appId="1038851094238369" autoLoad={false} fields="name,email,picture" callback={responseFacebook} icon="fa-facebook" />;
};

export default FacebookAuth;
