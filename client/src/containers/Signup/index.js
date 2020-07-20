import React from "react";
import AuthenticationForm from "../../components/AuthenticationForm";
import { REGISTER } from "../../constants";

const Signup = () => {
  return <AuthenticationForm page={REGISTER} pageTitle="register" />;
};

export default Signup;
