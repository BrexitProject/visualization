let margin = {top: 20, bottom: 40, left: 30, right: 60};
let svgWidth = 960;
let svgHeight = 700;

let width=svgWidth - margin.left - margin.right;
let height=svgHeight - margin.top - margin.bottom;
let second = 1000;
let paddingleft = 13;
let g = d3.select('#editorial')
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
let transition = g.append('g').attr('class','tra')
let color =d3.scaleSequential(d3.interpolateViridis).domain([-1,1]).interpolator(d3.interpolateRdBu);
let categorys =  ['express','sun','dailystar','dailymail','inews','guardian','ft','economist'];
let word = ['we','people','country','control','free'];
let xScale = d3.scaleBand().domain(categorys).range([0,width - paddingleft * 2]);
let yScale = d3.scaleLinear().range([height ,120]).domain([0,0.6]);
// Constants
const CANVASBALLOON = {
    KAPPA: (4 * (Math.sqrt(2) - 1))/3,
    WIDTH_FACTOR : 0.0333,
    HEIGHT_FACTOR: 0.4,
    TIE_WIDTH_FACTOR : 0.12,
    TIE_HEIGHT_FACTOR : 0.10,
    TIE_CURVE_FACTOR : 0.13,
    GRADIENT_FACTOR : 0.3,
    GRADIENT_CIRCLE_RADIUS : 3
}
let freepath = 'M782.933 953.6c-19.2-57.6-89.6-102.4-134.4-102.4-108.8 0-115.2-70.4-115.2-83.2h32s25.6 0 19.2-25.6l-38.4-83.2c38.4-6.4 70.4-25.6 102.4-51.2 12.8-19.2 32-38.4 44.8-51.2 64-96 89.6-185.6 96-236.8v-12.8-12.8-12.8-12.8c-6.4-147.2-128-268.8-281.6-268.8-153.6 0-281.6 121.6-281.6 281.6V326.4c12.8 121.6 70.4 211.2 102.4 256l6.4 6.4c6.4 0 12.8 6.4 19.2 12.8l6.4 6.4 6.4 6.4c25.6 25.6 64 44.8 108.8 57.6l-32 70.4c-12.8 32 19.2 32 19.2 32h32c12.8 121.6 102.4 121.6 140.8 121.6 102.4 12.8 108.8 96 108.8 108.8 0 6.4 6.4 19.2 25.6 19.2 19.2 0 19.2-25.6 19.2-25.6s0-12.8-6.4-44.8z'
function free(free){
    d3.csv('public/data/free/free.csv').then(function(data) {
                drawAxis();
                console.log(free,data);
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
function draw(centerX,centerY,radius){
    let topLeftCurveStartX = centerX - radius;
    let topLeftCurveStartY = centerY;
	let topLeftCurveEndX = centerX;
    let topLeftCurveEndY = centerY - radius;
    let handleLength = CANVASBALLOON.KAPPA * radius;
    let widthDiff = (radius * CANVASBALLOON.WIDTH_FACTOR);
	let heightDiff = (radius * CANVASBALLOON.HEIGHT_FACTOR);
	
    let balloonBottomY = centerY + radius + heightDiff;
    let topRightCurveStartX = centerX;
	let topRightCurveStartY = centerY - radius;
	
	let topRightCurveEndX = centerX + radius;
    let topRightCurveEndY = centerY;
    // Bottom Right Curve
	
	var bottomRightCurveStartX = centerX + radius;
	var bottomRightCurveStartY = centerY;
	
	var bottomRightCurveEndX = centerX;
	var bottomRightCurveEndY = balloonBottomY;
    	// Bottom Left Curve
	
	var bottomLeftCurveStartX = centerX;
	var bottomLeftCurveStartY = balloonBottomY;
	
	var bottomLeftCurveEndX = centerX - radius ;
    var bottomLeftCurveEndY = centerY;
    
	// Create balloon tie
	
	var halfTieWidth = (radius * CANVASBALLOON.TIE_WIDTH_FACTOR)/2;
	var tieHeight = (radius * CANVASBALLOON.TIE_HEIGHT_FACTOR);
	var tieCurveHeight = (radius * CANVASBALLOON.TIE_CURVE_FACTOR);
    let tie = `M${centerX - 1} ${balloonBottomY} L ${centerX - halfTieWidth} ${balloonBottomY + tieHeight} Q ${centerX} ${balloonBottomY + tieCurveHeight} ${centerX + halfTieWidth} ${balloonBottomY + tieHeight} L ${centerX + 1} ${balloonBottomY}`
    let path = 'M' + topLeftCurveStartX + ' ' + topLeftCurveStartY + ' C ' +  topLeftCurveStartX + ' ' + (topLeftCurveStartY - handleLength - widthDiff) + ', ' + (topLeftCurveEndX - handleLength) + ' ' + topLeftCurveEndY + ', ' + topLeftCurveEndX + ' '+ topLeftCurveEndY + ' C '  +  (topRightCurveStartX + handleLength + widthDiff) + ' ' + topRightCurveStartY + ', ' + topRightCurveEndX + ' ' + (topRightCurveEndY - handleLength) + ', ' + topRightCurveEndX + ' '+ topRightCurveEndY  + ' C '  +  bottomRightCurveStartX + ' ' + (bottomRightCurveStartY + handleLength) + ', ' + (bottomRightCurveEndX + handleLength) + ' ' + bottomRightCurveEndY + ', ' + bottomRightCurveEndX + ' '+ bottomRightCurveEndY + ' C '  +  (bottomLeftCurveStartX - handleLength) + ' ' + bottomLeftCurveStartY + ', ' + bottomLeftCurveEndX + ' ' + ( bottomLeftCurveEndY + handleLength) + ', ' + bottomLeftCurveEndX + ' '+ bottomLeftCurveEndY + tie
    return path;
}
function balloon(data){
    // d3.select('.circle').remove()
    g.append('g')
    .attr('class','icon')
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('class',(d)=>d.media)
    // .attr('transform',(d)=>`translate(${xScale(d.media) + xScale.bandwidth()/2},${height - 160})scale(0.09234)`)
    .append('path')
    .attr('d',(d)=>draw( xScale(d.media) + xScale.bandwidth()/2, height - 160, 40))
    .attr('fill','none')
    .attr('stroke','black')
    .attr('stroke-width',2)
    // .attr('d',freepath)
    // .attr("x", (d)=>xScale(d.media) + xScale.bandwidth()/2 - 20)
    // .attr('y', height - 160)
    // .transition()
    // .ease(d3.easeLinear)
    // .duration(5000)
    // .attr("y", (d)=>yScale(d.value / 100) - 160)
    // .attr('width', 40)
    // .attr('height', 80)
}
function sign(){

}