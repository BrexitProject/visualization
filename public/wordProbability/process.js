let tooltip = d3.select(".tooltip");
function wordCloud(word){
    let data;
    d3.layout.cloud().size([width /2 , height / 2])
        //   .timeInterval(20)
          .words(word)
          .fontSize(function(d) { return xScale(+d.probability); })
          .text(function(d) { return d.meaning; })
          .rotate(function() { return 0; })
          .font("Impact")
          .on("end", (words)=>{data = words})
          .start();
    d3.layout.cloud().stop();
    return data;
}
function drawWord(word){
    d3.selectAll("text").attr("opacity",0.7);
    let direction = d3.scaleOrdinal()
                     .domain([0,1,2,3])
                     .range(["translate(999,999)","translate(-999,999)","translate(-999,-999)","translate(999,-999)"])
    let cloud = svg.append('g')
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
      .text(function(d) { return d.meaning; });
cloud.attr("transform", function(d,i) {
    return direction(i%4);
      })
      .transition()
      .duration(function(d,i){
        return 1000+i*20
      })
     .attr("transform", function(d) {
        return scale(d.category)+"translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
}
function drawHorAxis(){
    let axis = svg.append("g")
             .attr("class",'axis')
        axis.append('line')
            .attr('x1', 0)
            .attr('y1', height / 2)
            .attr('x2', 0)
            .attr('y2', height / 2)
            .transition()
            .duration(600)
            .attr('x2', width)
            .attr('y2', height / 2)

        axis.append('text')
            .transition()
            .duration(200)
            .attr("x", 0)
            .attr("y", height / 2 - 5)
            .text('economic')
        axis.append('text')
            .transition()
            .duration(200)
              .attr("x", width - 50)
              .attr("y", height / 2 - 5)
              .text('politics')
}
function drawLevAxis () {
    let axis = svg.append("g")
    .attr("class",'axis')
    axis.append('line')
    .attr('x1', width / 2)
    .attr('y1', 50)
    .attr('y2', 50)
    .transition()
    .duration(600)
    .attr('x2', width / 2)
    .attr('y2', height-30)

axis.append('image')
    .attr('xlink:href', 'static/wordProbability/images/cold.svg')
    .attr("x", width / 2 - 20)
    .attr("y", 0)
    .attr('width', 40)
    .attr('height', 40)
axis.append('image')
    .attr('xlink:href', 'static/wordProbability/images/angry.svg')
    .attr("x", width / 2 -20)
    .attr("y", height-25)
    .attr('width', 40)
    .attr('height', 40)
}
function drawTwoGroup(data){
    let group = svg.append('g')
                    .attr('class','group')
                    .selectAll("text")
                    .data(data)
                    .enter()
                    .append("text")
    
        group.transition()
            .duration(600)
            .style("font-size", function(d) { 
                return xScale(d.probability) + "px"; 
              })
              .style("font-family", "Impact")
              .style("fill", (d)=>color(d.group))
              .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return d.group==='leave'?`translate(${width/4+rd(-50,50)},${height/2+rd(-80,80)})`:`translate(${width/4*3+rd(-50,50)},${height/2+rd(-80,80)})`;
            })
            .text(function(d) { return d.meaning; });
}
function drawSigWord(data){
    let max = data[0];
    let min = data[0];
    data.map(d=>{
        if(d.probability > max.probability)
            max = d;
        if(d.probability < min.probability)
            min = d;
    })
let sigWord = svg.append('g')
                 .attr('class','single')
                 .selectAll("text")
                 .data([max,min])
                 .enter()
                 .append("text")
                  .style("font-family", "Impact")
                  .style("fill", (d)=>color(d.group))
                  .attr("text-anchor", "middle")
                 .text(function(d) { return d.meaning; });
sigWord.attr("transform", `translate(0,${height / 2})`)
      .transition()
      .ease(d3.easeCubic)
      .duration(function(d,i){
        return 1000+i*1000
      })
      .attr("transform", `translate(${width / 2},${height / 2})`)
      .style("font-size", "50px")
      .transition()
      .ease(d3.easeCubic)
      .duration(function(d,i){
        return 1000+i*1000
      })
      .style("font-size", function(d) { 
        return xScale(d.probability) + "px"; 
      })
     .attr("transform", function(d) {
        return scale(d.category)+"translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })

}
function rd(n,m){
    var c = m-n+1;  
    return Math.floor(Math.random() * c + n);
}
function removeSig() {
    d3.selectAll(".single")
        .transition()
        .duration(function(d,i){
            return 1000+i*1000
        })
        .attr("transform",`translate(${width},${height / 2})`)
}
function removeGroup(){
    d3.selectAll(".group")
    .transition()
    .duration(function(d,i){
        return 1000+i*1000
    })
    .attr("transform",`translate(${width},${height / 2})`)
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
function divide (data) {
    let leave=[], remain=[];
    data.map(d=>{
        if (d.group==='leave')
            leave.push(d);
        else
            remain.push(d);
    })
    return {
       levea: leave,
       remain: remain 
    }
}
