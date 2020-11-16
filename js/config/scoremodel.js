const SCORING = {
  "settings" : {
    "waveheight": {
      "0":{"min":0.5,"points":2},
      "1":{"min":1.0,"points":4},
      "2":{"min":1.4,"points":6},
      "3":{"min":1.6,"points":8},
      "4":{"min":2.0,"points":10},
      "5":{"min":3.0,"points":12}
    },
    "waveperiod": {
      "0":{"min":4.5,"points":4},
      "1":{"min":5.5,"points":6},
      "2":{"min":6.0,"points":8},
      "3":{"min":6.5,"points":10},
      "4":{"min":8.0,"points":12},
      "5":{"min":10.0,"points":14}
    },
    "swellheight": {
      "0":{"min":0.2,"points":4},
      "1":{"min":0.4,"points":6},
      "2":{"min":0.6,"points":8},
      "3":{"min":1.0,"points":10},
      "4":{"min":1.4,"points":12},
      "5":{"min":1.8,"points":14}
    },
    "swellperiod": {
      "0":{"min":5.0,"points":6},
      "1":{"min":5.8,"points":9},
      "2":{"min":6.2,"points":12},
      "3":{"min":7.0,"points":15},
      "4":{"min":8.0,"points":18},
      "5":{"min":10.0,"points":21}
    },
    "wind": {
      "0":{"min":6,"points":0},
      "1":{"min":8,"points":4},
      "2":{"min":10,"points":6},
      "3":{"min":12,"points":8},
      "4":{"min":14,"points":10},
      "5":{"min":16,"points":12}
    }
  },
  "tresholds": {
    "0" : {"min":0,"points":0},
    "1" : {"min":17,"points":1},
    "2" : {"min":26,"points":2},
    "3" : {"min":30,"points":3},
    "4" : {"min":35,"points":4},
    "5" : {"min":46,"points":5}
  },
  "labels": {
    "0" : {"name":"Flatt","badge":"danger"},
    "1" : {"name":"Despo","badge":"warning"},
    "2" : {"name":"Dårlig","badge":"info"},
    "3" : {"name":"Ok","badge":"info"},
    "4" : {"name":"Bra","badge":"success"},
    "5" : {"name":"Episk","badge":"success"},
    "9" : {"name":"Utblåst","badge":"danger"},
  }
};

const SCORING1 = {
  "settings" : {
    "waveheight": {
      "0":{"min":0.5,"points":3},
      "1":{"min":1.4,"points":4},
      "2":{"min":1.6,"points":6},
      "3":{"min":2.0,"points":7},
      "4":{"min":2.5,"points":8},
      "5":{"min":3.0,"points":10}
    },
    "waveperiod": {
      "0":{"min":5.0,"points":5},
      "1":{"min":5.0,"points":6},
      "2":{"min":5.5,"points":8},
      "3":{"min":6.5,"points":9},
      "4":{"min":8.0,"points":10},
      "5":{"min":10.0,"points":12}
    },
    "swellheight": {
      "0":{"min":0.2,"points":3},
      "1":{"min":0.4,"points":4},
      "2":{"min":0.6,"points":6},
      "3":{"min":1.0,"points":7},
      "4":{"min":1.4,"points":8},
      "5":{"min":1.8,"points":10}
    },
    "swellperiod": {
      "0":{"min":5.0,"points":5},
      "1":{"min":5.8,"points":6},
      "2":{"min":6.2,"points":9},
      "3":{"min":7.0,"points":10},
      "4":{"min":8.0,"points":12},
      "5":{"min":10.0,"points":16}
    },
    "wind": {
      "0":{"min":6,"points":0},
      "1":{"min":8,"points":2},
      "2":{"min":10,"points":4},
      "3":{"min":12,"points":6},
      "4":{"min":14,"points":8},
      "5":{"min":16,"points":10}
    }
  },
  "tresholds": {
    "0" : {"min":0,"points":0},
    "1" : {"min":17,"points":1},
    "2" : {"min":26,"points":2},
    "3" : {"min":30,"points":3},
    "4" : {"min":35,"points":4},
    "5" : {"min":46,"points":5}
  },
  "labels": {
    "0" : {"name":"Flatt","badge":"danger"},
    "1" : {"name":"Despo","badge":"warning"},
    "2" : {"name":"Dårlig","badge":"info"},
    "3" : {"name":"Ok","badge":"info"},
    "4" : {"name":"Bra","badge":"success"},
    "5" : {"name":"Episk","badge":"success"},
    "9" : {"name":"Utblåst","badge":"danger"},
  }
};
