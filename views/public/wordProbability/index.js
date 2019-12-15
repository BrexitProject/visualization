let margin = {top: 20, bottom: 20, left: 20, right: 20};
const svgEle =document.getElementById("svg").getBoundingClientRect();

const ratio = 15 / 8;
const originalWidth = 1500;
let fontSizeRange = [5, 35]; // 1500的时候
const vwWidth = svgEle.width;
const vwHeight = svgEle.height;

let svgWidth;
let svgHeight;

if (vwWidth > vwHeight) {
  svgWidth = svgEle.width;
  svgHeight = svgWidth / ratio;
  fontSizeRange = fontSizeRange.map(d => vwWidth / originalWidth * d);
} else {
  svgHeight = vwHeight;
  svgWidth = svgHeight / ratio;
  fontSizeRange = fontSizeRange.map(d => vwHeight / originalWidth * d);
}
margin.left = (vwWidth - svgWidth) / 2;
margin.right = margin.left;

let width=svgWidth - margin.left - margin.right;
let height=svgHeight - margin.top - margin.bottom;
let xScale = d3.scaleLinear()
           .range(fontSizeRange);
let color = d3.scaleOrdinal().domain(['leave', 'remain']).range(['rgb(205, 23, 30)', 'rgb(31, 119, 180)'])
// 经济: economic 具体： concrete   政治：political 抽象：abstract
let svg = d3.select('.wordCloud')
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

let totalTime = 0;
let second = 1000;
d3.csv('public/data/word_probability.csv').then(function(data) {
    let max = data[0];
    let min = data[0];
    data.map(d=>{
        if(d.probability > max.probability)
            max = d;
        if(d.probability < min.probability)
            min = d;
    })
    xScale.domain([min.probability,1])
    let b=deepClone(data);
    let totalWord = wordCloud(b,[width,height]);
    drawWord(totalWord,"translate("+[width/2,height/2]+")");
});