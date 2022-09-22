import {StockChart} from "./chart.js";

function send_req(ticker, start, end, attribute, returns, callback){
  let host_url = [];
  if(returns){
    host_url = `http://localhost:8080/api/stats/${ticker}/${attribute}/returns`;
  }
  else{
    host_url = `http://localhost:8080/api/data/${ticker}/${attribute}`;
  }
  var url = new URL(host_url);
  url.searchParams.append("start", start);
  url.searchParams.append("end", end);
  fetch(url).
    then(response => {
      if (!response.ok)
          throw new Error("HTTP error: " + response.status);
      return response.json();
    })
    .then(data => {
      callback(data);
    });
}

function get_attributes(){
  let opt1 = document.querySelector("#option1");
  let opt2 = document.querySelector("#option2");
  let opt3 = document.querySelector("#option3");
  let opts = [opt1, opt2, opt3];
  let value = [];
  opts.forEach(element => {
      if(element.checked){
        value = element.value;
      }
  });
  return value;
}

///////////////// TICKER COMPONENT /////////////////////////////

function get_tickers(){
  let tickers_div = document.querySelector("#div-tickers");
  return Array.from(tickers_div.children).map(e => {
    return e.textContent;
  });
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

function remove_all_tickers(){
  let tickers_div = document.querySelector("#div-tickers");
  while (tickers_div.lastChild) {
    tickers_div.removeChild(tickers_div.lastChild);
  }
  
}

function remove_all_stats(){
  let corr_div = document.querySelector("#corr-group");
  while (corr_div.lastChild) {
    corr_div.removeChild(corr_div.lastChild);
  }
}


///////////////// HANDLERS /////////////////////////////

function handler(components){
  if(components.text_bar.value === ""){
    return;
  }
  let ticker = components.text_bar.value;
  let [start, end] = [components.start_date_picker.value, components.end_date_picker.value];
  let attribute = get_attributes();
  let returns = components.returns_switch.checked;
  send_req(ticker, start, end, attribute, returns, data => {
    chart.add([data]);
    chart.render();
  });
  components.text_bar.value = "";
  add_ticker(ticker);
  stats_handler(components);
}

function stats_handler(components){
  remove_all_stats();
  let tickers = get_tickers();
  let [start, end] = [components.start_date_picker.value, components.end_date_picker.value];
  let attribute = get_attributes();
  let host_url = [];
  if(components.returns_switch.checked){
    host_url = `http://localhost:8080/api/stats/${attribute}/corr`;
  }
  else{
    host_url = `http://localhost:8080/api/stats/${attribute}/returns/corr`;
  }
  var url = new URL(host_url);
  url.searchParams.append("start", start);
  url.searchParams.append("end", end);

  let opt = {
    method: "POST",
    body: JSON.stringify(tickers),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  };

  fetch(url, opt).
    then(response => {
      if (!response.ok)
          throw new Error("HTTP error: " + response.status);
      return response.json();
    })
    .then(data => {
      let matrix = data.value[0].data; 
      for(let i = 0; i < tickers.length - 1; ++i){
        for(let j = i + 1; j < tickers.length; ++j){
          let [t1, t2] = [tickers[i], tickers[j]];
          let corr = matrix[i][j];
          let str = `corr(${t1}, ${t2}) = ${corr}`;

          let new_div = document.createElement('li');
          new_div.className = "list-group-item";
          new_div.innerText = str;
          let corr_div = document.querySelector("#corr-group");
          corr_div.appendChild(new_div);
        }
      }
    });
}

///////////////// INIT /////////////////////////////

let components = {
  search_bar: document.querySelector("#search-btn"),
  text_bar: document.querySelector("#search-text"),
  start_date_picker: document.querySelector("#start"),
  end_date_picker: document.querySelector("#end"), 
  returns_switch: document.querySelector("#returns-switch"), 
  remove_btn: document.querySelector("#remove-btn"), 
  stats_btn: document.querySelector("#stats-btn")
}

const present_date = new Date();
const past_date = new Date();
past_date.setFullYear(present_date.getFullYear() - 1);
components.end_date_picker.value = present_date.toISOString().split('T')[0].slice(0, 10);
components.start_date_picker.value = past_date.toISOString().split('T')[0].slice(0, 10);

let tickers = ["SPY"];
let chart = new StockChart();
send_req(tickers[0], 
  components.start_date_picker.value, 
  components.end_date_picker.value, 
  get_attributes(), 
  components.returns_switch.checked,
  data => {
    chart.add([data]);
    chart.render();
})
add_ticker(tickers[0]);

///////////////// LISTENERS /////////////////////////////

components.search_bar.onclick = () => handler(components);
components.text_bar.onkeypress = event => {
  if (event.key === "Enter"){
    handler(components);
  }
};  
components.remove_btn.onclick = () => {
  chart.remove_all();
  chart.render();
  remove_all_tickers();
  remove_all_stats();
}

//components.stats_btn.onclick = () => stats_handler(components);
