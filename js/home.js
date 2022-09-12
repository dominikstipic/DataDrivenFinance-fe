class StockChart{
  NAME = "chartContainer"
  constructor(){
    this.opts = {
      animationEnabled: true,
      exportEnabled: true,
      charts: [{
        axisX: {
          crosshair: {
            enabled: true,
            snapToDataPoint: true
          }
        },
        axisY: {
          crosshair: {
            enabled: true
          }
        },
        data: []
      }], 
      rangeSelector: {
        inputFields: {
          startValue: 0,
          endValue: 0,
          valueFormatString: "###0"
        }
      }
    };
  }

  get_length(){
    if(this.get_data().length == 0){
      return 0;
    }
    else{
      let dataPoints = this.get_data()[0].dataPoints;
      return dataPoints.length;
    }
  }

  get_data(){
    return this.opts.charts[0].data;
  }

  put_data(data){
    this.opts.charts[0].data = data;
  }

  update_range(){
      let len = this.get_length();
      let range = {
          startValue: len/2 - len/4,
          endValue: len/2 + len/4,
          valueFormatString: "###0"
      }
      this.opts.rangeSelector.inputFields = range;
  }

  prepare_data(data){
    var dataSeries = { type: "spline" };
    let dataPoints = [];
    for(var i = 0; i < data.time.length; ++i){
      let parts = data.time[i].split(" ");
      var item = {
        x: new Date(parts[2] + " " + parts[1] + " " + parts[5]),
        y: data.values[i]
      };
      dataPoints.push(item);
    }
    dataSeries.dataPoints = dataPoints;
    return dataSeries;
  }

  add(data){
    data = data.map(d => this.prepare_data(d));
    let old_data = this.get_data();
    let new_data = old_data.concat(data);
    this.put_data(new_data);
    this.update_range();
  }

  render(){
    var stockChart = new CanvasJS.StockChart(this.NAME, this.opts);
    stockChart.render()
  }
}

function send_req(ticker, start, end, callback){
  const SERVER = "http://localhost:8080/api/data";
  let host_url = SERVER + "/" + ticker;
  var url = new URL(host_url);
  url.searchParams.append("start", start);
  url.searchParams.append("end", end);
  fetch(url).
    then(response => {
      if (!response.ok)
          throw new Error("HTTP error: " + response.status);
      return response.json();
    })
    .then(json => {
      var data = json.timeseries.close;
      callback(data);
    });
}

function search_handler(){
  let ticker = document.querySelector("#search-text").value;
  let queryParams = new URLSearchParams(window.location.search);
  let start = queryParams.get("start");
  let end = queryParams.get("end");
  return [ticker, start, end];

}

function add_ticker(ticker){
  let new_div = document.createElement('div');
  new_div.className = "div-ticker";
  new_div.innerText = ticker;
  new_div.id = ticker;

  tickers.push(ticker);
  let tickers_div = document.querySelector("#div-tickers");
  tickers_div.appendChild(new_div);
}

//////////////////////////////////////////////


let tickers = ["SPY"];
let start = "2021-01-01";
let end = "2022-01-1";
let chart = new StockChart();
send_req(tickers[0], start, end, data => {
  chart.add([data]);
  chart.render();
})
add_ticker(tickers[0]);




let search_bar = document.querySelector("#search-btn");
let text_bar = document.querySelector("#search-text");
search_bar.onclick = search_handler;
text_bar.onkeypress = event => {
  if (event.key === "Enter") {
    let [ticker, start, end] = search_handler();
    send_req(ticker, start, end, data => {
      chart.add([data]);
      chart.render();
    })

    text_bar.value = "";
    add_ticker(ticker);
  }
};  
