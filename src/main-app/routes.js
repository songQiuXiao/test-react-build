import React from "react";
import { BrowserRouter, renderRoutes } from "mage-react-router";
import _ from "lodash";
import { hot } from "react-hot-loader/root";

import App from "../component/App";

function getComponent(path) {
  return (props) => {
    const LazyComponent = _.get(props, path);
    return LazyComponent ? <LazyComponent {...props} /> : <div />;
  };
}

const routes = [
  {
    path: "/",
    component: App,
    routes: [
      {
        path: "/dashboard",
        components: {
          top: getComponent("CommonComponents.DashboardTopBar"),
          main: (props) =>
            getComponent("CommonComponents.DashboardMainPanel")(props),
        },
      },
      // {
      //   path: "/candidates",
      //   components: {
      //     top: getComponent("CandidateComponents.CandidateTopBar"),
      //     main: getComponent("CandidateComponents.CandidateMainPanel"),
      //   },
      // },
    ],
  },
];

const Routes = () => <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>;
export default hot(Routes);
