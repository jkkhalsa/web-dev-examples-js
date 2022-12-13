// Hint: This is a good place to declare your global variables

let svg;
let g;
let width;
let height;
const margin = {top:50, bottom:50, left:60, right:50}
let innerWidth;
let innerHeight;
let xScale;
let female_data;
let male_data;
let xAxis;
let yAxis;

let mL;
let mC;

const offset = 3; //offset for lines so they don't overlap


// This function is called once the HTML page is fully loaded by the browser
document.addEventListener('DOMContentLoaded', function () {
   // Hint: create or set your svg element inside this function
   svg = d3.select('svg');
   width = +svg.style('width').replace('px','');
   height = +svg.style('height').replace('px','')
   innerWidth = width-110;
   innerHeight = height-100
   
    
   // This will load your two CSV files and store them into two arrays.
   Promise.all([d3.csv('data/females_data.csv', (d) =>{
    return{
        Year: new Date(+d.Year, 0, 1),
        Australia: +d.Australia,
        Germany: +d.Germany,
        Netherlands: +d.Netherlands,
        ['United Kingdom']: +d['United Kingdom'],
        ["United States"]: +d["United States"]
    }
   }),d3.csv('data/males_data.csv', (d) =>{
    return{
        Year: new Date(+d.Year, 0, 1),
        Australia: +d.Australia,
        Germany: +d.Germany,
        Netherlands: +d.Netherlands,
        ['United Kingdom']: +d['United Kingdom'],
        ["United States"]: +d["United States"]
    }
   })])
        .then(function (values) {
            console.log('loaded females_data.csv and males_data.csv');
            female_data = values[0];
            male_data = values[1];
            console.log(female_data);
            console.log(typeof(male_data[0]["Year"]));

            // Hint: This is a good spot for doing data wrangling
            // Not a hint: Did data wrangling up in the actual d3.csv function.  Yes, it looks jank.  It works.

            //x axis range won't change, so set and forget
            xScale = d3.scaleTime()
                .domain([new Date(1990, 0, 1), new Date(2023, 0, 1)])
                .range([0, innerWidth])


            //set up svg
            g = svg.append('g')
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            xAxis = svg.append('g')
                .attr("transform", `translate(0, ${innerHeight})`)
            yAxis = svg.append('g')
                .attr("transform", `translate(${margin.left}, 50)`)


            drawLolliPopChart();
        });
});

// Use this function to draw the lollipop chart.
function drawLolliPopChart() {
    const country = document.getElementById('countrySelect').value;
    console.log('trace:drawLollipopChart()');
    console.log(country);

    //figure out what the max rate for this country is
    //which is silly 'cause it's always the male rate but oh well
    maxRate = d3.max(female_data, d=> d[country]);
    if(maxRate < d3.max(male_data, d => d[country])){
        maxRate = d3.max(male_data, d => d[country])
    }

    const yScale = d3.scaleLinear()
        .domain([0, maxRate])
        .range([innerHeight, 0])
    

    
    //time to doodle on the svg

    //clear current
    //svg.select('g').remove();


    /*set up g and axes
    const g = svg.append('g')
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    var xAxis = svg.append('g')
        .attr("transform", `translate(0, ${innerHeight})`)
    var yAxis = svg.append('g')*/

    //draw legend
    g.append("circle").attr("cx", 740).attr("cy", -10).attr("r", 6).style("fill", "#b56eff")
    g.append("text").attr("x", 760).attr("y", -7).text("Male Employment Rate").style("font-size", "12px").attr("alignment-baseline", "middle")
    g.append("circle").attr("cx", 740).attr("cy", 10).attr("r", 6).style("fill", "#ff6e70")
    g.append("text").attr("x", 760).attr("y", 13).text("Female Employment Rate").style("font-size", "12px").attr("alignment-baseline", "middle")

    
    //transform axes
    yAxis.transition()
        .duration(1000)
        .call(d3.axisLeft(yScale));

    //draw axes
    /*const yAxis = d3.axisLeft(yScale);
    g.append('g').call(yAxis)*/

    g.append('text')
        .attr("transform", 'rotate(-90)')
        .attr('y', '-40px')
        .attr('x', -innerHeight/2)
        .style('text-anchor','middle')
        .text("Employment Rate")

    const xAxis = d3.axisBottom(xScale);
    g.append('g').call(xAxis)
        .attr("transform", `translate(0, ${innerHeight})`)

    g.append('text')
        .attr('x', innerWidth/2)
        .attr('y', innerHeight+40)
        .text("Year")


    //Male data
    //lines
    g.selectAll(".maleLine")
        .data(male_data)
        .join("line")
        .attr("stroke", "#b56eff")
        .attr("class", "maleLine")
        .attr("x1", function (male_data) { return xScale(male_data.Year) - offset; })//first endpoint
        .attr("x2", function (male_data) { return xScale(male_data.Year) - offset; })//second endpoint
        .attr("y2", yScale(0))
        .transition()
        .duration(1000)
            .attr("y1", function(male_data) {return yScale(male_data[country]);})
    console.log(male_data)
            

    //circles
    mC = g.selectAll(".maleCircle")
        .data(male_data)
    mC
        .join("circle")
        .attr("class", "maleCircle")
        .attr("cx", function(male_data) {return xScale(male_data.Year)-offset;})
        .transition()
        .duration(1000)
            .attr("cy", function(male_data) {return yScale(male_data[country]);})
            .attr("r", "4")
            .style("fill", "#b56eff")


    //female data    
    //lines
    fL = g.selectAll(".femaleLine")
        .data(female_data)
    fL
        .join("line")
        .attr("class", "femaleLine")
        .attr("x2", function (female_data) { return xScale(female_data.Year) + offset; })//second endpoint
        .attr("y2", yScale(0))
        .attr("stroke", "#ff6e70")
        .attr("x1", function (female_data) { return xScale(female_data.Year) + offset; })//first endpoint
        .transition()
        .duration(1000)
            .attr("y1", function (female_data) { return yScale(female_data[country]); })
    //circles
    fC = g.selectAll(".femaleCircle")
        .data(female_data)
    fC
        .join("circle")
        .attr("class", "femaleCircle")
        .attr("r", "4")
        .style("fill", "#ff6e70")
        .attr("cx", function (female_data) { return xScale(female_data.Year) + offset; })
        .transition()
        .duration(1000)
            .attr("cy", function(female_data) {return yScale(female_data[country]);})



}

