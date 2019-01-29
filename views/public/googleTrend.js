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

  let margin = {top: 20, bottom: 50, left: 80, right: 150};
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
    .scale(xScaleByWeek)
    .tickFormat(d => {
      return `${d.getMonth() + 1}月`;
    });
  let yAxis = d3.axisLeft()
    .scale(yScaleByWeek);

  gXAxis.call(xAxis);
  gYAxis.call(yAxis);

  let gLines = gChart.append('g')
    .attr('class', 'lines')
    .attr('clip-path', 'url(#mask)');

  gYAxis.append("text")
    .attr('class', 'text')
    .attr("transform", "rotate(-90)")
    .attr('fill', 'black')
    .style("font-size", "30px")
    .attr("y", 8)
    .attr("dy", "0.8em")
    .style("text-anchor", "end")
    .text("搜索量");

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

  let legendRectSize = 18, legendSpacing = 6;
  let legendData = colorSet.map((color, i) => {
    return [d3.select(`g.lines > path:nth-child(${i + 1})`).attr("data-legend"), color];
  });
  setupLegend(svg, margin, width, height, legendData, legendSpacing, legendRectSize);     

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

function setupLegend(svg, margin, w, h, legendData, legendSpacing, legendRectSize) {
  let gLegend = svg.append("g")
    .attr("transform", `translate(${w + margin.left + 50}, ${margin.top + h / 3})`);

  let legend = gLegend.selectAll('.legend')                
    .data(legendData)                              
    .enter()                                           
    .append('g')                                       
    .attr('class', 'legend')                           
    .attr('transform', function(_, i) {                
      var height = legendRectSize + legendSpacing;     
      var offset =  height * legendData.length / 2;
      var horz = -2 * legendRectSize;                  
      var vert = i * height - offset;                  
      return 'translate(' + horz + ',' + vert + ')';   
    });                                                

  legend.append('rect')                                
    .attr('width', legendRectSize)                     
    .attr('height', legendRectSize)                    
    .style('fill', d => d[1])                         
    .style('stroke', d => d[1]);                           
          
  legend.append('text')                                
    .attr('x', legendRectSize + legendSpacing)         
    .attr('y', legendRectSize - legendSpacing / 2)         
    .text(function(d) { return d[0]; }); 
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
  let mapping = {
    "what-is-eu": "什么是欧盟",
    "what-is-brexit": "什么是脱欧",
    "is-russia-in-the-eu": "俄罗斯是不是欧盟国家",
    "what-is-article-50": "什么是脱欧法案",
    "is-sweden-in-the-eu": "瑞典是不是欧盟国家",
    "what-is-single-market": "什么是单一市场"
  };
  selector.selectAll('path')
    .data(data)
    .enter()
    .append('path')
    .attr('d', d => lineGenerator(d[1]))
    .attr("data-legend", d => mapping[d[0]])
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
    .call((() => {
      xAxis.scale(xScale[ofJuneFlag]);
      if (ofJuneFlag) {
        xAxis.tickFormat(d => {
          return d3.timeFormat("%m/%d")(d);
        })
      } else {
        xAxis.tickFormat(d => {
          return `${d.getMonth() + 1}月`;
        })
      }
      return xAxis;
    })());
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
