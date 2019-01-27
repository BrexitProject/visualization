let margin = {top: 20, bottom: 20, left: 20, right: 20};
let svgWidth = 1500;
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

let circleScale = d3.scaleLinear()
                    .range([2,10]);
let scale = d3.scaleOrdinal()
                    .domain(['移民','安全','财政','法规','政治','官僚','担忧'])
                    .range([`translate(${width/14+10},0)`,`translate(${width/7+width/14},0)`,`translate(${width/7*2+width/14},0)`,`translate(${width/7*3+width/14},0)`,`translate(${width/7*4+width/14},0)`,`translate(${width/7*5+width/14},0)`,`translate(${width/7*6+width/14},0)`])
let totalTime = 0;
let second = 1000;
d3.csv('public/data/word_probability1.csv').then(function(data) {
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
    let totalWord = wordCloud(b,[width,height]);
    let words = category(data);
    Object.keys(words).map( d=>{
        wordCloud(words[d]['leave'],[width / 7,height /2]);
        wordCloud(words[d]['remain'],[width / 7,height /2]);
     });
     console.log(words);
    //  Object.keys(words).map( d=>{
    //     drawWord(words[d]['leave'],scale(d)+`translate(0,${height/4})`);
    //     drawWord(words[d]['remain'],scale(d)+`translate(0,${height/4*3})`);
    //  });
    //
    drawWord(totalWord,"translate("+[width/2,height/2]+")");
    // setTimeout(function(){drawSigWord(max);},totalTime + 5*second);
    // totalTime+= 5*second
    // setTimeout(function(){removeSig(max);},totalTime + 2*second);
    // totalTime+= 2*second
    // setTimeout(function(){drawSigWord(min);},totalTime + 1*second);
    // totalTime+= 1*second
    // setTimeout(function(){removeSig(min);},totalTime + 2*second);
    // totalTime+= 2*second
    // setTimeout(function(){removeGroup();},totalTime + 2*second);
    // totalTime+= 2*second

    //
    // setTimeout(function(){drawLev();},totalTime + 2*second);
    // totalTime+= 2*second
    // setTimeout(function(){drawWord(words['移民']['leave'],scale('移民')+`translate(0,${height/4})`);},totalTime + 2*second);
    // totalTime+= 2*second
    // setTimeout(function(){drawCircle(words['移民']['leave']);},totalTime + 2*second);
    // totalTime+= 2*second
    // setTimeout(function(){drawWord(words['安全']['remain'],scale('安全')+`translate(0,${height/4*3})`);},totalTime + 2*second);
    // totalTime+= 2*second
    // setTimeout(function(){drawCircle(words['安全']['remain']);},totalTime + 2*second);
    // totalTime+= 2*second
    // setTimeout(function(){drawWord(words['财政']['leave'],scale('财政')+`translate(0,${height/4})`);},totalTime + 2*second);
    // totalTime+= 2*second
    // setTimeout(function(){drawCircle(words['财政']['leave']);},totalTime + 2*second);
    // totalTime+= 2*second
    // setTimeout(function(){drawWord(words['财政']['remain'],scale('财政')+`translate(0,${height/4*3})`);},totalTime + 2*second);
    // totalTime+= 2*second
    // setTimeout(function(){drawCircle(words['财政']['remain']);},totalTime + 2*second);
    // totalTime+= 2*second
    // setTimeout(function(){drawWord(words['法规']['leave'],scale('法规')+`translate(0,${height/4})`);},totalTime + 2*second);
    // totalTime+= 2*second
    // setTimeout(function(){drawCircle(words['法规']['leave']);},totalTime + 2*second);
    // totalTime+= 2*second
    // setTimeout(function(){drawWord(words['政治']['leave'],scale('政治')+`translate(0,${height/4})`);},totalTime + 2*second);
    // totalTime+= 2*second
    // setTimeout(function(){drawCircle(words['政治']['leave']);},totalTime + 2*second);
    // totalTime+= 2*second
    // setTimeout(function(){drawWord(words['政治']['remain'],scale('政治')+`translate(0,${height/4*3})`);},totalTime + 2*second);
    // totalTime+= 2*second
    // setTimeout(function(){drawCircle(words['政治']['remain']);},totalTime + 2*second);
    // totalTime+= 2*second
    // setTimeout(function(){drawWord(words['官僚']['leave'],scale('官僚')+`translate(0,${height/4})`);},totalTime + 2*second);
    // totalTime+= 2*second
    // setTimeout(function(){drawCircle(words['官僚']['leave']);},totalTime + 2*second);
    // totalTime+= 2*second
    // setTimeout(function(){drawWord(words['官僚']['remain'],scale('官僚')+`translate(0,${height/4*3})`);},totalTime + 2*second);
    // totalTime+= 2*second
    // setTimeout(function(){drawCircle(words['官僚']['remain']);},totalTime + 2*second);
    // totalTime+= 2*second
    // setTimeout(function(){drawWord(words['担忧']['remain'],scale('担忧')+`translate(0,${height/4*3})`);},totalTime + 2*second);
    // totalTime+= 2*second
    // setTimeout(function(){ d3.selectAll(".word").attr("opacity",0);drawCircle(words['担忧']['remain']);},totalTime + 2*second);
    // totalTime+= 2*second
});