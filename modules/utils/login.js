import { modal } from './html/modal.js';
import { el } from './html/elements.js';
import { startSurfLog } from '../startup.js';

export function statusChangeCallback(response) {
  if (response.status === 'connected') {
    startApp();
  } else {
    launchLogin();
  }
}

function startApp() {
  FB.api('/me', (user) => {
    console.log(`Successful login for: ${user.name}`); 
    $('#modal-login').modal('hide');
      
    FB.api(`/${user.id}/picture?redirect=false`, 'GET', {}, (picture) => {
      document.getElementById("navbar-profile-img").setAttribute("src", picture.data.url);
    });
    startSurfLog(user.id);
  });
};

function launchLogin() {
  let body = document.getElementById('sl-modal-login');
  let modalBody = el('div', "modal-login-body", [
    el('img', {src: "images/logo.png"}),
    el('span', 'text-modal-title', "Velkommen til Surflog"),
    el('p', 'modal-text', 'Logg på med din Facebook-bruker for å benytte SurfLog'),
    el('button', {id: "btn-fb-login", class: "fa fa-facebook"}, 'Logg inn med Facebook')
  ]);
  
  body.appendChild(modal(
    {
      id: "modal-login",
      title: "Logg inn med din Facebook bruker",
      body: modalBody
    }
  ));

  let loginBtn = document.getElementById('btn-fb-login');
  loginBtn.addEventListener('click', FB.login(response => statusChangeCallback(response)));

  $('#modal-login').modal('show');
}
