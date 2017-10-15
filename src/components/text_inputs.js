/**
 * Todos:
 *   1. The purpose of defaultValue and value seems to be duplicated
 *   2. The value of <input> needs the ability to change after mounting
 */

import React, {Component} from 'react';

import {validateExistence, validateMaxLength} from '../validations';

import './styles/text_inputs.css';

export default class WookoTextInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      text: this.props.value
        ? this.props.value
        : "",
      error: false,
      err_msg: "",
      on_focus: false
    };

    this._input_props = {};
    Object
      .getOwnPropertyNames(this.props)
      .forEach(p => {
        ['type', 'placeholder','defaultValue','autoFocus', 'value','checked'].includes(p) && (this._input_props[p] = this.props[p]);
      });
  }

  componentWillMount() {
    // initialize validity this requires that all validation functions work for
    // this.props.value of null and undefined
    var message = this._validateAndReturnMessage(this.state.text);
    if (message) { // error happens
      // call invalid callback
      if (this.props.invalidCallback)
        this.props.invalidCallback();
      }
    else { // error did not happend
      // call valid callback
      if (this.props.validCallback)
        this.props.validCallback();
      }
    }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        text: nextProps.value
      }, this._onChangeText.bind(this, nextProps.value));
    }
  }

  render() {
    return (
      <div className='wrapper' style={this.props.style}>
        <div className={'input_wrapper ' + this._decideStyle()}>
          {this.props.prefix && (this.state.on_focus || this.state.text)
            ? <p className={'pre_post_fix ' + this._decidePrePostFixFontColor()} id='prefix_p'>{this.props.prefix}</p>
            : null
}
          <input
            type='text'
            {...this._input_props}
            //value={this.state.text}
            style={{
            flex: 1
          }}
            ref={component => this._input = component}
            onChange={(event) => {
            this._onChangeText(event.target.value);
            this.props.onChangeText && this
              .props
              .onChangeText(event.target.value);
          }}
            onFocus={() => {
            this._onFocus();
            this.props.onFocus && this
              .props
              .onFocus();
          }}
            onBlur={this
            ._onBlur
            .bind(this)}/> {this.props.postfix && (this.state.on_focus || this.state.text)
            ? <p className={'pre_post_fix ' + this._decidePrePostFixFontColor()} id='postfix_p'>{this.props.postfix}</p>
            : null
}
        </div>
        <div className='err_msg_wrapper'>
          <p className='err_msg'>{this.state.err_msg}</p>
        </div>
      </div>
    );
  }

  // validate text whenever it changes it can only disable the error state but can
  // not enable the error state
  _onChangeText(text) {
    this.setState({text: text});
    var message = this._validateAndReturnMessage(text);
    if (message) { // error happends
      this._updateErrMsg(message);
      // call invalid callback
      if (this.props.invalidCallback)
        this.props.invalidCallback();
      }
    else { // error did not happend
      this._disableErrorState();
      // call valid callback
      if (this.props.validCallback) {
        this
          .props
          .validCallback();
      }
    }
  }

  // validate text return the error message or null if it passes all validations
  _validateAndReturnMessage(text) {
    if (this.props.validations) {
      var validations = this.props.validations;
      for (let i = 0; i < validations.length; i++) {
        var message = validations[i](text);
        if (message)
          return message;
        }
      }
    return null;
  }

  _updateErrMsg(err_msg) {
    if (this.state.error)
      this.setState({err_msg: err_msg});
    }

  _enableErrorState(err_msg) {
    this.setState({error: true, err_msg: err_msg});
  }
  _disableErrorState() {
    this.setState({error: false, err_msg: ""});
  }

  _onFocus() {
    this.props.enabled
      ? this.setState({on_focus: true})
      : this.blur();
  }
  // _onBlur changes the state on_focus to false and decide if the text is invalid
  _onBlur() {
    if (this.props.enabled === false) {
      return;
    }
    this.setState({on_focus: false});
    var message = this._validateAndReturnMessage(this.state.text);
    if (message) { // error happens
      this._enableErrorState(message);
      // call invalid callback
      if (this.props.invalidCallback)
        this.props.invalidCallback();
      }
    else { // error did not happen
      // call valid callback
      if (this.props.validCallback)
        this.props.validCallback();
      }
    }

  blur() {
    this
      ._input
      .blur();
    this._onBlur();
  }

  getText(){
    return this.state.text;
  }

  _decideStyle() {
    if (this.state.error)
      return 'input_wrapper_error';
    else if (this.state.on_focus)
      return 'input_wrapper_focus';
    else
      return 'input_wrapper_blur';
    }

  _decidePrePostFixFontColor() {
    if (this.state.text)
      return 'pre_post_fix_font_color_after';
    else
      return 'pre_post_fix_font_color_before';
    }

}

WookoTextInput.defaultProps = {
  enabled: true
};

export class NodeTitleInput extends Component {
  render() {
    return (<WookoTextInput
      {...this.props}
      ref={this.props.inputRef}
      placeholder="Title"
      validations={[validateExistence, (text) => { return validateMaxLength(text, 255) }]} />
    );
  }
}

export class NodeTextInput extends Component {
  render() {
    return (<WookoTextInput
      {...this.props}
      ref={this.props.inputRef}
      placeholder="Text"
      validations={[(text) => { return validateMaxLength(text, 1024) }]} />
    );
  }
}
