async function loadData() {
  let rawData = await d3.csv("public/data/writingStyle.csv");

  if (rawData) {
    let dataset = processData(rawData);

    render(dataset);
  }
}

function processData(rawData) {
  return rawData;
}

function render(dataset) {
  let svgEle = document.querySelector("svg");
  let svgWidth = parseFloat(window.getComputedStyle(svgEle).getPropertyValue("width"));
  let svgHeight = parseFloat(window.getComputedStyle(svgEle).getPropertyValue("height"));
  // console.log(svgWidth, svgHeight);

  let spanConfig = {
    vertical: {
      header: 0.3, 
      main: 0.7,
    },
    horizontal: {
    },
  };

  let padding = {
    left: 120,
    top: 20,
  };

  let posConfig = generatePosConfig(spanConfig);
  setupLayout(svgWidth, svgHeight, posConfig);

  addPlaceholder(svgWidth, svgHeight, spanConfig);

  renderHeader(svgWidth, svgHeight * spanConfig.vertical.header, padding);

  renderMain(dataset);
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
}

function renderMain(dataset) {

}