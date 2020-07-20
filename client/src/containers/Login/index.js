import React from "react";
import AuthenticationForm from "../../components/AuthenticationForm";
import { LOGIN } from "../../constants";

const Login = () => {
  return <AuthenticationForm page={LOGIN} pageTitle="login" />;
};

export default Login;
