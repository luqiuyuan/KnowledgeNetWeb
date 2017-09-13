const axios  = require('axios');

class Server{

  constructor(){
    this.domain = 'http://localhost:3000';
  }

  makeCancelable(promise, status) {
    let hasCanceled_ = false;

    const wrappedPromise = new Promise((resolve, reject) => {
      setTimeout(() => { reject(new Error("timeout")) }, 50000);
      promise.then((val) =>
        hasCanceled_ ? reject(new Error("canceled")) : resolve(val, status)
      );
      promise.catch((error) =>
        hasCanceled_ ? reject(new Error("canceled")) : reject(error)
      );
    });

    return {
      promise: wrappedPromise,
      cancel() {
        hasCanceled_ = true;
      },
    };
  };

  call(method, resource, body, success_callback, fail_callback){

    let header;
    header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    let status;

    const cancelable_promise = this.makeCancelable(axios.request({
      baseURL: this.domain,
      headers: header,
      method:method,
      url:resource,
      data:body,
      validateStatus: function (status) {
        return true;
      },
      timeout : 60000
      })
      .then(
      // rsolve function then
      (response) => {
        status = response.status;
        if ((response.status >= 200 && response.status < 300) || (response.status >= 400 && response.status < 500)) {
            if (response.data)
              return response.data;
            // to do: use resolve
          }
        else {
          var msg = "Server internal error when calling API";
          return msg;
        }
      }),status)

    cancelable_promise.promise.then(
      (responseJSON)=>{
        this._handleResponse(status, responseJSON, success_callback, fail_callback);
      }
    ).catch((error)=>{
      console.log(error)
    })

    return cancelable_promise;
  }

  _handleResponse(status, responseJSON, success_callback, fail_callback) {
    if (status >= 200 && status < 300) {
      if (success_callback)
        success_callback(status, responseJSON);
    }
    else
      this._callFailCallbacks(status, responseJSON, fail_callback);
  }

  _callFailCallbacks(status, response, fail_callback) {
    if (this._preFailCallback(status, response)) {
      if (fail_callback) {
        if (fail_callback(status, response)) {
          this._postFailCallback(status, response);
        }
      }
      else {
        this._postFailCallback(status, response);
      }
    }
  }
  _preFailCallback(status, response) {
    switch (status) {
      default:
        break;
    }

    return true;
  }
  _postFailCallback(status, response) {
    console.log("status: " + status + ", response: " + JSON.stringify(response));
  }

  getNodes(success_callback, fail_callback) {
    return this.call('get', 'nodes', null, success_callback, fail_callback);
  }

}

// module.exports= new Server();
export default new Server();
