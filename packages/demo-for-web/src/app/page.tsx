import { Link } from "react-router-dom";

const Index = () => {
  return (
    <nav style={{ padding: 20 }}>
      <li>
        <Link to="/login1">Login1</Link>
      </li>
    </nav>
  );
};

export default Index;
