let tooltip = d3.select(".tooltip");
function wordCloud(word){
    let data;
    d3.layout.cloud().size([width /2 , height / 2])
        //   .timeInterval(20)
          .words(word)
          .fontSize(function(d) { return xScale(+d.probability); })
          .text(function(d) { return d.word; })
          .rotate(function() { return 0; })
          .font("Impact")
          .on("end", (words)=>{data = words})
          .start();
    d3.layout.cloud().stop();
    return data;
}
function drawWord(word){
    var cloud = svg.append('g')
    .attr('class','word')
    .selectAll("text")
    .data(word)
    .enter()
    .append("text")
cloud.attr('class',function(d){return d.category + " " + d.kind})
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
        .attr("opacity",0.5)
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
        .attr("opacity",1)
          .style("font-size", ()=>{ return xScale(d.probability) + "px"});
          return tooltip.style("visibility", "hidden");
          })
      .text(function(d) { return d.word; });
cloud.attr("transform", function(d) {
      return "translate(999,999)";
      })
      .transition()
      .duration(function(d,i){
        return 1000+i*20
      })
      .attr("transform", function(d) {
        return scale(d.category)+"translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
}
function drawAxis(){
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
}
function sort(data){
    let EC = [],EA = [], PC=[], PA=[];
    let ECcategory = {'外国移民':[],'接地气':[],'拿回权力':[]},
        EAcategory = {'行业':[],'经济高上大':[],'担忧':[]},
        PCcategory = {'政治现实':[],'负面用词':[],'政客官僚':[],'不消极':[]},
        PAcategory = {'理念':[],'担忧':[]}
    data.map(d=>{
        switch(d.category){
            case 'EC':
                EC.push(d);
                ECcategory[d.kind].push(d);
                break;
            case 'EA':
                EA.push(d);
                EAcategory[d.kind].push(d);
                break;
            case 'PC':
                PC.push(d);
                PCcategory[d.kind].push(d);
                break;
            case 'PA':
                PA.push(d);
                PAcategory[d.kind].push(d);
                break;
            default:
        }
    });
    return {
        EA: {
            data: EA,
            category: EAcategory
        },
        EC: {
            data:EC,
            category:ECcategory
        },
        PC: {
            data:PC,
            category: PCcategory
        },
        PA: {
            data:PA,
            category:PAcategory
        }
    }
}
