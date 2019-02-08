let margin = {top: 20, bottom: 40, left: 40, right: 40};
let svgWidth = 960;
let svgHeight = 700;

let width=svgWidth - margin.left - margin.right;
let height=svgHeight - margin.top - margin.bottom;
let second = 1000;
let g = d3.select('#editorial')
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
let transition = g.append('g').attr('class','tra')
let color =d3.scaleSequential(d3.interpolateViridis).domain([-1,1]).interpolator(d3.interpolateRdBu);
let categorys =  ['express','dailymail','dailystar','sun','inews','guardian','ft','economist'];
let word = ['we','people','country','control','great'];
let xScale = d3.scaleBand().domain(categorys).range([0,width]);
let yScale = d3.scaleLinear().range([height ,120]).domain([0,0.6]);
function free(){
    d3.csv('public/data/free/free.csv').then(function(data) {
                drawAxis();
                balloon(data);
                // setTimeout(function() {
                //     sign();
                //   }, 5000);
    });
}
function drawAxis(){
    let axis = g.append('g')
                    .attr('class','axis').attr('transform','translate(0,-120)')
        axis.append("g")
            .transition()
            .call(d3.axisLeft(yScale).ticks(7).tickFormat(d3.format(".0%")))
        axis.append("text")
            .attr('x',0)
            .attr('y',120)
            .attr('text-anchor','start')
            .text("/自由");
}
function balloon(data){
    d3.select('.circle').remove()
    g.append('g')
    .attr('class','icon')
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('class',(d)=>d.media)
    .append('image')
    .attr('xlink:href', 'public/data/free/free.svg')
    .attr("x", (d)=>xScale(d.media) + xScale.bandwidth()/2 - 20)
    .attr('y', height - 160)
    .transition()
    .ease(d3.easeLinear)
    .duration(5000)
    .attr("y", (d)=>yScale(d.value / 100) - 160)
    .attr('width', 40)
    .attr('height', 80)
}
function sign(){

}