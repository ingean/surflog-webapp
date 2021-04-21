const scores = [
  {value: 0, caption: 'Flatt', rating: 0},
  {value: 1, caption: 'Despo', rating: 1},
  {value: 2, caption: 'Dårlig', rating: 2},
  {value: 3, caption: 'OK', rating: 3},
  {value: 4, caption: 'Bra', rating: 4, default: true},
  {value: 5, caption: 'Episk', rating: 5}
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

const boards = [
  {caption: 'SD No Brainer', default: true},
  {caption: 'CI OG Flyer'},
  {caption: 'Lost V2 Shortboard'},
  {caption: 'Von Sol Shadow'},
  {caption: 'MR Expoxy Twin'},
  {caption: 'OE Longboard'},
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
  waveheight: waveheight,
  waveperiod: waveperiod,
  wavedir: wavedir,
  winddir: winddir,
  windspeed: windspeed
}

function forms(session, observation, filter) {
  return {
    session: session,
    observation: observation,
    filter: filter
  }
}

export const tabNames = ['Lokasjon', 'Forhold', 'Vurdering', 'Utstyr', 'Vær','Bilder']

export var formsOptions = [
  {name: 'loctype', type: 'btn', tab: 1, caption: 'Type sted', domain: locType, forms: forms(false, false, true)},
  {name: 'country', type: 'datalist', tab: 1, caption: 'Land', forms: forms(true, true, false)},
  {name: 'location', type: 'datalist', tab: 1, caption: 'Område', forms: forms(true, true, false)},
  {name: 'spot', type: 'datalist', tab: 1, caption: 'Spot', forms: forms(true, true, true)},
  {name: 'crowds', type: 'btn', tab: 1, caption: 'Crowds', domain: crowds, forms: forms(true, false, true)},
  {name: 'reporttime', type: 'time', tab: 1, caption: 'Starttid', forms: forms(true, true, false)},
  {name: 'duration', type: 'number', tab: 1, caption: 'Varighet', forms: forms(true, false, false)},
  {name: 'source', type: 'btn', tab: 1, caption: 'Kilde', domain: sources, forms: forms(false, true, true)},
  {name: 'tidesFilter', type: 'btn', tab: 1, caption: 'Tidevann', domain: tidesFilter, forms: forms(false, false, true)},
  {name: 'tide', type: 'btn', tab: 1, caption: 'Tidevann', domain: tides, forms: forms(true, false, false)},
  {name: 'tidediff', type: 'btn', tab: 1, caption: 'Differanse', domain: tideDiffs, forms: forms(true, false, false)},
  {name: 'tidetype', type: 'btn', tab: 1, caption: 'Type', domain: tideTypes, forms: forms(true, false, false)},
  {name: 'winddir', type: 'btn', tab: 2, caption: 'Vindretning', domain: winddir, forms: forms(true, false, true)},
  {name: 'windspeed', type: 'btn', tab: 2, caption: 'Vindstyrke', domain: windspeed, forms: forms(true, false, true)},
  {name: 'waveheight', type: 'btn', tab: 2, caption: 'Bølgehøyde', domain: waveheight, forms: forms(true, false, true)},
  {name: 'waveperiod', type: 'btn', tab: 2, caption: 'Bølgeperiode', domain: waveperiod, forms: forms(true, false, true)},
  {name: 'wavedir', type: 'select', tab: 2, caption: 'Bølgeretning', domain: wavedir, forms: forms(true, false, true)},
  {name: 'score', type: 'btn', tab: 3, caption: 'Score', domain: scores, forms: forms(true, false, true)},
  {name: 'descr', type: 'textarea', tab: 3, caption: 'Beskrivelse', forms: forms(true, true, false)},
  {name: 'forecast', type: 'textarea', tab: 3, caption: 'Kommentar', forms: forms(true, false, false)},
  {name: 'board', type: 'select', tab: 4, caption: 'Brett', domain: boards, forms: forms(true, false, false)},
  {name: 'suit', type: 'select', tab: 4, caption: 'Drakt', domain: suits, forms: forms(true, false, false)},
  {name: 'gloves', type: 'select', tab: 4, caption: 'Hansker', domain: gloves, forms: forms(true, false, false)},
  {name: 'boots', type: 'select', tab: 4, caption: 'Booties', domain: boots, forms: forms(true, false, false)},
  {name: 'hood', type: 'btn', tab: 4, caption: 'Hette', domain: yesNo, forms: forms(true, false, false)},
  {name: 'airtemp', type: 'number', tab: 5, caption: 'Lufttemperatur', forms: forms(true, false, false)},
  {name: 'watertemp', type: 'number', tab: 5, caption: 'Vanntemperatur', forms: forms(true, false, false)},
  {name: 'temp', type: 'textarea', tab: 5, caption: 'Beskrivelse', forms: forms(true, false, false)},
  {name: 'issurfable', type: 'btn', tab: 1, caption: 'Surfbart', domain: yesNo, forms: forms(false, true, true)},
  {name: 'iscold', type: 'btn', tab: 5, caption: 'Kald', domain: yesNo, forms: forms(true, false, true)},
  {name: 'type', type: 'btn', tab: 1, caption: 'Type', domain: types, forms: forms(false, true, false)},
  {name: 'files', type: 'file', tab: 6, caption: 'Bilder', forms: forms(true, true, false)},
  {name: 'isreference', type: 'btn', tab: 6, caption: 'Referanse', domain: yesNo, forms: forms(true, true, true)}
];

export function getRating(param, value, key = 'caption', returnKey = 'rating') {
  let domain = domains[param];
  let domainItem = domain.find(v => v[key] === value);
    
  return domainItem[returnKey];
}

export function getScoreCaption(score) {
  return scores[score].caption;
}