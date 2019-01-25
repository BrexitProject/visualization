let margin = {top: 20, bottom: 20, left: 20, right: 20};
let svgWidth = 800;
let svgHeight = 700;

let width=svgWidth - margin.left - margin.right;
let height=svgHeight - margin.top - margin.bottom;
let xScale = d3.scaleLinear()
           .range([5,35]);
let color = d3.scaleOrdinal().domain(['leave', 'remain']).range(['rgb(205, 23, 30)', 'rgb(31, 119, 180)'])
// 经济: economic 具体： concrete   政治：political 抽象：abstract
let svg = d3.select('.wordCloud')
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
let scale = d3.scaleOrdinal()
              .domain(['EC','EA','PC','PA','EP'])
              .range([`translate(${width/4},${3*height/4})`,`translate(${width/4},${height/4})`,`translate(${3*width/4},${3*height/4})`,`translate(${3*width/4},${height/4})`,`translate(${width/2},${height/4*3})`])
let circleScale = d3.scaleLinear()
                    .range([2,10]);
let totalTime = 0;
let second = 1000;
d3.csv('static/data/word_probability.csv').then(function(data) {
    let max = data[0];
    let min = data[0];
    data.map(d=>{
        if(d.probability > max.probability)
            max = d;
        if(d.probability < min.probability)
            min = d;
    })
    xScale.domain([min.probability,1])
    circleScale.domain([min.probability,1])
    let b=deepClone(data);
    let words = sort(data);
    Object.keys(words).map( d=>{
       wordCloud(words[d].data,[width / 2,height /2]);
    });
    let totalWord = wordCloud(b,[width,height]);
    // document.onkeydown=function(e){
        // var keyNum=window.event ? e.keyCode :e.which;
        //键盘监听 q w  回车
        //1.画字 坐标轴
        // if(keyNum==81){
            drawWord(totalWord,"translate("+[width/2,height/2]+")");
            setTimeout(function(){drawSigWord(max);},totalTime + 5*second);
            totalTime+= 5*second
            setTimeout(function(){removeSig(max);},totalTime + 2*second);
            totalTime+= 2*second
            setTimeout(function(){drawSigWord(min);},totalTime + 1*second);
            totalTime+= 1*second
            setTimeout(function(){removeSig(min);},totalTime + 2*second);
            totalTime+= 2*second
            setTimeout(function(){removeGroup();},totalTime + 2*second);
            totalTime+= 2*second
            setTimeout(function(){drawHorAxis();},totalTime + 2*second);
            totalTime+= 2*second
            setTimeout(function(){drawLevAxis();},totalTime + 2*second);
            totalTime+= 2*second
            setTimeout(function(){drawWord(words['EA'].category['行业']);},totalTime + 4*second);
            totalTime+= 4*second;
            setTimeout(function(){drawWord(words['EA'].category['经济高上大']);},totalTime + 4*second);
            totalTime+= 4*second;
            setTimeout(function(){drawWord(words['EA'].category['担忧']);},totalTime + 4*second);
            totalTime+= 4*second;
            setTimeout(function(){drawWord(words['EC'].category['接地气']);},totalTime + 4*second);
            totalTime+= 4*second;
            setTimeout(function(){drawWord(words['EC'].category['拿回权力']);},totalTime + 4*second);
            totalTime+= 4*second;
            setTimeout(function(){drawWord(words['PC'].category['政治现实']);},totalTime + 4*second);
            totalTime+= 4*second;
            setTimeout(function(){drawWord(words['PC'].category['政客官僚']);},totalTime + 4*second);
            totalTime+= 4*second;
            setTimeout(function(){drawWord(words['PC'].category['负面用词']);},totalTime + 4*second);
            totalTime+= 4*second;
            setTimeout(function(){drawWord(words['PC'].category['不消极']);},totalTime + 4*second);
            totalTime+= 4*second;
            setTimeout(function(){drawWord(words['PA'].category['理念']);},totalTime + 4*second);
            totalTime+= 4*second;
            setTimeout(function(){d3.selectAll('.word').remove()},totalTime + 4*second);
            totalTime+= 2*second;
            let a=words['EA'].data.concat(words['EC'].data);
            let c=words['PA'].data.concat(words['PC'].data);
            let d=a.concat(c);
            setTimeout(function(){drawCircle(d);},totalTime + 4*second);
            totalTime+= 4*second;
            setTimeout(function(){drawWord(words['EP'].data);},totalTime + 4*second);
            totalTime+= 4*second;
        // }
    // }
});