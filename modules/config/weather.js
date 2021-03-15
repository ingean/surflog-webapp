import { getRange } from '../utils/utilities.js';

const luDirections = [
  {min: 348.75, max: 360, short: "n", name: "nord"}, 
  {min: 0, max: 11.25, short: "n", name: "nord"},
  {min: 11.25, max: 33.75, short: "nnø", name: "nord-nordøst"},
  {min: 33.75, max: 56.25, short: "nø", name: "nordøst"},
  {min: 56.25, max: 78.75, short: "ønø", name: "øst-nordøst"},
  {min: 78.75, max: 101.25, short: "ø", name: "øst"},
  {min: 101.25, max: 123.75, short: "øsø", name: "øst-sørøst"},
  {min: 123.75, max: 146.25, short: "sø", name: "sørøst"},
  {min: 146.25, max: 168.75, short: "ssø", name: "sør-sørøst"},
  {min: 168.75, max: 191.25, short: "s", name: "sør"},
  {min: 191.25, max: 213.75, short: "ssv", name: "sør-sørvest"},
  {min: 213.75, max: 236.25, short: "sv", name: "sørvest"},
  {min: 236.25, max: 258.75, short: "vsv", name: "vest-sørvest"},
  {min: 258.75, max: 281.25, short: "v", name: "vest"},
  {min: 281.25, max: 303.75, short: "vnv", name: "vest-nordvest"},
  {min: 303.75, max: 326.25, short: "nv", name: "nordvest"},
  {min: 326.25, max: 348.75, short: "nnv", name: "nord-nordvest"}
]

const luWindspeed = [
  {min: 0, max: 0.2, name: "Stille", score: {local: 3, fetch: 1}},
  {min: 0.2, max: 1.5, name: "Flau vind", score: {local: 3, fetch: 1}},
  {min: 1.5, max: 3.3, name: "Svak vind", score: {local: 3, fetch: 1}},
  {min: 3.3, max: 5.4, name: "Lett bris", score: {local: 3, fetch: 1}},
  {min: 5.4, max: 7.9, name: "Laber bris", score: {local: 2, fetch: 1}},
  {min: 7.9, max: 10.7, name: "Frisk bris", score: {local: 2, fetch: 2}},
  {min: 10.7, max: 13.8, name: "Liten kuling", score: {local: 1, fetch: 3}},
  {min: 13.8, max: 17.1, name: "Stiv kuling", score: {local: 1, fetch: 3}},
  {min: 17.1, max: 20.7, name: "Sterk kuling", score: {local: 1, fetch: 3}},
  {min: 20.7, max: 24.4, name: "Liten storm", score: {local: 1, fetch: 3}},
  {min: 24.4, max: 28.4, name: "Full storm", score: {local: 1, fetch: 3}},
  {min: 28.4, max: 32.6, name: "Sterk storm", score: {local: 1, fetch: 3}},
  {min: 32.6, max: 100, name: "Orkan", score: {local: 1, fetch: 3}}
];

export function getWindSpeed(value, param = 'name') {
  let wind = getRange(luWindspeed, value);
  return wind[param];
}

export function getWindDir(value, param = 'name') {
  let wind = getRange(luDirections, value);
  return wind[param];
}

