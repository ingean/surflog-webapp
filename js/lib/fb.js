// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
    if (response.status === 'connected') {
        testAPI();
    } else {
        launchLogin();
    }
}

function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function() {
    FB.init({
        appId      : '139520263438959',
        cookie     : true,  // enable cookies to allow the server to access 
        xfbml      : true,  // parse social plugins on this page
        version    : 'v7.0' // use graph api version 2.8
    });

    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
};

// Load the SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function testAPI() {
    FB.api('/me', function(response) {
        $('#modal-login').modal('hide');
        $('#fb-username').html(response.name);
        console.log('Successful login for: ' + response.name);
        user = response;
        document.getElementById("img-profile").setAttribute("src", "http://graph.facebook.com/" + response.id + "/picture?type=normal");
        startSurfLog(response.id);
    });
};

function launchLogin() {
    let func = 'FB.login(function(response) { statusChangeCallback(response);}, {scope: \'email,user_likes\'});'
    let html = '<img src="images/logo.png">';
    html += '<h4>SurfLog</h4>'
    html += 'Logg på med din facebook-bruker for å bruke SurfLog<br>';
    html += '<button id="login" class="fa fa-facebook" onClick="'+func+'">Logg inn</button>'
    $('#s-modal-login').html(htmlModal('login','Logg inn med din FB-bruker',html));
    $('#modal-login').modal('show');
}

