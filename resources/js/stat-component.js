
function remove_stats(){
    let corr_div = document.querySelector("#corr-group");
    while (corr_div.lastChild) {
        corr_div.removeChild(corr_div.lastChild);
    }
}

export {remove_stats};