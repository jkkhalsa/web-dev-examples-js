function createPieChart(){
    //dataset
    var dataset = global_foodAccess;

    jennaDataWrangling();
    
    var dataset = [
        { label: '1 Mile Desert', count: averagePercent_OneMile}, 
        { label: '10 Mile Desert', count: averagePercent_TenMile},
        { label: '20 Mile Desert', count: averagePercent_TwentyMile}
        ];

    //define dimensions 
    var width = 450;
    var height = 500;
    var radius = (Math.min(width, height) / 2) - 20;
    var donutWidth = 65; 

    var innerRadius = Math.min(width, height) / 3;
    var outerRadius = (Math.min(width, height) / 2) - 10; 
    var labelRadius = (innerRadius + outerRadius) / 2;
    var color = d3.scaleOrdinal(d3.schemeOranges[9]); //color scheme

    //select Pie SVG
    var svg = d3.select('#pieChart_svg')
        .append('svg')
        .classed("currSVG", true)
        .attr('width', width)
        .attr('height', height) //100 30 200 175
        .attr('transform', 'translate(' + 140 + ',' + 20 + ')');

    const g = svg.append('g')
        .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

    //Title for Pie Chart
    document.getElementById("StateNameTitle_Pie").innerHTML = "Percent Population for Miles From the Supermarket in " + global_state; //will change depending on chosen state

        
    //build arc
    var arc = d3.arc()
        .innerRadius(radius - donutWidth)             
        .outerRadius(radius);
        
    //Data sent here
    var pie = d3.pie()
        .value(function(d) { return d.count; })
        .sort(null);

    //Get each path in the chart
    var path = g.selectAll('path')
        .data(pie(dataset))
        .enter()
        .append('path')
        .attr('stroke-width', '1')
        .style('stroke', 'black')
        .attr('d', arc)
        .attr('fill', function(d, i) { 
            return color(d.data.label);
        });

    //text in center on mouseover
    path.on('mouseover', function(d) {
        g.selectAll("text")
            .data(dataset)
            .enter()
            .append("text")
            .text(d.currentTarget.__data__.data.label + ": " + d.currentTarget.__data__.data.count + "%")
            .attr("font-size", 20)
            .attr('fill', 'white')
            .attr("text-anchor", "middle")
    })
    
    //remove text on mouseout
    path.on('mouseout', function(d) {
        g.selectAll("text")
            .remove("text")
    })

}

