import { type FC } from "react";
import { styled } from "@linaria/react";

const Button = styled.div/*css*/ `
  border-radius: 50px;
  height: 30px;
  width: 100px;
  background: blue;
`;

const SignInSignUp2 = () => {
  return (
    <div>
      SignInSignUp2
      <Button>LOGIN</Button>
    </div>
  );
};

export default SignInSignUp2;
