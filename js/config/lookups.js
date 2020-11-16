const gUnits = {
  waveheight: 'm',
  waveperiod: 's',
  swellheight: 'm',
  swellperiod: 's',
  wind: 'm/s',
  waveheightforecast: 'm',
  waveheightmax: 'm'
};

const directionImages = {"Nord":"n","Nordvest":"nw","Vest":"w","Sørvest":"sw","Sør":"s","Sørøst":"se","Øst":"e","Nordøst":"ne"};
const tideImages = {"Ukjent":"tide_all","Lav - stigende": "tide_lr","Lav - synkende":"tide_ls","Middels - stigende":"tide_mr","Middels - synkende":"tide_ms","Høy - stigende":"tide_hr","Høy - synkende":"tide_hs"};
const flags = {"Norge":"norway.png", "Portugal":"portugal.png", "USA":"united-states-of-america.png", "Kanariøyene":"spain.png", "Spania":"spain.png", "Frankrike":"france.png", "Irland":"ireland.png", "Sri Lanka":"sri-lanka.png", "Indonesia":"indonesia.png"};
const paramsScore = {
  0: {label:"Flatt", class: "default"},
  1: {label:"Despo", class: "danger"},
  2: {label:"Dårlig", class: "warning"},
  3: {label:"Ok", class: "info"},
  4: {label:"Bra", class: "primary"},
  5: {label:"Episk", class: "success"}
};

const labels = {
  score: { 
    0: {label:"Flatt", class: "default"},
    1: {label:"Despo", class: "danger"},
    2: {label:"Dårlig", class: "warning"},
    3: {label:"Ok", class: "info"},
    4: {label:"Bra", class: "primary"},
    5: {label:"Episk", class: "success"}
  },
  wh: {
    'Kne': {label: 'Kne', class: 'danger'},
    'Midje': {label: 'Midje', class: 'warning'},
    'Skulder': {label: 'Skulder', class: 'success'},
    'Hode': {label: 'Hode', class: 'success'},
    'Over hode': {label: 'Over hode', class: 'info'}
  },
  wp: {
    'Lav': {label: 'Lav', class: 'danger'},
    'Middels': {label: 'Middels', class: 'info'},
    'Høy': {label: 'Høy', class: 'success'},
    'Veldig høy': {label: 'Veldig høy', class: 'success'}
  },
  wd: {
    'Saltstein': {
      'Sør': {label: 'Sør', class: 'info'},
      'Sørvest': {label: 'Sørvest', class: 'success'},
      'Vest': {label: 'Vest', class: 'info'},
      'Nordvest': {label: 'Nordvest', class: 'warning'},
      'Nord': {label: 'Nord', class: 'danger'},
      'Nordøst': {label: 'Nordøst', class: 'danger'},
      'Øst': {label: 'Øst', class: 'warning'},
      'Sørøst': {label: 'Sørøst', class: 'info'}
    } 
  },
  wdir: {
    'Onshore': {label: 'Onshore', class: 'danger'},
    'Crosshore': {label: 'Crosshore', class: 'info'},
    'Offshore': {label: 'Offshore', class: 'success'}
  },
  ws: {
    'Stille': {label: 'Stille', class: 'info'},
    'Bris': {label: 'Bris', class: 'success'},
    'Frisk bris': {label: 'Frisk bris', class: 'warning'},
    'Kuling': {label: 'Kuling', class: 'danger'},
  }
};


const paramsObservation = {
  "Øyenvitne": {class: "", image: "eye"},
  "Webkamera": {class: "", image: "webcam"},
  "Observasjoner": {class: "", image: "observation"},
  "Bomtur": {class: "danger", image: "notsurfable"}
}

const paramsSurfable = {
  0: {label: "Ikke surfbart", icon: "thumbs-down"},
  1: {label: "Surfbart", icon: "thumbs-up"}
}

const ForecastTypes = { 
  "SURFLOG" : {
    "url":"https://storage.googleapis.com/fcasts/",
    "suffix":".png",                    
    "waveheight":"Waveheight",
    "waveperiod":"Waveperiod",
    "wave":"Waveheight",
    "swellheight":"Swellheight",
    "swellperiod":"Swellperiod",
    "swell":"Swellheight",
    "wind":"Wind",
    "skagerak":"Skagerak",
    "saltstein":"Saltstein"
  },
  "DMI" : {
    "url":"http://ocean.dmi.dk/anim/plots/",
    "suffix":"idf.1.png",
    "waveheight":"hs.",
    "waveperiod":"tp.",
    "swellheight":"hsw.",
    "swellperiod":"tsw.",
    "wind":"win."
  },
  "MSW" : {
    "url":"https://charts-s3.msw.ms/archive/wave/940/7-",
    "wurl":"https://charts-s3.msw.ms/archive/gfs/940/7-",
    "suffix":".gif",
    "swellheight":"-1",
    "wind":"-4",
    "swellperiod":"-2"},
  "YR" : {
    "url":"https://www.yr.no/sted/Hav/",
    "suffix":"/marinogram.png",
    "saltstein":"58,89305_9,87906",
    "skagerak":"58,26417_9,59732"
  }
};

const monthsEn = {
  "januar":"January",
  "februar":"February",
  "mars":"March",
  "april":"April",
  "mai":"May",
  "juni":"June",
  "juli":"July",
  "august":"August",
  "september":"September",
  "oktober":"October",
  "november":"November",
  "desember":"December"
}

const forecastOptions = [
  {
    'name':'DMI from Surflog',
    'source':'surflog',
    'provider':'dmi',
    'navigation':true, 
    'footer':false,
    'categories': 
    [ 
      {
        'category':'wave',
        'title':'Bølger'
      },
      {
        'category':'swell',
        'title':'Dønning'
      },
      {
        'category':'wind',
        'title':'Vind'
      }
    ]
  },
  {
    'name':'MSW from history',
    'source':'history',
    'provider':'msw',
    'navigation':true, 
    'footer':true,
    'categories':
    [ 
      {
        'category':'swellheight',
        'title':'Dønning'
      },
      {
        'category':'swellperiod',
        'title':'Periode'
      },
      {
        'category':'wind',
        'title':'Vind'
      }
    ]
  },
  {
    'name':'Yr from Surflog',
    'source':'surflog',
    'provider':'yr',
    'navigation':false,
     'footer':false,
     'categories':
     [ 
      {
        'category':'skagerak',
        'title':'Skagerak'
      },
      {
        'category':'saltstein',
        'title':'Saltstein'
      }
    ]
  }
];