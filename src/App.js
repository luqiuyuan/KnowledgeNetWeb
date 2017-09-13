import React, { Component } from 'react';

import server from './server';

import {Card, CardHeader, CardText} from 'material-ui/Card';

import styles from './styles/App.style';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      status: 'loading'
    };
  }

  componentWillMount() {
    server.getNodes(this._getNodesSuccessCallback.bind(this), this._getNodesFailCallback.bind(this));
  }

  render() {
    return (
      <div style={styles.container}>
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
      </div>
    );
  }

  _getNodesSuccessCallback(status, response) {
    this.setState({status: 'found', nodes: response.nodes}, () => {console.log(JSON.stringify(this.state.nodes))});
  }
  _getNodesFailCallback(status, response) {
    this.setState({status: 'not_found'});
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
      </Card>
    );
  }
}

export default App;
