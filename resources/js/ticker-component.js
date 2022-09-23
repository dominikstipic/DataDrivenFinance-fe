let tickers = ["SPY"];

function get_tickers(){
    let tickers_div = document.querySelector("#div-tickers");
    return Array.from(tickers_div.children).map(e => {
      return e.textContent;
    });
}
  
function add_ticker(ticker){
    let row = document.createElement('div');
    row.className = "row ticker-row";
    row.id = ticker;
  
    let li = document.createElement('li');
    li.className = "col-sm-9 list-group-item ticker-li";
    li.innerText = ticker;
    row.appendChild(li);
  
    let input = document.createElement('input');
    input.className = "col-sm form-control ticker-input";
    input.type = "number";
    input.step = "0.01";
    input.min = 0;
    input.max = 1;
    row.appendChild(input);
  
    document.querySelector("#div-tickers").appendChild(row);
    tickers.push(ticker);
}
  
function remove_tickers(){
    let tickers_div = document.querySelector("#div-tickers");
    while (tickers_div.lastChild) {
        tickers_div.removeChild(tickers_div.lastChild);
    }
}
  
export {get_tickers, add_ticker, remove_tickers, tickers};