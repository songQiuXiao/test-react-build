import React from "react";
import { Link } from "mage-react-router";

class NavColumn extends React.Component {
  render() {
    return (
      <div>
        {[
          { to: "/", text: "home" },
          { to: "/dashboard", text: "dashboard" },
          { to: "/candidates", text: "candidates" },
        ].map(({ to, text }, i) => {
          return (
            <div style={{ lineHeight: "50px" }} key={i}>
              <Link to={to}>
                <span>{text}</span>
              </Link>
            </div>
          );
        })}
      </div>
    );
  }
}

export default NavColumn;
