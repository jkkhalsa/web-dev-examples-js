let data = {};

phbRaces = ["Dragonborn", "Dwarf", "Elf", "Half-Elf", "Tiefling", "Human", "Halfling", "Half-Orc", "Gnome", "Aasimar"]


document.addEventListener('DOMContentLoaded', function() {

    Promise.all([d3.csv('data/Race & Class Poll Results.csv', (d) => {
        return{
            Race : d.Race,
            Wizards: +d.Wizard,
            Clerics: +d.Cleric,
            Warlocks: +d.Warlock,
            Fighters: +d.Fighter,
            Paladins: +d.Paladin,
            Sorcerers: +d.Sorcerer,
            Bards: +d.Bard,
            Druids: +d.Druid,
            Artificers: +d.Artificer,
            Rogues: +d.Rogue,
            Rangers: +d.Ranger,
            Barbarians: +d.Barbarian,
            Monks: +d.Monk,
            "Blood Hunters": +d["Blood Hunter"],
            Multiclassed: +d["Multi Class"]
        }
        
    })])
    .then(function(values){
        values[0].forEach((race) => {
            currentRace = race.Race
            data[currentRace] = race
            delete data[currentRace].Race

        });
        //console.log(data)
        updateLeft()
        updateRight()
    })
})

function updateLeft(){
    let svg = d3.select("#left")
    let g = svg.append("g")
    const width = +svg.style('width').replace('px', '');
    const height = +svg.style('height').replace('px', '')

    //get maximums
    let maxes = []

    Object.keys(data).forEach((raceKey, index) => {
        maxes.push(["", "", 0])
        Object.keys(data[raceKey]).forEach((classKey) => {
            if(data[raceKey][classKey] > maxes[index][2]){
                maxes[index] = [raceKey, classKey, data[raceKey][classKey]]
            }
        })
    })
    //console.log(maxes)

    //create a tooltip
    var div = d3.select("body").append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);
    
    
    let color = {}
    Object.keys(data.Human).forEach((classKey, index) => {
        color[classKey] = d3.interpolatePlasma(1-(index/15))
    });

    const circScale = d3.scaleSqrt()   
        .domain([0, 50])
        .range([0, 30])

    const circles = g.selectAll(".classCircles")
        .data(maxes)
        .join("circle")
        .attr("class", "classCircles")
        .attr("r", function(maxes) {return circScale(maxes[2])})
        .attr("cx", width/2)
        .attr("cy", height/2)
        .style("fill", function(d) {return color[d[1]]})
        //tooltip go brr
        .on('mouseover', function(event, d){
            div.transition()
                .duration(.200)
                .style("opacity", .9);
            div.html(this.__data__[2] + " " + this.__data__[0] + " " + this.__data__[1])
            div.style("left", (event.pageX)+'px')
                .style("top", (event.pageY-55) + 'px')
        })
        .on('mousemove', function(event, d){
            div.style("left", (event.pageX)+"px")
            div.style("top", (event.pageY-55)+"px")
        })
        .on('mouseout', function(d){
            div.transition()
                .duration(.500)
                .style("opacity", 0)
            div.style("left", '0px')
            div.style("top", '0px')
        })

    const circleText = g.selectAll(".raceText")
        .data(maxes)
        .join("text")
        .attr("class", "raceText")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .style("color", "rgb(169, 169, 169)")
        .text(d => d[0])
        .on('mouseover', function(event, d){
            div.transition()
                .duration(.200)
                .style("opacity", .9);
            div.html(this.__data__[2] + " " + this.__data__[0] + " " + this.__data__[1])
            div.style("left", (event.pageX)+'px')
                .style("top", (event.pageY-55) + 'px')
        })
        .on('mousemove', function(event, d){
            div.style("left", (event.pageX)+"px")
            div.style("top", (event.pageY-55)+"px")
        })
        .on('mouseout', function(d){
            div.transition()
                .duration(.500)
                .style("opacity", 0)
            div.style("left", '0px')
            div.style("top", '0px')
        })





    const simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(width/2).y(height/2)) // Attraction to the low center of the svg area
        .force("charge", d3.forceManyBody().strength(0.5)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.1).radius(30).iterations(1)) // Force that avoids circle overlapping

    simulation
        .nodes(maxes)
        .on("tick", function(d){
        circles
              .attr("cx", function(d){ return d.x; })
              .attr("cy", function(d){ return d.y; })
        circleText
            .attr("x", function(d){ return d.x; })
            .attr("y", function(d){ return d.y; })
        });

    

        
    
}

function updateRight(){
    let svg = d3.select("#right")
    let g = svg.append("g")
    const width = +svg.style('width').replace('px', '');
    const height = +svg.style('height').replace('px', '')

    //make tooltip, get key
    var div = d3.select("body").append("div")
        .attr("id", "tooltip")
        .style("opacity", 0)
        .style("width", '80px')
        .style("height", '25px')

    const key = d3.select("#key")


    let threeMax = []
    let color = {}
    const order = {0: 0, 1: -1, 2: 1}
    let popRaces = []
    //get three max per class
    Object.keys(data.Human).forEach((classKey) => {//iterate through classes
        currentClass = {}
        //grab this class' data from every race
        for(var race in data){
            currentClass[race] = data[race][classKey]
        };
        currentThree = []
        
        for(let i=0; i<2; i++){//get max three times
            currentMax = ["", 0, 0];
            //iterate through races, get current maximum
            for(var raceKey in currentClass){
                if(currentClass[raceKey] > currentMax[1]){
                    currentMax = [raceKey, currentClass[raceKey]]
                }
            }
            //add to class max list and delete race from contention
            currentThree.push({Race: currentMax[0], val: currentMax[1], place: order[i]})
            if(!popRaces.includes(currentMax[0])){
                popRaces.push(currentMax[0])
            }
            delete currentClass[currentMax[0]]
        }
        threeMax.push({class: classKey, topThree: currentThree})
    });
    popRaces.sort()


    //create color scaling
    popRaces.forEach((raceKey, index) => {
        color[raceKey] = d3.interpolateViridis(.8-(index/10))
    });
    //color in the key
    for(row of key._groups[0][0].childNodes[1].rows){
        for(cell of row.cells){
            currentText = cell.innerText.split(" ")[0]
            cell.style["color"] = color[currentText]
        }
    }

    //create axes
    const yScale = d3.scaleLinear()
        .domain([0, 50])
        .range([height-85, 0])

    yAxis = svg.append("g")
        .call(d3.axisLeft(yScale))
        .attr("transform", "translate(30, 15)")

    const xScale = d3.scaleBand()
        .domain(Object.keys(data.Human))
        .range([30, width-50])
    xAxis = svg.append("g")
        .call(d3.axisBottom(xScale))
        .attr("transform", "translate(0, 380)")
        .selectAll("text")
            .style("text-align", "right")
            .attr("transform", 'translate(-20, 15) rotate(-45)')

    
    threeMax.forEach(job => {
        selected = g.selectAll("." + job.class)
            .data(job.topThree)
                .join("line")
                .attr("stroke", d => color[d.Race])
                .style("stroke-width", function(d) {return ((d.Race == "Human") ? "1.6" : "1.3")})
                .attr("class", job.class)
                .attr("x1", function (d) {return xScale(job.class)+17+(d.place*7)})//first endpoint
                .attr("x2", function (d) { return xScale(job.class)+17+(d.place*7)})//second endpoint
                .attr("y2", yScale(0)+15)
                .on('mouseover', function(event, d){
                    div.transition()
                        .duration(.200)
                        .style("opacity", .9);
                    div.html(this.__data__.Race + ", " + this.__data__.val)
                    div.style("left", (event.pageX)+'px')
                        .style("top", (event.pageY-55) + 'px')
                })
                .on('mousemove', function(event, d){
                    div.style("left", (event.pageX)+"px")
                    div.style("top", (event.pageY-55)+"px")
                })
                .on('mouseout', function(d){
                    div.transition()
                        .duration(.500)
                        .style("opacity", 0)
                    div.style("left", '0px')
                    div.style("top", '0px')
                })
                .transition()
                    .duration(1000)
                        .attr("y1", function(d) {return yScale(d.val)+15})

        selected = g.selectAll(".circ" + job.class)
            .data(job.topThree)
                .join("circle")
            .attr("class", ("circ" + job.class))
            .attr("cx", function(d) {return xScale(job.class)+17+(d.place*7)})
            .attr("r", "4")
            .style("fill", d=>color[d.Race])   
            .on('mouseover', function(event, d){
                div.transition()
                    .duration(.200)
                    .style("opacity", .9);
                div.html(this.__data__.Race + ", " + this.__data__.val)
                div.style("left", (event.pageX)+'px')
                    .style("top", (event.pageY-55) + 'px')
            })
            .on('mousemove', function(event, d){
                div.style("left", (event.pageX)+"px")
                div.style("top", (event.pageY-55)+"px")
            })
            .on('mouseout', function(d){
                div.transition()
                    .duration(.500)
                    .style("opacity", 0)
                div.style("left", '0px')
                div.style("top", '0px')
            })
            .transition()
                .duration(1000)
                .attr("cy", function(d) {return yScale(d.val)+15})
    })
}