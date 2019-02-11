async function loadData() {
  let rawData = await d3.csv("public/data/writingStyle.csv");

  if (rawData) {
    let dataset = processData(rawData);

    render(dataset);
  }
}

function processData(rawData) {
  let dataset = {};
  let keys = rawData.columns;
  let nameKey = keys[0];
  let indices = keys.slice(1, keys.length - 2);

  let nameArray = rawData.map(d => d[nameKey]);

  for (let index of indices) {
    dataset[index] = rawData.map(d => parseFloat(d[index]));
  }

  dataset["indices"] = indices;
  dataset["nameArray"] = nameArray;
  return dataset;
}

function render(dataset) {
  let svgEle = document.querySelector("svg");
  let svgWidth = parseFloat(window.getComputedStyle(svgEle).getPropertyValue("width"));
  let svgHeight = parseFloat(window.getComputedStyle(svgEle).getPropertyValue("height"));
  // console.log(svgWidth, svgHeight);

  let spanConfig = {
    vertical: {
      header: 0.28, 
      main: 0.7,
    },
    horizontal: {
    },
  };

  let padding = {
    left: 120,
    top: 30,
  };

  let posConfig = generatePosConfig(spanConfig);
  setupLayout(svgWidth, svgHeight, posConfig);

  addPlaceholder(svgWidth, svgHeight, spanConfig);

  renderHeader(svgWidth, svgHeight * spanConfig.vertical.header, padding);

  renderMain(dataset, svgWidth, svgHeight * spanConfig.vertical.main, padding);
}

function generatePosConfig(spanConfig) {
  let posConfig = {};
  Object.keys(spanConfig).forEach(direction => {
    posConfig[direction] = {};

    let config = spanConfig[direction];
    let keys = Object.keys(config);

    let cnt = 0;
    for (let i = 0, len = keys.length; i < len; i += 1) {
      posConfig[direction][keys[i]] = cnt;
      cnt += config[keys[i]];
    }
  });

  return posConfig;
}

function setupLayout(svgWidth, svgHeight, posConfig) {
  let {vertical, horizontal} = posConfig;

  Object.keys(vertical).forEach(className => {
    d3.select(`.${className}`)
      .attr("transform", `translate(${0}, ${svgHeight * vertical[className]})`);
  });

  Object.keys(horizontal).forEach(className => {
    d3.select(`.${className}`)
      .attr("transform", `translate(${svgWidth * horizontal[className]}, ${0})`);
  });
}

function addPlaceholder(svgWidth, svgHeight, spanConfig) {
  let {vertical, horizontal} = spanConfig;

  Object.keys(vertical).forEach(className => {
    d3.select(`.${className}`)
      .append("rect")
      .attr("class", `placeholder p-${className}`)
      .attr("data-height", svgHeight * vertical[className])
      .attr("width", svgWidth)
      .attr("height", svgHeight * vertical[className]);
  });

  Object.keys(horizontal).forEach(className => {
    let node = d3.select(`.${className}`);
    let parentNode = node.select(function() {return this.parentNode;});
    node
      .append("rect")
      .attr("class", "placeholder")
      .attr("width", svgWidth * horizontal[className])
      .attr("height", parentNode.select(`rect.p-${parentNode.attr("class")}`).attr("data-height"));
  });
}

function renderHeader(width, height, padding) {
  let gHeader = d3.select(".header");

  let imageWidth = height - 2 * padding.top;
  let imageHeight = imageWidth;

  let brexit = gHeader.append("image")
    .attr("transform", `translate(${padding.left}, ${padding.top})`)
    .attr("width", imageWidth)
    .attr("height", imageHeight)
    .attr("xlink:href", `public/data/writingStyle/brexit.svg`);

  let antiBrexit = gHeader.append("image")
    .attr("transform", `translate(${width - padding.left - imageWidth}, ${padding.top})`)
    .attr("width", imageWidth)
    .attr("height", imageHeight)
    .attr("xlink:href", `public/data/writingStyle/brexit.svg`);

  let spaceBetweenLineAndImage = 10;
  let horizontalLine = gHeader.append("line")
    .attr("class", "header-line")
    .attr("x1", padding.left + imageWidth + spaceBetweenLineAndImage)
    .attr("y1", padding.top + imageHeight / 2)
    .attr("x2", width - padding.left - imageWidth - spaceBetweenLineAndImage)
    .attr("y2", padding.top + imageHeight / 2);
  let verticalLine = gHeader.append("line")
    .attr("class", "header-line")
    .attr("x1", width / 2)
    .attr("y1", padding.top + imageHeight / 2)
    .attr("x2", width / 2)
    .attr("y2", padding.top + imageHeight);

  let spaceBetweenLineAndTitle = 15;
  let title = gHeader.append("text")
    .attr("class", "title")
    .attr("transform", `translate(${width / 2}, ${padding.top + imageHeight / 2 - spaceBetweenLineAndTitle})`)
    .text("Writing Style Indices")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "baseline");
}

function renderMain(dataset, width, height, padding) {
  addGEleByIndices(dataset.indices);
  let spanConfig = constructSpanConfig(dataset.indices);
  let posConfig = generatePosConfig(spanConfig);
  setupLayout(width, height, posConfig);

  addPlaceholder(width, height, spanConfig);

  for (let index of dataset.indices) {
    renderRow(d3.select(`.${index}`), dataset[index], dataset["nameArray"], index, padding);
  }
}

function addGEleByIndices(indices) {
  for (let index of indices) {
    d3.select(".main")
      .append("g")
      .attr("class", `${index}`);
  }
}

function constructSpanConfig(indices) {
  let spanConfig = {
    vertical: {},
    horizontal: {},
  };

  let ratio = 1 / indices.length;

  for (let index of indices) {
    spanConfig["vertical"][index] = ratio;
  }

  return spanConfig;
}

function renderRow(selector, data, nameArray, index, padding) {
  let width = selector.select("rect").attr("width");
  let height = selector.select("rect").attr("height");

  let top =5;

  let gChart = selector.append("g")
    .attr("transform", `translate(${padding.left}, ${padding.top})`)
    .attr("class", "chart");

  let axisWidth = width - 2 * padding.left;
  let axisHeight = height - 2 * padding.top;

  let xScale = d3.scaleBand()
    .domain(nameArray)
    .range([0, axisWidth])
    .paddingInner(0.97)
    .paddingOuter(0.97);
  let yScale = d3.scaleLinear()
    .domain([0, d3.extent(data)[1]])
    .range([axisHeight, 0]);

  let tickNum = 3;
  let tickValues = [];
  for (let i = 0; i < tickNum; i += 1) {
    tickValues.push(i * yScale.domain()[1] / (tickNum - 1));
  }

  let xAxis = d3.axisBottom()
    .scale(xScale)
    .tickSizeOuter(0);
  let yAxis = d3.axisRight()
    .tickSize(axisWidth)
    .scale(yScale)
    .tickValues(tickValues);

  let gXAxis = gChart.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(${0}, ${axisHeight})`)
    .call(xAxis);
  let gYAxis = gChart.append("g")
    .attr('class', 'y-axis')
    .call(customYAxis(yAxis));

  let colorSet = generateColorSet(nameArray);

  let gBar = gChart.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", ".bar")
    .attr("x", (_, i) => xScale(nameArray[i]))
    .attr("y", d => yScale(d))
    .attr("width", xScale.bandwidth())
    .attr("height", d => axisHeight - yScale(d))
    .attr("fill", (_, i) => colorSet[i]);

  let radius = xScale.bandwidth() / 2 * 2;
  let gCircle = gChart.selectAll(".circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", ".circle")
    .attr("cx", (_, i) => xScale(nameArray[i]) + xScale.bandwidth() / 2)
    .attr("cy", d => yScale(d))
    .attr("r", radius)
    .attr("fill", (_, i) => colorSet[i]);

  let offset = 10;
  let legendData = [{
    text: index,
    offset: padding.left - offset,
    anchor: "end"
  }, {
    text: index,
    offset: width - padding.left + offset,
    anchor: "start"
  }];
  let legend = selector.selectAll(".legend")
    .data(legendData)
    .enter()
    .append("text")
    .attr("transform", d => `translate(${d.offset}, ${axisHeight + padding.top})`)
    .text(d => d.text.toUpperCase())
    .attr("text-anchor", d => d.anchor)
    .attr("dominant-baseline", "middle");

  let valTextXOffset = 20;
  let valTextData = data.map((d, i) => ({
    val: d,
    x: xScale(nameArray[i]) + xScale.bandwidth() / 2 + (i < data.length / 2 ? (-valTextXOffset) : valTextXOffset),
    y: yScale(yScale.domain()[1] / 4 * 1),
  }));
  let valText = gChart.selectAll(".valText")
    .data(valTextData)
    .enter()
    .append("text")
    .attr("transform", d => `translate(${d.x}, ${d.y})`)
    .text(d => d.val)
    .attr("text-anchor", (_, i) => i < data.length / 2 ? "end" : "start")
    .attr("dominant-baseline", "middle")
    .attr("fill", (_, i) => colorSet[i]);
}

function generateColorSet(nameArray) {
  let colorSet = nameArray.map((_, i) => i < nameArray.length / 2 ? "#006e89" : "#ed5931");
  return colorSet;
}

function customYAxis(yAxis) {
  return g => {
    g.call(yAxis);
    g.select(".domain").remove();
    g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
    g.selectAll(".tick text").attr("x", 4).attr("dy", -4);
  }
}