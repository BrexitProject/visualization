let margin = {top: 50, bottom: 60, left: 50, right: 20};
let svgWidth = 850;
let svgHeight = 600;

let width=svgWidth - margin.left - margin.right;
let height=svgHeight - margin.top - margin.bottom;
let categorys =  ['express','dailymail','dailystar','sun','inews','guardian','ft','economist'];
let word = ['we','people','country','control','great'];
let xScale = d3.scaleBand().domain(categorys).range([0,width])
let yScale = d3.scaleBand().domain(word).range([0,height])
let scales = {
    'we':{
        data:[],
    },
    'people':{        
        data:[],
    },
    'country':{
        data:[],
    },
    'want':{
        data:[],
    },
    'control':{
        data:[],
    },
    'great':{
        data:[],
    }
};
 d3.csv('public/data/newspaper/words.csv').then(function(data) {
     let svg = d3.select('#bubble').append('g').attr('transform',`translate(${margin.left},${margin.top})`)
     let xlable = svg.append('g')
                    .attr('class','axis')
                    .selectAll("text")
                    .data(categorys)
                    .enter()
                    .append("text")
                    .attr('x',(d)=>xScale(d)+ xScale.bandwidth()/2)
                    .attr('y',height)
                    .text((d)=>d)
    let ylable = svg.append('g')
                    .attr('class','axis')
                    .selectAll("text")
                    .data(word)
                    .enter()
                    .append("text")
                    .attr('y',(d)=>yScale(d))
                    .attr('x',0)
                    .text((d)=>d)
    let yline = svg.append('g')
                    .attr('class','line')
                    .selectAll("line")
                    .data(word)
                    .enter()
                    .append("line")
                    .attr('y1',(d)=>yScale(d))
                    .attr('x1',30)
                    .attr('y2',(d)=>yScale(d))
                    .attr('x2',width)
    data.map(d=>{
        if(d.fre!=0){
        scales[d.word].data.push(d.fre);
        }
    })
    word.map(d=>{
        scales[d].scale = d3.scaleLinear()
                .range([2,15])
                .domain([d3.min(scales[d].data), d3.max(scales[d].data)])
    })
    //画圆
    let circle = svg.append('g')
                    .attr('class','circle')
                    .selectAll("circle")
                    .data(data)
                    .enter()
                    .append('circle')
                    .attr('cx',(d)=>xScale(d.media)+ xScale.bandwidth()/2)
                    .attr('cy',(d)=>yScale(d.word))
                    .attr('r',(d)=>d.fre==0?0:scales[d.word].scale(d.fre))
                    .attr('fill','rgb(198,85,82)')
    //画箭头

let line = svg.append("line")
			 .attr("x1",xScale('dailymail'))
			 .attr("y1",height + 30)
			 .attr("x2",xScale('ft'))
			 .attr("y2",height + 30)
			 .attr("stroke","black")
			 .attr("stroke-width",2)
			 .attr("marker-end","url(#arrow)");

let text = svg.append("text")
			 .attr("x",xScale('dailymail'))
			 .attr("y",height + 50)
			 .text('脱欧')
let text2 = svg.append("text")
			 .attr("x",xScale('ft'))
			 .attr("y",height + 50)
			 .text('留欧')

//图标
let lable = svg.append('circle')
                .attr('class','lable')
                .attr('cx',xScale('economist'))
                .attr('cy',height+30)
                .attr('r',15)
                .attr('fill','none')
            svg.append('line')
                .attr('x1',xScale('economist')+12)
                .attr('y1',height+20)
                .attr('x2',xScale('economist')+30)
                .attr('y2',height+20)
            svg.append('text')
                .attr('x',xScale('economist')+30)
                .attr('y',height+20)
                .text('max')
                .attr('font-size','12px')

let lable2 = svg.append('circle')
                .attr('class','lable')
                .attr('cx',xScale('economist'))
                .attr('cy',height+40)
                .attr('r',2)
            svg.append('line')
                .attr('x1',xScale('economist'))
                .attr('y1',height+40)
                .attr('x2',xScale('economist')+30)
                .attr('y2',height+40)
            svg.append('text')
                .attr('x',xScale('economist')+30)
                .attr('y',height+40)
                .text('min')
                .attr('font-size','12px')
});