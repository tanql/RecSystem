module.exports = {
  initFacebookLogin: function (elementId) {
    //Based on facebook example docs
    window.fbAsyncInit = window.fbAsyncInit || function() {
      FB.init({
          appId      : '577510402427180',
          cookie     : true,  // enable cookies to allow the server to access
                              // the session
          xfbml      : true,  // parse social plugins on this page
          version    : 'v2.5' // use graph api version 2.5
      });
    };

    var js, fjs = document.getElementById(elementId);
    if (document.getElementById('facebook-jssdk')) return;
    js = document.createElement('script'); js.id = 'facebook-jssdk';
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  },

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  verifyFacebookLoginAndGetToken: function(response, onSuccess) {
      if (response.status === 'connected') {
        return $.post('/api/authenticate/facebook', {accessToken: response.authResponse.accessToken})
          .done((response) => {
            onSuccess(response);
          })
          .fail(() => {
            console.log("api/authenticate/facebook failed");
          });
      } else {
        console.log('cannot verify facebook login with facebook response status: ');
        console.log(response.status);
      }
  },

  mergeAccounts: function(userId, response, onSuccess) {
    if (response.status === 'connected') {
      return $.post('/api/mergeaccounts', {
        userId: userId,
        accessToken: response.authResponse.accessToken
      })
      .done((response) => {
        onSuccess(response);
      })
      .fail(() => {
        console.log("api/authenticate/facebook failed");
      });
    } else {
      console.log('cannot verify facebook login with facebook response status: ');
      console.log(response.status);
    }
  }

}
