async function loadData() {
  let dataW = await d3.csv('public/data/GoogleTrendByDayW.csv');
  let dataI = await d3.csv('public/data/GoogleTrendByDayI.csv');
  if (dataW && dataI) {
    // let {newDataByWeek, newDataOfJune} = processData1(dataByWeek, dataOfJune);
    // newDataByWeek.columns = dataByWeek.columns;
    // newDataOfJune.columns = dataOfJune.columns;
    console.log(dataW, dataI);
    let data = [dataW, dataI];
    for (let rawData of data) {
      let dataset = processData(rawData);
      await render(dataset);
    }
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

function processData(data) {
  let keys = [...data.columns];

  let processedData = {};
  keys.forEach(key => {
    processedData[key] = data.map(d => d[key]);
  });

  let date = processedData['date'];
  delete processedData.date;

  // let maxValSet = data.map(datum => {
  //   let cnt = 0;
  //   Object.keys(datum).forEach(key => {
  //     if (key !== "date") {
  //       cnt += parseFloat(datum[key]);
  //     }
  //   });
  //   return [datum["date"], cnt];
  // });
  let maxValSet = [];
  keys.map(key => {
    if (key !== "date") {
      maxValSet.push([key, Math.max(...processedData[key])]);
    }
  });

  Object.keys(processedData).forEach(key => {
    processedData[key] = processedData[key].map((d, i) => ({date: date[i], val: d}));
  });

  maxValSet.sort((a, b) => b[1] - a[1]);
  keys = maxValSet.map(d => d[0]);

  // let stackedData = d3.stack().keys(maxValSet.map(d => d[0]))(data);
  let stackedData = keys.map(key => processedData[key]);
  keys.map((key, i) => stackedData[i]["key"] = key);

  let dataset = {processedData, maxValSet, date, stackedData, keys};
  
  return dataset;
}

function clearSvg(selector) {
  selector.selectAll("*").remove();
}

function render(dataset) {
  let {processedData, maxValSet, date, stackedData, keys} = dataset;

  let margin = {top: 20, bottom: 50, left: 80, right: 150};
  let svgWidth = 1300;
  let svgHeight = 600;

  let width = svgWidth - margin.left - margin.right;
  let height = svgHeight - margin.top - margin.bottom;

  let svg = d3.select("#svg");

  clearSvg(svg);

  svg.append('clipPath')
    .attr('id', 'path-mask')
    .append('rect')
    .attr('width', width)
    .attr('height', height);

  svg.append('clipPath')
    .attr('id', 'xAxis-mask')
    .append('rect')
    .attr('x', -15)
    .attr('width', width + 15)
    .attr('height', height);

  let gChart = svg.append('g')
    .attr('class', 'chart')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  let gXAxis = gChart.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(${0},${height})`)
    .attr('clip-path', 'url(#xAxis-mask)');
  let gYAxis = gChart.append('g')
    .attr('class', 'y-axis');

  let parser = d3.timeParse("%Y-%m-%d");
  let xScaleByYear = defineXScale(date, width, parser);
  let xScaleOfJune = defineXScale(["2016-06-01", "2016-06-30"], width, parser);
  let yScale = defineYScale([0, Math.max(...maxValSet.map(d => d[1]))], height);
  let xScale = [xScaleByYear, xScaleOfJune];

  let xAxis = d3.axisBottom()
    .scale(xScale[0])
    .tickFormat(d => {
      return `${d.getMonth() + 1}月`;
    });
  let yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(5);

  gXAxis.call(xAxis);
  gYAxis.call(yAxis);

  let gLines = gChart.append('g')
    .attr('class', 'lines')
    .attr('clip-path', 'url(#path-mask)');

  gYAxis.append("text")
    .attr('class', 'text')
    .attr("transform", `translate(${160}, ${0})`)
    .attr('fill', 'black')
    .style("font-size", "30px")
    .attr("y", 8)
    .attr("dy", "0.8em")
    .style("text-anchor", "end")
    .text("相对搜索量");

  gYAxis.append("text")
    .attr('class', 'text')
    .attr("transform", `translate(${145}, ${40})`)
    .attr('fill', 'black')
    .style("font-size", "30px")
    .attr("y", 8)
    .attr("dy", "0.8em")
    .style("text-anchor", "end")
    .text("（英国）");

  gYAxis.append("text")
    .attr('class', 'text')
    .attr("transform", `translate(${width + 100}, ${height - 20})`)
    .attr('fill', 'black')
    .style("font-size", "30px")
    .attr("y", 8)
    .attr("dy", "0.8em")
    .style("text-anchor", "end")
    .text("2016");

  let colorSet = ['#7fc97f', '#beaed4',
    '#386cb0', '#f0027f'].reverse();

  // let lineGenerator = d3.line()
  //   .x(d => xScale(parser(d.date)))
  //   .y(d => yScale(d.val));
    // .curve(d3.curveCardinal);

  let areaGenerator = d3.area()
    .x(d => xScale[0](parser(d.date)))
    .y0(_ => yScale(0))
    .y1(d => yScale(parseFloat(d.val)));
  // let bindedData = Object.keys(processedData).map(key => {
  //   return [key, processedData[key]];
  // });
  
  renderAll(stackedData, areaGenerator, colorSet, gLines);

  let legendRectSize = 18, legendSpacing = 6;
  let legendData = colorSet.slice(0, keys.length).map((color, i) => {
    return [d3.select(`g.lines > path:nth-child(${i + 1})`).attr("data-legend"), color];
  });
  setupLegend(svg, margin, width, height, legendData, legendSpacing, legendRectSize);     

  // let order = maxValSetByWeek.map(d => d[0]);
  let delay = 3000;
  let duration = 2000;


  return new Promise(resolve => {
    animateLine(parser, gLines, areaGenerator, gXAxis, xAxis, xScale, duration, delay).then(async () => {
      await delayMs(delay);
      resolve();
    });
  });

  // for (let [index, key] of order.entries()) {
  //   let item = maxValSetOfJune.find(d => d[0] === key);
  //   // darkenOtherLines(key, gLines, duration, 0);
  //   await fitLine(parser, key, [0, maxValSetByWeek[index][1] * 1.1], [0, item[1] * 1.1], gYAxis, yAxis, yScale, gXAxis, xAxis, xScale, lineGenerator, gLines, delay, duration);
  //   console.log(index, key);
  //   if (index === order.length - 1) {
  //     darkenOtherLines('', gLines, duration, 1);
  //   }
  // }
}

function delayMs(delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, delay);
  })
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

function renderAll(stackedData, areaGenerator, colorSet, selector) {
  let mapping = {
    "what-is-eu": "什么是欧盟",
    "what-is-brexit": "什么是脱欧",
    "is-russia-in-the-eu": "俄罗斯是不是欧盟国家",
    "what-is-article-50": "什么是脱欧法案",
    "is-sweden-in-the-eu": "瑞典是不是欧盟国家",
    "what-is-single-market": "什么是单一市场"
  };
  // selector.selectAll('path')
  //   .data(bindedData)
  //   .enter()
  //   .append('path')
  //   .attr('d', d => lineGenerator(d[1]))
  //   .attr("data-legend", d => mapping[d[0]])
  //   .attr("fill", "none")
  //   .attr("stroke-width", "0.16em")
  //   .attr("stroke", (_, i) => colorSet[i]);

  selector.selectAll("path")
    .data(stackedData)
    .enter()
    .append("path")
    .attr("class", function(d) { 
      return "myArea " + d.key;
    })
    .attr("data-legend", d => mapping[d.key])
    .style("fill", function(d, i) { return colorSet[i]; })
    .style("fill-opacity", 1)
    .attr("d", areaGenerator)
}

async function animateLine(parser, selector, areaGenerator, gXAxis, xAxis, xScale, duration, delay) {
  return new Promise(resolve => {
    setTimeout(async () => {
      await zoomIn(parser, selector, areaGenerator, gXAxis, xAxis, xScale, duration, delay);
      console.log("span");
      await restore(parser, selector, areaGenerator, gXAxis, xAxis, xScale, duration, delay);
      console.log("restore");
      resolve();
    }, 0);
  });
}

function zoomIn(parser, selector, areaGenerator, gXAxis, xAxis, xScale, duration, delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      updateXAxis(gXAxis, xAxis, xScale, duration, 1);
      updateLines(parser, selector, areaGenerator, xScale, duration, 1);
      resolve();
    }, delay);
  });
}

function restore(parser, selector, areaGenerator, gXAxis, xAxis, xScale, duration, delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      updateXAxis(gXAxis, xAxis, xScale, duration, 0);
      updateLines(parser, selector, areaGenerator, xScale, duration, 0);
      resolve();
    }, delay);
  });
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

function updateLines(parser, selector, areaGenerator, xScale, duration, ofJuneFlag) {
  areaGenerator.x(d => xScale[ofJuneFlag](parser(d.date)));

  selector.selectAll('path')
    .transition()
    .ease(d3.easeLinear)
    .duration(duration)
    .attr("d", areaGenerator);
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
