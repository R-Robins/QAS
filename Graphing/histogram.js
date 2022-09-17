var histogramHeight = 380;
var defaultData = [4, 3, 10, 9, 29, 19, 22];
var defaultCategories = [10,20,30,40,50,60,70]
var options = {
    series: [{
    data: defaultData
  }],
    chart: {
    type: "histogram",
    height: histogramHeight,
    foreColor: "#999",
    events: {
      dataPointSelection: function(e, chart, opts) {
        var arraySelected = []
        opts.selectedDataPoints.map(function(selectedIndex) {
          return selectedIndex.map(function(s) {
            return arraySelected.push(chart.w.globals.series[0][s])
          })
  
        });
        arraySelected = arraySelected.reduce(function(acc, curr) {
          return acc + curr;
        } , 0)
  
        document.querySelector("#selected-count").innerHTML = arraySelected
      }
    }
  },
  plotOptions: {
    bar: {
      dataLabels: {
        enabled: false
      }
    }
  },
  states: {
    active: {
      allowMultipleDataPointsSelection: true
    }
  },
  dataLabels: {
    enabled: false
 
  },
  xaxis: {
    tickAmount: 10,
    tickPlacement: 'between',
    categories: defaultCategories,
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: true
    }
  },
  yaxis: {
    tickAmount: 4,
    labels: {
      offsetX: -5,
      offsetY: -5
    }
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val
      }
    }
  }
};
  

function setTitle(title){
  options.title = {
    text: `${title}`,
    floating: true,
    offsetY: 0,
    align: 'center',
    style: {
      color: '#444',
      fontSize: '18px'
    }
  }
} 
function setLabelX(xLabel){
  options.xaxis.title = {
    text: `${xLabel}`,
    offsetY: -20,
    style: {
      fontSize: '14px',
      color: 'black',
      fontWeight: 'normal'
    }
  }
}
function setLabelY(yLabel){
  options.yaxis.title = {
    text: `${yLabel}`,
    style: {
      fontSize: '14px',
      color: 'black',
      fontWeight: 'normal',
      
    }
  }
}
function setLabels(xLabel, yLabel){
  setLabel(xLabel);
  setLabel(yLabel);
}
function setData(data, categories){
    options.series = [{name:"", data}];
    options.xaxis.categories = categories; 
}
var chart;
function createHistogram(data, categories, title = null, xLabel = null, yLabel = null){
  setData(data, categories);
  if(title !== null){
    setTitle(title);
  }
  if(xLabel !== null)
    setLabelX(xLabel);
  
  if(yLabel !== null)
    setLabelY(yLabel);

  if(chart !== undefined)
    delete chart;
    
  chart = new ApexCharts(document.querySelector("#chart"), options);
  
  chart.render();
  chart.addEventListener("dataPointSelection", function(e, opts) {console.log(e, opts)})
}

