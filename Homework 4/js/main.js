//variables
let countryRegions = {
    SA: [],
    ECA: [],
    MENA: [],
    SSA: [],
    LAC: [],
    EAP: [],
    NA: []
};
let globalDevelopment;
let southAsia = {};
let europeCentralAsia = {};
let middleEastNorthAfrica = {};
let subSaharanAfrica = {};
let latinAmericanCarribean = {};
let eastAsiaPacific = {};
let northAmerica = {};

let container = [
    southAsia,
    europeCentralAsia,
    middleEastNorthAfrica,
    subSaharanAfrica,
    latinAmericanCarribean,
    eastAsiaPacific,
    northAmerica
];

let checked = {
    SA: false,
    ECA: false,
    MENA: false,
    SSA: false,
    LAC: false,
    EAP: false,
    NA: false
};

let animationContainer;



let svg;
let g;
let width;
let height;
const margin = { top: 50, bottom: 50, left: 60, right: 50 }
let innerWidth;
let innerHeight;
let xAxis;
let xScale;
let yAxis;

let currentOpacity;

let sa;
let saCirc;
let saLab;
let eca;
let ecaCirc;
let ecaLab;
let mena;
let menaCirc;
let menaLab;
let ssa;
let ssaCirc;
let ssaLab;
let lac;
let lacCirc;
let lacLab;
let eap;
let eapCirc;
let eapLab;
let na;
let naCirc;
let naLab;
let color = [];





//control panel functions

function allClicked() {
    document.getElementById("SA").checked = true;
    document.getElementById("ECA").checked = true;
    document.getElementById("MENA").checked = true;
    document.getElementById("SSA").checked = true;
    document.getElementById("LAC").checked = true;
    document.getElementById("EAP").checked = true;
    document.getElementById("NA").checked = true;
    graphUpdate()
}

function allRemoved() {
    document.getElementById("SA").checked = false;
    document.getElementById("ECA").checked = false;
    document.getElementById("MENA").checked = false;
    document.getElementById("SSA").checked = false;
    document.getElementById("LAC").checked = false;
    document.getElementById("EAP").checked = false;
    document.getElementById("NA").checked = false;
    graphUpdate()
}

function opacityChange() {
    currentOpacity = document.getElementById("opacitySlider").value / 100
    let drawings = document.getElementsByClassName("drawing")
    for (let i = 0; i < drawings.length; i++) {
        drawings[i].style.opacity = currentOpacity
    }
    //console.log("opacity is" + currentOpacity)
}

function animation() {
    let totalLength = []
    let animationIDs = []
    let selection = d3.selectAll(".line")._groups[0]
    console.log(selection)
    selection.forEach((path) => {
        totalLength.push(path.getTotalLength())
        animationIDs.push("." + path.id)
    });
    console.log(animationIDs)
    selection.forEach((path, index) => {
        console.log(d3.select(path))
        d3.select(path)
            .attr("stroke-dasharray", totalLength[index])
            .attr("stroke-dashoffset", totalLength[index])
            .transition()
            .duration(5000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
    });
}

function updateNoAnim() {
    graphUpdate()
}

//time to d3 this bitch

//data wrangling
document.addEventListener('DOMContentLoaded', function () {

    svg = d3.select('#line-chart');
    width = +svg.style('width').replace('px', '');
    height = +svg.style('height').replace('px', '')
    innerWidth = width - 110;
    innerHeight = height - 100

    Promise.all([d3.csv('data/global_development.csv', (d) => {
        if (+d.Year > 1979) {
            return {
                Year: new Date(+d.Year, 0, 1),
                Country: d.Country,
                birthRate: +d.BirthRate,
                deathRate: +d.DeathRate,
                totalPop: +d.TotalPopulation,
                popGrowth: +d.PopulationGrowth,
                ruralPop: +d.RuralPopulation,
                ruralPopGrowth: +d.RuralPopulationGrowth,
                urbanPopPerc: +d.UrbanPopulationPercent,
                urbanPopGrowth: +d.UrbanPopulationPercentGrowth,
                cellSub: +d.MobileCellularSubscriptionsper100People,
                telLines: +d.TelephoneLinesper100People
            }
        }

    }), d3.csv('data/countries_regions.csv', (d) => { //add names of countries to respective areas
        countryRegions[d["World bank region"]].push(d.name)
    })])
        .then(function (values) {
            globalDevelopment = values[0];
            //countryRegions = values[1];


            //put country data in region groups
            //region groups are made of array blocks of each country's data, updated dynamically based on what keys we have
            globalDevelopment.forEach((item, index) => {
                currentCountry = item["Country"];
                currentLine = globalDevelopment[index];
                if (countryRegions.SA.includes(currentCountry)) {
                    (currentCountry in southAsia ? southAsia[currentCountry].push(currentLine) : southAsia[currentCountry] = [currentLine])
                }
                else if (countryRegions.ECA.includes(currentCountry)) {
                    (currentCountry in europeCentralAsia ? europeCentralAsia[currentCountry].push(currentLine) : europeCentralAsia[currentCountry] = [currentLine])
                }
                else if (countryRegions.MENA.includes(currentCountry)) {
                    (currentCountry in middleEastNorthAfrica ? middleEastNorthAfrica[currentCountry].push(currentLine) : middleEastNorthAfrica[currentCountry] = [currentLine])
                }
                else if (countryRegions.SSA.includes(currentCountry)) {
                    (currentCountry in subSaharanAfrica ? subSaharanAfrica[currentCountry].push(currentLine) : subSaharanAfrica[currentCountry] = [currentLine])
                }
                else if (countryRegions.LAC.includes(currentCountry)) {
                    (currentCountry in latinAmericanCarribean ? latinAmericanCarribean[currentCountry].push(currentLine) : latinAmericanCarribean[currentCountry] = [currentLine])
                }
                else if (countryRegions.EAP.includes(currentCountry)) {
                    (currentCountry in eastAsiaPacific ? eastAsiaPacific[currentCountry].push(currentLine) : eastAsiaPacific[currentCountry] = [currentLine])
                }
                else if (countryRegions.NA.includes(currentCountry)) {
                    (currentCountry in northAmerica ? northAmerica[currentCountry].push(currentLine) : northAmerica[currentCountry] = [currentLine])
                }
            });

            //draw x axis since it won't change
            xScale = d3.scaleTime()
                .domain([new Date(1980, 0, 1), new Date(2013, 0, 1)])
                .range([0, innerWidth])

            //set up svg
            g = svg.append('g')
                .attr("transform", `translate(${margin.left}, ${margin.top})`);


            xAxis = g.append('g')
                .call(d3.axisBottom(xScale))
                .attr("transform", `translate(0, ${innerHeight})`)
            yAxis = g.append('g')
                .attr("transform", `translate(0, 0)`)
            currentOpacity = document.getElementById("opacitySlider").value / 100
            console.log(container)
            graphUpdate();
        });
});


//update graph
function graphUpdate() {

    //fetch what we're working with
    let indicator = document.getElementById("indicatorSelect").value
    //console.log(indicator)

    document.querySelectorAll("input[type='checkbox']").forEach((item) => {
        checked[item.id] = item.checked;
    });
    //console.log(checked)


    //get countries that we're displaying, then put in usable form (usedVal)
    //also get all values we're using to scale y axis (allVal)
    let allVal = [];
    let usedVal = [[], [], [], [], [], [], []];
    //blank out colors and only color in regions that are used
    let color = ["none", "none", "none", "none", "none", "none", "none"]
    let opaqueControl = [0, 0, 0, 0, 0, 0, 0]
    //console.log("dataset is ")
    //console.log(dataset)
    container.forEach((item, index) => {
        if (Object.values(checked)[index]) { //color in regions that are used
            color[index] = (d3.interpolateWarm(1 - (index / container.length)))
            opaqueControl[index] = currentOpacity;
        }
        for (var key in item) {
            usedVal[index].push({
                country: key,
                items: item[key].map(function (d) {
                    if ((Object.values(checked)[index])) { //check what's being shown for y axis and colors
                        allVal.push(d[indicator])
                    }
                    return {
                        date: d.Year,
                        val: d[indicator]
                    }
                })
            });
        }
    });

    console.log(usedVal)
    console.log(container)


    //update y axis
    const yScale = d3.scaleLinear()
        .domain([d3.min(allVal), d3.max(allVal)])
        .range([innerHeight, 0])

    yAxis.transition()
        .duration(1000)
        .call(d3.axisLeft(yScale));

    const singleLine = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.val))
        .curve(d3.curveMonotoneX);

    //draw each region separately
    sa = g.selectAll('.southAsia')
        .data(usedVal[0])
        .join('path')
        .style('fill', 'none')
        .style('stroke', color[0])
        //.style('opacity', currentOpacity)
        .attr("class", "southAsia drawing line")
        .attr("id", d => (d.country + "-line"))
        .style('stroke-width', '1.5')
        .on('mouseover', d => hover(d.target.__data__.country))
        .on('mouseout', function () { quithover() })
        .transition()
        .duration(1000)
        .style('opacity', opaqueControl[0])
        .attr('d', function (d) { return singleLine(d.items); });
    saCirc = g.selectAll('.saCircles')
        .data(usedVal[0])
        .join("circle")
        .attr("class", "saCircles drawing circle")
        .attr("id", d => (d.country + "-circ"))
        .attr("r", "2")
        .style("fill", color[0])
        .attr("cx", function (d) { return xScale(d.items.slice(-1)[0].date) })
        .on('mouseover', d => hover(d.target.__data__.country))
        .on('mouseout', function () { quithover() })
        .transition()
        .duration(1000)
        .attr("cy", function (d) {
            if (yScale(d.items.slice(-1)[0].val != NaN)) {
                return yScale(d.items.slice(-1)[0].val)
            }
        })
        .style('opacity', opaqueControl[0])
    saLab = g.selectAll('.saLab')
        .data(usedVal[0])
        .join("text")
        .attr("class", "saLab drawing label")
        .attr("id", d => (d.country + "-lab"))
        .style("fill", color[0])
        .style('font-size', '8px')
        .style("text-align", "left")
        .text(function (d) { return d.country })
        .attr("x", function (d) { return xScale(d.items.slice(-1)[0].date) + 5 })
        .on('mouseover', d => hover(d.target.__data__.country))
        .on('mouseout', function () { quithover() })
        .transition()
        .duration(1000)
        .attr("y", function (d) {
            if (yScale(d.items.slice(-1)[0].val != NaN)) {
                return yScale(d.items.slice(-1)[0].val)
            }
        })
        .style('opacity', opaqueControl[0])

    eca = g.selectAll('.europeCentralAsia')
        .data(usedVal[1])
        .join('path')
        .style('fill', 'none')
        .style('stroke', color[1])
        .attr("class", "europeCentralAsia drawing line")
        .attr("id", d => (d.country + "-line"))
        .style('stroke-width', '1.5')
        .on('mouseover', d => hover(d.target.__data__.country))
        .on('mouseout', function () { quithover() })
        .transition()
        .style('opacity', opaqueControl[1])
        .duration(1000)
        .attr('d', function (d) { return singleLine(d.items); });
    ecaCirc = g.selectAll('.ecaCircles')
        .data(usedVal[1])
        .join("circle")
        .attr("class", "ecaCircles drawing circle")
        .attr("id", d => (d.country + "-circ"))
        .attr("r", "2")
        .style("fill", color[1])
        .attr("cx", function (d) { return xScale(d.items.slice(-1)[0].date) })
        .on('mouseover', d => hover(d.target.__data__.country))
        .on('mouseout', function () { quithover() })
        .transition()
        .duration(1000)
        .style('opacity', opaqueControl[1])
        .attr("cy", function (d) {
            if (yScale(d.items.slice(-1)[0].val != NaN)) {
                return yScale(d.items.slice(-1)[0].val)
            }
        })
    ecaLab = g.selectAll('.ecaLab')
        .data(usedVal[1])
        .join("text")
        .attr("class", "ecaLab drawing label")
        .attr("id", d => (d.country + "-lab"))
        .style("fill", color[1])
        .style('font-size', '8px')
        .style("text-align", "left")
        .text(function (d) { return d.country })
        .attr("x", function (d) { return xScale(d.items.slice(-1)[0].date) + 5 })
        .on('mouseover', d => hover(d.target.__data__.country))
        .on('mouseout', function () { quithover() })
        .transition()
        .duration(1000)
        .style('opacity', opaqueControl[1])
        .attr("y", function (d) {
            if (yScale(d.items.slice(-1)[0].val != NaN)) {
                return yScale(d.items.slice(-1)[0].val)
            }
        })


    mena = g.selectAll('.middleEastNorthAfrica')
        .data(usedVal[2])
        .join('path')
        .style('fill', 'none')
        .style('stroke', color[2])
        .attr("class", "middleEastNorthAfrica drawing line")
        .attr("id", d => (d.country + "-line"))
        .style('stroke-width', '1.5')
        .on('mouseover', d => hover(d.target.__data__.country))
        .on('mouseout', function () { quithover() })
        .transition()
        .duration(1000)
        .style('opacity', opaqueControl[2])
        .attr('d', function (d) { return singleLine(d.items); });
    menaCirc = g.selectAll('.menaCircles')
        .data(usedVal[2])
        .join("circle")
        .attr("class", "menaCircles drawing circle")
        .attr("id", d => (d.country + "-circ"))
        .attr("r", "2")
        .style("fill", color[2])
        .attr("cx", function (d) { return xScale(d.items.slice(-1)[0].date) })
        .on('mouseover', d => hover(d.target.__data__.country))
        .on('mouseout', function () { quithover() })
        .transition()
        .duration(1000)
        .style('opacity', opaqueControl[2])
        .attr("cy", function (d) {
            if (yScale(d.items.slice(-1)[0].val != NaN)) {
                return yScale(d.items.slice(-1)[0].val)
            }
        })
    menaLab = g.selectAll('.menaLab')
        .data(usedVal[2])
        .join("text")
        .attr("class", "menaLab drawing label")
        .attr("id", d => (d.country + "-lab"))
        .style("fill", color[2])
        .style('font-size', '8px')
        .style("text-align", "left")
        .text(function (d) { return d.country })
        .attr("x", function (d) { return xScale(d.items.slice(-1)[0].date) + 5 })
        .on('mouseover', d => hover(d.target.__data__.country))
        .on('mouseout', function () { quithover() })
        .transition()
        .duration(1000)
        .style('opacity', opaqueControl[2])
        .attr("y", function (d) {
            if (yScale(d.items.slice(-1)[0].val != NaN)) {
                return yScale(d.items.slice(-1)[0].val)
            }
        })


    ssa = g.selectAll('.subSaharanAfrica')
        .data(usedVal[3])
        .join('path')
        .style('fill', 'none')
        .style('stroke', color[3])
        .attr("class", "subSaharanAfrica drawing line")
        .attr("id", d => (d.country + "-line"))
        .style('stroke-width', '1.5')
        .on('mouseover', d => hover(d.target.__data__.country))
        .on('mouseout', function () { quithover() })
        .transition()
        .duration(1000)
        .style('opacity', opaqueControl[3])
        .attr('d', function (d) { return singleLine(d.items); });
    ssaCirc = g.selectAll('.ssaCirc')
        .data(usedVal[3])
        .join("circle")
        .attr("class", "ssaCirc drawing circle")
        .attr("id", d => (d.country + "-circ"))
        .attr("r", "2")
        .style("fill", color[3])
        .attr("cx", function (d) { return xScale(d.items.slice(-1)[0].date) })
        .on('mouseover', d => hover(d.target.__data__.country))
        .on('mouseout', function () { quithover() })
        .transition()
        .duration(1000)
        .style('opacity', opaqueControl[3])
        .attr("cy", function (d) {
            if (yScale(d.items.slice(-1)[0].val != NaN)) {
                return yScale(d.items.slice(-1)[0].val)
            }
        })
    ssaLab = g.selectAll('.ssaLab')
        .data(usedVal[3])
        .join("text")
        .attr("class", "ssaLab drawing label")
        .attr("id", d => (d.country + "-lab"))
        .style("fill", color[3])
        .style('font-size', '8px')
        .style("text-align", "left")
        .text(function (d) { return d.country })
        .attr("x", function (d) { return xScale(d.items.slice(-1)[0].date) + 5 })
        .on('mouseover', d => hover(d.target.__data__.country))
        .on('mouseout', function () { quithover() })
        .transition()
        .duration(1000)
        .style('opacity', opaqueControl[3])
        .attr("y", function (d) {
            if (yScale(d.items.slice(-1)[0].val != NaN)) {
                return yScale(d.items.slice(-1)[0].val)
            }
        })


    lac = g.selectAll('.latinAmericanCarribean')
        .data(usedVal[4])
        .join('path')
        .style('fill', 'none')
        .style('stroke', color[4])
        .attr("class", "latinAmericanCarribean drawing line")
        .attr("id", d => (d.country + "-line"))
        .style('stroke-width', '1.5')
        .on('mouseover', d => hover(d.target.__data__.country))
        .on('mouseout', function () { quithover() })
        .transition()
        .duration(1000)
        .style('opacity', opaqueControl[4])
        .attr('d', function (d) { return singleLine(d.items); });
    lacCirc = g.selectAll('.lacCircles')
        .data(usedVal[4])
        .join("circle")
        .attr("class", "lacCircles drawing circle")
        .attr("id", d => (d.country + "-circ"))
        .attr("r", "2")
        .style("fill", color[4])
        .attr("cx", function (d) { return xScale(d.items.slice(-1)[0].date) })
        .on('mouseover', d => hover(d.target.__data__.country))
        .on('mouseout', function () { quithover() })
        .transition()
        .duration(1000)
        .style('opacity', opaqueControl[4])
        .attr("cy", function (d) {
            if (yScale(d.items.slice(-1)[0].val != NaN)) {
                return yScale(d.items.slice(-1)[0].val)
            }
        })
    lacLab = g.selectAll('.lacLab')
        .data(usedVal[4])
        .join("text")
        .attr("class", "lacLab drawing label")
        .attr("id", d => (d.country + "-lab"))
        .style("fill", color[4])
        .style('font-size', '8px')
        .style("text-align", "left")
        .text(function (d) { return d.country })
        .attr("x", function (d) { return xScale(d.items.slice(-1)[0].date) + 5 })
        .on('mouseover', d => hover(d.target.__data__.country))
        .on('mouseout', function () { quithover() })
        .transition()
        .duration(1000)
        .style('opacity', opaqueControl[4])
        .attr("y", function (d) {
            if (yScale(d.items.slice(-1)[0].val != NaN)) {
                return yScale(d.items.slice(-1)[0].val)
            }
        })


    eap = g.selectAll('.eastAsiaPacific')
        .data(usedVal[5])
        .join('path')
        .style('fill', 'none')
        .style('stroke', color[5])
        .attr("class", "eastAsiaPacific drawing line")
        .attr("id", d => (d.country + "-line"))
        .style('stroke-width', '1.5')
        .on('mouseover', d => hover(d.target.__data__.country))
        .on('mouseout', function () { quithover() })
        .transition()
        .duration(1000)
        .style('opacity', opaqueControl[5])
        .attr('d', function (d) { return singleLine(d.items); });
    eapCirc = g.selectAll('.eapCircles')
        .data(usedVal[5])
        .join("circle")
        .attr("class", "eapCircles drawing circle")
        .attr("id", d => (d.country + "-circ"))
        .attr("r", "2")
        .style("fill", color[5])
        .attr("cx", function (d) { return xScale(d.items.slice(-1)[0].date) })
        .on('mouseover', d => hover(d.target.__data__.country))
        .on('mouseout', function () { quithover() })
        .transition()
        .duration(1000)
        .style('opacity', opaqueControl[5])
        .attr("cy", function (d) {
            if (yScale(d.items.slice(-1)[0].val != NaN)) {
                return yScale(d.items.slice(-1)[0].val)
            }
        })
    eapLab = g.selectAll('.eapLab')
        .data(usedVal[5])
        .join("text")
        .attr("class", "eapLab drawing label")
        .attr("id", d => (d.country + "-lab"))
        .style("fill", color[5])
        .style('font-size', '8px')
        .style("text-align", "left")
        .text(function (d) { return d.country })
        .attr("x", function (d) { return xScale(d.items.slice(-1)[0].date) + 5 })
        .on('mouseover', d => hover(d.target.__data__.country))
        .on('mouseout', function () { quithover() })
        .transition()
        .duration(1000)
        .style('opacity', opaqueControl[5])
        .attr("y", function (d) {
            if (yScale(d.items.slice(-1)[0].val != NaN)) {
                return yScale(d.items.slice(-1)[0].val)
            }
        })

    na = g.selectAll('.northAmerica')
        .data(usedVal[6])
        .join('path')
        .style('fill', 'none')
        .style('stroke', color[6])
        .attr("class", "northAmerica drawing line")
        .attr("id", d => (d.country + "-line"))
        .style('stroke-width', '1.5')
        .on('mouseover', d => hover(d.target.__data__.country))
        .on('mouseout', function () { quithover() })
        .transition()
        .duration(1000)
        .style('opacity', opaqueControl[6])
        .attr('d', function (d) { return singleLine(d.items); });
    naCirc = g.selectAll('.naCircles')
        .data(usedVal[6])
        .join("circle")
        .attr("class", "naCircles drawing circle")
        .attr("id", d => (d.country + "-circ"))
        .attr("r", "2")
        .style("fill", color[6])
        .attr("cx", function (d) { return xScale(d.items.slice(-1)[0].date) })
        .on('mouseover', d => hover(d.target.__data__.country))
        .on('mouseout', function () { quithover() })
        .transition()
        .duration(1000)
        .style('opacity', opaqueControl[6])
        .attr("cy", function (d) {
            if (yScale(d.items.slice(-1)[0].val != NaN)) {
                return yScale(d.items.slice(-1)[0].val)
            }
        })
    naLab = g.selectAll('.naLab')
        .data(usedVal[6])
        .join("text")
        .attr("class", "naLab drawing label")
        .attr("id", d => (d.country + "-lab"))
        .style("fill", color[6])
        .style('font-size', '8px')
        .style("text-align", "left")
        .text(function (d) { return d.country })
        .attr("x", function (d) { return xScale(d.items.slice(-1)[0].date) + 5 })
        .on('mouseover', d => hover(d.target.__data__.country))
        .on('mouseout', function () { quithover() })
        .transition()
        .duration(1000)
        .style('opacity', opaqueControl[6])
        .attr("y", function (d) {
            if (yScale(d.items.slice(-1)[0].val != NaN)) {
                return yScale(d.items.slice(-1)[0].val)
            }
        })
}

function hover(country) {
    let selectString = "#" + country + "-line,#" + country + "-lab,#" + country + "-circ"
    console.log("hovering")
    currentOpacity -= .3
    let drawings = document.getElementsByClassName("drawing")
    for (let i = 0; i < drawings.length; i++) {
        drawings[i].style.opacity = currentOpacity
    }
    document.getElementById(country + "-line")
        .style.opacity = 1
    document.getElementById(country + "-circ")
        .style.opacity = 1
    document.getElementById(country + "-lab")
        .style.opacity = 1

}

function quithover() {
    currentOpacity += .3
    console.log("done hovering")
    let drawings = document.getElementsByClassName("drawing")
    for (let i = 0; i < drawings.length; i++) {
        drawings[i].style.opacity = currentOpacity
    }
}