function createFormObservation() {
  $('#s-modal-note').html(
    htmlModal(
    'report-observation', 
    'Ny observasjon', 
    htmlFormObservation(), 
    htmlButton(
      'submit-observation', 
      'Lagre', 
      'submitObservation()',
      'success'
      )
    )
  );
}

function createFormSession() {
  $('#s-modal-session').html(
    htmlModal(
    'report-session', 
    'Ny session', 
    htmlFormSession(6), 
    '<div id="btn-form-session">' + 
      htmlButton(
        'next-session', 
        'Neste', 
        'wizardNextStep()',
        'default'
        ) +
      '</div>'
    )
  );
  $('.setup-content').hide(); //Hide all steps in session form wizard
  $('#btn-wizard-1').trigger('click'); //Open step 1 
}

function htmlFormObservation() {
  var html = '<form id="form-report-observation" class="form-horisontal" enctype="multipart/form-data">';
  for ( var i = 0; i < inputsReports.length; i++) {
    var input = inputsReports[i];
    if (input.observation) {
      html += htmlFormGroupInline(input.html('obs'));
    }
  }
  return html += '</form>'
}

function htmlFormSession(steps) {
  var html = 
    htmlWizard(steps) + 
    '<form id="form-report-session" class="form-horisontal" enctype="multipart/form-data">';
  for (var s = 1; s <= steps; s++) {
    html += '<div class="setup-content" id="step-' + s + '">';
    for (var i = 0; i < inputsReports.length; i++) {
      var input = inputsReports[i];
      if (input.session && input.group === s) {
        html += htmlFormGroupInline(input.html('session'));
      }
    }
    html += '</div>';
  }
  return html += '</form>';  
}

function htmlWizard(steps) {
  var html = '<div class="stepwizard">' +
             '<div class="stepwizard-row setup-panel">';

  for (var i = 1; i <= steps; i++) {
    html += '<div class="stepwizard-step">' +
            '<a id="btn-wizard-' + i + '" href="#step-'+ i + '" type="button" class="btn btn-primary btn-circle">'+ i + '</a>' + 
            '</div>';
  }
  return html += '</div></div>';
}

function wizardNextStep() {
  var currentStepId = $('.btn-circle.btn-primary').attr('id');
  var id = currentStepId.split('-');
  
  id = Number(id[2]);
  $('#btn-wizard-' + String(id + 1)).trigger('click'); //Open next step

  if (id < 5) {
    $('#btn-form-session').html(
    htmlButton(
      'next-session', 
      'Neste', 
      'wizardNextStep()',
      'default'
      )
    );
  } else {
    $('#btn-form-session').html(
      htmlButton(
        'submit-session', 
        'Lagre', 
        'submitSession()',
        'success'
      )
    )
  }
}

