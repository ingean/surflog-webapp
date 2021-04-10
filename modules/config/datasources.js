export const urlAPI = 'https://high-plating-184911.appspot.com/';
export const urlYr = 'https://www.yr.no/api/v0/locations/';
export const urlImages = 'http://storage.googleapis.com/observations/';
export const urlMSW = 'https://magicseaweed.com/';
export const urlMSWForecasts = 'https://charts-s3.msw.ms/archive/';
export const urlSunTimes = 'https://api.sunrise-sunset.org/json';

export const forecastSources = { 
  surflog: {
    url: "https://storage.googleapis.com/fcasts/",
    suffix: ".png",                    
    waveheight: "Waveheight",
    waveperiod: "Waveperiod",
    swellheight: "Swellheight",
    swellperiod: "Swellperiod",
    wind: "Wind",
    skagerak: "Skagerak",
    saltstein: "Saltstein"
  },
  dmi: {
    url: "http://ocean.dmi.dk/anim/plots/",
    suffix: "idf.1.png",
    waveheight: "hs.",
    waveperiod: "tp.",
    swellheight: "hsw.",
    swellperiod: "tsw.",
    wind: "win."
  },
  msw : {
    url: "https://charts-s3.msw.ms/archive/wave/940/7-",
    windurl: "https://charts-s3.msw.ms/archive/gfs/940/7-",
    suffix: ".gif",
    swellheight: "-1",
    wind: "-4",
    swellperiod: "-2"},
  yr: {
    url: "https://www.yr.no/sted/Hav/",
    suffix: "/marinogram.png",
    saltstein: "58,89305_9,87906",
    skagerak: "58,26417_9,59732"
  }
};
