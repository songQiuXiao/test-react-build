import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import App from "./App";

const Home = lazy(() =>
  import(/* webpackChunkName: "my-chunk-name-Home" */ "./component/Home")
);
const About = lazy(() =>
  import(/* webpackChunkName: "my-chunk-name-About" */ "./component/About")
);
const Test = lazy(() =>
  import(/* webpackChunkName: "my-chunk-name-Test" */ "./component/Test")
);
const Routes = (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={App} />
        <Route
          path="/home"
          render={() => <li>render</li>}
          component={Home}
          children={() => <li>children</li>}
        />
        <Route path="/about" component={About} />
        <Route path="/test" component={Test} />
      </Switch>
    </Suspense>
  </Router>
);
export default Routes;
