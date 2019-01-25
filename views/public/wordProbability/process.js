let tooltip = d3.select(".tooltip");
function wordCloud(word,range){
    let result;
    d3.layout.cloud().size(range)
        //   .timeInterval(20)
          .words(word)
          .fontSize(function(d) { return xScale(+d.probability); })
          .text(function(d) { return d.meaning; })
          .rotate(function() { return 0; })
        //   .font("Impact")
        //   .spiral("archimedean") // "archimedean" or "rectangular"
          .on("end", (d)=>{result = d})
          .start();
    d3.layout.cloud().stop();
    return result;
}
function drawWord(word,flag){
    d3.selectAll(".word").attr("opacity",0);
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
      .attr('id',(d)=>d.word)
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
        return  flag?flag+"translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")":scale(d.category)+"translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
}
function drawCircle(circles){
    let circle = svg.append('g')
    .attr('class','circle')
    .selectAll("circle")
    .data(circles)
    .enter()
    .append("circle")
    // circle.attr('transform',function(d){ return scale(d.category)})
    circle.transition()
    .duration(function(d,i){
      return 1000+i*30
    })
    .attr('transform',function(d){ let a = d.group==='leave'?`translate(0,${height/4})`:`translate(0,${height/4*3})`; return scale(d.kind)+a})
    .attr("cx",function(d){return d.x})
    .attr("cy",function(d){return d.y})
    .attr("r",function(d){return circleScale(d.probability)})
    .attr("fill",function(d){return color(d.group)})
    .attr("opacity",1)
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
            .text('生计')
        axis.append('text')
            .transition()
            .duration(200)
              .attr("x", width - 25)
              .attr("y", height / 2 - 5)
              .text('信念')
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
    .attr('xlink:href', 'public/wordProbability/images/cold.svg')
    .attr("x", width / 2 - 20)
    .attr("y", 0)
    .attr('width', 40)
    .attr('height', 40)
axis.append('image')
    .attr('xlink:href', 'public/wordProbability/images/angry.svg')
    .attr("x", width / 2 -20)
    .attr("y", height-25)
    .attr('width', 40)
    .attr('height', 40)
}
//版本二添加的函数
function drawLev(){
    let axis = svg.append("g")
                  .attr("class",'axis')
                axis.append('image')
                    .attr('xlink:href', 'static/wordProbability/images/cold.svg')
                    .attr("x", 0)
                    .attr("y", height/4)
                    .attr('width', 30)
                    .attr('height', 30)
                axis.append('image')
                    .attr('xlink:href', 'static/wordProbability/images/angry.svg')
                    .attr("x", 0)
                    .attr("y", height/4*3)
                    .attr('width', 30)
                    .attr('height', 30)
}
function category(data){
    let category = {'移民':{'leave':[],'remain':[]},
                    '安全':{'leave':[],'remain':[]},
                    '财政':{'leave':[],'remain':[]},
                    '法规':{'leave':[],'remain':[]},
                    '政治':{'leave':[],'remain':[]},
                    '官僚':{'leave':[],'remain':[]},
                    '担忧':{'leave':[],'remain':[]}}
    data.map(d=>{
        category[d.kind][d.group].push(d);
    });
    return category;
}
//
function drawSigWord(d){
let sigWord = d3.select('#'+d.word)
                .transition()
                .ease(d3.easeCubic)
                .duration(200)
                // .attr("opacity",0.7)
                .style("font-size","90px");
}
function rd(n,m){
    var c = m-n+1;  
    return Math.floor(Math.random() * c + n);
}
function removeSig(d) {
    d3.select('#'+d.word)
                .transition()
                .ease(d3.easeCubic)
                .duration(200)
                // .attr("opacity",1)
                .style("font-size",xScale(d.probability) + "px");
}
function removeGroup(){
    d3.selectAll(".word")
    .transition()
    .duration(function(d,i){
        return 1000+i*1000
    })
    .remove()
}
function sort(data){
    let EC = [],EA = [], PC=[], PA=[],EP=[];
    let ECcategory = {'外国移民':[],'接地气':[],'拿回权力':[]},
        EAcategory = {'行业':[],'经济高上大':[],'担忧':[]},
        PCcategory = {'政治现实':[],'负面用词':[],'政客官僚':[],'不消极':[]},
        PAcategory = {'理念':[]}
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
            case 'EP':
                EP.push(d);
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
        },
        EP:{
            data:EP,
            category:[]
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
function deepClone(obj){
    let _obj = JSON.stringify(obj),
        objClone = JSON.parse(_obj);
    return objClone
} 
