import { type FC } from "react";
import { styled } from "@linaria/react";

const Button = styled.div/*css*/ `
  border-radius: 10px;
  height: 100px;
  width: 100px;
  background: blue;
`;

const SignInSignUp1 = () => {
  return (
    <div>
      SignInSignUp1
      <Button>LOGIN</Button>
    </div>
  );
};

export default SignInSignUp1;
