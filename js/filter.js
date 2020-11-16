function createFormFilter() {
  $('#s-modal-filter').html(
    htmlModal(
      'reports-filter', 
      'Filter', 
      htmlFormFilter(), 
      htmlButton(
        'filter',
        'Filtrer',
        'filterReports()',
        'success'
        ) + 
        htmlButton(
          'filter-clear',
          'Nullstill',
          'filterClear()',
          'default',
          'left'
        )
      )
    );
}

function htmlFormFilter() { 
  var html = '<form class="form-horisontal" role="form" enctype="multipart/form-data">' + 
                htmlFilterPlace();

  for(var i = 0; i < inputsReports.length; i++) {
    if (inputsReports[i].filter) {
      html += htmlFormGroupInline(inputsReports[i].html('filter'));  
    }
  }

  html += '</form>';
  return html;
}

function htmlFilterPlace() {
  return '<div class="form-group">' +
          '<label for="test">Type sted</label>' +
          '<div class="input-group pull-right">' +
            '<div id="radioBtn" class="btn-group">' +
              htmlBtnPlace(0, "country", "Land", 'notActive') +
              htmlBtnPlace(1, "location", "Område", 'notActive') +
              htmlBtnPlace(2, "spot", "Spot", 'Active') +
            '</div>' + //radioBtn
            '<input type="hidden" id="a-place-type" data-title="2" value="2">' +
          '</div>' + //Input group
        '</div>' + //Form group
        '<div id="form-group-place" class="form-group">' +
          inputsReports[2].html('filter') + 
        '</div>';       
}

function htmlBtnPlace(id, label, caption, status) {
  return '<a onClick="updateOptionlist(' + id + ')"' +  
            ' class="btn btn-primary btn-sm ' + status + '"' +
            ' data-toggle="a-place-type"' +
            ' data-title="' + label + '">' + caption +
          '</a>'
}

function updateOptionlist(id) { 
  $('#form-group-place').html(inputsReports[id].html('filter'));
}

function filterReports() {
  var query = '';

  if($('#select-place').val() != 'Alle') {
    var place = $('#a-place-type').val();
    query += '&' + place +
             '=' + $('#filter-' + place).val();
  }

  for (var i = 3; i < inputsReports.length; i++) {
    var input = inputsReports[i];
    if (input.filter) {
      if($('#filter-' + input.id).val() != 'Alle') {
        query += '&' + input.id + '=' + $('#filter-' + input.id).val();
      }
    }
  }

  getRequest('reports?' + query)
  .then(response => {
    let count = Number(response.xhr.getResponseHeader('X-Total-Count'));
    displayPagination(count, response.data, query);
  })
}

function filterClear() {
  getRequest('reports') //Reset the report list
  .then(response => {
    let count = Number(response.xhr.getResponseHeader('X-Total-Count'));
    displayPagination(count, response.data);
  })
  
  //Reset the form
  $('a[data-title="spot"]').trigger('click');

  for(var i = 3; i < inputsReports.length; i++) {
    if (inputsReports[i].filter) {
      if(inputsReports[i].inputType === 'btn') {
        $('a[data-toggle="filter-'+inputsReports[i].id +'"]').not('[data-title="Alle"]').removeClass('Active').addClass('notActive');
        $('a[data-toggle="filter-'+inputsReports[i].id+'"][data-title="Alle"]').removeClass('notActive').addClass('Active');
      } else {
        $('#filter-' + inputsReports[i].id + ' option[value="Alle"]').prop('selected', true);
      }
      $('#filter-' + inputsReports[i].id).val('Alle');
    }
  }
}

