import { type FC } from "react";
import { styled } from "@linaria/react";

// font related refers to https://zhuanlan.zhihu.com/p/465313889
const Container = styled.div/*css*/ `
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  font-family: system-ui, -apple-system, Helvetica, Arial, sans-serif;
`;

const Decoration = styled.div<{ background: string }>/*css*/ `
  position: absolute;
  left: 50%;
  top: -25%;
  transform: translateX(-50%);
  width: 150%;
  height: 60%;
  border-radius: 100%;
  background: ${(props) => props.background};

  @media (min-width: 768px) {
    width: 0;
    height: 0;
    transform: translate(-100%, -10%);
    padding: max(100px, 40%);
  }

  @media (min-width: 1024px) {
    transform: translate(-100%, -15%);
  }
`;

const Form = styled.form/*css*/ `
  display: flex;
  flex-direction: column;
  width: 75%;

  /* addition */
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -25%);

  @media (min-width: 768px) {
    width: 60%;
    left: auto;
    right: 10px;
  }
`;

const Header = styled.h2/*css*/ `
  margin: 0 0 20px 0;
  text-align: center;
`;

const FormItem = styled.div/*css*/ `
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  box-sizing: border-box;
  width: 100%;
  border-radius: 50px;
  padding: 10px 15px;
  background: #f0f0f0;

  & .ctrl-text {
    flex-grow: 1;
    outline: none;
    border: 0 none;
    background: transparent;
    font-weight: bold;
  }

  & .ctrl-select {
    flex-grow: 1;
    outline: none;
    border: 0 none;
    background: transparent;
    font-weight: bold;
  }
`;

const Button = styled.div<{ background: string }>/*css*/ `
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  display: inline-block;
  border-radius: 50px;
  margin-bottom: 20px;
  padding: 10px 40px;
  background: ${(props) => props.background + "f0"};
  font-weight: bold;
  line-height: 1.2em;
  color: #ffffff;
  user-select: none;

  &:hover {
    cursor: pointer;
    background: ${(props) => props.background + "ff"};
  }
`;

const SocialPlatforms = styled.div/*css*/ `
  & .message {
    margin: 0;
    text-align: center;
  }
`;

type Login1Props = {
  signInTitle?: string;
  signInButtonText?: string;
  signInButtonBackground?: string;
  decorationBackground?: string;
};

const Login1: FC<Login1Props> = ({
  signInTitle = "Sign in",
  signInButtonText = "LOGIN",
  signInButtonBackground = "#5f94fc",
  decorationBackground = "#408fee",
}) => {
  return (
    <Container>
      <Form>
        <Header>{signInTitle}</Header>
        <FormItem>
          <i>icon</i>
          <select className="ctrl-select">
            <option value={0}>123</option>
          </select>
        </FormItem>
        <FormItem>
          <i>icon</i>
          <input className="ctrl-text" type="text" placeholder="Username" />
        </FormItem>
        <FormItem>
          <i>icon</i>
          <input className="ctrl-text" type="text" placeholder="Password" />
        </FormItem>
        <div>
          <Button background={signInButtonBackground}>{signInButtonText}</Button>
        </div>
        {/* <SocialPlatforms>
          <h4 className="message">Or Sign in with social platforms</h4>
        </SocialPlatforms> */}
      </Form>
      <Decoration background={decorationBackground} />
    </Container>
  );
};

export default Login1;
