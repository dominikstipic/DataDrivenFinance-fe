export class StockChart{
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
  
    remove_all(){
        this.put_data([]);
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