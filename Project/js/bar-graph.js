function createBarChart(){
    //select the Bar graph
    const svg = d3.select('#bar_svg');
    const width = +svg.style('width').replace('px','');
    const height = +svg.style('height').replace('px','');
    const margin = { top:50, bottom: 50, right: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    jennaDataWrangling();

    //Title for Graph - FEEL FREE TO CHANGE THIS TITLE, I DIDNT KNOW WHAT SOUNDED GOOD
    document.getElementById("StateNameTitle_Bar").innerHTML = "People Affected In " + global_state + "'s Worst Counties"; //will change depending on chosen state

    svg.select("*").remove(); //redraw graph
    
    var color = d3.scaleOrdinal(d3.schemeOranges[9]); //color scheme

    //x Axis
    const xScale = d3.scaleBand()
            .domain([1, 10, 20])
            .range([0, innerWidth]); // pixel space


    //y Axis
    const yScale = d3.scaleLinear()
            .domain([0, milesAway_maxCount]) 
            .range([innerHeight, 0 ]); // pixel space

    const g = svg.append('g')
            .attr('transform', 'translate('+100+', '+margin.top+')');

    //select the Bar SVG
    const yAxis = d3.axisLeft(yScale);
        g.append('g').call(yAxis);
    const xAxis = d3.axisBottom(xScale);
        //xAxis.ticks(3);
        g.append('g').call(xAxis)
                    .attr('transform',`translate(0,${innerHeight})`)


    g.append('text')
        .attr('x',innerWidth/2 - 100)
        .attr('y',innerHeight+40)
        .text('Miles Away From Nearest Supermarket')
        .style('fill', 'white');
    g.append('text')
        .attr('transform','rotate(-90)')
        .attr('y','-50px')
        .attr('x',-innerHeight/2)
        .style('text-anchor','middle')
        .text('Count')
        .style('fill', 'white');      
       
    //Tooltip
    var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    //Get max for each:
    var maxOneMile = 0;
    var maxTenMile = 0;
    var maxTwentyMile = 0;
    let tempmax = 0
    let oneCounty = ""
    let tenCounty = ""
    let twentyCounty = ""
    chosenState.forEach(element => {
      tempmax = Math.max(maxOneMile, element.OneMileDesert);
      (tempmax > maxOneMile)  && (oneCounty = element.County) && (maxOneMile = tempmax)

      tempmax = Math.max(maxTenMile, element.TenMileDesert);
      (tempmax > maxTenMile)  && (tenCounty = element.County) && (maxTenMile = tempmax)
      
      tempmax = Math.max(maxTwentyMile, element.TwentyMileDesert);
      (tempmax > maxTwentyMile)  && (twentyCounty = element.County) && (maxTwentyMile = tempmax)
    });
    console.log(chosenState)

    //Bar for: population count beyond 1 mile from supermarket
  var OneMileDesertRect = g.selectAll('.OneMileDesertRect')
    .data(chosenState)
    .enter()
    .append('rect')
    .attr('fill', 'rgb(251, 206, 177)')
    .attr('y', d => yScale(d.OneMileDesert))
    .attr('height', d => { return yScale(0) - yScale(d.OneMileDesert) })
    .attr('width', xScale.bandwidth())
    .attr('x', xScale(1))
    .on("mouseover", function (event, d) {
      div.transition()
        .duration(200)
        .style("opacity", .9);
      div.html(oneCounty + " has " + maxOneMile + " people 1 mile away from fresh food") //switch state for dynamic variable based on chosen state
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function (d) {
      div.transition()
        .duration(500)
        .style("opacity", 0);
    });

    //Bar for: population count beyond 10 miles from supermarket
  var TenMileDesertRect = g.selectAll('.TenMileDesertRect')
    .data(chosenState)
    .enter()
    .append('rect')
    .attr('fill', 'rgb(205, 127, 50)')
    .attr('y', d => yScale(d.TenMileDesert))
    .attr('height', d => { return yScale(0) - yScale(d.TenMileDesert) })
    .attr('width', xScale.bandwidth())
    .attr('x', xScale(10))
    .on("mouseover", function (event, d) {
      div.transition()
        .duration(200)
        .style("opacity", .9);
      div.html(tenCounty + " has " + maxTenMile + " people 10 miles away from fresh food") //switch state for dynamic variable based on chosen state
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function (d) {
      div.transition()
        .duration(500)
        .style("opacity", 0);
    });

    //Bar for: population count beyond 20 miles from supermarket
  var TwentyMileDesertRect = g.selectAll('.TwentyMileDesertRect')
    .data(chosenState)
    .enter()
    .append('rect')
    .attr('fill', 'rgb(218, 160, 109)')
    .attr('y', d => yScale(d.TwentyMileDesert))
    .attr('height', d => { return yScale(0) - yScale(d.TwentyMileDesert) })
    .attr('width', xScale.bandwidth())
    .attr('x', xScale(20))
    .on("mouseover", function (event, d) {
      div.transition()
        .duration(200)
        .style("opacity", .9);
      div.html(twentyCounty + " has " + maxTwentyMile + " people 20 miles away from fresh food") //switch state for dynamic variable based on chosen state
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function (d) {
      div.transition()
        .duration(500)
        .style("opacity", 0);
    });
}