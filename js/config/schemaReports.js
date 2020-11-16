var inputsReports = [
  new FormInput('country', 1, 'datalist', 'Land', [], true, true, false),
  new FormInput('location', 1, 'datalist', 'Sted', [], true, true, false),
  new FormInput('spot', 1, 'datalist', 'Spot', [], true, true, false),
  new FormInput('crowds', 1, 'btn', 'Crowds', domainCrowds, true, false, true),
  new FormInput('time', 1, 'time', 'Starttid', '', true, true, false),
  new FormInput('duration', 1, 'number', 'Varighet', '', true, false, false),
  new FormInput('source', 1, 'btn', 'Kilde', domainObsSource, false, true, true),
  new FormInput('tide', 1, 'btn', 'Tidevann', domainTide, true, false, true),
  new FormInput('tidediff', 1, 'btn', 'Differanse', domainTideDiff, true, false, true),
  new FormInput('tidetype', 1, 'btn', 'Type', domainTideType, true, false, true),
  new FormInput('winddir', 2, 'btn', 'Vindretning', domainWinddir, true, false, true),
  new FormInput('windspeed', 2, 'btn', 'Vindstyrke', domainWindspeed, true, false, true),
  new FormInput('waveheight', 2, 'btn', 'Bølgehøyde', domainWaveheight, true, false, true),
  new FormInput('waveperiod', 2, 'btn', 'Bølgeperiode', domainWaveperiod, true, false, true),
  new FormInput('wavedir', 2, 'select', 'Bølgeretning', domainWavedir, true, false, true),
  new FormInput('score', 3, 'btn', 'Score', domainScore, true, false, true),
  new FormInput('descr', 3, 'textarea', 'Beskrivelse', '', true, true, false),
  new FormInput('forecast', 3, 'textarea', 'Kommentar', '', true, false, false),
  new FormInput('board', 4, 'select', 'Brett', domainBoard, true, false, false),
  new FormInput('suit', 4, 'select', 'Drakt', domainSuit, true, false, false),
  new FormInput('gloves', 4, 'select', 'Hansker', domainGloves, true, false, false),
  new FormInput('boots', 4, 'select', 'Booties', domainBoots, true, false, false),
  new FormInput('hood', 4, 'btn', 'Hette', domainYesNo, true, false, false),
  new FormInput('airtemp', 5, 'number', 'Lufttemperatur', '', true, false, false),
  new FormInput('watertemp', 5, 'number', 'Vanntemperatur', '', true, false, false),
  new FormInput('tempdescr', 5, 'textarea', 'Beskrivelse', '', true, false, false),
  new FormInput('issurfable', 1, 'btn', 'Surfbart', domainYesNo, false,  true, true),
  new FormInput('iscold', 5, 'btn', 'Kald', domainYesNo, true, false, true),
  new FormInput('type', 1, 'btn', 'Type', domainObsType, false,  true, false),
  new FormInput('files', 6, 'file', 'Bilder', '', true, true, false),
  new FormInput('isreference', 6, 'btn', 'Referanse', domainYesNo, true, true, true)
];

function arrayToDomain(array, defaultValue) {
  var domain = [];
  var isDefault = false;
  for (var i = 0; i < array.length; i++) {
    if (array[i] === defaultValue) {isDefault = true} else {isDefault = false};
    domain.push(new DomainValue(array[i], isDefault))
  }
  return domain;
}
