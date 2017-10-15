import React, {Component} from 'react';

import Routes from './routes';

import { browserHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class App extends Component {

  render() {
    return (
      <MuiThemeProvider>
        <div style={styles.container}>
          <Routes history={browserHistory} />
        </div>
      </MuiThemeProvider>
    );
  }

}

const styles = {
  container: {
    display: 'flex',
    flex: 1
  }
}
