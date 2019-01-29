let margin = {top: 20, bottom: 40, left: 20, right: 20};
let svgWidth = 960;
let svgHeight = 520;

let width=svgWidth - margin.left - margin.right;
let height=svgHeight - margin.top - margin.bottom;

let g = d3.select('#editorial')
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
let color =d3.scaleSequential(d3.interpolateViridis).domain([-1,1]).interpolator(d3.interpolateRdBu);
d3.csv('public/data/newspaper/EditorialKeywords.csv').then(function(data) {
    let x = d3.scaleLinear()
              .range([0, width])
              .domain([-1,1])
            //   .domain(d3.extent(data, function(d) { return d.Weight; }))
    // let forceCollide = d3.forceCollide()
    //         .radius(function(d) { return d.radius + 1; })
    //         .iterations(1);
    let simulation = d3.forceSimulation(data)
              .force("x", d3.forceX(function(d) { return x(d.Weight); }).strength(1))
              .force("y", d3.forceY(height / 2))
              .force("collide", d3.forceCollide(28))
              .stop();
//????
    for (var i = 0; i < 120; ++i) simulation.tick();
    // g.append("g")
    // .attr("class", "axis")
    // .attr("transform", "translate(0," + height / 2 + ")")
    // .call(d3.axisBottom(x));
    g.append('g')
    .attr('class','axis')
    .attr("transform", "translate(0," + height / 2 + ")")
    .append('line')
    .attr('x1',0)
    .attr('x2',width)

let cell = g.append("g")
            .attr("class", "cells")
            .selectAll("g").data(d3.voronoi()
            .extent([[-margin.left, -margin.top], [width + margin.right, height + margin.top]])
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })
            .polygons(data)).enter().append("g");

cell.append("circle")
    .attr("r", 25)
    .attr("cx", function(d) { return d.data.x; })
    .attr("cy", function(d) { return d.data.y; })
    .attr('fill',(d)=>{
        return color(d.data.Weight);
    })

cell.append("text")  
    .attr("x", function(d) { return d.data.x; })
    .attr("y", function(d) { return d.data.y; })
    .attr('stroke',(d)=>color(d.data.Weight))
    // .text((d)=>d.data.Word)
    .each(function (d) {
        var arr = d.data.Word.split(" ");
        for (i = 0; i < arr.length; i++) {
            d3.select(this).append("tspan")
                .text(arr[i])
                .attr("dy", i ? "1.2em" : 0)
                .attr("x", d.data.x)
                .attr('y',d.data.y)
                .attr("text-anchor", "middle")
                .attr("class", "tspan" + i);
        }
    });
});