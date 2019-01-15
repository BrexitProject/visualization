let margin = {top: 20, bottom: 20, left: 20, right: 20};
let svgWidth = 800;
let svgHeight = 700;

let width=svgWidth - margin.left - margin.right;
let height=svgHeight - margin.top - margin.bottom;
let xScale = d3.scaleLinear()
           .range([5,35]);
let color = d3.scaleOrdinal().domain(['leave', 'remain']).range(['rgb(216, 75, 42)', 'rgb(31, 119, 180)'])
// 经济: economic 具体： concrete   政治：political 抽象：abstract
let svg = d3.select('.wordCloud')
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
let scale = d3.scaleOrdinal()
              .domain(['EC','EA','PC','PA'])
              .range([`translate(${width/4},${3*height/4})`,`translate(${width/4},${height/4})`,`translate(${3*width/4},${3*height/4})`,`translate(${3*width/4},${height/4})`])

drawAxis();
let wordData = [];
let count = 0;
d3.csv('static/data/word_probability.csv').then(function(data) {
    xScale.domain([d3.min(data, function(d) {
              return d.probability;
            }),1
           ])
    //分成四块词云送进函数
    let words = sort(data);
    Object.keys(words).map( d=>{
        wordData = wordData.concat(wordCloud(words[d].data));
    });
    //得到计算结果后分步骤画
    Object.keys(words).forEach( category => {
        Object.keys(words[category].category).forEach(kind => {
            // console.log(category,kind,words[category].category[kind]);
            setTimeout(function(){
                drawWord(words[category].category[kind]);
            },3000*count++);
            // setTimeout(drawWord(words[category].category[kind]),1000*count++);
            // drawWord(words[category].category[kind]);
        });
   });
   setTimeout(function(){
        d3.selectAll("text").attr("opacity",1);
    },3000*count++);
});