import React, { Component } from 'react';

import {NodeTitleInput, NodeTextInput} from './components/text_inputs';
import server from './server';

import FlatButton from 'material-ui/FlatButton';
import {browserHistory} from 'react-router';

export default class Compose extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.location.state? this.props.location.state.id : null,
      title: this.props.location.state? this.props.location.state.title : null,
      text: this.props.location.state? this.props.location.state.text : null
    };
  }

  render() {
    return (
      <div style={{display:'flex', flexDirection:'column', flex:1, alignItems:'center'}}>
        <NodeTitleInput
          onChangeText={(title) => {
            this.setState({title});
          }}
          validCallback={() => {
            this.setState({title_valid: true});
          }}
          invalidCallback={() => {
            this.setState({title_valid: false});
          }}
          defaultValue={this.state.title} />
        <NodeTextInput
          onChangeText={(text) => {
            this.setState({text});
          }}
          validCallback={() => {
            this.setState({text_valid: true});
          }}
          invalidCallback={() => {
            this.setState({text_valid: false});
          }}
          defaultValue={this.state.text} />
        <FlatButton
          label = "Save"
          onClick = {this._onSave.bind(this)} />
        <FlatButton
          label = "Cancel"
          onClick = {this._onCancel.bind(this)} />
      </div>
    );
  }

  _onSave() {
    if (this.state.title_valid && this.state.text_valid) {
      if (this.state.id) {
        server.updateNode(this.state.id, {
          node: {
            title: this.state.title,
            text: this.state.text
          }
        }, this._updateNodeSuccessCallback.bind(this));
      } else {
        server.postNodes({
          node: {
            title: this.state.title,
            text: this.state.text
          }
        }, this._postNodesSuccessCallback.bind(this));
      }
    }
  }

  _onCancel() {
    browserHistory.goBack();
  }

  _postNodesSuccessCallback() {
    browserHistory.goBack();
  }

  _updateNodeSuccessCallback() {
    browserHistory.goBack();
  }

}
