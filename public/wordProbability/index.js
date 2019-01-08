let margin = {top: 20, bottom: 20, left: 20, right: 20};
let svgWidth = 800;
let svgHeight = 700;

let width=svgWidth - margin.left - margin.right;
let height=svgHeight - margin.top - margin.bottom;
let xScale = d3.scaleLinear()
           .range([5,35]);
let color = d3.scaleOrdinal().domain(['leave', 'remain']).range(['rgb(216, 75, 42)', 'rgb(31, 119, 180)'])
// 经济: economic 具体： concrete   政治：political 抽象：abstract
let svg = d3.select('.wordCloud')
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
let axis = svg.append("g")
             .attr("class",'axis')
        axis.append('line')
            .attr('x1', 0)
            .attr('y1', height / 2)
            .attr('x2', width)
            .attr('y2', height / 2)
        axis.append('line')
            .attr('x1', width / 2)
            .attr('y1', 0)
            .attr('x2', width / 2)
            .attr('y2', height)

        axis.append('text')
              .attr("x", 0)
              .attr("y", height / 2 - 5)
              .text('economic')
        axis.append('text')
              .attr("x", width - 50)
              .attr("y", height / 2 - 5)
              .text('politics')
        axis.append('text')
              .attr("x", width / 2)
              .attr("y", 0)
              .text('abstract')
        axis.append('text')
              .attr("x", width / 2)
              .attr("y", height)
              .text('specific')

d3.csv('static/data/word_probability.csv').then(function(data) {
    xScale.domain([d3.min(data, function(d) {
              return d.probability;
            }),1
           ])
    let words = sort(data);
    Object.keys(words).map( d=>{
        wordCloud(d, words[d]);
    });
});