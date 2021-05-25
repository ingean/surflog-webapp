export const urlAPI = 'https://high-plating-184911.appspot.com/';
export const urlYr = 'https://www.yr.no/api/v0/locations/';
export const urlImages = 'http://storage.googleapis.com/observations/';
export const urlMSW = 'https://magicseaweed.com/';
export const urlMSWForecasts = 'https://charts-s3.msw.ms/archive/';
export const urlSunTimes = 'https://api.sunrise-sunset.org/json';

export const forecasts = { 
  surflog: {
    imgUrl: "https://storage.googleapis.com/fcasts/",
    imgSuffix: ".png",
    params: ['waveheight', 'waveperiod', 'swellheight', 'swellperiod', 'wind', 'skagerak', 'saltstein']                    
  },
  dmi: { 
    imgUrl: "http://ocean.dmi.dk/anim/plots/",
    imgSuffix: "idf.1.png",
    params: ['waveheight', 'waveperiod', 'swellheight', 'swellperiod', 'wind'],   
    waveheight: "hs.",
    waveperiod: "tp.",
    swellheight: "hsw.",
    swellperiod: "tsw.",
    wind: "win."
  },
  msw : {
    imgUrl: "https://charts-s3.msw.ms/archive/wave/940/7-",
    imgwUrlWind: "https://charts-s3.msw.ms/archive/gfs/940/7-",
    imgSuffix: ".gif",
    params: ['swellheight', 'swellperiod', 'wind'],
    swellheight: "-1",
    wind: "-4",
    swellperiod: "-2"},
  yr: {
    imgUrl: "https://www.yr.no/sted/Hav/",
    imgSuffix: "/marinogram.png",
    params: ['skagerak', 'saltstein'],
    saltstein: "58,89305_9,87906",
    skagerak: "58,26417_9,59732"
  },
  uk: {
    url: "http://datapoint.metoffice.gov.uk/public/data/val/wxmarineobs/all/json/",
    apiKey: "5ae6dfd7-726f-4873-ba73-1651ff663a8e",
    locations: [{id:'162304', name: 'Sandettie'}, {id: '162170', name: 'F3'}]
  }
};
