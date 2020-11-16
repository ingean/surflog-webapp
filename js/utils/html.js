function htmlModal(id, title, body, footer = '') {
  return '<div id="modal-' + id + '" class="modal fade" role="dialog">' +
            '<div class="modal-dialog">' +
              '<div class="modal-content">' +
                '<div class="modal-header">' +
                  '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
                  '<h4 class="modal-title">' + title + '</h4>' +
                '</div>' +
              '<div class="modal-body">' +
                //'<div class="container col-sm-12 col-md-12">' +
                  body + 
                //'</div>' +
              '</div>' +
              '<div class="modal-footer">' +
                footer +
              '</div>' +
            '</div>' + 
          '</div>' + 
        '</div>';
}

function htmlConfirmDelete() {
  return '<span id="btn-deleteReport" class="glyphicon glyphicon-trash pull-right i-tool-small" ' +
         'data-toggle="confirmation" ' +
         'data-on-confirm="deleteReport" ' +
         'data-btn-ok-label="Slett" data-btn-ok-icon="glyphicon glyphicon-trash" ' +
         'data-btn-ok-class="btn-danger" ' +
         'data-btn-cancel-label="Angre" data-btn-cancel-icon="glyphicon glyphicon-ban-circle" ' +
         'data-btn-cancel-class="btn-success" ' +
         'data-title="Rapport" data-content="Vil du slette rapporten?"></span>';
}

function htmlCarouselStart(id) {
  return '<div id="carousel-' + id + '" class="carousel slide" data-ride="carousel">'+
          '<ol class="carousel-indicators">';
}

function htmlCarouselEnd(id, controlsVisible = true) {
  var controlClass = '';
  var controlIndicatorRight = '<span class="glyphicon glyphicon-chevron-right"></span>';
  var controlIndicatorLeft = '<span class="glyphicon glyphicon-chevron-left"></span>';

  if (controlsVisible != true) {
    controlClass = 'carousel-control-invisible';
    controlIndicatorLeft = '';
    controlIndicatorRight = '';
  }

  return  '</div>' +
          '<a class="left carousel-control ' + controlClass + '" href="#carousel-' + id + '" data-slide="prev">' +
            controlIndicatorLeft + 
          '</a>' +
          '<a class="right carousel-control ' + controlClass + '" href="#carousel-' + id + '" data-slide="next">' +
            controlIndicatorRight + 
          '</a>' + 
        '</div>';
}

function htmlCarousel(id, contentList, controlsVisible = true) {
  var html = htmlCarouselStart(id);
  
  for (var i = 0; i < contentList.length; i++) {
    html +=  '<li data-target="#carousel-' +id + '" data-slide-to="' + i + '"';
    if (i === 0) {html += ' class="active"'};
    html += '></li>';
  }
  
  html += '</ol><div class="carousel-inner">';
  
  for (var i = 0; i < contentList.length; i++) {
    html += '<div class="item carousel-item carousel-item-' + id;
    if (i === 0) {html += ' active'};
    html += '">' +
    contentList[i] + 
    '</div>';
  }

  return html += htmlCarouselEnd(id, controlsVisible)
}



function htmlButton(id, caption, clickFunctionName, className = 'default', align = 'right') {
  var onClick = '';
  
  if (clickFunctionName != '') {
    onClick = ' onClick="' + clickFunctionName + '"';
  }

  return '<button id="btn-' + id + '" class="btn btn-' + className + ' pull-' + align + '"' + onClick + '>' + caption + '</button>';
}

function htmlTool(id, iconName, align, size, clickAction, toggle = '') {
  var style = ' i-tool'
  if (size != '') {style += '-' + size};
  
  if (toggle != '') {
    return '<span id="tool-' + id + 
           '" class="glyphicon glyphicon-' + 
           iconName + style +
           ' pull-' + align + '" data-toggle="' + toggle + '" data-target="#'
           + clickAction +           
           '"></span>';
  } else {
    return '<span id="tool-' + id + 
    '" class="glyphicon glyphicon-' + 
    iconName + style + 
    ' pull-' + align + '" onClick="'
    + clickAction +           
    '"></span>';
  }  
}

function label(caption, className, classes = '') {
  return htmlElement('label',className, 'span', caption, classes);
}

function glyph(name, classes = '') {
  return htmlElement('glyphicon', name, 'span', '', classes);
}

function htmlElement(classType, className, element = 'span', caption = '', classes = '') {
  var html = '<' + element + ' class="' + 
             classType + ' ' +
             classType + '-' + className;

  if(classes != '') { html += ' ' + classes }
  html += '">' + caption + '</' + element + '>'; 
  return html;
}