//Formatting for table cells showing wind speed and direction


const locations = {
  "saltstein": {"label": "Saltstein", "type": "spot", "class": "local"},
  "esso": {"label": "Esso", "type": "spot", "class": "local"},
  "Fugløya": {"label": "Fugløya", "type": "observation", "class": "local"},
  "skagerak": {"label": "Skagerak", "type": "forecast", "class": "fetch"},
  "SN76939:0": {"label": "Vallhall A", "observation": "spot", "class": "fetch"},
  "SN76938:0": {"label": "Ula", "type": "observation", "class": "fetch"},
  "SN76920:0": {"label": "Ekofisk", "type": "observation", "class": "fetch"},
  "SN39100:0": {"label": "Oksøy Fyr", "type": "observation", "class": "fetch"},
  "SN36200:0": {"label": "Torungen Fyr", "type": "observation", "class": "fetch"},
  "SN35860:0": {"label": "Lyngør Fyr", "type": "spobservationot", "class": "fetch"},
  "SN34130:0": {"label": "Jomfruland", "type": "observation", "class": "fetch"},
  "SN29950:0": {"label": "Svenner Fyr", "type": "observation", "class": "fetch"},
  "SN27500:0": {"label": "Færder Fyr", "type": "observation", "class": "fetch"},
  "SN250100:0": {"label": "Väderöerna", "type": "observation", "class": "fetch"},
  "SN250000:0": {"label": "Nordkoster", "type": "observation", "class": "fetch"},
  "SN603300:0": {"label": "Hirtshals", "type": "observation", "class": "fetch"},
  "SN602100:0": {"label": "Hanstsholm", "type": "observation", "class": "fetch"},
  "SN601600:0": {"label": "Horns Rev", "type": "observation", "class": "fetch"}
};

const locationSectors = {
  "saltstein": [ 
    {"low": 125,"high": 270,"local": 1, "fetch": 3, "label": "onshore"},
    {"low": 270,"high": 315, "local": 2, "fetch": 1, "label": "crosshore"},
    {"low": 90,"high": 125, "local": 2, "fetch": 1, "label": "crosshore"},
    {"low": 315,"high": 360, "local": 3, "fetch": 0, "label": "offshore"},
    {"low": 0,"high": 90, "local": 3, "fetch": 0, "label": "offshore"}
  ],
  "esso": [
    {"low": 45,"high": 125, "score": 1, "fetch": 3, "label": "onshore"},
    {"low": 315,"high": 360, "score": 2, "fetch": 1, "label": "crosshore"},
    {"low": 0,"high": 45, "score": 2, "fetch": 1, "label": "crosshore"},
    {"low": 125,"high": 225, "score": 2, "fetch": 1, "label": "crosshore"},
    {"low": 225,"high": 315, "score": 3, "fetch": 0, "label": "offshore"}
  ]
};

const directionSectors = [
  {"low": 348.75, "high": 360, "type": "n", "label": "nord"}, 
  {"low": 0, "high": 11.25, "type": "n", "label": "nord"},
  {"low": 11.25, "high": 33.75, "type": "nnø", "label": "nord-nordøst"},
  {"low": 33.75, "high": 56.25, "type": "nø", "label": "nordøst"},
  {"low": 56.25, "high": 78.75, "type": "ønø", "label": "øst-nordøst"},
  {"low": 78.75, "high": 101.25, "type": "ø", "label": "øst"},
  {"low": 101.25, "high": 123.75, "type": "øsø", "label": "øst-sørøst"},
  {"low": 123.75, "high": 146.25, "type": "sø", "label": "sørøst"},
  {"low": 146.25, "high": 168.75, "type": "ssø", "label": "sør-sørøst"},
  {"low": 168.75, "high": 191.25, "type": "s", "label": "sør"},
  {"low": 191.25, "high": 213.75, "type": "ssv", "label": "sør-sørvest"},
  {"low": 213.75, "high": 236.25, "type": "sv", "label": "sørvest"},
  {"low": 236.25, "high": 258.75, "type": "vsv", "label": "vest-sørvest"},
  {"low": 258.75, "high": 281.25, "type": "v", "label": "vest"},
  {"low": 281.25, "high": 303.75, "type": "vnv", "label": "vest-nordvest"},
  {"low": 303.75, "high": 326.25, "type": "nv", "label": "nordvest"},
  {"low": 326.25, "high": 348.75, "type": "nnv", "label": "nord-nordvest"}
]

const windspeedCategories = [
  {"low": 0, "high": 0.2, "local": 3, "fetch": 1, "label": "Stille"},
  {"low": 0.2, "high": 1.5, "local": 3, "fetch": 1, "label": "Flau vind"},
  {"low": 1.5, "high": 3.3, "local": 3, "fetch": 1, "label": "Svak vind"},
  {"low": 3.3, "high": 5.4, "local": 3, "fetch": 1, "label": "Lett bris"},
  {"low": 5.4, "high": 7.9, "local": 2, "fetch": 1, "label": "Laber bris"},
  {"low": 7.9, "high": 10.7, "local": 2, "fetch": 2, "label": "Frisk bris"},
  {"low": 10.7, "high": 13.8, "local": 1, "fetch": 3, "label": "Liten kuling"},
  {"low": 13.8, "high": 17.1, "local": 1, "fetch": 3, "label": "Stiv kuling"},
  {"low": 17.1, "high": 20.7, "local": 1, "fetch": 3, "label": "Sterk kuling"},
  {"low": 20.7, "high": 24.4, "local": 1, "fetch": 3, "label": "Liten storm"},
  {"low": 24.4, "high": 28.4, "local": 1, "fetch": 3, "label": "Full storm"},
  {"low": 28.4, "high": 32.6, "local": 1, "fetch": 3, "label": "Sterk storm"},
  {"low": 32.6, "high": 100, "local": 1, "fetch": 3, "label": "Orkan"}
];

const windScores = {
"0": {"tdclass": "td-flat", "label": "Dårlig"},
"1": {"tdclass": "td-flat", "label": "Dårlig"},
"2": {"tdclass": "td-flat", "label": "Dårlig"},
"3": {"tdclass": "td-min", "label": "Ok"},
"4": {"tdclass": "td-min", "label": "Ok"},
"5": {"tdclass": "td-max", "label": "Bra"},
"6": {"tdclass": "td-max", "label": "Bra"}
};

const waveDirScores = {
  "0": {"tdclass": "td-flat", "label": "Dårlig"},
  "1": {"tdclass": "td-min", "label": "Ok"},
  "2": {"tdclass": "td-avg", "label": "Bra"},
  "3": {"tdclass": "td-max", "label": "Bra"}
  };