function loadData() {
  // let rawData = await d3.csv('public/data/territory.csv');

  // if (rawData) {
  //   dataset = processData(rawData);
  //   render(dataset);
  // } else {
  //   console.error("Fails loading data!");
  // }

  render();
}

function processData(data) {
  
}

function render() {
  let svgEle = document.querySelector("svg");
  let svgWidth = parseFloat(window.getComputedStyle(svgEle).getPropertyValue("width"));
  let svgHeight = parseFloat(window.getComputedStyle(svgEle).getPropertyValue("height"));
  // console.log(svgWidth, svgHeight);

  let spanConfig = {
    vertical: {
      header: 0.2, 
      main: 0.8, 
      // footer: 0.1,
    },
    horizontal: {
      aside: 0.2,
      map: 0.8
    }
  };
  let posConfig = generatePosConfig(spanConfig);
  setupLayout(svgWidth, svgHeight, posConfig);

  addPlaceholder(svgWidth, svgHeight, spanConfig);

  renderHeader(svgWidth, svgHeight * spanConfig.vertical.header);

  renderMain();

  // renderFooter();
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

function renderHeader(svgWidth, height) {
  let gHeader = d3.select(".header");

  let gText = gHeader.append("g")
    .attr("transform", `translate(${160}, ${0})`);

  gText.append("text")
    .attr('class', 'h1')
    .attr("transform", `translate(${0}, ${20})`)
    .attr('fill', 'black')
    .style("font-size", "50px")
    .attr("y", 8)
    .attr("dy", "0.8em")
    .text("只有22个国家从未被英国入侵");
    // .text("Only 22 countries have never been invaded by Britain");

  gText.append("text")
    .attr('class', 'h3')
    .attr("transform", `translate(${0}, ${100})`)
    .attr('fill', 'black')
    .style("font-size", "30px")
    .attr("y", 8)
    .attr("dy", "0.8em")
    .text("历史上所有被英国入侵的国家");
    // .text("All the countries invaded by Britain throughout history");

  gText.append("text")
    .attr('id', 'year')
    .attr("transform", `translate(${1400}, ${100})`)
    .attr('fill', 'black')
    .style("font-size", "30px")
    .attr("y", 8)
    .attr("dy", "0.8em")
    .text("");
}

function renderMain() {
  renderAside();

  renderSection();
}

function renderAside() {
  let countries = ["Andorra", "Belarus", "Bolivia", "Burundi", "Central African Republic",
    "Chad", "Republic of the Congo", "Guatemala", "Ivory Coast", "Kyrgyzstan",
    "Liechtenstein", "Luxembourg", "Mali", "Marshall Islands", "Monaco",
    "Mongolia", "Paraguay", "Sao Tome and Principe", "Sweden", "Tajikistan",
    "Uzbekistan", "Vatican City"
  ];

  let mapping = {
    "Andorra": "安道尔",
    "Belarus": "白俄罗斯",
    "Bolivia": "玻利维亚",
    "Burundi": "布隆迪",
    "Central African Republic": "中非共和国",
    "Chad": "乍得",
    "Republic of Congo": "刚果共和国", 
    "Guatemala": "危地马拉", 
    "Ivory Coast": "科特迪瓦", 
    "Kyrgyzstan": "吉尔吉斯斯坦",
    "Liechtenstein": "列支敦士登", 
    "Luxembourg": "卢森堡", 
    "Mali": "马里", 
    "Marshall Islands": "马绍尔群岛共和国", 
    "Monaco": "摩纳哥",
    "Mongolia": "蒙古", 
    "Paraguay": "巴拉圭", 
    "Sao Tome and Principe": "圣多美和普林西比民主共和国", 
    "Sweden": "瑞典", 
    "Tajikistan": "塔吉克斯坦",
    "Uzbekistan": "乌兹别克斯坦", 
    "Vatican City": "梵蒂冈",
  }

  let spacing = {
    top: 30,
    left: 30,
    rx: 10,
    ry: 10,
  }

  let gAside = d3.select(".aside");

  let asideHeight = gAside.select("rect").attr("height");
  let asideWidth = gAside.select("rect").attr("width");
  let containerHeight = asideHeight - 2 * spacing.top;
  let containerWidth = asideWidth - 2 * spacing.left;

  let container = gAside.append("g")
    .attr("transform", `translate(${spacing.left}, ${spacing.top})`);

  container.append("rect")
    .attr("class", "container")
    .attr("width", containerWidth)
    .attr("height", containerHeight)
    .attr("rx", spacing.rx)
    .attr("ry", spacing.ry);

  let legendRectSize = 24;
  let fontSize = 16;
  let legendMargin = {
    top: 20,
    left: 22,
  };
  let letterSpacing = 10;
  let len = countries.length;
  let lineSpacing = (containerHeight - 2 * legendMargin.top - len * legendRectSize) / (len - 1);

  let legend = container.selectAll('.legend')                
    .data(countries)                              
    .enter()                                           
    .append('g')                                       
    .attr('class', 'legend')                 
    .attr('transform', (_, i) => `translate(${legendMargin.left}, ${legendMargin.top + i * (legendRectSize + lineSpacing)})`);

  legend.append('image') 
    .attr("class", "flag")                              
    .attr('width', legendRectSize)                     
    .attr('height', legendRectSize)  
    .attr("xlink:href", d => `public/data/invasion/${d}.svg`)                  
    .style('fill', "red")                         
    // .style('stroke', d => d[1]);                           
          
  legend.append('text')  
    .attr("class", "legend-text")                              
    .attr('x', legendRectSize + letterSpacing)         
    .attr('y', fontSize)         
    .text(d => mapping[d])
    .style("font-size", fontSize)
    .style("dominant-baseline", "middle")
}

function renderSection() {
  let gMap = document.querySelector("g.map");
  let placeholderEle = gMap.querySelector("rect");
  let placeholderWidth = parseFloat(window.getComputedStyle(placeholderEle).getPropertyValue("width"));
  let mapWidth = d3.select("#svg258").attr("width");

  d3.select("#map-container")
    .attr("transform", `translate(${(placeholderWidth - mapWidth) / 2}, ${0})`)

  
  let width = d3.select(".map rect")
    .attr("width");
  let height = d3.select(".map rect")
    .attr("height");

  let spacing = {
    top: 30,
    left: 30,
    rx: 10,
    ry: 10,
  }

  let img = d3.select(".map")
    .append("image")
    .attr("id", "map-img")
    .attr("x", spacing.left)
    .attr("y", spacing.top)
    .attr("width", width - 2 * spacing.top)
    .attr("height", height - 2 * spacing.left);

  animateMap();
}

async function animateMap() {
  let timeline = [1450, 1680, 1750, 1820, 1885, 1901, 1915, 1919, 1938, 1945, 1959, 1974, 2018];
  let duration = 2000;
  
  for (let year of timeline) {
    await animate(year, duration);

    if (year === 2018) {
      d3.select("#map-img")
        .style("display", "none");
      d3.select("#map-container")
        .style("display", "block");
    }
  }
}

function animate(year, duration) {
  return new Promise(resolve => {
    updateMap(year, duration).then(async () => {
      console.log(year);
      await delayMs(duration);
      resolve();
    });
  });
}

function updateMap(year, duration) {
  return new Promise(resolve => {
    d3.select("#year")
      .text(year);
    d3.select("#map-img")
      .attr("xlink:href", `public/data/territory/${year}.svg`);;
    resolve();
  }, duration);
}

function delayMs(delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, delay);
  })
}