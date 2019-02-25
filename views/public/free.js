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
let transition = g.append('g').attr('class','tra').attr('transform','translate(0,-270)')
let axis = transition.append('g').attr('class','axis')
let color =d3.scaleSequential(d3.interpolateViridis).domain([-1,1]).interpolator(d3.interpolateRdBu);
let categorys =  ['express','sun','dailystar','dailymail','inews','guardian','ft','economist'];
let word = ['we','country','people','free'];
let xScale = d3.scaleBand().domain(categorys).range([0,width - paddingleft * 2]);
let yScale = d3.scaleLinear().range([height ,110]).domain([0,0.6]);
// Constants
const CANVASBALLOON = {
    KAPPA: (4 * (Math.sqrt(2) - 1))/3,
    WIDTH_FACTOR : 0.0333,
    HEIGHT_FACTOR: 0.4,
    TIE_WIDTH_FACTOR : 0.2,
    TIE_HEIGHT_FACTOR : 0.17,
    TIE_CURVE_FACTOR : 0.13,
    GRADIENT_FACTOR : 0.3,
    GRADIENT_CIRCLE_RADIUS : 3
}
function free(free){
    // d3.csv('public/data/free/free.csv').then(function(data) {
                balloon(free);
                setTimeout(()=>{
                    drawAxis();
                },second)
    // });
}
function drawAxis(){
    let axis = g.append('g')
                    .attr('class','axis').attr('transform','translate(10,-110)')
        axis.append("g")
            .transition()
            .call(d3.axisLeft(yScale).ticks(7).tickFormat(d3.format(".0%")))
        axis.append("text")
            .attr('x',0)
            .attr('y',110)
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
function balloon(free){
    let ballon = d3.selectAll('.circlepath')
                    .transition()
                    .ease(d3.easeCubic)
                    .duration(1000)
                    // .attrTween('d',(d)=>{
                    //     console.log(d);
                    //     return function(){
                    //         return draw( xScale(d.media) + xScale.bandwidth()/2, height - 720, 26)
                    //     }
                    // })
    .attr('d',(d)=>draw( xScale(d.media) + xScale.bandwidth()/2, height - 620, free.scale(d.fre)))
    .transition()
    .ease(d3.easeLinear)
    .duration(5000)
    .attr("transform",(d)=> `translate(0,${-height+ yScale(d.freevalue / 100)})`)
}
function sign(){

}