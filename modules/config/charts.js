export const defaults = {
  height: 300,
  interpolateNulls: true, 
  titleTextStyle: {fontSize: 12},
  curveType: 'function', 
  intervals: {style: 'area'},
  focusTarget: 'category',
  annotations: {
    textStyle: {
      fontSize: 10,
      bold: true
    }
  },
  chartArea: {
    width: '80%',
    height: '80%'
  },
  hAxis: {
    textPosition: "out",
    textStyle : {fontSize: 12,
      color:'gray',
      auraColor:'white',
      },
    gridlines: { 
        units: {
            days: {format: ['EEEE']},
            hours: {format: ['HH']},
        },
        color: 'silver' 
    }
  },
  vAxis: {
    textStyle : {fontSize: 8}
  },
  tooltip: {
    isHtml:true,
    ignoreBounds: true,
    textStyle: {
      fontName: 'Verdana',
      fontSize: 10,
    }
  } 
}

export const waveheight = {  
  dmi: {
    title: 'Bølgehøyde (DMI)',
    series: series(['blue', ['blue', [5, 5]],'silver']),
    vAxis: { 
      ticks: ticks([0,1,2,3,4,5], 'm'),
      viewWindow: {min: 0, max: 5}
    }
  },
  smhi: {
    title: "SMHI",
    series: series(['blue', 'green', 'silver', 'silver']),
    vAxis: { 
      ticks: ticks([0,1,2,3,4,5], 'm'),
      viewWindow: {min: 0, max: 5}}
    },
  yr: {
    title: "Yr",
    series: series(['blue', 'red', 'yellow']),
    vAxis: { 
      ticks: ticks([0,1,2,3,4,5], 'm'),
      viewWindow: {min: 0, max: 5}
    },
  }
};

export const waveperiod = {
  dmi : {
    title: 'Bølgeperiode (DMI)',
    series: series(['blue', ['blue', [5, 5]],'silver']),
    vAxis: { 
      ticks: ticks([0,3,6,9,12], 's'),
      viewWindow: {min: 0, max: 12}}},
  smhi : {
    title: 'Bølgeperiode (SMHI)',
    series: series(['blue', 'blue', 'silver']),
    vAxis: { 
      ticks: ticks([0,3,6,9,12], 's'),
      viewWindow: {min: 0, max: 12}
    }
  }
};

export const swellheight = {
  dmi: {
    title: 'Dønning (DMI)',
    series: series(['red', ['red', [5, 5]],'silver']),
    vAxis: { 
      ticks: ticks([0,0.4,0.8,1.2,1.6,2], 'm'),
      viewWindow: {min: 0, max: 2}
    }
  }
};
  
export const swellperiod = {
  dmi: {
    title: 'Periode (DMI)',
    series: series(['red', ['red', [5, 5]],'silver']),
    vAxis: { 
      ticks: ticks([0,3,6,9,12], 's'),
      viewWindow: {min: 0, max: 12},
    }
  }
};

export const wind = {
  dmi: {
    title: 'Vind (DMI)',
    series: {
      0: { color: "green" }, 
      1: { color: "green", lineDashStyle: [5, 5] }
    },
    vAxis: { 
      ticks: ticks([0,4,8,12,16,20], 'm/s'),
      viewWindow: {min: 0, max: 20}
    },
  },
  frost: {
    title: 'Vind (Met)',
    pointSize: 10,
    series: series(['green', 'green', 'green', 'green', 'green']),
    vAxis: { 
      ticks: ticks([0,4,8,12,16,20], 'm/s'),
      viewWindow: {min: 0, max: 20}
    }
  }
};
  
export const score = {
  dmi: {
    series: {
      0: {color: "#FF3333"},
      1: {color: "#FF8633"},
      2: {color: "#FFC433"},
      3: {color: "#337ab7"},
      4: {color: "#7EFF33"},
      5: {color: "#4D8A2A"},
      6: {type: "line", color: "#0A1105"}
    },
    vAxis: { 
      ticks: [
        {v:0, f:'Flatt'},
        {v:17, f:'Despo'}, 
        {v:26, f:'Dårlig'},
        {v:30, f:'Ok'},
        {v:35, f:'Bra'},
        {v:46, f:'Episk'}
      ],
      viewWindow: {min: 0, max: 6}
    },
    seriesType : "bars",
    bar: {groupWidth: "100%"},
    isStacked: true
  }
};
 
function ticks(values, unit) {
  return values.map(v => {return {v: v, f: `${v}${unit}`}});
}

function series(colors) {
  let series = {};

  for (let i = 0; i < colors.length; i++) {
    if (colors[i] instanceof Array) {
      series[i] = {color: colors[i][0], lineDashStyle: colors[i[1]]};
    } else {
      series[i] = {color: colors[i]};
    }
  }
  return series;
}