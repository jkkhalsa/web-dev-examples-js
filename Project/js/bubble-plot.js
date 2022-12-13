function createBubblePlot() {
    const svg = d3.select("#bubble_svg");

    document.getElementById('StateNameTitle_Bubble').innerHTML = `People's Access to Quality Health Care in ${global_state}`

    svg.selectAll("*").remove(); //redraw graph

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = 650;
    const height = 650;

    // Set svg dimensions and margins
    svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    // data = [{"Cost", "Quality", "Population"}];
    const bubbleData = [];

    // Maximum and Minimum population of the counties in a state
    let minPopulation = 0;
    let maxPopulation = 0;

    //console.log(cityCountyConversion[global_state]);
    statesData[global_state]["Hospitals"].forEach((hospital) => {
        if (hospital.Quality == -1) {
            //console.log(hospital);
            return
        }

        // console.log(hospital);
        const city = hospital.City;

        statesData[global_state]["countyDeserts"].forEach((county) => {
            // console.log(statesData[global_state]);
            minPopulation = county.OneMileDesert;

            var cities = "";

            switch (global_state) {
                case "Alaska":
                    var county_name = county.County.replace(" Municipality", "").replace(" City and Borough", "").replace(" Borough", "").replace(" Census Area", "").replace("-", " ").toUpperCase();
                    cities = cityCountyConversion[global_state][county_name];
                    break;
                case "Louisiana":
                    var county_name = county.County.replace(" Parish", "").replace("St. John", "St John").replace("St.", "Saint").toUpperCase();
                    cities = cityCountyConversion[global_state][county_name];
                    break
                default:
                    cities = cityCountyConversion[global_state][county.County.replace(" County", "").toUpperCase()];
                    break;
            }

            if (cities == null) {
                console.log(county.County + " data can't be found!");
            } else {
                if (cities.indexOf(city) != -1) {
                    bubbleData.push({
                        Cost: hospital.Cost,
                        Quality: hospital.Quality,
                        OneMilePopulation: county.OneMileDesert,
                        TenMilePopulation: county.TenMileDesert,
                        TwentyMilePopulation: county.TwentyMileDesert,
                        Name: hospital.Name,
                        County: county.County
                    });

                    maxPopulation = Math.max(maxPopulation, county.OneMileDesert, county.TenMileDesert, county.TwentyMileDesert);
                    minPopulation = Math.max(minPopulation, county.OneMileDesert, county.TenMileDesert, county.TwentyMileDesert);
                }
            }
        })
    })

    // Population Scale [0, maxPopulation]
    const z = d3.scaleLinear()
        .domain([0, maxPopulation])
        .range([2, 20]);

    let colorScale = d3.scaleOrdinal()
        .domain([0, 1, 2, 3, 4, 5])
        .range(['#F44336', '#FF5722', '#FF9800', '#FFEB3B', '#CDDC39', "#4CAF50"]);


    //Tooltip
    let tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    tooltip.append("p").style("margin", 0);

    // bubbles for 1 mile desert
    bubbles = g.append('g')
        .selectAll("one-dot")
        .data(bubbleData)
        .join("circle")
        .attr("cx", width / 2)
        .attr("cy", width / 2)
        .attr("r", d => z(d.OneMilePopulation))
        .style("fill", d => colorScale(d.Quality))
        .style("opacity", "0.75")
        .on("mouseover", function (event, d) {
            tooltip.style("opacity", 1);

            tooltip
                .style("left", `${event.pageX}px`)
                .style("top", `${event.pageY}px`);

            tooltip
                .select("p")
                .html(`${d.Name} in ${d.County}<br>Hospital Quality: ${d.Quality}<br>One Mile Food Desert Population: ${d.OneMilePopulation}`)
    
            //console.log(this);
        })
        .on("mousemove", function (event) {
            tooltip
                .style("left", `${event.pageX}px`)
                .style("top", `${event.pageY}px`);
        })
        .on("mouseout", function (d) {
            tooltip.style("opacity", 0);
        });

    const simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the low center of the svg area
        .force("charge", d3.forceManyBody().strength(0.3)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.1).radius(30).iterations(1)) // Force that avoids circle overlapping

    simulation
        .nodes(bubbleData)
        .on("tick", function (d) {
            bubbles
                .attr("cx", function(d) { return d.x = Math.max(z(d.OneMilePopulation), Math.min(width - z(d.OneMilePopulation), d.x)); })
                .attr("cy", function(d) { return d.y = Math.max(z(d.OneMilePopulation), Math.min(height - z(d.OneMilePopulation), d.y)); });
                
        });
}
