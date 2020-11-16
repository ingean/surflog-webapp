function dateSelected(date,id){
  //Get reports and forecast for selected day
  if (moment(date).isSameOrBefore(new Date(), 'day')){ //Selected date is today or in the past
      if (typeof id=="undefined"){  getReportsAndImages(moment(date).format('YYYY-MM-DD')); } else { getReportsAndImages(moment(date).format('YYYY-MM-DD'),id); } //Get images for date from database via API
      if (!moment(date).isSame(new Date(), 'day')){
        displayHistoricForecasts(date);
      }
  } else { // Selected date is in the future
      showAlert('Det finnes ikke varsler for denne datoen','info','time');
  }
  getSunriseSet(moment(date).format('YYYY-MM-DD'));
  getTides(date,'tab');   
}

function displayDMIforecast(response,id) {
  var forecast = reformatDMI(response);  
  var salt = calcScore(forecast,'Saltstein');
  var esso = calcScore(forecast,'Esso');

  var score = salt.label;
  if (esso.score >= 35 ) {score += '<span class="glyphicon glyphicon-fire"></span>'};
  $('#score'+id).html(score);
  $('#waves'+id).html('Bølger (' + Math.round( forecast.waveheight * 10 ) / 10 + 'm/' + Math.round( forecast.waveperiod * 10 ) / 10 + 's)');
  $('#swell'+id).html('Dønning (' + Math.round( forecast.swellheight * 10 ) / 10 + 'm/' + Math.round( forecast.swellperiod * 10 ) / 10 + 's)');
  $('#wind'+id).html('Vind (' + Math.round( forecast.wind * 10 ) / 10 + 'ms/' + Math.round( forecast.swind * 10 ) / 10 + 'ms)');
}

function displayPagination(count, reports, query = '') {
    var pcount = Math.ceil(count / 10);
    $('#pagination').pagination({
        items: count,
        itemsOnPage: 10,
        displayedPages: 3,
        cssStyle: '',
        prevText: '<span aria-hidden="true">&laquo;</span>',
        nextText: '<span aria-hidden="true">&raquo;</span>',
        onInit: function () {
            displayReportList(reports);
        },
        onPageClick: function (page, evg) {
            getReportsPage(page,query);
        }
    });
}

function displaySpotSelector(spotList) {
    var html = '';
    for (var s in spotList) {
        html += '<li><a  href="javascript:void(0);" onClick="getReportsStatsSpot(\'' 
             + spotList[s] + '\')">' + spotList[s] + '</a></li>';
    }
    $('#spotlist').html(html);
}

function displayReportList(reports) {  
  if (reports.constructor == Array) {
    var html = '';
    for(var i in reports){
      var r = reports[i];
      if (r.id > REPORTLATEST.id && r.type == 'Session') { 
          REPORTLATEST = r //Get id of last session report
      }; 
      
      html += '<a href="javascript:void(0);" class="list-group-item" onClick="dateSelected(\'' + r.reporttime + '\',\'' + r.id + '\')">';

      if (r.type === 'Session') {
        html += "<img id='img-list-user' src='images/session.png'>";
      } else {
        html += "<img id='img-list-user' src='images/" + paramsObservation[r.source].image + ".png'>";
      }
      
      html += "<span class='title-list-reports'><strong>" + r.spot +"</strong></span>" +
                '<img src="images/flags/'+flags[r.country]+'" onClick="getLocation(\''+r.spot+'\')" width="15px" hspace="10px">' +
                moment(r.reporttime).calendar();
      
      if (r.hasimages === 1) { html += glyph('picture','i-report-attr') };
      if (r.crowds === "Mye") { html += glyph('user','i-report-attr') };
      if (r.isreference === 1) { html += glyph('star','i-report-attr') };
      if (r.iscold === 1) { html += glyph('snowflake','i-report-attr') };
      
      
      if (r.type === 'Observasjon'){
          if (r.source ==="Bomtur") {
            html += label(r.source,paramsObservation[r.source].class, 'label-score pull-right') + '</a>'      
          } else {
            html += glyph(paramsSurfable[r.issurfable].icon);
          }    
      } else {
          html += label(labels.score[r.score].label, labels.score[r.score].class,'label-score pull-right');
          
          html += '<span class="labels-report">'
          html += label(labels.wh[r.waveheight].label, labels.wh[r.waveheight].class,'label-report');
          html += label(labels.wp[r.waveperiod].label, labels.wp[r.waveperiod].class,'label-report');
          
          if(r.spot === 'Saltstein') {
            html += label(labels.wd[r.spot][r.wavedir].label, labels.wd[r.spot][r.wavedir].class,'label-report');
          } else {
            html += label(r.wavedir, 'default','label-report');
          }
          html += label(labels.ws[r.windspeed].label, labels.ws[r.windspeed].class,'label-report');
          html += label(labels.wdir[r.winddir].label, labels.wdir[r.winddir].class,'label-report');
          html += '</span>'           
      }
      $('#reportlist').html(html);
    }
    //setDefaultsFormSession();
  } else {
    showAlert('Innstillingene gir ingen treff på rapporter', 'Info', 'filter');
  }
}
    
function displayReport(reports) {
    var report = reports[0];

    if (report.type==="Session") {
        $('#report').html(htmlSession(report)); 
    }
    if (report.type==="Observasjon") {
        $('#report').html(htmlObservation(report));  
    }  
}

function htmlSession(report) { 
  return '<div id="panel-report" class="panel panel-square-dark" data-reportid="'+report.id +'">' +
          '<div class="panel-heading">' +
            htmlReportHeader(report) +
          '</div>' + // End header
          '<div class="panel-body-fluid">' +
            htmlCarousel('session',[
              htmlReportDescr(report), 
              htmlReportComment(report), 
              htmlReportWeather(report), 
              htmlReportBoard(report), 
              htmlReportCompare(report)],
              false) +
          '</div>' + //End body
          '<div class="panel-footer">' +
            htmlReportFooter(report) + 
          '</div>' + // End footer
        '</div>'; //End panel
}

function htmlReportHeader(report) {
  return '<img id="img-report-user" src="http://graph.facebook.com/'+report.userid+'/picture?type=normal" class="img-circle">'+
         '<span class="reporttitle"><h4>'+report.surfer+'</h4></span>'+
         '<span class="reportsubtitle">' + report.spot+','+report.duration+'t fra kl: '+moment(report.reporttime).format('HH:mm') + ' ' +
         '<span class="reporttide">' + report.tide + '</span>' + 
         label(paramsScore[report.score].label,paramsScore[report.score].class,'label-score pull-right');
}

function htmlReportFooter(report) {
  var htmlImages = '';
  if (report.hasimages==1) {
    htmlImages = htmlTool('report-image','picture','right', 'small','modal-images','modal');
  };
  
  return report.winddir + ' (' + report.windspeed +') ' +
         '| <img height="20px" src="images/swell_' + directionImages[report.wavedir] + '.png"> ' +
         report.waveheight + 'høyt med <span class="text-lowercase">' + report.waveperiod + '</span> periode' +
         htmlImages + htmlConfirmDelete();
}

function htmlReportDescr(report) {
  return '<h4>Beskrivelse</h4>' +
         '<p>' + report.descr + '</p>';
}

function htmlReportComment(report) {
  return '<h4>Kommentar</h4>' +
         '<p>' + report.forecast + '</p>';
}

function htmlReportWeather(report) {
 return   '<img id="img-wetsuit" src="images/wetsuit_full_markers.png">'+
          '<div id="txt-hood">' + report.hood + '</div>' +
          '<div id="txt-suit">' + report.suit + '</div>' + 
          '<div id="txt-gloves">'+ report.gloves + '</div>' +
          '<div id="txt-boots">' + report.boots + '</div>'+
          '<div id="txt-temp-air">Luft: ' + report.airtemp + '&#8451;</div>'+
          '<div id="txt-temp-water">Vann: ' + report.watertemp + '&#8451;</div>'+
          '<div id="txt-temp-descr">Beskrivelse: '+ report.temp + '</div>';
}

function htmlReportBoard(report) {
  var board = getObjInArray('model', report.board, userSettings.boards);

  if (typeof board === 'undefined') {
    return '<h4>' + report.board + '</h4>'
  } else {
    return '<img id="img-board" src="images/' + board.thumburl + '">' +
           '<div id="text-board-model"><h4>' + board.model + '</h4></div>' +
           '<div id="text-board-volume">Volum: ' + board.volume + 'l</div>' +
           '<div id="text-board-length">Lengde: ' + board.length + '</div>' +
           '<div id="text-board-width">Bredde: ' + board.width + '</div>' +
           '<div id="text-board-thicknesss">Tykkelse: ' + board.thickness + '</div>';
  }
}

function htmlReportCompare(report) {
  if (report.reporttime === TWIN.reporttime) {
    return '<h4>Tvillinginfo</h4><p>' +
            moment(getForecastTime('#time-dmi-today')).calendar() +
            ' er det mest sannsynlig <b>' + 
            TWIN.wavesize + '</b> bølger og <b>' +
            TWIN.windspeed + '</b> vind ' + 
            'enn denne økta.</p>' +
            '<b>Detaljer:</b></br>' +
            'Bølgehøyde: ' + TWIN.waveheight + 'm <br>' +
            'Bølgeperiode: ' + TWIN.waveperiod + 's <br>' +
            'Dønning: ' + TWIN.swellheight + 'm <br>' +
            'Periode: ' + TWIN.swellperiod + 's <br>' +
            'Lokalvind: ' + TWIN.wind + 'm/s <br>' +
            'Vind: ' + TWIN.swind + 'm/s';
  } else {
    return  '<div id="insert-twin-info">' +
            '<h4>Her vises kun info hvis rapporten er en tvilling til valgt tidspunkt</h4>' +
            '</div>';
  }
}


function htmlObservation(report) {
    var iconHTML = glyph(paramsObservation[report.issurfable]);
    var imagesHTML = "";
    
    if (report.hasimages==1){imagesHTML = htmlTool('report-image','picture','right', 'small','modal-images','modal');};

    return  '<div id="panel-report" class="panel panel-square-dark" data-reportid="'+report.id +'">' +
              '<div class="panel-heading">' +
                '<img id="img-report-user" src="http://graph.facebook.com/'+report.userid+'/picture?type=normal" class="img-circle">'+
                '<span class="reporttitle"><h4>'+report.surfer+'</h4></span>'+
                '<span class="reportsubtitle">' + report.spot+', kl: '+report.reporttime+
                '<span id="scoredisplay">' + iconHTML + '</span>' + 
              '</div>'+
              '<div class="panel-body-fluid">'+ //Start panel body
                '<div class="carousel-item">' +  
                  htmlReportDescr(report) +
                '</div>' +
              '</div>'+
              '<div class="panel-footer">Kilde: ' + report.source + imagesHTML + htmlConfirmDelete() + 
            '</div>'+
          '</div>'; //End panel
}

function displayImages(images) {
  var contentLists = imageLists(images);
  var webHTML = htmlCarousel('webcam', contentLists[0]);
  var imgHTML = htmlModal(
    'images', 
    'Bilder fra dagen', 
    htmlCarousel('report-images',contentLists[1]));
                     
  $('#s-modal-images').html(imgHTML);
  $('#img-webcam-surflog').html(webHTML);
  $("#webCarousel").carousel({interval: false});
  $("#imgCarousel").carousel({interval: false});
}

function imageLists(images) {
  var webList = [];
  var imgList = [];
  
  for (var i in images) {
    if (images[i].indexOf('.') > 0) { //Check if item is image file
      if (images[i].length > 14) {  
        webList.push('<img class="img-obs" src="'+urlImages+images[i]+'" alt="'+webList.length+'">');
      } else {      
        imgList.push('<img class="img-obs" src="'+urlImages+images[i]+'" alt="'+imgList.length+'">');    
      }
    }
  }
  return [webList, imgList];
}



function displaySun(times) {
  sunTimes["first"] = moment(utcToLocal(moment(times.results.civil_twilight_begin,'h:mm:ss a').toDate())).format('HH:mm');
  sunTimes["last"] = moment(utcToLocal(moment(times.results.civil_twilight_end,'h:mm:ss a').toDate())).format('HH:mm');
    
  let html = 'Første lys: ' + sunTimes.first;
  html += ' siste lys: ' + sunTimes.last;
  $('#sun').html(html);
}


function refreshWebCam() {
    var date = new Date();
    $('#img-webcam').attr('src', urlWebCam + '?a=' + date.getTime());
}

function updateTwin() {
  var spot = $('#ddown-nav-spots').val();
  var forecasttime = getForecastTime('#time-dmi-today');
  getTwin(forecasttime,spot);
}

function displayTwin(twin) {
  TWIN = twin;
  dateSelected(moment(twin.reporttime).format('YYYY-MM-DD'));

  var html = label(twin.reporttime + ' ' + 
                   paramsScore[twin.score].label, 
                   paramsScore[twin.score].class);

  $('#twin').html(html);
}

function submitSession() {
  var date = $('#datepicker').datepicker('getDate'); 
  if (date === null) { date = new Date() };

  var data = {
    "reporttime": moment(date).format('YYYY-MM-DD') + " " + $("#session-time").val(),
    "duration": Number($("#session-duration").val()),
    "userid": user.id,
    "surfer": user.name,
    "type": "Session",
    "country": $("#session-country").val(),
    "location": $("#session-location").val(),
    "spot": $("#session-spot").val(),
    "score": $('#session-score').prop('value'), 
    "tide": formatTide($("#session-tide").val(),$("#session-tidediff").val(),$("#session-tidetype").val()),
    "winddir": $("#session-winddir").prop('value'),
    "windspeed": $("#session-windspeed").prop('value'),
    "waveheight": $("#session-waveheight").prop('value'),
    "waveperiod": $("#session-waveperiod").prop('value'),
    "wavedir": $("#session-wavedir").val(),
    "descr": $("#session-descr").val(),
    "source": '',
    "forecast": $("#session-forecast").val(),
    "crowds": $("#session-crowds").prop('value'),
    "board": $("#session-board").val(),
    "suit": $("#session-suit").val(),
    "hood": $("#session-hood").prop('value'),            
    "boots": $("#session-boots").val(),
    "gloves": $("#session-gloves").val(),
    "watertemp": Number($("#session-watertemp").val()),
    "airtemp": Number($("#session-airtemp").val()),
    "temp": $("#session-tempdescr").val(),
    "iscold": Number($("#session-iscold").prop('value')),
    "isreference": Number($("#session-isreference").prop('value')),
    "issurfable": 1,
    "hasImages": postFiles('session-files', date)
  }

  postReport(data, 'session');
}

function formatTide(tide,diff,type) {
  if (diff === '0') {
    return tide + ' (' + type + ')';
  } else {
    return tide + ' ' + diff + ' (' + type + ')';  
  }
}

function submitObservation() {
  var date = $('#datepicker').datepicker('getDate'); 
  if (date === null) { date = new Date() };
      
  var data = {
    "reporttime": moment(date).format('YYYY-MM-DD') + " " + $("#obs-time").val(),
    "duration": 0,
    "userid": user.id,
    "surfer": user.name,
    "type": $("#obs-type").val(),
    "country": $("#obs-country").val(),
    "location": $("#obs-location").val(),
    "spot": $("#obs-spot").val(),
    "score": 0,
    "descr": $("#obs-descr").val(),
    "source": $("#obs-source").prop('value'),
    "isreference": Number($("#obs-isreference").prop('value')),
    "issurfable": Number($("#obs-issurfable").prop('value')),
    "hasimages": postFiles('obs-files', date)
  };   
  
  postReport(data, 'observation');
}

function postReport(data, reportType) {
  $.post(urlAPI + 'reports',data)
  .done(response => {
    showAlert('Ny rapport lagt til','success','cloud-upload')
    getReports(1,'');
    closeForm(reportType);
  })
  .fail(error => {
    alert("Skjema er ikke korrekt utfylt, rett opp og prøv igjen");
  })
}

function closeForm(name) {
  $('#form-report-' + name).find('input[type=text], textarea').val(''); //Clear form
  $('#modal-report-' + name).modal('toggle'); //Close form modal
}

function postFiles(elementId, date) {
  var url = urlAPI + 'images/' + moment(date).format('YYYY-MM-DD');
  var formdata = new FormData();
  var files = $("#" + elementId)[0].files;
  var hasimages = 0;
  for (var i = 0; i < files.length; i++) {
      formdata.append("files",files[i]);
      hasimages = 1;
  }
  
  if(hasimages === 1) {
    $.post({
      "url": url,
      "data": formdata,
      "processData": false,
      "contentType": false
    })
    .done(response => {
      showAlert('Opplasting av bilder/filer var vellykket', 'success', 'picture');
    })
    .fail(error => {
      showError(error, 
        'Opplasting av bilder feilet',
        'Failed to upload report form files to API');
    })
  }  
        
  return hasimages;
}

