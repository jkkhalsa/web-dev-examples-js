function createScatterPlot() {
    const svg = d3.select('#scatter_svg');
    var margin = { top: 10, right: 30, bottom: 60, left: 90 };
    const width = +svg.style('width').replace('px','');
    const height = +svg.style('height').replace('px','');
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    jennaDataWrangling()

    //Title for Scatter Chart
    document.getElementById("StateNameTitle_Scatter").innerHTML = "Homes Without Transport in " + global_state + "'s Food Deserts"; //will change depending on chosen state

    // Data
    // I need for a given state:
    // a) number of housing units that are far away in each county
    // b) number of people that are far away in each county

    let div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg.selectAll("*").remove()

    const xScale = d3.scaleLinear()
            .domain([0, d3.max(chosenState, d => d['TenMileDesert'])]) // data space
            .range([0, innerWidth]); // pixel space
    const yScale = d3.scaleLinear()
            .domain([0, d3.max(chosenState, d => d['TenMileHousing'])]) // data space
            .range([innerHeight, 0 ]); // pixel space

    const g = svg.append('g')
            .attr('transform',`translate(${margin.left},${margin.top})`);

    g.append('g')
            .call(d3.axisLeft(yScale));
    g.append('g')
            .attr('transform',`translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale));

    g.selectAll('circle')
             .data(chosenState)
             .enter()
             .append('circle')
             .attr('cx', d => xScale(d['TenMileDesert']))
             .attr('cy', d => yScale(d['TenMileHousing']))
             .attr('r',3)
             .style('fill', 'rgb(205, 127, 50)')
             .on("mouseover", function (event) {
                div.transition()
                  .duration(200)
                  .style("opacity", .9);
                div.html(this.__data__.County)
                  .style("left", (event.pageX) + "px")
                  .style("top", (event.pageY - 28) + "px");
              })
              .on("mouseout", function (d) {
                div.transition()
                  .duration(500)
                  .style("opacity", 0);
              })

    g.append('text')
             .attr('x',innerWidth/2)
             .attr('y',innerHeight+40)
             .style('text-anchor', 'middle')
             .text('Population living in a 10 mile food desert by county')
             .style('fill', 'white');
    g.append('text')
             .attr('transform','rotate(-90)')
             .attr('y','-50px')
             .attr('x',-innerHeight/2)
             .style('text-anchor','middle')
             .text('Number of houses sans vehicle in a 10 mile food desert')
             .style('fill', 'white'); 

}