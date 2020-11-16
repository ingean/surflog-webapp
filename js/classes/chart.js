class Chart {
  constructor(elementId, title = '', table = [], options = {}, chartType = 'line') { 
    this.element = $('#chart-' + elementId);
    this.title = title;
    this.table = table;
    this.options = options;
    this.isDataTable = false;
    this.elementId = elementId;
    this.chart = null;
    this.chartType = chartType;
  }
  toDataTable(firstRowIsData) {
    this.table = google.visualization.arrayToDataTable(this.table, firstRowIsData);
    this.isDataTable = true;
  }
  makeChart() {
    if (this.chartType === 'Combo') {
      this.chart = new google.visualization.ComboChart(this.element);
    } else {
      this.chart = new google.visualization.LineChart(this.element);  
    }
  }
  draw() {
    this.chart.draw(this.table,this.options)
  }

}