let svg;
let sidebar;
let g;
let sideg;
let global_state;
let alaskaFIPS = {};




document.addEventListener('DOMContentLoaded', function () {
    //set up html stuff
    svg = d3.select("#map_svg")
    sidebar = d3.select("#state_svg")
    sideg = sidebar.append("g")
    g = svg.append("g")

    //set up alaska. screw alaska.

    Promise.all([d3.csv("data/alaskaFIPS.csv", (line) => {
        return {
            fips: line.fips,
            name: line.countyName
        }
    })]).then(function(values) {
        //iterate through what we just made and put it into an actual array
        values[0].forEach((item) => {
            alaskaFIPS[item.fips] = item.name
        })
    })
});

function countryHeatMap(){

    if (window.scrollY) {
        document.getElementById('one').scrollIntoView();
    }

    //for averages-
    //1 mile from supermarket counts as .5 
    //10 miles from supermarket counts as 1
    //20 miles from supermarket counts as 2

    let tempAverages = {}
    let stateAverages = {}
    global_foodAccess.forEach((county) => {
        if(Object.keys(tempAverages).includes(county.State)){
            tempAverages[county.State].Population += county.Population
            tempAverages[county.State].Desert += (county.OneMileDesert*.5) + (county.TenMileDesert) + (county.TwentyMileDesert*2)
        }
        else{
            temp = (county.OneMileDesert*.5) + (county.TenMileDesert) + (county.TwentyMileDesert*2)
            tempAverages[county.State] = {Population: county.Population, Desert: temp}
        }
    })
    Object.keys(tempAverages).forEach((state) => {
        stateAverages[state] = tempAverages[state].Desert/tempAverages[state].Population
    })
    

    //hippity hoppity your bones are my property

    var path = d3.geoPath();

    
   
    //g.selectAll("path").remove()
    
    Promise.all([d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json", (us) => {
        return (topojson.feature(us, us.objects.states))
        
    })])
    .then(function(values){
        data = topojson.feature(values[0], values[0].objects.states).features
    
        states = g.selectAll("path")
            .data(data)
            .enter()
            .append("path")
            .attr("class", "states")
            .attr("d", path)
            .style("fill", d => d3.interpolateRdYlGn(1-stateAverages[d.properties.name]*2)) //FINAL FILL COLOR
            .on("click", function() {stateHeatMap(this.__data__.properties.name, this.__data__.id); document.getElementById('state_svg').scrollIntoView();})

        
    })
    legend(d3.min(Object.values(stateAverages)), d3.max(Object.values(stateAverages)))

}

function stateHeatMap(state, stateCode){
    global_state = state;
    let selectedState = {}

    for (var member in selectedState) delete selectedState[member];
    global_foodAccess.forEach((county) => {
        if(county.State == state){ //check if this line item will be drawn
            selectedState[county.County] = ((county.OneMileDesert*.2) + (county.TenMileDesert*.5) + (county.TwentyMileDesert))/county.Population
        }
    });
    //console.log("selected state, ", selectedState)

    let severityScale = d3.scaleLinear()
        .domain([d3.min(Object.values(selectedState)), d3.max(Object.values(selectedState))])
        .range([0, 2])

    var geopath = d3.geoPath();
    let myCounties = []

    let div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    Promise.all([d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json", (us) => {
        return (topojson.feature(us, us.objects.counties))
        
    })])
    .then(function(values){
        data = topojson.feature(values[0], values[0].objects.counties).features
        data.forEach((line) => {
            if(line.id.slice(0, 2) == stateCode){
                myCounties.push(line)
            }
        })
    
        sideg.selectAll("path").remove()
        
        counties = sideg.selectAll("path")
            .data(myCounties)
            .enter()
            .append("path")
            .attr("class", "counties")
            .attr("d", geopath)
            .style("opacity", 0)
            .attr("transform", `scale(1.5)`)
            .style("fill", d => d3.interpolateRdYlGn(1-severityScale(selectedState[getCountyName(d.properties.name, d.id, stateCode)]))) //play with fill color
            //.on("keypress", countryHeatMap())
            .on("mouseover", function (event) {
                div.transition()
                  .duration(200)
                  .style("opacity", .9);
                div.html(this.__data__.properties.name)
                  .style("left", (event.pageX) + "px")
                  .style("top", (event.pageY - 28) + "px");
              })
              .on("mouseout", function (d) {
                div.transition()
                  .duration(500)
                  .style("opacity", 0);
              })
            .transition()
                .duration(500)
                .style("opacity", 1)
                .on("end", changeAspect(sideg._groups[0][0].getBBox()))
                
    })
    

    legend(d3.min(Object.values(selectedState)), d3.max(Object.values(selectedState)))

    updateDependents();
    

}

function changeAspect(bbox){
    scaleBy = 1
    if(bbox.width < 50){
        scaleBy = 200/bbox.width
    }
    sidebar
        .style('width', bbox.width*scaleBy + 'px')
        .style('height', bbox.height*scaleBy + 'px')

    sideg  
        .attr("transform", `scale(${scaleBy}), translate(${-bbox.x}, ${-bbox.y})`)

    //create our sidebar
}

function getCountyName(name, code, state){
    if(state == "22"){
        return name + " Parish"
    }
    else if(state == "02"){
        //this is alaska and alaska is fucked enough to warrant its own dictionary
        return alaskaFIPS[code]
    }
    else{
        return name + " County"
    }
}

function legend(min, max){
    let range = [d3.interpolateRdYlGn(1-min*2), d3.interpolateRdYlGn(1-d3.median([min, max])*2), d3.interpolateRdYlGn(1-max*2)]
    let defs = svg.append("defs")

    colors = []
    for(let i = 0; i < 3; i++){
        colors.push({
            offset: i*50 + "%",
            color: range[i]
        })
    }

    let colorScale = d3.scaleLinear()
        .domain([min, d3.median([min, max]), max])
        .range(range)
    
    let linearGradient = defs.append('linearGradient')
        .attr("id", "linear-gradient")

    //make horizontal
    linearGradient
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%")

    linearGradient.selectAll("stop")
        .data(colors)
        .enter().append("stop")
        .attr("offset", function(d) {return d.offset})
        .attr("stop-color", function(d){return d.color})

    g.append("rect")
        .attr("x", 500)
        .attr("y", 30)
        .attr("width", 400)
        .attr("height", 15)
        .style("fill", "url(#linear-gradient)")

    g.append("legendText")
        .attr("class", "legendText")
        .text("Less Severe            More Severe")
        .attr("x", 500)
        .attr("y", 30)
        .style("color", "white")
        .style("position", "absolute")

}

function updateDependents(){
    //place to store all the function calls for charts that need to be linked

    createPieChart()
    createBarChart()
    createBubblePlot()
    createScatterPlot()
    createLineGraph() //keeps throwing errors on city variable
}