function createLineGraph() {
    //successfully linked. probably.
    const svg = d3.select('#line_svg');
    var margin = { top: 10, right: 30, bottom: 60, left: 90 };
    const width = +svg.style('width').replace('px','');
    const height = +svg.style('height').replace('px','');
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    //Title for Line Chart
    document.getElementById("StateNameTitle_Line").innerHTML = "Cost of Healthcare in " + global_state + "'s Food Deserts"; //will change depending on chosen state

    // Get data
    // I need a list of objects where each object is a county
    // in the selected state and contains at least
    // a) the percentage of people in the county in a 10 mile desert
    // b) the cost of care in that county

    data = []
    state = global_state

    statesData[state]["Hospitals"].forEach((hospital) => {
        city = hospital.City;

        statesData[state]["countyDeserts"].forEach((county) => {

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
                // console.log(county.County + " data can't be found!");
            } else {
                if (cities.indexOf(city) != -1) {

                    let flag = 0;
                    data.forEach((datapoint) => {
                        if (county.County.replace(" County", "").toUpperCase() == datapoint.County) {
                            flag = 1;
                        }
                    })
    
                    if (flag == 0) {
                        data.push({
                            County: county.County.replace(" County", "").toUpperCase(),
                            Cost: hospital.Cost,
                            TenMileDesertPct: county.TenMileDesert / county.Population
                        });
                    }
                }   
            }
        })
    })

    // remove zeros
    datacopy = data;
    data = [];
    datacopy.forEach((datapoint) => {
        if (datapoint.Cost != 0) {
            data.push(datapoint);
        }
    })

    // sort data
    data.sort(function(a, b){return a.TenMileDesertPct - b.TenMileDesertPct});

    /*
    chosenState.forEach((item) => {
        datapoint = {};
        datapoint.TenMileDesertPct = item.TenMileDesert / item.Population;
        
    })

    console.log("chosenState");
    console.log(chosenState);
    console.log("chosenStateHospital");
    console.log(chosenStateHospital);
    console.log("cityCountyConversion");
    console.log(cityCountyConversion);
    console.log("statesData");
    console.log(statesData);
    */

    const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.TenMileDesertPct)]) 
            .range([0, innerWidth]); // pixel space

    const yScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.Cost) - 1000, d3.max(data, d => d.Cost)]) 
            .range([innerHeight, 0]); // pixel space

    svg.selectAll("*").remove()

    const g = svg.append('g')
        .attr('transform',`translate(${margin.left},${margin.top})`);

    g.append('g')
        .call(d3.axisLeft(yScale));
    g.append('g')
        .attr('transform',`translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale));

    const singleLine = d3.line()
        .x(d => xScale(d.TenMileDesertPct))
        .y(d => yScale(d.Cost))  
        .curve(d3.curveMonotoneX)

    g.append('path')
        .datum(data)  
        .attr('class','singleLine')      
        .style('fill','none')
        .style('stroke','rgb(205, 127, 50)')
        .style('stroke-width','2')
        .attr('d', singleLine);

    g.append('text')
        .attr('x',innerWidth/2)
        .attr('y',innerHeight+40)
        .style('text-anchor', 'middle')
        .text('Percentage of county living in a 10 mile food desert')
        .style('fill', 'white');
    g.append('text')
        .attr('transform','rotate(-90)')
        .attr('y','-50px')
        .attr('x',-innerHeight/2)
        .style('text-anchor','middle')
        .text('Cost of care at local hospital ($)')
        .style('fill', 'white'); 
}