const urlAPI = 'https://high-plating-184911.appspot.com/';
const urlImages = 'http://storage.googleapis.com/observations/';
const urlWebCam = 'http://8eed09c7286a.sn.mynetname.net:50005/cgi-bin/snapshot.cgi';

// Persist current forecast data
var gFCNow = {
  dmi: [],
  smhi: [],
  bw: [],
  yr: [],
  frost: []
}

// Presist forecast data for selected time period
var gFCSelected = {
  dmi: [],
  smhi: [],
  bw: [],
  yr: [],
  frost: []
}

// Presist forecast statistics
var gFCStats = {}

var TWIN = {};
var COUNTRIES = [];
var LOCATIONS = [];
var SPOTS = [];
var REPORTLATEST = {};

var user = {};
var sunTimes = {"first": "03:00","last": "22:00"};
var userSettings = {};








