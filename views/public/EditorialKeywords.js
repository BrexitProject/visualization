let editorial = new Promise(function(resolve, reject) {
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
    let axis = g.append('g')
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
        
    
    let cell = g.append("g")
                .attr("class", "cells")
                .selectAll("g").data(d3.voronoi()
                .extent([[-margin.left, -margin.top], [width + margin.right, height + margin.top]])
                .x(function(d) { return d.x; })
                .y(function(d) { return d.y; })
                .polygons(data)).enter().append("g").attr('id',(d)=>d.data.Word).attr('class',(d)=>d.data.Word==='we'?'':'sig');
    
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
function removeEditorial(){
    setTimeout( () => {
        d3.selectAll('.sig')
        .transition()
        .duration(2000)
        .attr('transform','translate(999,0)')
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
        .attr('transform','translate(0,200)')
    },second*5)
}
editorial.then(function(d){
    removeEditorial();
    setTimeout( () => {
        freword().then(function(d){
            removefreword();
            setTimeout( ()=>{
                free();
            },second*7)
        })
    },second*4)
})
