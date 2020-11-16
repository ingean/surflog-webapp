const domainScore = [
  new DomainValue(0, false, 'Flatt'),
  new DomainValue(1, false, 'Despo'),
  new DomainValue(2, false, 'Dårlig'),
  new DomainValue(3, false, 'OK'),
  new DomainValue(4, true, 'Bra'),
  new DomainValue(5, false, 'Episk')
];

const domainCrowds = [
  new DomainValue("Lite"),
  new DomainValue("Normalt", true),
  new DomainValue("Mye")
];

const domainTide = [
  new DomainValue("Høyvann"),
  new DomainValue("Lavvann"),
  new DomainValue("Ukjent", true)
];

const domainTideDiff = [
  new DomainValue("-3t"),
  new DomainValue("-2t"),
  new DomainValue("-1t"),
  new DomainValue("0", true),
  new DomainValue("+1t"),
  new DomainValue("+2t"),
  new DomainValue("+3t")
];

const domainTideType = [
  new DomainValue("Normal"),
  new DomainValue("Spring"),
  new DomainValue("Nipp"),
  new DomainValue("Ukjent", true)
];

const domainWinddir = [
  new DomainValue("Onshore", true),
  new DomainValue("Crosshore"),
  new DomainValue("Offshore")
];

const domainWindspeed = [
  new DomainValue("Kuling"),
  new DomainValue("Frisk bris", true),
  new DomainValue("Bris"),
  new DomainValue("Stille")
];
const domainWaveheight = [
  new DomainValue("Kne"),
  new DomainValue("Midje", true),
  new DomainValue("Skulder"),
  new DomainValue("Hode"),
  new DomainValue("Over hode")
];

const domainWaveperiod = [
  new DomainValue("Lav"),
  new DomainValue("Middels", true),
  new DomainValue("Høy"),
  new DomainValue("Veldig høy") 
];

const domainWavedir = [
  new DomainValue("Sør"),
  new DomainValue("Sørvest", true),
  new DomainValue("Vest"),
  new DomainValue("Nordvest"),
  new DomainValue("Nord"),
  new DomainValue("Nordøst"),
  new DomainValue("Øst"),
  new DomainValue("Sørøst")
];

const domainBoard = [
  new DomainValue("SD No Brainer", true),
  new DomainValue("CI OG Flyer"),
  new DomainValue("Lost V2 Shortboard"),
  new DomainValue("Von Sol Shadow"),
  new DomainValue("MR Expoxy Twin"),
  new DomainValue("OE Longboard"),
  new DomainValue("Annet")
];

const domainSuit = [
  new DomainValue("6/5"),
  new DomainValue("5/4"),
  new DomainValue("4.5/3.5"),
  new DomainValue("4/3", true),
  new DomainValue("3/2"),
  new DomainValue("Shortie"),
  new DomainValue("Vest"),
  new DomainValue("Boardies")
];

const domainGloves = [
  new DomainValue("Nei", true),
  new DomainValue("7 vott"),
  new DomainValue("5 vott"),
  new DomainValue("5 hanske"),
  new DomainValue("4"),
  new DomainValue("3"),
  new DomainValue("2")
];

const domainBoots = [
  new DomainValue("Nei", true),
  new DomainValue("7"),
  new DomainValue("5"),
  new DomainValue("3"),
  new DomainValue("Reefboots")
];

const domainObsSource = [
  new DomainValue("Observasjoner"),
  new DomainValue("Webkamera", true),
  new DomainValue("Øyenvitne"),
  new DomainValue("Bomtur")
];

const domainObsType = [
  new DomainValue("Treningsdata"),
  new DomainValue("Observasjon", true)
];

const domainYesNo = [
  new DomainValue(1, false, "Ja"),
  new DomainValue(0, true, "Nei"),
];