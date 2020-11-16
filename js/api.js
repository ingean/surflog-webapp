async function getUserSettings(userid) { //userid is Facebook id as string
  userSettings = await $.get(urlAPI + 'settings/' + userid).catch(error => {showError(error,
    'Oppstart feilet, klarte ikke hente brukerinstillinger for bruker',
    'Failed to get user settings for user with id'
    ,fbUserId);});
}


async function getForecasts(startTime = null, endTime = null, elementId = '', type = 'chart') {
  let html =  '<img id="img-fc-loader" src="images/loader.gif">';
  $('#interpretcontainer' + elementId).html(html);

  
  let spot = $('#ddown-nav-spots').val();
  
  let query = '';
  if (startTime && endTime) {
    var startTime = moment(startTime).format('YYYY-MM-DDT00:00:00');
    var endTime = moment(endTime).format('YYYY-MM-DDT23:00:00');
    query = `?starttime=${startTime}&endtime=${endTime}`;  
  }
  
  gFCStats = await $.get(urlAPI + 'statistics/forecasts').catch(error => {showError(error, 
    'Klarte ikke hente varsel-statistikk for spotter i Oslofjorden',
    'Failed to get forecast statistics all spots')})
  
  
  gFCNow.dmi = await $.get(`${urlAPI}forecasts/dmi${query}`).catch(error => {showError(error, 
    'Klarte ikke hente tolkede dmi varsler',
    'Failed to get DMI data from surflog')})
    
  createChartsDMI(gFCNow.dmi, spot, elementId);

  gFCNow.smhi = await $.get(`${urlAPI}forecasts/smhi${query}`).catch(error => {showError(error, 
    'Klarte ikke hente smhi observasjoner og varsler',
    'Failed to get SMHI data from surflog/smhi')})
    
  createChart(gFCNow.smhi, 'smhi', 'waveheight', spot, elementId);
  

  gFCNow.yr = await $.get(urlAPI + 'forecasts/yr').catch(error => {showError(error, 
    'Klarte ikke hente yr varsler',
    'Failed to get Yr data')})
    
  createChart(gFCNow.yr, 'yr', 'waveheight', spot, elementId);

  gFCNow.frost = await $.get(`${urlAPI}forecasts/frost${query}`).catch(error => {showError(error, 
    'Klarte ikke hente Frost vindobservasjoner',
    'Failed to get Frost data')})

  gFCNow.kv = await $.get(`${urlAPI}forecasts/kv${query}`).catch(error => {showError(error, 
    'Klarte ikke hente Kystvær vindobservasjoner',
    'Failed to get Kystverket wind data')})
    
  //createChart(gFCNow.frost, 'frost', 'wind', spot, elementId);
  createTable(gFCNow.frost, gFCNow.kv, '', elementId);

/* 

  gFCNow.bw = await $.get(`${urlAPI}forecasts/bw${query}`).catch(error => {showError(error, 
    'Klarte ikke hente Barentswatch-varsler',
    'Failed to get BW-data from surflog/barentswatch')})
    
  createChart(gFCNow.bw, 'bw', 'waveheight', spot, elementId); 
  
  */

  $('#img-fc-loader').remove();
}

function getForecastsForDate(datestring,targetId = '', type = 'chart') { 
  var starttime = moment(datestring).format('YYYY-MM-DDT00:00:00');
  var endtime = moment(datestring).format('YYYY-MM-DDT23:00:00');  
  
  getForecasts(starttime,endtime,targetId,type);
}


function initReports() {
  Promise.all([
    getRequest('reports'),
    getRequest('places/countries'),
    getRequest('places/locations'),
    getRequest('places/spots')
  ])
  .then(results => {    
    let response = results[0].data;
    let count = Number(results[0].xhr.getResponseHeader('X-Total-Count'));
    displayPagination(count, response);

    COUNTRIES = jsonToArray(results[1].data, 'country');
    LOCATIONS = jsonToArray(results[2].data, 'location');
    SPOTS = jsonToArray(results[3].data, 'spot');

    inputsReports[0].domain = arrayToDomain(COUNTRIES, 'Norge');
    inputsReports[1].domain = arrayToDomain(LOCATIONS, 'Oslofjorden');
    inputsReports[2].domain = arrayToDomain(SPOTS, 'Saltstein');

    createFormFilter(); 
    displaySpotSelector(SPOTS);
    createFormObservation();
    createFormSession();   
  })
  .catch(error => {
    showError(error,'Oppstart av rapporter feilet','Failed to get data for reports, countries, locations and sposts at startup');
  })
}


/* 

function getForecasts(starttime,endtime,targetId = '',type = 'chart') { 
  var url = encodeURI(urlAPI + 'forecasts?starttime=' + 
                      moment(starttime).format('YYYY-MM-DDTHH:00:00') + 
                      '&endtime=' + moment(endtime).format('YYYY-MM-DDTHH:00:00'));
  makeRequest('GET',url)
  .then(xhr => {
    FORECASTSCOMPARE = JSON.parse(xhr.response);
    displayForecasts(JSON.parse(xhr.response),targetId,type);
  })
  .catch(error => {
    showError(error,
      'Klarte ikke hente varsler for perioden',
      'Failed to get forecasts between',
      moment(starttime).format('YYYY-MM-DDTHH:00:00') + ' til: ' + moment(endtime).format('YYYY-MM-DDTHH:00:00')
    );
  });
}

function getForcastsForSessions(source = 'dmi') {
  //makeRequest('GET',urlAPI + 'forecasts/reports?source=' + source)
  makeRequest('GET','http://localhost:8080/forecasts/reports?source=' + source)
    .then(xhr => {validateScoringModel(JSON.parse(xhr.response));})
    .catch(error => {showError(error,
                               'Klarte ikke hente varsler for rapporter fra kilde',
                               'Failed to get forecasts for sessions from source',
                               source);});
} */


//--------REPORTS---------------------------------
function getReports(page,query) { //location as string e.g. all
    var url = urlAPI + 'reports?page=' + page;
    if (typeof query != 'undefined') {url += '&' + query};
    
    makeRequest('GET',url)
    .then(xhr => {
        let count = Number(xhr.getResponseHeader('X-Total-Count'));
        displayPagination(count, JSON.parse(xhr.response), query);
    })
    .catch(error => {showError(error,
                               'Klarte ikke hente rapporter for side', 
                               'Failed to get reports for pagination for page',
                               page);});
}

function getReportsPage(page,query) { //location as string e.g. all
    var url = urlAPI + 'reports?page=' + page;
    if (typeof query != 'undefined') {url += '&' + query};
    
    makeRequest('GET',url)
    .then(xhr => {displayReportList(JSON.parse(xhr.response));})
    .catch(error => {showError(error,
                               'Klarte ikke hente rapporter for side', 
                               'Failed to get reports for page',
                               page);});
}

function getTwin(forecasttime, spot = 'Saltstein', source = 'dmi') {
  var url = urlAPI + 'forecasts/' + source + '/' +
            moment(forecasttime).format('YYYY-MM-DDTHH:00:00') +
            '/twin?spot=' + spot;
            
  makeRequest('GET',url)
  .then(xhr => {displayTwin(JSON.parse(xhr.response));})
  .catch(error => {showError(error,
                              'Klarte ikke hente twilling for tidspunkt', 
                              'Failed to find twin for time',
                              forecasttime);});
}

function getReport(id,callback) {
    makeRequest('GET',urlAPI + 'reports/'+id)
    .then(xhr => {callback(JSON.parse(xhr.response));})
    .catch(error => {showError(error,
                               'Klarte ikke hente rapport', 
                               'Failed to get report with id',
                               id);});
}

function getReportsByDate(datestring) { //datestring is date as string: e.g. 2017-05-11
  getRequest('reports?datestring=' + datestring)
  .then(result => { 
    if (result.data.constructor == Array) {
      getReportsAndImages(datestring, result.data[0].id)
    }
  })
  .catch(error => {showError(error,
                            'Klarte ikke hente rapport(er)', 
                            'Failed to get reports for date',
                            datestring);});
}

function getReportsAndImages(datestring,id) { //datestring format e.g. 2017-05-10
    if (id !== undefined) {getReport(id,displayReport) } 
    else {getReportsByDate(datestring)}
    getImages(datestring);
}

function addReport(report) { //Adds a report to the database
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 201) {
      showAlert('Ny rapport lagt til','success','cloud-upload')
      getReports(1,'');
    } else {
      showError(error,
              'Lagring av rapport feilet',
              'Failed to upload report form data to API');
    }
  }
  xhr.open("POST", urlAPI + "reports",true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(report);
}

function deleteReport() { //Delete report from database
    let id = $('#panel-report').attr('data-reportid');
    makeRequest('DELETE',urlAPI + 'reports/' + id)
    .then(xhr => {
        $('#report').html(''); //Empty report display
        showAlert('Rapport slettet','alert alert-danger','trash')
        return getReports(1,'');
    })
    .catch(error => {showError(error,
                               'Klarte ikke slette rapport',
                               'Failed to delete report with id',
                               id);});
}

//--------FILES---------------------------------
function addFiles(data,datestring) { //datestring format e.g. 2017-05-10
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      showAlert('Filer er lastet opp','success','picture')
    } else {
      showError(error,
                'Lagring av bilder feilet',
                'Failed to upload report form files to API');
    }
  }
  xhr.open('POST', urlAPI + 'images/'+datestring,true);
  xhr.send(data);
}

function getImages(datestring) { //datestring format e.g. 2017-05-10
    makeRequest('GET',urlAPI + 'images/'+datestring)
    .then(xhr => {return displayImages(JSON.parse(xhr.response));})
    .catch(error => {return;});
}

function saveWebCam() { //Upload current WebCam image to Google Cloud
    makeRequest('GET',urlAPI + 'savewebcam')
    .then(xhr => {
        showAlert('Bilde fra webkamera er lagret','success','camera');
        getImages(moment(new Date()).format('YYYY-MM-DD')); //Refresh webcam image carousel
        return;
    })
    .catch(error => {
      showError(error,
                'Klarte ikke lagre bildet fra webkamera',
                'Failed to save webcam image');
      return;
    });
}

//Statistics for a user
function getReportsStatsUser(userid){
    makeRequest('GET',urlAPI + 'statistics/reports?userid=' + userid)
    .then(xhr => {return displayUserStats(JSON.parse(xhr.response));})
    .catch(error => {showError(error,
                               'Klarte ikke hente statistikk for bruker',
                               'Failed to get statistics for user with id',
                               userid);});
}

//Statistics for a location
function getReportsStatsSpot(spot){
    makeRequest('GET',urlAPI + 'statistics/reports?spot=' + spot)
    .then(xhr => {return displayLocation(JSON.parse(xhr.response),spot);})
    .catch(error => {showError(error,
                               'Klarte ikke hente statistikk for spot', 
                               'Failed to get statistics for spot',
                               spot);});
}

//--------SUNRISE AND SUNSET---------------------------------
function getSunriseSet(datestring) { //datestring is date as string e.g. 2017-05-11
    makeRequest('GET','https://api.sunrise-sunset.org/json?lat=58.8930500&lng=9.8790600&date=' + datestring)
    .then(xhr => {displaySun(JSON.parse(xhr.response));})
    .catch(error => {showError(error,
                               'Klarte ikke hente solopp/-nedgang for',
                               'Failed to get sunrise/set for datestring', 
                               moment(datestring).format('DD.MM.YYYY'));});
}

//--------Tides and water level----------------------------
function getTides(date,type) {//date is date object
    let start = moment(date).format('YYYY-MM-DD');
    let end = moment(date).add(1,'days').format('YYYY-MM-DD');
    let url = 'https://api.sehavniva.no/tideapi.php?lat=58.9674138888889&lon=9.86748055555556&fromtime=' + start + 'T00%3A00&totime=' + end + 'T00%3A00&datatype=' + type + '&refcode=cd&place=HRO&file=&lang=nn&interval=10&dst=1&tzone=1&tide_request=locationdata';

    makeRequest('GET',url)
    .then(xhr => {displayTides(xhr.response);})
    .catch(error => {showError(error,
                                  'Klarte ikke hente tidevannsdata for', 
                                  'Failed to get tide for date',
                                   moment(date).format('DD-MM-YYYY'));});
}

//Make a http request to a web service
function makeRequest (method, url) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr);
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        }
      };
      xhr.onerror = function () {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      };
      xhr.send();
    });
  }


  function getRequest(urlParams) {
    return new Promise((resolve, reject) => {
      $.get(urlAPI + urlParams)
      .done((data, status, xhr) => {
        resolve({
          data: data, 
          status: status,
          xhr: xhr})
      })
      .fail(error => {
        reject(error)
      })
    })
  }

  