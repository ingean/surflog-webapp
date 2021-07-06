import { statusChangeCallback } from './modules/utils/login.js';
import { initTheme } from './modules/settings.js';

initTheme(); //Set UI theme to light or dark
moment.locale('nb_NO');
google.charts.load('current', {'packages':['corechart'],'language':'nb_NO'}); 

//Load FB SDK and check status
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

//Initialize SDK and check status
window.fbAsyncInit = () => {
  FB.init({
    appId            : '139520263438959',
    autoLogAppEvents : true,
    xfbml            : false,
    version          : 'v9.0'
  });

  FB.getLoginStatus(response => {
    statusChangeCallback(response);
  });
};


