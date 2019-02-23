function editorial() {
    return new Promise(function(resolve, reject) {
        d3.csv('public/data/newspaper/EditorialKeywords.csv').then(function(data) {
            let x = d3.scaleLinear()
                    .range([0, width])
                    .domain([-1,1])
            let simulation = d3.forceSimulation(data)
                    .force("x", d3.forceX(function(d) { return x(d.Weight); }).strength(1))
                    .force("y", d3.forceY(height / 2))
                    .force("collide", d3.forceCollide(28))
                    .stop();
            for (var i = 0; i < 120; ++i) simulation.tick();
        let keyword = g.append('g').attr('class','container').attr('transform','translate(0,180)');
        let axis = keyword.append('g')
            .attr('class','axis')
            .attr("transform", "translate(0," + height / 2 + ")")
        axis.append('line')
            .attr('x1',0)
            .attr('x2',width)
        axis.append('text')
        .attr('class','static')
            .attr('x',0)
            .attr('y',8)
            .text('-1')
        axis.append('text')
        .attr('class','static')
            .attr('x',width /2)
            .attr('y',8)
            .text('0')
        axis.append('text')
        .attr('class','static')
            .attr('x',width)
            .attr('y',8)
            .text('1')
        axis.append('line')
        .attr('class','static')
            .attr('x1',width / 2)
            .attr('y1',0)
            .attr('x2',width / 2)
            .attr('y2',-height / 2)
            
        
        let cell = keyword.append("g")
                    .attr("class", "cells")
                    .selectAll("g").data(d3.voronoi()
                    .extent([[-margin.left, -margin.top], [width + margin.right, height + margin.top]])
                    .x(function(d) { return d.x; })
                    .y(function(d) { return d.y; })
                    .polygons(data)).enter().append("g").attr('id',(d)=>d.data.Word).attr('class',(d)=>d.data.Word==='we'?'':'sig');
        
        cell.append("circle")
            .attr("cx", function(d) { return d.data.x; })
            .attr("cy", function(d) { return d.data.y; })
            .attr("r", 0)
            .attr('opacity',0)
            .transition()
            .ease(d3.easeLinear)
            .duration(1000)
            .attr("r", 26)
            .attr('opacity',1)
            .attr('fill',(d)=>{
                return color(d.data.Weight);
            })
        
        cell.append("text")  
            .attr("x", function(d) { return d.data.x; })
            .attr("y", function(d) { return d.data.y; })
            .attr('stroke',(d)=>color(d.data.Weight))
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
        resolve();
    });
}
function drawstatic(){
    let g = d3.select('.static').attr('transform','translate(0,180)')
    g.append('line')
    .attr('x1',20)
    .attr('y1',20)
    .attr('x2',20)
    .attr('y2',40)
    .style('stroke','rgb(103, 0, 31)')
    g.append('line')
    .attr('x1',940)
    .attr('y1',20)
    .attr('x2',940)
    .attr('y2',40)
    .style('stroke','rgb(5, 48, 97)')
    g.append('text')
    .attr('x',20)
    .attr('y',11)
    .style('fill','rgb(103, 0, 31)')
    .attr('text-anchor','start')
    .text('More probablely Word of Out')
    g.append('text')
    .attr('x',940)
    .attr('y',11)
    .attr('text-anchor','end')
    .style('fill','rgb(5, 48, 97)')
    .text('More probablely Word of In')
    g.append('text')
    .attr('x',480)
    .attr('y',11)
    .attr('text-anchor','middle')
    .style('fill','#C1C1C1')
    .text('Be Neutral')
    g.append('text')
    .attr('x',750)
    .attr('y',490)
    .attr('text-anchor','end')
    .text('possibility:')
    g.append('text')
    .attr('x',760)
    .attr('y',510)
    .attr('text-anchor','start')
    .text('Out') 
    g.append('text')
    .attr('x',890)
    .attr('y',510)
    .attr('text-anchor','end')
    .text('In') 
    g.append('rect')
    .attr('x',760)
    .attr('y',480)
    .attr('width',130)
    .attr('height',20)
    .attr('fill','url(#myGradient)')
}
function removeEditorial(){
    setTimeout( () => {
        d3.selectAll('.sig').selectAll('circle')
        .transition()
        .ease(d3.easeBounce)
        .duration(4000)
        .attr('cy',450)
        .transition()
        .ease(d3.easeLinear)
        .duration(4000)
        .attr('cx',1000)
        .remove()
    d3.selectAll('.sig').selectAll('tspan')
        .transition()
        .ease(d3.easeBounce)
        .duration(4000)
        .attr('y',450)
        .transition()
        .ease(d3.easeLinear)
        .duration(4000)
        .attr('x',1000)
        .remove()
        d3.selectAll('.static')
        .transition()
        .duration(2000)
        .attr('opacity',0)
        .remove()
    }, second*3);
}
function removefreword(){
    setTimeout( () => {
        d3.select('#mark')
        .style('fill','url(#myGradient)')
        d3.selectAll('#we')
        .transition()
        .duration(500)
        .attr('transform','translate(999,0)')
        .remove()
        d3.selectAll('#people')
        .transition()
        .duration(500)
        .attr('transform','translate(999,0)')
        .remove()
        d3.selectAll('#country')
        .transition()
        .duration(500)
        .attr('transform','translate(999,0)')
        .remove()
        d3.selectAll('#control')
        .transition()
        .duration(500)
        .attr('transform','translate(999,0)')
        .remove()
        d3.selectAll('.legend')
        .transition()
        .duration(500)
        .attr('transform','translate(999,0)')
        .remove()
        d3.selectAll('#great')
        .transition()
        .duration(500)
        .attr('transform','translate(999,0)')
        .remove()
        d3.selectAll('#free')
        .transition()
        .duration(500)
        .attr('transform','translate(0,300)')
    },second*30)
}
function frewordstatic(){
    setTimeout( ()=>{
        drawxlable(categorys,xScale);
        setTimeout( ()=>{
            d3.select('#editorial').select('.container').transition().duration(500).attr('transform','translate(0,0)')
            d3.select('.tra').transition().duration(500).attr('transform','translate(0,0)')
            d3.select('#title').remove();
        },second*3)
    },second*2)
}
drawarrow(xScale);
drawxlable(['express','dailymail','dailystar','sun','mine','dailymirror','guardian','economist'],d3.scaleBand().domain(['express','dailymail','dailystar','sun','mine','dailymirror','guardian','economist']).range([0,width - paddingleft * 2]));
// setTimeout(()=>{drawxlable(categorys,xScale);},second*3);
setTimeout(()=>{
    // editorial().then(function(d){
    // removeEditorial();
        frewordstatic();
        setTimeout( () => {
                freword().then(function(result){
                    removefreword();
                    setTimeout( ()=>{
                        free(result);
                    },second*34)
                })
            },second*7)
    // });
    // drawstatic();
},second*2);

    // setTimeout( () => {
    //     d3.selectAll('.sig').remove();
    //     drawarrow(xScale);
    //     drawxlable(categorys,xScale);
    // },second*12);
    // setTimeout( () => {
    //     freword().then(function(result){
    //         removefreword();
    //         setTimeout( ()=>{
    //             free(result);
    //         },second*34)
    //     })
    // },second*17)


