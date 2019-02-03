let margin = {top: 50, bottom: 120, left: 80, right: 120};
let svgWidth = 850;
let svgHeight = 600;

let width=svgWidth - margin.left - margin.right;
let height=svgHeight - margin.top - margin.bottom;
let categorys =  ['dailymail','dailystar','sun','guardian','ft','economist'];

let xScale = d3.scaleBand().domain(categorys).range([0,width]);
let yScale = d3.scaleLinear().range([height,0]).domain([0,0.6]);
let svg = d3.select('#free').append('g').attr('transform',`translate(${margin.left},${margin.top})`)
d3.csv('public/data/newspaper/free.csv').then(function(data) {
            drawAxis();
            balloon(data);
            setTimeout(function() {
                sign();
              }, 5000);
});
function drawAxis(){
    let axis = svg.append('g')
                    .attr('class','axis')
                axis.selectAll("text")
                    .data(categorys)
                    .enter()
                    .append("text")
                    .attr('x',(d)=>xScale(d)+ xScale.bandwidth()/2)
                    .attr('y',height + margin.bottom / 2)
                    .attr('text-anchor','middle')
                    .text((d)=>d)
        axis.append("g")
            .call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format(".0%")))
            .append("text")
            .attr('x',0)
            // .attr('stroke','black')
            .attr('text-anchor','start')
            .text("让我自由/让我自由+自由流动+自由贸易");
        let line = svg.append("line")
            .attr("x1",xScale('dailystar'))
            .attr("y1",height + 30 + margin.bottom / 2)
            .attr("x2",xScale('economist'))
            .attr("y2",height + 30 + margin.bottom / 2)
            .attr("stroke","grey")
            .attr("stroke-width",2)
            .attr("marker-end","url(#arrow)");

        let text = svg.append("text")
            .attr("x",xScale('dailystar'))
            .attr("y",height + 50 + margin.bottom / 2)
            .text('脱欧')
        let text2 = svg.append("text")
            .attr("x",xScale('economist'))
            .attr("y",height + 50 + margin.bottom / 2)
            .text('留欧')
}
function balloon(data){
    let g = svg.append('g')
    .attr('class','icon')
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('class',(d)=>d.media)
    .append('image')
    .attr('xlink:href', 'public/data/free/free.svg')
    .attr("x", (d)=>xScale(d.media) + xScale.bandwidth()/2 - 20)
    .attr('y', height)
    .transition()
    .ease(d3.easeLinear)
    .duration(5000)
    .attr("y", (d)=>yScale(d.value / 100))
    .attr('width', 40)
    .attr('height', 80)
}
function sign(){

}