let tooltip = d3.select(".tooltip");
function wordCloud(className, word){
    d3.layout.cloud().size([width /2 , height / 2])
          .timeInterval(20)
          .words(word)
          .fontSize(function(d) { return xScale(+d.probability); })
          .text(function(d) { return d.word; })
          .rotate(function() { return 0; })
          .font("Impact")
          .on("end", draw)
          .start();
    d3.layout.cloud().stop();

    function draw(words) {
  var cloud = svg.append("g")
            .attr("class", className)
            .attr("transform", scale(className))
            .selectAll("text")
            .data(words)
            .enter()
            .append("text")
        cloud.attr('class','single-word')
              .style("font-size", function(d) { 
                return xScale(d.probability) + "px"; 
              })
              .style("font-family", "Impact")
              .style("fill", (d)=>color(d.group))
              .attr("text-anchor", "middle")
              .on("mouseover", function(d){
                d3.select(this)
                .transition()
                .ease(d3.easeCubic)
                .duration(200)
                  .style("font-size", ()=>{ return xScale(d.probability) * 1.5 + "px"});
                  return tooltip.style("visibility", "visible");
                  })
              .on("mousemove", function(d){
                return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").text(d.probability);
              })
              .on("mouseout", function(d){
                d3.select(this)
                .transition()
                .ease(d3.easeCubic)
                .duration(200)
                  .style("font-size", ()=>{ return xScale(d.probability) + "px"});
                  return tooltip.style("visibility", "hidden");
                  })
              .text(function(d) { return d.word; });
        cloud.attr("transform", function(d) {
              return "translate(999,999)";
              })
              .transition()
              .duration(function(d,i){
                return 1000+i*100
              })
              .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
              })
    }
}