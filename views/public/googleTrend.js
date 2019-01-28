function loadData() {
  let url = 'public/data/GoogleTrend.csv';

  d3.csv(url)
    .then(processData)
    .catch(e => console.error(e));
}

function processData(data) {
  if (data) {
    let keys = [...data.columns];

    let processedData = {};
    keys.forEach(key => processedData[key] = data.map(d => d[key])); 
    
    render(processedData);
  }
}

function render(data) {
  if (data) {
    console.log(data);
  }
}

// // window.onload = loadData;

// d3.csv('public/data/GoogleTrend.csv').then(render);