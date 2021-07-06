export const urlAPI = 'https://high-plating-184911.appspot.com/';
export const urlYr = 'https://www.yr.no/api/v0/locations/';
export const urlImages = 'http://storage.googleapis.com/observations/';
export const urlMSW = 'https://magicseaweed.com/';
export const urlSunTimes = 'https://api.sunrise-sunset.org/json';

const unitHeight = {
  unit: 'm',
  precision: 1,
  up: 'større',
  down: 'mindre'
}

const unitPeriod = {
  unit: 's',
  precision: 0,
  up: 'lengre',
  down: 'kortere'
}

const unitSpeed = {
  unit: 'm/s',
  precision: 0,
  up: 'mer',
  down: 'mindre'
}

const unitPressure = {
  unit: 'hpa',
  precision: 0,
  up: 'høyere',
  down: 'lavere'
}

const unitDir = {
  unit: '',
  precision: 0,
  up: '',
  down: ''
}

const unitTemp = {
  unit: '°',
  precision: 0,
  up: 'varmere',
  down: 'kaldere'
}

export const forecasts = { 
  surflog: {
    baseUrl: 'https://storage.googleapis.com/fcasts/',
    imgFormat: 'png',          
  },
  dmi: { 
    baseUrl: 'http://ocean.dmi.dk/anim/plots/',
    suffix: 'idf.1.',
    imgFormat: 'png',
    params: [
      {id: 'waveheight', caption: 'Bølgehøyde', unit: unitHeight, type: 'hs.', panel: true}, 
      {id: 'waveperiod', caption: 'Bølgeperiode', unit: unitPeriod, type: 'tp.'}, 
      {id: 'swellheight', caption: 'Dønning', unit: unitHeight, type: 'hsw.', panel: true}, 
      {id: 'swellperiod',  caption: 'Dønning', unit: unitPeriod, type: 'tsw.'}, 
      {id: 'wind', caption: 'Vind', unit: unitSpeed, type: 'win.', panel: true}
    ]  
  },
  msw : {
    baseUrl: 'https://charts-s3.msw.ms/archive/',
    prefix: '7-',
    size: 940,
    imgFormat: 'gif',
    params: [
      {id: 'wave', caption: 'Dønning', unit: unitHeight, type: 'wave', subtype: 24, panel: true },
      {id: 'period', caption: 'Periode', unit: unitPeriod, type: 'wave', subtype: 25, panel: true },
      {id: 'wind', caption: 'Vind', unit: unitSpeed, type: 'gfs', subtype: 4, panel: true },
      {id: 'pressure', caption: 'Trykk', unit: unitPressure, type: 'gfs', subtype: 3, panel: true },
    ]
  },
  yr: {
    baseUrl: 'https://www.yr.no/sted/Hav/',
    suffix: '/marinogram.',
    imgFormat: 'png',
    params: [
      {id: 'skagerak', caption: 'Skagerak', pos: '58,26417_9,59732', panel: true}, 
      {id: 'saltstein', caption: 'Saltstein', pos: '58,89305_9,87906', panel: true}
    ]
  },
  yrCoast: {
    baseUrl: 'https://www.yr.no/api/v0/locations/',
    proxyUrl: 'https://high-plating-184911.appspot.com/proxy/yr',
    params: [
      {id: 'wind', caption: 'Vind', unit: unitSpeed},
      {id: 'gust', caption: 'Vindkast', unit: unitSpeed},
      {id: 'currentSpeed', caption: 'Strøm', unit: unitSpeed},
      {id: 'pressure', caption: 'Lufttrykk', unit: unitPressure}
    ]
  },
  met: {
    url: 'https://api.met.no/weatherapi/oceanforecast/2.0/complete',
    locations: [
      {name: "Oslofjorden", lat:"59.307995", lon:"10.578443"},
      {name: "Saltstein", lat:"58.892235", lon:"9.888914"},
      {name: "Skagerak", lat:"58.26443", lon:"9.5951"}
    ],
    params: [
      {id: 'wavedir', sourceId: 'sea_surface_wave_from_direction', caption: 'Bølgeretning', unit: unitDir},
      {id: 'waveheight', sourceId: 'sea_surface_wave_height', caption: 'Bølgehøyde', unit: unitHeight},
      {id: 'currentSpeed', sourceId: 'sea_water_speed', caption: 'Strøm', unit: unitSpeed},
      {id: 'watertemp', sourceId: 'sea_water_temperature', caption: 'Vanntemp', unit: unitTemp},
      {id: 'current', sourceId: 'sea_water_to_direction', caption: 'Strømretning', unit: unitDir}
    ]
  },
  smhi: {
    params: [
      {id: 'waveheight', caption: 'Bølgehøyde', unit: unitHeight}, 
      {id: 'waveperiod', caption: 'Bølgeperiode', unit: unitPeriod},
      {id: 'wavedir', caption: 'Bølgeretning', unit: unitDir}, 
      {id: 'waveheightforecast', caption: 'Bølgehøyde, varsel', unit: unitHeight},
      {id: 'waveheightmax', caption: 'Bølgehøyde, maks', unit: unitHeight}
    ]
  },
  uk: {
    url: "http://datapoint.metoffice.gov.uk/public/data/val/wxmarineobs/all/json/",
    apiKey: "5ae6dfd7-726f-4873-ba73-1651ff663a8e",
    locations: [{id:'162304', name: 'Sandettie'}, {id: '162170', name: 'F3'}]
  }, 
  dmiObs: {
    url: 'https://dmigw.govcloud.dk/v2/metObs/collections/observation/items',
    apiKey: '279fa355-ec19-49ba-9ab6-e1e455876329',
    locations: [{id: '06081', name: 'Blåvandshuk Fyr'},{id: '06052', name: 'Thyborøn'},{id: '06041', name: 'Skagen Fyr'},{id: '06079', name: 'Anholt Havn'},{id: '06168', name: 'Nakkehoved Fyr'}],
    params: [{id: 'wind_speed_past1h', caption: 'Vind'}, {id: 'wind_gust_always_past1h', caption: 'Vindkast'}, {id: 'wind_dir_past1h', caption: 'Vindretning'}]
  }
};

export function imgPanels(source) {
  let params = forecasts[source].params
  return params.filter(p => p.panel === true)
}

export function forecastParam(source, param) {
  let params = forecasts[source].params
  return params.find(p => p.id === param)
}

export function forecastParamAll(param) {
  let sources = ['dmi', 'msw', 'yr', 'yrCoast', 'smhi']
  for(let source of sources) {
    let params = forecasts[source].params
    let result = params.find(p => p.id === param)
    if(result) {
      return result
    } 
  }
}
