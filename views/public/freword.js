function freword() {
    return new Promise(function(resolve, reject) {
        d3.csv('public/data/newspaper/words.csv').then(function(data) {
            let scales = {
                'we':{
                    data:[],
                    list:[],
                    id:'we'
                },
                'people':{        
                    data:[],
                    list:[],
                    id:'people'
                },
                'country':{
                    data:[],
                    list:[],
                    id:'country'
                },
                'control':{
                    data:[],
                    list:[],
                    id:'control'
                },
                'great':{
                    data:[],
                    list:[],
                    id:'great'
                },
                'free':{
                    data:[],
                    list:[],
                    id:'free'
                }
            };
            drawxlable(categorys,xScale);
           data.map(d=>{
               if(d.fre!=0){
               scales[d.word].data.push(d.fre);
               scales[d.word].list.push(d);
               }
           })
           word.map(d=>{
               scales[d].scale = d3.scaleLinear()
                       .range([2,26])
                       .domain([d3.min(scales[d].data), d3.max(scales[d].data)])
           })
           transition.append('g').attr('class','circle')
           drawarrow(xScale);
           drawlegend(xScale);
           d3.select('#mark')
           .style('fill','url(#myGradient)')
           Object.keys(scales).forEach(function(key,i){
            // key,scales[key]
            // if(i===0){
            //     split(scales[key],xScale);
            // }
            // if(i!==0){
                setTimeout( () => {
                    drawcircle(scales[key],xScale,i);
                },second*7*i);
            // }
            d3.select('.cells')
            .remove()
            });
            resolve();
           });

        });
}
// function split(key,xScale){
//     d3.select('#we').remove()
//     let circle = d3.select('.circle').append('g').attr('id',key.id)
//     circle.append()
// }
function drawcircle(key,xScale,j) {
    let circle = d3.select('.circle').append('g').attr('id',key.id)
    circle.selectAll("circle")
    .data(key.list)
    .enter()
    .append('circle')
    .attr('cx',xScale('express')+ xScale.bandwidth()/2 + paddingleft)
    .transition()
    .duration((d,i)=>i*second*1.2)
    .attr('cx',(d)=>xScale(d.media)+ xScale.bandwidth()/2 + paddingleft)
    .attr('cy',height / 2 - j*100)
    .attr('r',(d)=>d.fre==0?0:key.scale(d.fre))
    .attr('fill','rgb(158, 22, 42)')
    // if(j!==0)
    d3.select('.axis').append('line').attr('id',key.id)
          .attr('y1',height / 2 - j*100)
          .attr('x1',0)
          .attr('y2',height / 2 - j*100)
          .attr('x2',width)
          .attr('stroke-dasharray','3 3')
   let text =  circle.append('text')
          .attr('x',xScale('express')+ xScale.bandwidth()/2 + paddingleft)
          .attr('y',height / 2 - j*100)
          .attr('y',height / 2 - j*100)
          .text(key.id)
          .attr('text-anchor','middle')
setTimeout(()=>{
    text.transition()
        .duration(500)
        .attr('x',width + 30)
    key.id!='free'&& d3.select('.tra')
        .transition()
        .duration(500)
        .attr('transform',`translate(0,${50*(j+1)})`)
    },second*6)
}
function drawxlable(categorys,xScale){
    let xlable = transition.append('g')
    .attr('class','axis')
    xlable.selectAll("text")
    .data(categorys)
    .enter()
    .append("text")
    .transition()
    .duration((d,i)=>200*i)
    .attr('x',(d)=>xScale(d)+ xScale.bandwidth()/2 + paddingleft)
    .attr('y',height / 2 + 40)
    .text((d)=>d)
    //原来的线移掉
    d3.selectAll('.axis').select('line').remove()
}

function drawarrow(xScale) {
    let arrow = transition.append('g').attr('class','arrow')
    let line = arrow.append("line")
    .attr("x1",width / 2 + 10)
    .attr("y1",height /2 + 65)
    .attr("x2",width)
    .attr("y2",height /2 + 65)
    .attr("stroke","black")
    .attr("stroke-width",2)
    .attr("marker-end","url(#arrow)");

    arrow.append("line")
    .attr("x1",width / 2 - 10)
    .attr("y1",height /2 + 65)
    .attr("x2",0)
    .attr("y2",height /2 + 65)
    .attr("stroke","black")
    .attr("stroke-width",2)
    .attr("marker-end","url(#arrow)");

    let text = arrow.append("text")
        .attr("x",0)
        .attr("y",height /2 + 90)
        .attr('text-anchor','start')
        .style('font-size','15px')
        .text('脱欧')
    let text2 = arrow.append("text")
        .attr("x",width)
        .attr("y",height /2 + 90)
        .attr('text-anchor','end')
        .style('font-size','15px')
        .text('留欧')
}
function drawlegend(xScale){
    let lable = g.append('g').attr('transform',`translate(${xScale('economist')+xScale.bandwidth() / 2 + 30},${-50})`).attr('class','legend')
    lable.append('circle')
    .attr('class','lable')
    .attr('cx',0)
    .attr('cy',65)
    .attr('r',15)
    .attr('fill','none')
    lable.append('line')
        .attr('x1',12)
        .attr('y1',60)
        .attr('x2',30)
        .attr('y2',60)
    lable.append('text')
        .attr('x',30)
        .attr('y',60)
        .text('max')
        .attr('font-size','12px')

    lable.append('circle')
        .attr('class','lable')
        .attr('cx',0)
        .attr('cy',80)
        .attr('r',2)
    lable.append('line')
        .attr('x1',0)
        .attr('y1',80)
        .attr('x2',30)
        .attr('y2',80)
    lable.append('text')
        .attr('x',30)
        .attr('y',80)
        .text('min')
        .attr('font-size','12px')
}