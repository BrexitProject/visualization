async function loadData() {
  let dataByWeek = await d3.csv('public/data/GoogleTrendByWeek.csv');
  let dataOfJune = await d3.csv('public/data/GoogleTrendOfJune.csv');
  if (dataByWeek && dataOfJune) {
    let {newDataByWeek, newDataOfJune} = processData1(dataByWeek, dataOfJune);
    newDataByWeek.columns = dataByWeek.columns;
    newDataOfJune.columns = dataOfJune.columns;
    console.log(newDataByWeek, newDataOfJune);
    processData(newDataByWeek, newDataOfJune);
  }
}

function processData1(dataByWeek, dataOfJune) {
  let baseByWeek = dataByWeek.length;
  let baseOfJune = dataOfJune.length;
  let base = (baseByWeek - 1) * (baseOfJune - 1)/ gcd(baseByWeek - 1, baseOfJune - 1); 
  let parser = d3.timeParse("%Y-%m-%d");
  let formatter = d3.timeFormat("%Y-%m-%d-%H-%M-%S");
  let newDataByWeek = interpolate(dataByWeek, base, parser, formatter);
  let newDataOfJune = interpolate(dataOfJune, base, parser, formatter);

  return {newDataByWeek, newDataOfJune};
}

function interpolate(data, base, parser, formatter) {
  let len = data.length;
  let numPerGroup = base / (data.length - 1);
  let newData = [];

  for (let i = 0; i < len - 1; i += 1) {
    let scaleSet = Object.keys(data[i]).map(key => {
      if (key === 'date') {
        return d3.interpolateDate(parser(data[i][key]), parser(data[i + 1][key]));
      } else {
        return d3.interpolateNumber(parseFloat(data[i][key]), parseFloat(data[i + 1][key]));
      }
    });

    for (let j = 0; j < numPerGroup; j += 1) {
      let item = {};
      Object.keys(data[i]).forEach((key, k) => {
        item[key] = scaleSet[k](j / numPerGroup);
        if (key === 'date') {
          item[key] = formatter(item[key]);
        }
      });
      newData.push(item);
    }
  }

  newData.push({...data[len - 1]});
  Object.keys(newData[base]).forEach(key => {
    if (key === 'date') {
      newData[base][key] = formatter(parser(newData[base][key]));
    } else {
      newData[base][key] = parseFloat(newData[base][key]);
    }
  });

  return newData;
}

function gcd(a, b) {
  if (!b) {
    return a;
  }
  return gcd(b, a % b);
};

function processData(dataByWeek, dataOfJune) {
  let keys = [...dataByWeek.columns];

  let processedDataByWeek = {}, processedDataOfJune = {};
  keys.forEach(key => {
    processedDataByWeek[key] = dataByWeek.map(d => d[key]);
    processedDataOfJune[key] = dataOfJune.map(d => d[key]);
  });

  let dateByWeek = processedDataByWeek['date'];
  let dateOfJune = processedDataOfJune['date'];
  delete processedDataByWeek.date;
  delete processedDataOfJune.date

  let maxValSetByWeek = [], maxValSetOfJune = [];
  keys.map(key => {
    if (key !== "date") {
      maxValSetByWeek.push([key, Math.max(...processedDataByWeek[key])]);
      maxValSetOfJune.push([key, Math.max(...processedDataOfJune[key])]);
    }
  });

  Object.keys(processedDataByWeek).forEach(key => {
    processedDataByWeek[key] = processedDataByWeek[key].map((d, i) => ({date: dateByWeek[i], val: d}));
  });
  Object.keys(processedDataOfJune).forEach(key => {
    processedDataOfJune[key] = processedDataOfJune[key].map((d, i) => ({date: dateOfJune[i], val: d}));
  });

  maxValSetByWeek.sort((a, b) => a[1] - b[1]);
  maxValSetOfJune.sort((a, b) => a[1] - b[1]);

  let datasetByWeek = {processedDataByWeek, maxValSetByWeek, dateByWeek};
  let datasetOfJune = {processedDataOfJune, maxValSetOfJune, dateOfJune};
  
  render(datasetByWeek, datasetOfJune);
}

async function render(datasetByWeek, datasetOfJune) {
  let {processedDataByWeek, maxValSetByWeek, dateByWeek} = datasetByWeek;
  let {processedDataOfJune, maxValSetOfJune, dateOfJune} = datasetOfJune;

  let margin = {top: 20, bottom: 50, left: 80, right: 60};
  let svgWidth = 1300;
  let svgHeight = 600;

  let width = svgWidth - margin.left - margin.right;
  let height = svgHeight - margin.top - margin.bottom;

  let svg = d3.select("#svg");

  svg.append('clipPath')
    .attr('id', 'mask')
    .append('rect')
    .attr('width', width)
    .attr('height', height);

  let gChart = svg.append('g')
    .attr('class', 'chart')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  let gXAxis = gChart.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(${0},${height})`);
  let gYAxis = gChart.append('g')
    .attr('class', 'y-axis');

  let parser = d3.timeParse("%Y-%m-%d-%H-%M-%S");
  // let parser = d3.timeParse("%Y-%m-%d");
  let xScaleByWeek = defineXScale(dateByWeek, width, parser);
  let yScaleByWeek = defineYScale([0, Math.max(...maxValSetByWeek.map(d => d[1])) * 1.1], height);
  let xScaleOfJune = defineXScale(dateOfJune, width, parser);
  let yScaleOfJune = defineYScale([0, Math.max(...maxValSetOfJune.map(d => d[1])) * 1.1], height);
  let ofJuneFlag = 0;
  let xScale = [xScaleByWeek, xScaleOfJune];
  let yScale = [yScaleByWeek, yScaleOfJune];

  let xAxis = d3.axisBottom()
    .scale(xScaleByWeek);
  let yAxis = d3.axisLeft()
    .scale(yScaleByWeek);

  gXAxis.call(xAxis);
  gYAxis.call(yAxis);

  let gLines = gChart.append('g')
    .attr('class', 'lines')
    .attr('clip-path', 'url(#mask)');
  let colorSet = ['#7fc97f', '#beaed4', '#fdc086',
    '#ffff99', '#386cb0', '#f0027f'];
  let lineGenerator = d3.line()
    .x(d => xScale[0](parser(d.date)))
    .y(d => yScale[0](d.val));
    // .curve(d3.curveCardinal);
  let processedData = Object.keys(processedDataByWeek).map(key => {
    return [key, processedDataByWeek[key], processedDataOfJune[key]];
  });
  
  renderAll(processedData, lineGenerator, colorSet, gLines, ofJuneFlag);

  let order = maxValSetByWeek.map(d => d[0]);
  let delay = 3000;
  let duration = 2000;

  for (let [index, key] of order.entries()) {
    let item = maxValSetOfJune.find(d => d[0] === key);
    // darkenOtherLines(key, gLines, duration, 0);
    await fitLine(parser, key, [0, maxValSetByWeek[index][1] * 1.1], [0, item[1] * 1.1], gYAxis, yAxis, yScale, gXAxis, xAxis, xScale, lineGenerator, gLines, delay, duration);
    console.log(index, key);
    if (index === order.length - 1) {
      darkenOtherLines('', gLines, duration, 1);
    }
  }
}

function defineXScale(domain, width, parser) {
  return d3.scaleTime()
    .domain([parser(domain[0]), parser(domain[domain.length - 1])])
    .range([0, width]);
}

function defineYScale(domain, height) {
  return d3.scaleLinear()
    .domain(domain)
    .range([height, 0]);
}

function updateYScale(yScale, domain, ofJuneFlag) {
  yScale[ofJuneFlag].domain(domain);
}

function renderAll(data, lineGenerator, colorSet, selector) {
  selector.selectAll('path')
    .data(data)
    .enter()
    .append('path')
    .attr('d', d => lineGenerator(d[1]))
    .attr("fill", "none")
    .attr("stroke-width","0.16em")
    .attr("stroke", (_, i) => colorSet[i]);
}

async function fitLine(parser, key, rangeByWeek, rangeOfJune, gYAxis, yAxis, yScale, gXAxis, xAxis, xScale, lineGenerator, selector, delay, duration) {
  return new Promise(resolve => {
    setTimeout(async () => {
      updateYScale(yScale, rangeByWeek, 0);
      updateYAxis(gYAxis, yAxis, yScale, duration, 0);
      updateLines(parser, selector, yScale, xScale, lineGenerator, duration, 0);
      darkenOtherLines(key, selector, duration, 0);
      await spanLine(parser, rangeOfJune, gYAxis, yAxis, yScale, gXAxis, xAxis, xScale, lineGenerator, selector, delay, duration);
      console.log("span", key);
      await restoreLine(parser, rangeByWeek, gYAxis, yAxis, yScale, gXAxis, xAxis, xScale, lineGenerator, selector, delay, duration);
      console.log("restore", key);
      resolve("OK");
    }, delay);
  });
}

function darkenOtherLines(key, selector, duration, showAllFlag) {
  selector.selectAll('path')
    // .filter(d => {
    //   return d[0] !== key;
    // })
    // .transition()
    // .duration(duration)
    .attr('stroke-opacity', d => {
      if (!showAllFlag) {
        return d[0] !== key ? 0.1 : 1;
      } else {
        return 1;
      }
    });
}

function restoreOtherLines(key, selector, duration) {
  selector.selectAll('path')
    .filter(d => {
      return d[0] !== key;
    })
    // .transition()
    // .duration(duration)
    .attr('stroke-opacity', 1);
}

function updateYAxis(gYAxis, yAxis, yScale, duration, ofJuneFlag) {
  gYAxis
    .transition()
    .ease(d3.easeLinear)
    .duration(duration)
    .call(yAxis.scale(yScale[ofJuneFlag]));
}

function updateLines(parser, selector, yScale, xScale, lineGenerator, duration, ofJuneFlag) {
  lineGenerator.x(d => xScale[ofJuneFlag](parser(d.date)))
    .y(d => yScale[ofJuneFlag](d.val));

  selector.selectAll('path')
    .transition()
    .ease(d3.easeLinear)
    .duration(duration)
    .attr('d', d => {
      return lineGenerator(d[1 + ofJuneFlag])
    })
}

function updateXAxis(gXAxis, xAxis, xScale, duration, ofJuneFlag) {
  gXAxis
    .transition()
    .ease(d3.easeLinear)
    .duration(duration)
    .call(xAxis.scale(xScale[ofJuneFlag]));
}

function spanLine(parser, range, gYAxis, yAxis, yScale, gXAxis, xAxis, xScale, lineGenerator, selector, delay, duration) {
  return new Promise(resolve => {
    setTimeout(() => {
      updateYScale(yScale, range, 1);
      updateYAxis(gYAxis, yAxis, yScale, duration, 1);
      updateXAxis(gXAxis, xAxis, xScale, duration, 1);
      updateLines(parser, selector, yScale, xScale, lineGenerator, duration, 1);
      resolve();
    }, delay);
  });
}

function restoreLine(parser, range, gYAxis, yAxis, yScale, gXAxis, xAxis, xScale, lineGenerator, selector, delay, duration) {
  return new Promise(resolve => {
    setTimeout(() => {
      updateYScale(yScale, range, 0);
      updateYAxis(gYAxis, yAxis, yScale, duration, 0);
      updateXAxis(gXAxis, xAxis, xScale, duration, 0);
      updateLines(parser, selector, yScale, xScale, lineGenerator, duration, 0);
      resolve();
    }, delay);
  });
}
