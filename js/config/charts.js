var gFCOptions = 
{
  defaults: {
    width:1500,
    height:120,
    interpolateNulls: true, 
    titleTextStyle: {fontSize: 12},
    titlePosition: 'in',
    annotations: {
      textStyle: {
        fontSize: 10,
        bold: true
      }
    },
    chartArea: {
      width: '95%',
      height: '100%'
    },
    focusTarget: 'category',
    hAxis: {
      textStyle : {fontSize: 12,
        color:'gray',
        auraColor:'white',
        },
      textPosition:'none', 
      gridlines: { 
          count: 20,
          units: {
              days: {format: ['EEEE']},
              hours: {format: ['HH']},
          },
          color: 'silver' 
      }
    },
    tooltip: {
      isHtml:true,
      ignoreBounds: true,
      textStyle: {
        fontName: 'Verdana',
        fontSize: 10,
      }
    },
    vAxis: {
      textStyle : {fontSize: 8}
    },
    legend: 'none',
    curveType: 'function', 
    tooltip: { isHtml: true },
    intervals: {style: 'area'}
  },
  waveheight: {  
    dmi: {
      title: 'Bølgehøyde (DMI)',
      series: {
        0: { color: "blue" }, 
        1: { color: "blue", lineDashStyle: [5, 5] },
        2: { color: "silver"} 
      },
      vAxis: { 
        ticks: [
          {v:0, f:' '},
          {v:1, f:'1m'}, 
          {v:2, f:'2m'},
          {v:3, f:'3m'},
          {v:4, f:'4m'},
          {v:5, f:'5m'}
        ],
        textStyle : {fontSize: 8},
        viewWindow: {min: 0, max: 5}}},
    smhi: {
      title: "SMHI",
      series: {
          0: { color: "blue" }, 
          1: { color: "green"},
          2: { color: "silver" },
          3: { color: "silver" } 
      },
      vAxis: { 
        ticks: [
          {v:0, f:' '},
          {v:1, f:'1m'}, 
          {v:2, f:'2m'},
          {v:3, f:'3m'},
          {v:4, f:'4m'},
          {v:5, f:'5m'}
        ],
        textStyle : {fontSize: 8},
        viewWindow: {min: 0, max: 5}}},
      },
      yr: {
        title: "Yr",
        series: {
            0: { color: "blue" }, 
            1: { color: "red"},
            2: { color: "yellow" }
        },
        vAxis: { 
          ticks: [
            {v:0, f:' '},
            {v:1, f:'1m'}, 
            {v:2, f:'2m'},
            {v:3, f:'3m'},
            {v:4, f:'4m'},
            {v:5, f:'5m'}
          ],
          textStyle : {fontSize: 8},
          viewWindow: {min: 0, max: 5}
        },
        hAxis: {
          textPosition: "in",
          textStyle : {fontSize: 12,
            color:'gray',
            auraColor:'white',
            },
          gridlines: { 
              //count: 20,
              units: {
                  days: {format: ['EEEE']},
                  hours: {format: ['HH']},
              },
              color: 'silver' 
          }
        }
      },
    waveperiod: {
      dmi : {
        title: 'Bølgeperiode (DMI)',
        series: {
        0: { color: "blue" }, 
        1: { color: "blue", lineDashStyle: [5, 5] },
        2: { color: "silver" }
      },
      vAxis: { 
        ticks: [
          {v:0, f:' '},
          {v:3, f:'3s'}, 
          {v:6, f:'6s'},
          {v:9, f:'9s'},
          {v:12, f:'12s'}
        ],
        textStyle : {fontSize: 8},
        viewWindow: {min: 0, max: 12}}},
    smhi : {
      series: {
        0: { color: "blue" }, 
        1: { color: "blue"},
        2: { color: "silver"}
      },
      vAxis: { 
        ticks: [
          {v:0, f:' '},
          {v:3, f:'3s'},
          {v:6, f:'6s'},
          {v:9, f:'9s'},
          {v:12, f:'12s'}
        ],
        textStyle : {fontSize: 8},
        viewWindow: {min: 0, max: 12}}}},
  swellheight: {
    dmi: {
      title: 'Dønning (DMI)',
      series: {
      0: { color: "red" }, 
      1: { color: "red", lineDashStyle: [5, 5] },
      2: { color: "silver"}
    },
      vAxis: { 
        ticks: [
          {v:0, f:' '},
          {v:0.4, f:'0.4m'}, 
          {v:0.8, f:'0.8m'},
          {v:1.2, f:'1.2m'},
          {v:1.6, f:'1.6m'},
          {v:2, f:'2m'},
        ],
        textStyle : {fontSize: 8},
        viewWindow: {min: 0, max: 2}}}},
    swellperiod: {
      dmi: {
        title: 'Periode (DMI)',
        series: {
          0: { color: "red" }, 
          1: { color: "red", lineDashStyle: [5, 5] },
          2: { color: "silver"}
        },
        vAxis: { 
          ticks: [
            {v:0, f:' '},
            {v:3, f:'3s'},
            {v:6, f:'6s'},
            {v:9, f:'9s'},
            {v:12, f:'12s'}
          ],
          textStyle : {fontSize: 8},
          viewWindow: {min: 0, max: 12},
          textStyle : {fontSize: 8}
        },
        hAxis: {
          textPosition: "in",
          textStyle : {fontSize: 12,
            color:'gray',
            auraColor:'white',
            },
          gridlines: { 
              count: 20,
              units: {
                  days: {format: ['EEEE']},
                  hours: {format: ['HH']},
              },
              color: 'silver' 
          }
        }
      }
    },
    wind: {
      dmi: {
        series: {
          0: { color: "green" }, 
          1: { color: "green", lineDashStyle: [5, 5] }
        },
        vAxis: { 
          ticks: [
            {v:0, f:' '},
            {v:4, f:'4 m/s'}, 
            {v:8, f:'8 m/s'},
            {v:12, f:'12 m/s'},
            {v:16, f:'16 m/s'},
            {v:20, f:'20 m/s'}
          ],
        textStyle : {fontSize: 8},
        viewWindow: {min: 0, max: 20}
      },
      hAxis: {textPosition: "none"}
    },
    frost: {
      pointSize: 10,
      series: {
        0: { color: "green"}, 
        1: { color: "green"},
        2: { color: "green"},
        3: { color: "green"},
        4: { color: "green"}
      },
      vAxis: { 
        ticks: [
          {v:0, f:' '},
          {v:4, f:'4 m/s'}, 
          {v:8, f:'8 m/s'},
          {v:12, f:'12 m/s'},
          {v:16, f:'16 m/s'},
          {v:20, f:'20 m/s'}
        ],
      textStyle : {fontSize: 8},
      viewWindow: {min: 0, max: 20}
    },
    hAxis: {textPosition: "none"}
  }
  },
  score: {
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
        textStyle : {fontSize: 8},
        viewWindow: {min: 0, max: 6}
      },
      hAxis: {textPosition: "none"},
      seriesType : "bars",
      bar: {groupWidth: "100%"},
      isStacked: true
    }
  }
}
   