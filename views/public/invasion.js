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

function render(dataset) {
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

  renderMain(dataset);

  renderFooter();

  // exportSVG(document.querySelector("#svg"));
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

    // if (className === "map") {
    //   node.select("foreignobject")
    //     .attr("width", svgWidth * horizontal[className])
    //     .attr("height", parentNode.select(`rect.p-${parentNode.attr("class")}`).attr("data-height"))
    //     .append("div")
    //     .attr("id", "map")
    //     .attr("width", svgWidth * horizontal[className])
    //     .attr("height", parentNode.select(`rect.p-${parentNode.attr("class")}`).attr("data-height"))
    //     .attr("innerHTML", "adfaf");
    // }
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
    .text("Only 22 countries have never been invaded by Britain");

  gText.append("text")
    .attr('class', 'h3')
    .attr("transform", `translate(${0}, ${100})`)
    .attr('fill', 'black')
    .style("font-size", "30px")
    .attr("y", 8)
    .attr("dy", "0.8em")
    .text("All the countries invaded by Britain throughout history");
}

function renderMain(dataset) {
  renderAside();

  // renderSection(dataset);
}

function renderAside() {
  let countries = ["Andorra", "Belarus", "Bolivia", "Burundi", "Central African Republic",
    "Chad", "Republic of the Congo", "Guatemala", "Ivory Coast", "Kyrgyzstan",
    "Liechtenstein", "Luxembourg", "Mali", "Marshall Islands", "Monaco",
    "Mongolia", "Paraguay", "Sao Tome and Principe", "Sweden", "Tajikistan",
    "Uzbekistan", "Vatican City"
  ];

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
    left: 30,
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
    .text(d => d)
    .style("font-size", fontSize)
    .style("dominant-baseline", "middle")
}

function renderSection(dataset) {
  am4core.useTheme(am4themes_animated);
  // Themes end

  // Create map instance
  let chart = am4core.create("#map", am4maps.MapChart);

  // Set map definition
  chart.geodata = am4geodata_worldLow;

  // Set projection
  chart.projection = new am4maps.projections.Miller();

  // Create map polygon series
  let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

  // Exclude Antartica
  polygonSeries.exclude = ["AQ"];

  // Make map load polygon (like country names) data from GeoJSON
  polygonSeries.useGeodata = true;

  // Configure series
  let polygonTemplate = polygonSeries.mapPolygons.template;
  polygonTemplate.tooltipText = "{name}";
  polygonTemplate.fill = chart.colors.getIndex(0);

  // Create hover state and set alternative fill color
  let hs = polygonTemplate.states.create("hover");
  hs.properties.fill = chart.colors.getIndex(0).brighten(-0.5);

  // Create active state
  let activeState = polygonTemplate.states.create("active");
  activeState.properties.fill = chart.colors.getIndex(3).brighten(-0.5);

  // Create an event to toggle "active" state
  polygonTemplate.events.on("hit", function(ev) {
    ev.target.isActive = !ev.target.isActive;
  })
}

function renderFooter() {

}