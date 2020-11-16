class DomainValue {
  constructor(value, isDefault = '', label = '') {
    this.value = value;
    if (label === '') {
      this.label = value;
    } else {
      this.label = label;
    }
    if (isDefault === '') {
      this.isDefault = false;
    } else {
      this.isDefault = isDefault;
    }
  }
}

class FormInput {
  constructor(id, group = 0, inputType = 'btn', label = '', domain = '', session = true, observation = false, filter = false) {
    this.id = id;
    this.group = group;
    this.inputType = inputType;
    this.domain = domain;
    this.session = session; 
    this.observation = observation;
    this.filter = filter;
    
    if (label === '') {
      this.label = id;
    } else {
      this.label = label;
    }
  }

  defaultValue() { //Returns the default value of the domain 
    if (this.domain.constructor === Array) {
      for (var i = 0; i < this.domain.length; i++) {
        if (this.domain[i].isDefault) { return this.domain[i] };
      }
    } else {
      return this.domain
    }    
  }

  html(preId) { //Returns the html for the form input as a string
    var domainList = this.domain;
    var defaultValue = this.defaultValue().value;
    var id = preId + '-' + this.id;
    var html = '<label class="control-label">' + this.label + '</label>';

    //Add extra option for filter form
    if (preId === 'filter') {
      domainList = this.domain.concat(new DomainValue('Alle'));
      defaultValue = 'Alle';
    }

    if (this.inputType === 'btn' || this.inputType === 'select' || this.inputType === 'datalist') {
      
      
      html += '<div class="input-group pull-right">';

      var end = '</div>' +
                '<input type="hidden" id="' + id + '" data-title="' + defaultValue + '" value="' + defaultValue + '">';

      if(this.inputType === 'btn') { html += '<div id="radioBtn" class="btn-group">' }
      if(this.inputType === 'select') { 
        html += '<select id="' + id + '" class="form-control">';
        end = '</select>';
      }
      if(this.inputType === 'datalist') { 
        html += '<input id="' + id + '" list="' + id + '_list"><datalist id="' + id + '_list">'
        end = '</datalist>';
      }

      for (var i = 0; i < domainList.length; i++) {
        if (this.inputType == 'btn') {
          html += '<a class="btn btn-primary btn-sm ';
          if (domainList[i].value === defaultValue) { html += 'Active' } else {html += 'notActive'};
            html += '" data-toggle="' + id + '" data-title="' +domainList[i].value + '">' + domainList[i].label + '</a>';
        } else if(this.inputType === 'datalist') {
          html += '<option value="' + domainList[i].label + '">';
        } else {
          html += '<option ';
          if (domainList[i].value === defaultValue) { html += 'selected' }
          html += '>' + domainList[i].label + '</option>';
        }
      }
      return html += end + '</div>';
    } else if (this.inputType === 'file') {
      return html += '<input type="file" class="form-control" id="' + id + '" multiple>';  
    } else if (this.inputType === 'textarea') {
      return html += '<textarea id="' + id + '" class="form-control" />';
    } else if (this.inputType === 'time') {
      return html += '<input type="' + this.inputType +'" id="' + id + '" class="form-control" value="' + moment().format('HH:00') +'" />';
    } else { //Text, number, time or other input type
      return html += '<input type="' + this.inputType +'" id="' + id + '" class="form-control" />';
    } 
  }
}