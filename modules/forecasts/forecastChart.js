function createChart(forecast, createHeader, createRow, options) { 
  let table = [];
  table.push(createHeader())
  
  forecast.forEach(f => {
    table.push(createRow(f))
  })

  let date_formatter = new google.visualization.DateFormat({ 
    pattern: "EEEE HH:mm"
  });

  if (screen.width > 800) {gFCOptions.defaults.width = screen.width };
  
  let dataTable = google.visualization.arrayToDataTable(table, false);
  date_formatter.format(dataTable, 0);
  
  let defaultOptions = JSON.parse(JSON.stringify(gFCOptions.defaults));
  options = overrideDefaultOptions(defaultOptions, options);
  
  let chart;
  let e = document.getElementById(insertHTMLElem(param, source, chartIdsuffix));
  if (param === 'score') {
    chart = new google.visualization.ComboChart(e);  
  } else {
    chart = new google.visualization.LineChart(e);
  }
  chart.draw(dataTable, options);
}



export function updateForecastChart() {
  createChart()
}