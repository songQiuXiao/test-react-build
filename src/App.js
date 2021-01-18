import React from "react";
import { Link } from "react-router-dom";

// const routeConfig = [
//   {
//     path: "/",
//     component: Home,
//     indexRoute: { component: Home },
//     childRoutes: [
//       { path: "about", component: About },
//       { path: "test", component: Test },
//     ],
//   },
// ];

const App = () => (
  <div style={{ margin: "60px 80px", lineHeight: 2 }}>
    <Link to="/">App</Link>
    <br />
    <Link to="/home">Home</Link>
    <br />
    <Link to="/about">About</Link>
    <br />
    <Link to="/test">Test</Link>
  </div>
);

export default App;
