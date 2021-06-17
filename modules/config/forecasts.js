const directions = [
  {low: 348.75, mid:0, high: 360, short: "N", caption: "nord"}, 
  {low: 0, mid: 0, high: 11.25, short: "N", caption: "nord"},
  {low: 11.25, mid: 22.5, high: 33.75, short: "NNE", caption: "nord-nordøst"},
  {low: 33.75, mid: 45, high: 56.25, short: "NE", caption: "nordøst"},
  {low: 56.25, mid: 67.5, high: 78.75, short: "ENE", caption: "øst-nordøst"},
  {low: 78.75, mid: 90, high: 101.25, short: "E", caption: "øst"},
  {low: 101.25, mid: 112.5, high: 123.75, short: "ESE", caption: "øst-sørøst"},
  {low: 123.75, mid: 135, high: 146.25, short: "SE", caption: "sørøst"},
  {low: 146.25, mid: 157.5, high: 168.75, short: "SSE", caption: "sør-sørøst"},
  {low: 168.75, mid: 180, high: 191.25, short: "S", caption: "sør"},
  {low: 191.25, mid: 202.5, high: 213.75, short: "SSW", caption: "sør-sørvest"},
  {low: 213.75, mid: 225, high: 236.25, short: "SW", caption: "sørvest"},
  {low: 236.25, mid: 247.5, high: 258.75, short: "WSW", caption: "vest-sørvest"},
  {low: 258.75, mid: 270, high: 281.25, short: "W", caption: "vest"},
  {low: 281.25, mid: 292.5, high: 303.75, short: "WNW", caption: "vest-nordvest"},
  {low: 303.75, mid: 315, high: 326.25, short: "NW", caption: "nordvest"},
  {low: 326.25, mid: 337.5, high: 348.75, short: "NNW", caption: "nord-nordvest"}
];

const windspeeds = [
  {low: 0, high: 0.2, local: 5, fetch: 0, caption: "Stille"},
  {low: 0.2, high: 1.5, local: 5, fetch: 0, caption: "Flau vind"},
  {low: 1.5, high: 3.3, local: 5, fetch: 0, caption: "Svak vind"},
  {low: 3.3, high: 5.4, local: 5, fetch: 0, caption: "Lett bris"},
  {low: 5.4, high: 7.9, local: 4, fetch: 0, caption: "Laber bris"},
  {low: 7.9, high: 10.7, local: 3, fetch: 3, caption: "Frisk bris"},
  {low: 10.7, high: 13.8, local: 2, fetch: 4, caption: "Liten kuling"},
  {low: 13.8, high: 17.1, local: 1, fetch: 4, caption: "Stiv kuling"},
  {low: 17.1, high: 20.7, local: 1, fetch: 5, caption: "Sterk kuling"},
  {low: 20.7, high: 24.4, local: 1, fetch: 5, caption: "Liten storm"},
  {low: 24.4, high: 28.4, local: 1, fetch: 5, caption: "Full storm"},
  {low: 28.4, high: 32.6, local: 1, fetch: 5, caption: "Sterk storm"},
  {low: 32.6, high: 100, local: 1, fetch: 5, caption: "Orkan"}
];

const currents = [
  {low: 0, high: 30, category: 2, caption: 'Svak'},
  {low: 30, high: 40, category: 1, caption: 'Sterk'},
  {low: 40, high: 9999, category: 0, caption: 'Svært sterk'}
];

const ratings = {
  0: {caption: 'Ukjent', score: 'Flatt'},
  1: {caption: 'Veldig lav', score: 'Despo'},
  2: {caption: 'Lav', score: 'Dårlig'},
  3: {caption: 'Middels', score: 'Ok'},
  4: {caption: 'Høy', score: 'Bra'},
  5: {caption: 'Veldig høy', score: 'Episk'}
};

export function direction(dir) {
  return directions.find(d => dir > d.low && dir <= d.high); 
}

export function directionFromText(dirTxt) {
  return directions.find(d => d.short === dirTxt).mid
}

export function windspeed(speed) {
  return windspeeds.find(s => speed > s.low && speed <= s.high); 
}

export function current(speed) {
  return currents.find(s => speed > s.low && speed <= s.high); 
}

export function score(score) {
  return ratings[score].score;
}

export const weatherIcons = {
  clearsky: '01',
  fair: '02',
  partlycloudy: '03',
  cloudy: '04',
  lightrainshowers: '40',
  rainshowers: '05',
  heavyrainshowers: '41',
  lightrainshowersandthunder: '24',
  rainshowersandthunder: '06',
  heavyrainshowersandthunder: '25',
  lightsleetshowers: '42',
  sleetshowers: '07',
  heavysleetshowers: '43',
  lightsleetshowersandthunder: '26',
  sleetshowersandthunder: '20',
  heavysleetshowersandthunder: '27',
  lightsnowshowers: '44',
  snowshowers: '08',
  heavysnowshowers: '45',
  lightsnowshowersandthunder: '28',
  snowshowersandthunder: '21',
  heavysnowshowersandthunder: '29',
  lightrain: '46',
  rain: '09',
  heavyrain: '10',
  lightrainandthunder: '30',
  rainandthunder: '22',
  heavyrainandthunder: '11',
  lightsleet: '47',
  sleet: '12',
  heavysleet: '48',
  lightsleetandthunder: '31',
  sleetandthunder: '23',
  heavysleetandthunder: '32',
  lightsnow: '49',
  snow: '13',
  heavysnow: '50',
  lightsnowandthunder: '33',
  snowandthunder: '14',
  heavysnowandthunder: '34',
  fog: '15'
}