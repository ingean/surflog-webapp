const classes = { 
  0: {class: "default"},
  1: {class: "danger"},
  2: {class: "warning"},
  3: {class: "info"},
  4: {class: "primary"},
  5: {class: "success"},
  9: {class: "danger"}
}

export function getClass(rating) {
  return classes[rating].class;
}

export const luUnits = {
  waveheight: 'm',
  waveperiod: 's',
  swellheight: 'm',
  swellperiod: 's',
  wind: 'm/s',
  waveheightforecast: 'm',
  waveheightmax: 'm'
};

export const mswIds = {
  'Saltstein': {id: 556},
  'Esso': {id: 556, name: 'Saltstein'},
  'Øya': {id: 556, name: 'Saltstein'},
  'Ins and outs': {id: 556, name: 'Saltstein'},
  'Elvemunningen': {id: 556, name: 'Saltstein'},
  'Skallevold': {id: 556, name: 'Saltstein'},
  'Unstad, right': {id: 674, name: 'Unstad beach'},
  'Unstad, left': {id: 674, name: 'Unstad beach'},
  'Unstad, beach': {id: 674, name: 'Unstad beach'},
  'Ervik': {id: 1893},
  'Hoddevika': {id: 552},
  'Alnes Fyr': {id: 4660},
  'Flø': {id: 4660, name: 'Alnes Fyr'},
  'Svinestien': {id: 1884, name: 'Pigsty-Piggy'},
  'Reve Havn': {id: 1885},
  'Kvassheim': {id: 1892},
  'Sele': {id: 554},
  'Trestles, uppers': {id: 291, name: 'Trestles'},
  'Carlsbad': {id: 292},
  'Cotton': {id: 291, name: 'Trestles'},
  'Ocean Beach': {id: 4212},
  'Blacks Beach': {id: 8146},
  'Georges´s': {id: 4663, name: 'Cardiff-Reef'},
  'Seaside Reef': {id: 4663, name: 'Cardiff-Reef'},
  'Ponto Jetties': {id: 1149, name: 'Ponto'},
  'Cardiff Reef': {id: 4663},
  'Torrey Pines State Beach S.': {id: 295, name: 'Torrey-Pines-Blacks-Beach'},
  'Sunset Cliffs': {id: 4211},
  'Fletcher Cove': {id: 294, name: 'Solana-Beach'},
  'Sao Pedro': {id: 912, name: 'Carcavelos'},
  'Carcavelos': {id: 912},
  'Matador': {id: 4343, name: 'Ribeira-dIlhas'},
  'Ribeira': {id: 4343, name: 'Ribeira-dIlhas'},
  'Baleal': {id: 6707},
  'Supertubos': {id: 196},
  'Lagide': {id: 195},
  'Praia da Luz': {id: 4325},
  'Arrifana': {id: 836},
  'Beliche': {id: 4323},
  'Praia da Ingrina': {id: 4324, name: 'Zavial'},
  'Praia das Furnas': {id: 5831},
  'Praia do Barranco': {id: 5830},
  'Zavial': {id: 4324},
  'Praia do Martinhal': {id: 5828},
  'Sagres (south)': {id: 1098, name: 'Sagres-South'},
  'El Charco': {id: 1853},
  'La Izquierda': {id: 1853, name: 'El Charco'},
  'El Arenal': {id: 1853, name: 'El Charco'},
  'Are Goling': {id: 4170, name: 'Air-Guling'},
  'Senggigi': {id: 4130},
  'Outside Grupuk': {id: 4129},
  'Outside Grupuk Left': {id: 4129, name: 'Outside Grupuk'},
  'Tanjung': {id: 4129, name: 'Outside Grupuk'},
  'Don-Don': {id: 4123},
  'Inside Grupuk': {id: 4126}
}

