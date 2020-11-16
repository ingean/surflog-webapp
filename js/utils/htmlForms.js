function htmlFormGroupInline(html) {
  return '<div class="form-group">' +
              html +    
          '</div>';
}

function htmlFormLabel(inputId, caption) {
  return '<label for="' + inputId + 
         '" class="control-label text-left">' + caption + '</label>';
}

function htmlFormInput(id, values, captions, defaultValue, type) {
  if (type === 'btn' || type === 'select' || type === 'datalist') {
    return htmlFormSelect(id, values, captions, defaultValue, type);
  } else if (type === 'file') {
    return '<input type="file" class="form-control" id="' + id + '" multiple>';
  } else if (type === 'time') {
    return '<input type="time" id="' + id + '" class="form-control"  required="required" />';
  } else if (type === 'textarea') {
    return '<textarea id="' + id + '" class="form-control" placeholder="' + defaultValue + '" />';
  } else { //Text
    return '<input type="text" id="' + id + '" class="form-control" placeholder="' + defaultValue + '" />'
  }
}


function htmlFormSelect(id, valuesList, captionsList, defaultValue, type) {
  var html = '<div class="input-group pull-right">';
  var end = '</div>' +
            '<input type="hidden" id="' + id + '" data-title="' + defaultValue + '" value="' + defaultValue + '">';

  if(type === 'btn') { html += '<div id="radioBtn" class="btn-group">' }
  if(type === 'select') { 
    html += '<select id="' + id + '" class="form-control">';
    end = '</select>';
  }
  if(type === 'datalist') { 
    html += '<datalist id="' + id + '">'
    end = '</datalist>'
  }

  for (i in valuesList) {
      if (type == 'btn') {
          html += '<a class="btn btn-primary btn-sm ';
          if (valuesList[i] === defaultValue) { html += 'Active' } else {html += 'notActive'};
          html += '" data-toggle="' + id + '" data-title="' + valuesList[i] + '">' + captionsList[i] + '</a>';
      } else {
          html += '<option ';
          if (valuesList[i] === defaultValue) { html += 'selected' }
          html += '>' + captionsList[i] + '</option>';
      }
  }

  return html += end + '</div>';
}