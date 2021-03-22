import { getClass } from "./lookups.js";

const scores = [
  {value: 0, caption: 'Flatt', rating: 0},
  {value: 1, caption: 'Despo', rating: 1},
  {value: 2, caption: 'Dårlig', rating: 2},
  {value: 3, caption: 'OK', rating: 3},
  {value: 4, caption: 'Bra', rating: 4, default: true},
  {value: 5, caption: 'Episk', rating: 5}
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
  {caption: 'Sør'},
  {caption: 'Sørvest', default: true},
  {caption: 'Vest'},
  {caption: 'Nordvest'},
  {caption: 'Nord'},
  {caption: 'Nordøst'},
  {caption: 'Øst'},
  {caption: 'Sørøst'}
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

export const tabNames = {
  1: 'Lokasjon',
  2: 'Forhold',
  3: 'Vurdering',
  4: 'Utstyr',
  5: 'Vær',
  6: 'Bilder',
}

export var formsOptions = [
  {type: 'datalist', id: 'country', tab: 1, caption: 'Land', forms: forms(true, true, false)},
  {type: 'datalist', id: 'location', tab: 1, caption: 'Sted', forms: forms(true, true, false)},
  {type: 'datalist', id: 'spot', tab: 1, caption: 'Spot', forms: forms(true, true, false)},
  {type: 'btn', id: 'crowds', tab: 1, caption: 'Crowds', domain: crowds, forms: forms(true, false, true)},
  {type: 'time', id: 'reporttime', tab: 1, caption: 'Starttid', forms: forms(true, true, false)},
  {type: 'number', id: 'duration', tab: 1, caption: 'Varighet', forms: forms(true, false, false)},
  {type: 'btn', id: 'source', tab: 1, caption: 'Kilde', domain: sources, forms: forms(false, true, true)},
  {type: 'btn', id: 'tide', tab: 1, caption: 'Tidevann', domain: tides, forms: forms(true, false, true)},
  {type: 'btn', id: 'tidediff', tab: 1, caption: 'Differanse', domain: tideDiffs, forms: forms(true, false, true)},
  {type: 'btn', id: 'tidetype', tab: 1, caption: 'Type', domain: tideTypes, forms: forms(true, false, true)},
  {type: 'btn', id: 'winddir', tab: 2, caption: 'Vindretning', domain: winddir, forms: forms(true, false, true)},
  {type: 'btn', id: 'windspeed', tab: 2, caption: 'Vindstyrke', domain: windspeed, forms: forms(true, false, true)},
  {type: 'btn', id: 'waveheight', tab: 2, caption: 'Bølgehøyde', domain: waveheight, forms: forms(true, false, true)},
  {type: 'btn', id: 'waveperiod', tab: 2, caption: 'Bølgeperiode', domain: waveperiod, forms: forms(true, false, true)},
  {type: 'select', id: 'wavedir', tab: 2, caption: 'Bølgeretning', domain: wavedir, forms: forms(true, false, true)},
  {type: 'btn', id: 'score', tab: 3, caption: 'Score', domain: scores, forms: forms(true, false, true)},
  {type: 'textarea', id: 'descr', tab: 3, caption: 'Beskrivelse', forms: forms(true, true, false)},
  {type: 'textarea', id: 'forecast', tab: 3, caption: 'Kommentar', forms: forms(true, false, false)},
  {type: 'select', id: 'board', tab: 4, caption: 'Brett', domain: boards, forms: forms(true, false, false)},
  {type: 'select', id: 'suit', tab: 4, caption: 'Drakt', domain: suits, forms: forms(true, false, false)},
  {type: 'select', id: 'gloves', tab: 4, caption: 'Hansker', domain: gloves, forms: forms(true, false, false)},
  {type: 'select', id: 'boots', tab: 4, caption: 'Booties', domain: boots, forms: forms(true, false, false)},
  {type: 'btn', id: 'hood', tab: 4, caption: 'Hette', domain: yesNo, forms: forms(true, false, false)},
  {type: 'number', id: 'airtemp', tab: 5, caption: 'Lufttemperatur', forms: forms(true, false, false)},
  {type: 'number', id: 'watertemp', tab: 5, caption: 'Vanntemperatur', forms: forms(true, false, false)},
  {type: 'textarea', id: 'temp', tab: 5, caption: 'Beskrivelse', forms: forms(true, false, false)},
  {type: 'btn', id: 'issurfable', tab: 1, caption: 'Surfbart', domain: yesNo, forms: forms(false, true, true)},
  {type: 'btn', id: 'iscold', tab: 5, caption: 'Kald', domain: yesNo, forms: forms(true, false, true)},
  {type: 'btn', id: 'type', tab: 1, caption: 'Type', domain: types, forms: forms(false, true, false)},
  {type: 'file', id: 'files', tab: 6, caption: 'Bilder', forms: forms(true, true, false)},
  {type: 'btn', id: 'isreference', tab: 6, caption: 'Referanse', domain: yesNo, forms: forms(true, true, true)}
];

export function getRating(param, value, key = 'caption', returnClass = true) {
  let domain = domains[param];
  let domainItem = domain.find(v => v[key] === value);
    
  return returnClass ? getClass(domainItem.rating) : domainItem.caption;  
}