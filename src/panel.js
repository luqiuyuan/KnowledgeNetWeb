import React, { Component } from 'react';

import server from './server';

import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import {browserHistory} from 'react-router';

import styles from './styles/panel.style';

class Panel extends Component {

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
                      id={node.id}
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
    browserHistory.push('/compose');
  }

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
        <CardActions>
          <FlatButton label="Edit" onClick={this._onEdit.bind(this)} />
        </CardActions>
      </Card>
    );
  }

  _onEdit() {
    browserHistory.push({
      pathname:'/compose',
      state: {
        id: this.props.id,
        title: this.props.title,
        text: this.props.text
      }
    });
  }
}

export default Panel;
