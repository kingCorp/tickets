import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import Events from "./pages/events/events";
import EventsDetails from "./pages/eventDetails/eventDetails";
import Scan from "./pages/scan/scan";
import Test from "./pages/test/test";

function App() {
  return (
    <BrowserRouter basename='/'>
      <Switch>
      {/* <Route exact path="/" component={Test} /> */}
      <Route exact path="/" component={Events} />
      <Route exact path="/event/:id" component={EventsDetails} />
      <Route exact path="/scan" component={Scan} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
