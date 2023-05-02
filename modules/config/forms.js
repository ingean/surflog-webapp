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
  {caption: 'Lost RNF96', default: true},
  {caption: 'Lost Little Wing'},
  {caption: 'Machado Seaside'},
  {caption: 'FW Dominator II'},
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
  {name: 'loctype', save: false, type: 'btn', tab: 1, caption: 'Type sted', domain: locType, forms: forms(false, false, true)},
  {name: 'country', save: true, type: 'datalist', tab: 1, caption: 'Land', forms: forms(true, true, false)},
  {name: 'location', save: true, type: 'datalist', tab: 1, caption: 'Område', forms: forms(true, true, false)},
  {name: 'spot', save: true, type: 'datalist', tab: 1, caption: 'Spot', forms: forms(true, true, true)},
  {name: 'crowds', save: false, type: 'btn', tab: 1, caption: 'Crowds', domain: crowds, forms: forms(true, false, true)},
  {name: 'reporttime', save: false, type: 'time', tab: 1, caption: 'Starttid', forms: forms(true, true, false)},
  {name: 'duration', save: false, type: 'number', tab: 1, caption: 'Varighet', forms: forms(true, false, false)},
  {name: 'source', save: false, type: 'btn', tab: 1, caption: 'Kilde', domain: sources, forms: forms(false, true, true)},
  {name: 'tidesFilter', save: false, type: 'btn', tab: 1, caption: 'Tidevann', domain: tidesFilter, forms: forms(false, false, true)},
  {name: 'tide', save: false, type: 'btn', tab: 1, caption: 'Tidevann', domain: tides, forms: forms(true, false, false)},
  {name: 'tidediff', save: false, type: 'btn', tab: 1, caption: 'Differanse', domain: tideDiffs, forms: forms(true, false, false)},
  {name: 'tidetype', save: false, type: 'btn', tab: 1, caption: 'Type', domain: tideTypes, forms: forms(true, false, false)},
  {name: 'winddir', save: false, type: 'btn', tab: 2, caption: 'Vindretning', domain: winddir, forms: forms(true, false, true)},
  {name: 'windspeed', save: false, type: 'btn', tab: 2, caption: 'Vindstyrke', domain: windspeed, forms: forms(true, false, true)},
  {name: 'waveheight', save: false, type: 'btn', tab: 2, caption: 'Bølgehøyde', domain: waveheight, forms: forms(true, false, true)},
  {name: 'waveperiod', save: false, type: 'btn', tab: 2, caption: 'Bølgeperiode', domain: waveperiod, forms: forms(true, false, true)},
  {name: 'wavedir', save: false, type: 'select', tab: 2, caption: 'Bølgeretning', domain: wavedir, forms: forms(true, false, true)},
  {name: 'score', save: false, type: 'btn', tab: 3, caption: 'Score', domain: scores, forms: forms(true, false, true)},
  {name: 'descr', save: false, type: 'textarea', tab: 3, caption: 'Beskrivelse', forms: forms(true, true, false)},
  {name: 'forecast', save: false, type: 'textarea', tab: 3, caption: 'Kommentar', forms: forms(true, false, false)},
  {name: 'board', save: true, type: 'select', tab: 4, caption: 'Brett', domain: boards, forms: forms(true, false, false)},
  {name: 'suit', save: true, type: 'select', tab: 4, caption: 'Drakt', domain: suits, forms: forms(true, false, false)},
  {name: 'gloves', save: true, type: 'select', tab: 4, caption: 'Hansker', domain: gloves, forms: forms(true, false, false)},
  {name: 'boots', save: true, type: 'select', tab: 4, caption: 'Booties', domain: boots, forms: forms(true, false, false)},
  {name: 'hood', save: true, type: 'btn', tab: 4, caption: 'Hette', domain: yesNo, forms: forms(true, false, false)},
  {name: 'airtemp', save: true, type: 'number', tab: 5, caption: 'Lufttemperatur', forms: forms(true, false, false)},
  {name: 'watertemp', save: true, type: 'number', tab: 5, caption: 'Vanntemperatur', forms: forms(true, false, false)},
  {name: 'temp', save: false, type: 'textarea', tab: 5, caption: 'Beskrivelse', forms: forms(true, false, false)},
  {name: 'issurfable', save: false, type: 'btn', tab: 1, caption: 'Surfbart', domain: yesNo, forms: forms(false, true, true)},
  {name: 'iscold', save: false, type: 'btn', tab: 5, caption: 'Kald', domain: yesNo, forms: forms(true, false, true)},
  {name: 'type', save: false, type: 'btn', tab: 1, caption: 'Type', domain: types, forms: forms(false, true, false)},
  {name: 'files', save: false, type: 'file', tab: 6, caption: 'Bilder', forms: forms(true, true, false)},
  {name: 'isreference', save: false, type: 'btn', tab: 6, caption: 'Referanse', domain: yesNo, forms: forms(true, true, true)}
];

export function getRating(param, value, key = 'caption', returnKey = 'rating') {
  let domain = domains[param];
  let domainItem = domain.find(v => v[key] === value);
    
  return (domainItem) ? domainItem[returnKey] : 0;
}

export function getScoreCaption(score) {
  return scores[score].caption;
}