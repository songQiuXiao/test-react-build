import React from "react";
import { renderRoutes, withRouter } from "mage-react-router";
import NavColumn from "../component/NavColumn";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { topRoutes: [], mainRoutes: [] };
  }

  asyncLoadComponents = () => {
    import(/* webpackChunkName: "candidates"*/ "../routes/candidates").then(
      (CandidateComponents) => {
        this.setState({ CandidateComponents });
      }
    );
  };

  componentDidMount() {
    this.generateRoutes();
    this.asyncLoadComponents();
  }

  // 生成 对应 top main 的
  generateRoutes = () => {
    const {
      route: { routes },
    } = this.props;

    let topRoutes = [];
    let mainRoutes = [];

    routes.forEach(({ components: { top, main } = {}, ...rest }) => {
      if (top) {
        let topRoute = { ...rest };
        if (typeof top === "function") {
          topRoute.render = top;
        } else {
          topRoute.component = top;
        }
        topRoutes.push(topRoute);
      }
      if (main) {
        let mainRoute = { ...rest };
        if (typeof main === "function") {
          mainRoute.render = main;
        } else {
          mainRoute.component = main;
        }
        mainRoutes.push(mainRoute);
      } else {
        mainRoutes.push({ ...rest });
      }
    });

    this.setState({ topRoutes, mainRoutes });
  };

  render() {
    const { topRoutes, mainRoutes, CandidateComponents } = this.state;
    return (
      <div style={{ display: "flex" }}>
        {/* Left panel */}
        <div style={{ width: "10%", background: "pink", height: "100vh" }}>
          Left panel
          <NavColumn />
        </div>
        <div style={{ flex: 1 }}>
          {/* Top panel */}
          <div style={{ height: "80px", borderBottom: "3px solid pink" }}>
            Top panel
            {renderRoutes(topRoutes, { CandidateComponents })}
          </div>
          {/* Main panel */}
          <div>
            Main panel
            {renderRoutes(mainRoutes, { CandidateComponents })}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
