import React, { Component } from 'react';

import server from './server';
import {NodeTitleInput, NodeTextInput} from './components/text_inputs';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import styles from './styles/App.style';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      status: 'loading',
      open: false
    };
  }

  componentWillMount() {
    server.getNodes(this._getNodesSuccessCallback.bind(this), this._getNodesFailCallback.bind(this));
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this._handleClose}
      />,
      <FlatButton
        label="Create"
        primary={true}
        keyboardFocused={true}
        onClick={this._create.bind(this)}
      />,
    ];

    return (
      <div style={styles.container}>
        <AppBar
          title="Knowledge Net"
          iconElementLeft={<p></p>}
          iconElementRight={<FlatButton label="Add" onClick={this._add.bind(this)} />} />
        {(() => {
          switch (this.state.status) {
            case 'found':
              return (
                this.state.nodes.map((node) => {
                  return (
                    <NodeCard
                      key={node.id}
                      title={node.title}
                      text={node.text} />
                  );
                })
              );
            case 'not_found':
              return (
                <p>Not Found</p>
              );
            default:
              return (
                <p>Loading</p>
              );
          }
        })()}
        <Dialog
          title="New Knowledge Node"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this._handleClose}>
          <NodeTitleInput
            onChangeText={(title) => {
              this.setState({title});
            }}
            validCallback={() => {
              this.setState({title_valid: true});
            }}
            invalidCallback={() => {
              this.setState({title_valid: false});
            }} />
          <NodeTextInput
            onChangeText={(text) => {
              this.setState({text});
            }}
            validCallback={() => {
              this.setState({text_valid: true});
            }}
            invalidCallback={() => {
              this.setState({text_valid: false});
            }} />
        </Dialog>
      </div>
    );
  }

  _getNodesSuccessCallback(status, response) {
    this.setState({status: 'found', nodes: response.nodes});
  }
  _getNodesFailCallback(status, response) {
    this.setState({status: 'not_found'});
  }

  _add() {
    this._handleOpen();
  }
  _create() {
    if (this.state.title_valid && this.state.text_valid) {
      server.postNodes({
        node:{
          title: this.state.title,
          text: this.state.text
        }
      });
    }

    this._handleClose();
  }

  _handleOpen = () => {
    this.setState({open: true});
  };

  _handleClose = () => {
    this.setState({open: false});
  };

}

class NodeCard extends Component {
  render() {
    return (
      <Card style={styles.card}>
        <CardHeader
          title={this.props.title}
          actAsExpander={true}
          showExpandableButton={true} />
        <CardText expandable={true}>
          {this.props.text}
        </CardText>
      </Card>
    );
  }
}

export default App;
