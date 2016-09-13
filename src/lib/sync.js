var Backbone = require('backbone');
var sync = Backbone.sync;
var _ = require('underscore');

Backbone.sync = function (method, model, options = {}) {

  options.beforeSend = function (xhr) {
    xhr.setRequestHeader('Authorization', localStorage.getItem('x-access-token'));
  };

  options.error = function (response) {
    if (_.include([401, 403], response.status)) {
      if ( window && window.location) {
        window.location = "http://" + window.location.host + "#login";
      }
    }
  };

  return sync(method, model, options);
};
