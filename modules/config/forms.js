export const scores = [
  {value: 0, caption: 'Flatt', rating: 0, color: '#eeeeee'},
  {value: 1, caption: 'Despo', rating: 1, color: '#E1576F'},
  {value: 2, caption: 'Dårlig', rating: 2, color: '#F19A37'},
  {value: 3, caption: 'OK', rating: 3, color: '#62D37E'},
  {value: 4, caption: 'Bra', rating: 4, color: '#409173', default: true},
  {value: 5, caption: 'Episk', rating: 5, color: '#6452EB'}
];

const locType = [
  {caption: 'Land', value: 'country'},
  {caption: 'Område', value: 'location'},
  {caption: 'Spot', value: 'spot', default: true}
];

const crowds = [
  {caption: 'Lite', rating: 5},
  {caption: 'Normalt', rating: 3, default: true},
  {caption: 'Mye', rating: 0}
];

const tides = [
  {caption: 'Høyvann'},
  {caption: 'Lavvann'},
  {caption: 'Ukjent', default: true}
];

const tidesFilter = [
  {caption: 'Høyvann'},
  {caption: 'Lavvann'},
  {caption: 'Mellom', default: true}
];

const tideDiffs = [
  {caption: '-3t'},
  {caption: '-2t'},
  {caption: '-1t'},
  {caption: '0', default: true},
  {caption: '+1t'},
  {caption: '+2t'},
  {caption: '+3t'}
];

const tideTypes = [
  {caption: 'Normal'},
  {caption: 'Spring'},
  {caption: 'Nipp'},
  {caption: 'Ukjent', default: true}
];

const winddir = [
  {caption: 'Onshore', rating: 1, default: true},
  {caption: 'Crosshore', rating: 3},
  {caption: 'Offshore', rating: 5}
];

const windspeed = [
  {caption: 'Kuling', rating: 1},
  {caption: 'Frisk bris', rating: 2, default: true},
  {caption: 'Bris', rating: 4},
  {caption: 'Stille', rating: 5}
];

const waveheight = [
  {caption: 'Kne', rating: 2},
  {caption: 'Midje', rating: 3, default: true},
  {caption: 'Skulder', rating: 4},
  {caption: 'Hode', rating: 5},
  {caption: 'Over hode', rating: 4}
];

const waveperiod = [
  {caption: 'Lav', rating: 1},
  {caption: 'Middels', rating: 2, default: true},
  {caption: 'Høy', rating: 4},
  {caption: 'Veldig høy', rating: 5}
];

const wavedir = [
  {caption: 'Sør', rating: 0},
  {caption: 'Sørvest', rating: 0, default: true},
  {caption: 'Vest', rating: 0},
  {caption: 'Nordvest', rating: 0},
  {caption: 'Nord', rating: 0},
  {caption: 'Nordøst', rating: 0},
  {caption: 'Øst', rating: 0},
  {caption: 'Sørøst', rating: 0}
];

const closeout = [
  {caption: 'Ukjent', rating: 0},
  {caption: 'Veldig ofte', rating: 1},
  {caption: 'Ofte', rating: 2},
  {caption: 'Normalt', rating: 3, default: true},
  {caption: 'Skjelden', rating: 4},
  {caption: 'Veldig skjelden', rating: 5}
];

const consistency = [
  {caption: 'Ukjent', rating: 0},
  {caption: 'Lange pauser', rating: 2},
  {caption: 'Litt pauser', rating: 3, default: true},
  {caption: 'Lite pauser', rating: 4},
  {caption: 'Ingen pauser', rating: 5}
];

const wavecount = [
  {caption: 'Ukjent', rating: 0},
  {caption: 'Velig lav', rating: 1},
  {caption: 'Lav', rating: 2},
  {caption: 'Ok', rating: 3, default: true},
  {caption: 'Høy', rating: 4},
  {caption: 'Veldig høy', rating: 5}
];

const shape = [
  {caption: 'Ukjent', rating: 0},
  {caption: 'Veldig rotete', rating: 1},
  {caption: 'Rotete', rating: 2},
  {caption: 'Ok', rating: 3, default: true},
  {caption: 'Cleant', rating: 4},
  {caption: 'Glassy', rating: 5}
];

const push = [
  {caption: 'Ukjent', rating: 0},
  {caption: 'Veldig slapt', rating: 1},
  {caption: 'Slapt', rating: 2},
  {caption: 'Ok', rating: 3, default: true},
  {caption: 'Kraftig', rating: 4},
  {caption: 'Veldig kraftig', rating: 5}
];

const size = [
  {caption: 'Ukjent', rating: 0},
  {caption: 'For lite', rating: 1},
  {caption: 'Lite', rating: 2},
  {caption: 'Medium', rating: 4, default: true},
  {caption: 'Stort', rating: 3},
  {caption: 'Veldig stort', rating: 2},
  {caption: 'For stort', rating: 1},
];

const boards = [
  {caption: 'Lost RNF96', default: true, volume: 36.5, length: "5'11", width: 21, thickness: 2.6, fins: 'Twin + trailer', type: 'Groveler', material: 'PU'},
  {caption: 'Lost Little Wing', volume: 32, length: "6'0", width: 20.13, thickness: 2.53, fins: 'Thruster', type: 'Shortboard', material: 'PU'},
  {caption: 'Machado Seaside', volume: 33.6, length: "5'7", width: "21 5/8" , thickness: 2.5, fins: 'Quad / Twin', type: 'Groveler', material: 'Epoxy'},
  {caption: 'FW Dominator II', volume: 31.5, length: "5'9", width: '20 1/8', thickness: "2 7/16", fins: 'Thruster / Quad', type: 'Groveler', material: 'Epoxy'},
  {caption: 'OE Longboard', volume: 94, length: "9'0", width: 23, thickness: 3.5, fins: 'Thruster', type: 'Longboard', material: 'Softtop'},
  {caption: 'Annet'}
];

const suits = [
  {caption: '6/5'},
  {caption: '5/4'},
  {caption: '4.5/3.5'},
  {caption: '4/3', default: true},
  {caption: '3/2'},
  {caption: 'Shortie'},
  {caption: 'Vest'},
  {caption: 'Boardies'}
];

const gloves = [
  {caption: 'Nei', default: true},
  {caption: '7 vott'},
  {caption: '5 vott'},
  {caption: '5 hanske'},
  {caption: '4'},
  {caption: '3'},
  {caption: '2'}
];

const boots = [
  {caption: 'Nei', default: true},
  {caption: '7'},
  {caption: '5'},
  {caption: '3'},
  {caption: 'Reefboots'}
];

const sources = [
  {caption: 'Observasjoner'},
  {caption: 'Webkamera', default: true},
  {caption: 'Øyenvitne'},
  {caption: 'Bomtur'}
];

const types = [
  {caption: 'Treningsdata'},
  {caption: 'Observasjon', default: true}
];

const yesNo = [
  {caption: 'Ja', value: 1},
  {caption: 'Nei', value: 0, default: true}
];

const domains = {
  score: scores,
  closeout: closeout, 
  consistency: consistency,
  wavecount: wavecount,
  shape: shape,
  push: push,
  size: size,
  waveheight: waveheight,
  waveperiod: waveperiod,
  wavedir: wavedir,
  winddir: winddir,
  windspeed: windspeed
}

export const slRating = [
  {caption: 'VERY POOR'},
  {caption: 'POOR'},
  {caption: 'POOR TO FAIR'},
  {caption: 'FAIR', default: true},
  {caption: 'FAIR TO GOOD'},
  {caption: 'GOOD'},
  {caption: 'EPIC'}
]

function forms(session, observation, filter) {
  return {
    session: session,
    observation: observation,
    filter: filter
  }
}

export const tabNamesSession = ['Lokasjon', 'Forhold', 'Vurdering', 'Merker', 'Utstyr', 'Varsel']
export const tabNamesObs = ['Vurdering', 'Varsel']

export var formsOptions = [
  {name: 'loctype', save: false, type: 'btn', tab: 1, caption: 'Type sted', domain: locType, forms: forms(false, false, true)},
  {name: 'country', save: true, type: 'datalist', tab: 1, size: 6, caption: 'Land', forms: forms(true, true, false)},
  {name: 'location', save: true, type: 'datalist', tab: 1, size: 6, caption: 'Område', forms: forms(true, true, false)},
  {name: 'spot', save: true, type: 'datalist', tab: 1, size: 6, caption: 'Spot', forms: forms(true, true, true)},
  {name: 'crowds', save: false, type: 'btn', tab: 1, caption: 'Crowds', domain: crowds, forms: forms(true, false, true)},
  {name: 'reporttime', save: false, type: 'time', tab: 1, size: 6, caption: 'Starttid', forms: forms(true, true, false)},
  {name: 'duration', save: false, type: 'number', tab: 1, size: 6, caption: 'Varighet', units: 't', forms: forms(true, false, false)},
  {name: 'source', save: false, type: 'btn', tab: 1, caption: 'Kilde', domain: sources, forms: forms(false, true, true)},
  {name: 'tidesFilter', save: false, type: 'btn', tab: 1, caption: 'Tidevann', domain: tidesFilter, forms: forms(false, false, true)},
  {name: 'tidestart', save: false, type: 'number', tab: 1, size: 6, caption: 'Tidevannsnivå, start', units: 'm', forms: forms(true, false, false)},
  {name: 'tideend', save: false, type: 'number', tab: 1, size: 6, caption: 'Tidevannsnivå, slutt', units: 'm', forms: forms(true, false, false)},
  {name: 'tide', save: false, type: 'btn', tab: 1, caption: 'Tidevann', domain: tides, forms: forms(true, false, false)},
  {name: 'tidediff', save: false, type: 'btn', tab: 1, caption: 'Differanse', domain: tideDiffs, forms: forms(true, false, false)},
  {name: 'tidetype', save: false, type: 'btn', tab: 1, caption: 'Type', domain: tideTypes, forms: forms(true, false, false)},
  {name: 'winddir', save: true, type: 'btn', tab: 2, caption: 'Vindretning', domain: winddir, forms: forms(true, false, true)},
  {name: 'windspeed', save: true, type: 'btn', tab: 2, caption: 'Vindstyrke', domain: windspeed, forms: forms(true, false, true)},
  {name: 'waveheight', save: true, type: 'btn', tab: 2, caption: 'Bølgehøyde', domain: waveheight, forms: forms(true, false, true)},
  {name: 'waveperiod', save: true, type: 'btn', tab: 2, caption: 'Bølgeperiode', domain: waveperiod, forms: forms(true, false, true)},
  {name: 'wavedir', save: true, type: 'select', tab: 2, caption: 'Bølgeretning', domain: wavedir, forms: forms(true, false, true)},
  {name: 'score', save: true, type: 'btn', tab: 3, caption: 'Score', domain: scores, forms: forms(true, false, true)},
  {name: 'descr', save: false, type: 'textarea', tab: 3, caption: 'Beskrivelse', forms: forms(true, true, false)},
  {name: 'forecast', save: false, type: 'textarea', tab: 3, caption: 'Kommentar', forms: forms(true, false, false)},
  {name: 'closeout', save: true, type: 'btn', tab: 4, caption: 'Closeouts', domain: closeout, forms: forms(true, false, true)},
  {name: 'consistency', save: true, type: 'btn', tab: 4, caption: 'Bølgefrekvens', domain: consistency, forms: forms(true, false, true)},
  {name: 'wavecount', save: true, type: 'btn', tab: 4, caption: 'Wavecount', domain: wavecount, forms: forms(true, false, true)},
  {name: 'shape', save: true, type: 'btn', tab: 4, caption: 'Shape', domain: shape, forms: forms(true, false, true)},
  {name: 'push', save: true, type: 'btn', tab: 4, caption: 'Push', domain: push, forms: forms(true, false, true)},
  {name: 'size', save: true, type: 'btn', tab: 4, caption: 'Størrelse', domain: size, forms: forms(true, false, true)},
  {name: 'files', save: false, type: 'file', tab: 4, caption: 'Bilder', forms: forms(true, true, false)},
  {name: 'isreference', save: false, type: 'btn', tab: 4, caption: 'Referanse', domain: yesNo, forms: forms(true, true, true)},
  {name: 'board', save: true, type: 'select', tab: 5, caption: 'Brett', domain: boards, forms: forms(true, false, false)},
  {name: 'suit', save: true, type: 'select', tab: 5, size: 4, caption: 'Drakt', domain: suits, forms: forms(true, false, false)},
  {name: 'gloves', save: true, type: 'select', tab: 5, size: 4, caption: 'Hansker', domain: gloves, forms: forms(true, false, false)},
  {name: 'boots', save: true, type: 'select', tab: 5, size: 4, caption: 'Booties', domain: boots, forms: forms(true, false, false)},
  {name: 'hood', save: true, type: 'btn', tab: 5, caption: 'Hette', domain: yesNo, forms: forms(true, false, false)},
  {name: 'airtemp', save: true, type: 'number', tab: 5, size: 6, caption: 'Lufttemperatur', units: '°', forms: forms(true, false, false)},
  {name: 'watertemp', save: true, type: 'number', tab: 5, size: 6, caption: 'Vanntemperatur', units: '°', forms: forms(true, false, false)},
  {name: 'temp', save: false, type: 'textarea', tab: 5, caption: 'Beskrivelse', forms: forms(true, false, false)},
  {name: 'issurfable', save: false, type: 'btn', tab: 1, caption: 'Surfbart', domain: yesNo, forms: forms(false, true, true)},
  {name: 'iscold', save: false, type: 'btn', tab: 5, caption: 'Kald', domain: yesNo, forms: forms(true, false, true)},
  {name: 'type', save: false, type: 'btn', tab: 1, caption: 'Type', domain: types, forms: forms(false, true, false)},
  {name: 'forecastimage', save: false, type: 'imgToTxt', tab: 6, caption: 'Hent forslag fra bilde', forms: forms(true, true, false)},
  {name: 'forecasttime', save: false, type: 'time', tab: 6, caption: 'Tidspunkt for varslet', forms: forms(true, true, false)},
  {name: 'waveheight_from', save: false, type: 'number', tab: 6, size: 6, caption: 'Surf from', units: 'm', forms: forms(true, true, false)},
  {name: 'waveheight_to', save: false, type: 'number', tab: 6, size: 6, caption: 'Surf to', units: 'm', forms: forms(true, true, false)},
  {name: 'rating', save: false, type: 'select', tab: 6, caption: 'Rating', domain: slRating, forms: forms(true, true, false)},
  {name: 'swellheight', save: false, type: 'number', tab: 6, size: 4, caption: 'Waveheight', units: 'm', forms: forms(true, true, false)},
  {name: 'swellperiod', save: false, type: 'number', tab: 6, size: 4, caption: 'Waveperiod', units: 's', forms: forms(true, true, false)},
  {name: 'swelldir', save: false, type: 'number', tab: 6, size: 4, caption: 'Wavedirection', units: 'arrow', forms: forms(true, true, false)},
  {name: 'subswellheight', save: false, type: 'number', tab: 6, size: 4, caption: 'Secondary waveheight', units: 'm', forms: forms(true, true, false)},
  {name: 'subswellperiod', save: false, type: 'number', tab: 6, size: 4, caption: 'Secondary waveperiod', units: 's', forms: forms(true, true, false)},
  {name: 'subswelldir', save: false, type: 'number', tab: 6, size: 4, caption: 'Secondary wavedirection', units: 'arrow', forms: forms(true, true, false)},
  {name: 'slwindspeed', save: false, type: 'number', tab: 6, size: 4, caption: 'Wind speed', units: 'kph', forms: forms(true, true, false)},
  {name: 'windgust', save: false, type: 'number', tab: 6, size: 4, caption: 'Wind gusts', units: 'kph', forms: forms(true, true, false)},
  {name: 'slwinddir', save: false, type: 'number', tab: 6, size: 4, caption: 'Wind direction',  units: 'arrow', forms: forms(true, true, false)},
  {name: 'energy', save: false, type: 'number', tab: 6, caption: 'Energy', units: 'kJ', forms: forms(true, true, false)}
]

export function getRating(param, value, key = 'caption', returnKey = 'rating') {
  let domain = domains[param];
  let domainItem = domain.find(v => v[key] === value);
    
  return (domainItem) ? domainItem[returnKey] : 0;
}

export function getScoreCaption(score) {
  return scores[score].caption
}

export function scoreColor(score) {
  return scores[score].color
}

export const getBoardInfo = (board) => {
  let result = boards.filter(b => b.caption === board)
  return result[0]
}

export const getTabNr = (name, form = "session") => {
  let option = formsOptions.find(o => o.name === name)
  if (form === 'session') return option.tab
  return (option.tab === 6) ? 2 : 1
}