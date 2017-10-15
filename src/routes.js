import React from 'react';
import {Router, Route} from 'react-router';

import Panel from './panel';
import Compose from './compose';

const Routes = (props) => (
  <Router {...props}>

    <Route path = '/' component = {Panel} />
    <Route path = '/compose' component = {Compose} />

  </Router>
);

export default Routes;
