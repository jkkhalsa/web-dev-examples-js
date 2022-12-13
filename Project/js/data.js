
let global_foodAccess; //variable for storing the food access data
//LINK: https://corgis-edu.github.io/corgis/csv/food_access/
let global_hospitalData;



let chosenState = []; //THIS WILL DEPEND ON WHICH STATE IS CHOSEN IN HEAT MAP
let chosenStateHospital = [];

//For Bar Graph
let maxCount = 0;
let milesAway_maxCount = 0;
let milesAway_totalCount = 0;

//For Pie Graph
let oneMile_Population = 0;
let tenMile_Population = 0;
let twentyMile_Population = 0;

let averagePercent_OneMile  = 0;
let averagePercent_TenMile  = 0;
let averagePercent_TwentyMile  = 0;

let statesData = {};
/*
    statesData is an object to store all data being used.  It's a multiple tiered dictionary, with each entry formatted 
    as follows.
    State: [Hospitals, countyDeserts]
    "State" key is the name of the state in question.
    "Hospitals" key is attached to an object with hospital information.
        Each line of the Hospitals object carries the following keys:
            state (location)
            city (location)
            name of hospital (name of hospital)
            quality of hospital (integer one to five stars, -1 being no rating)
            cost of heart care at the hospital. (float, in dollars)
    "countyDeserts" key is attached to an object with food desert information.
        Each line of the countyDeserts object carries the following keys:
            state (location)
            county (location) (one each)
            population (overall in entire county - 2010 census)
            OneMileDesert (population count beyond 1 mile from supermarket) -- using for bar chart
            TenMileDesert (population count beyond 10 miles from supermarket) -- using for bar chart
            TwentyMileDesert (population count beyond 20 miles from supermarket) -- using for bar chart
            OneMileHousing (housing units WITHOUT VEHICLE beyond 1 mile from supermarket)
            TenMileHousing  (housing units WITHOUT VEHICLE beyond 10 miles from supermarket)
            TwentyMileHousing  (housing units WITHOUT VEHICLE beyond 20 miles from supermarket)
*/

let foodByCounty = {
    Arizona: {Maricopa: []}
};
/*
    foodByCounty is for my dumb ass to make the heatmap easier, since I've gotta break stuff down by county.
*/

let cityCountyConversion = {};
/*
    cityCountyConversion.State.County => [Cities]
    "State" key is the name of the state
    "County" is the name of the county
        Cities is a list of cities within the mentioned county.
*/

document.addEventListener("DOMContentLoaded", function() {
    Promise.all([d3.csv('data/hospitals.csv', (d) =>{
        return{
            //returns postal code of state, averaged cost for heart attack & failure treatment
            State: d["Facility.State"],
            City: d["Facility.City"],
            Name: d["Facility.Name"],
            Quality: +d["Rating.Overall"],
            Cost: (+d["Procedure.Heart Attack.Cost"]+(+d["Procedure.Heart Failure.Cost"]))/2
        }
    }), d3.csv('data/food_access.csv', (d) => {
        return{
            //returns data needed for food deserts
            State: d.State,
            County: d.County,
            Population: +d.Population,
            OneMileDesert: parseFloat(d["Low Access Numbers.People.1 Mile"]),
            TenMileDesert: parseFloat(d["Low Access Numbers.People.10 Miles"]),
            TwentyMileDesert: parseFloat(d["Low Access Numbers.People.20 Miles"]),
            OneMileHousing: parseFloat(d["Vehicle Access.1 Mile"]),
            TenMileHousing: parseFloat(d["Vehicle Access.10 Miles"]),
            TwentyMileHousing: parseFloat(d["Vehicle Access.20 Miles"])
        }
    }), d3.dsv("|", 'data/us_cities_states_counties.csv', (d) => {
        return{
            // returns cities, counties and states within US
            City: d["City alias"],
            State: d["State full"],
            County: d.County
        }
    })]).then(function(values) {
        //iterate through hospitals data and put it into state sub-categories
        values[0].forEach((item, index) =>{
            currentState = item.State;
            currentLine = values[0][index];
            (currentState in statesData ? statesData[currentState]["Hospitals"].push(currentLine) : statesData[currentState] = {Hospitals:[currentLine], countyDeserts:[]});
        });
    
        //iterate through food access data and put it into state sub-categories
        values[1].forEach((item) => {
            currentState = item.State;
            currentCounty = item.County;
            currentLine = item;
            statesData[currentState].countyDeserts.push(currentLine);
        
            //county sub-categories for innovative vis
            if(currentState in foodByCounty){
                (currentCounty in foodByCounty[currentState] ? foodByCounty[currentState][currentCounty].push(currentLine) : foodByCounty[currentState][currentCounty] = [currentLine])
            }
            else{
                foodByCounty[currentState] = {};
                foodByCounty[currentState][currentCounty] = [currentLine]
            }
        })

        values[2].forEach((item) => {
            currentCity = item.City;
            currentState = item.State;
            currentCounty = item.County;

            if (currentState in cityCountyConversion) {
                if (currentCounty in cityCountyConversion[currentState]) {
                    cityCountyConversion[currentState][currentCounty].push(currentCity);
                } else {
                    cityCountyConversion[currentState][currentCounty] = [currentCity];
                }
            } else {
                cityCountyConversion[currentState] = {};
                cityCountyConversion[currentState][currentCounty] = [currentCity];
            }
        })
        
        global_foodAccess = values[1]; //store all the food access data
        global_hospitalData = values[0];
        console.log("global_foodaccess for debugging", global_foodAccess);

        
        
        countryHeatMap();  //us-heatmap.js called
        stateHeatMap("Arizona", "04") //us-heatmap.js but default state, calls all other graphs inside
    })
    
});

function jennaDataWrangling(){
    //zero out our variables
    chosenState = []; //THIS WILL DEPEND ON WHICH STATE IS CHOSEN IN HEAT MAP
    chosenStateHospital = [];

    //For Bar Graph
    maxCount = 0;
    milesAway_maxCount = 0;
    milesAway_totalCount = 0;

    //For Pie Graph
    oneMile_Population = 0;
    tenMile_Population = 0;
    twentyMile_Population = 0;

    averagePercent_OneMile  = 0;
    averagePercent_TenMile  = 0;
    laveragePercent_TwentyMile  = 0;

    //Below is data used for pie and bar graph
    let local_stateCount = 0;
    for(index in global_foodAccess){
        if(global_foodAccess[index].State == global_state){ //State will be changed to whatever state clicked on in heat map
            chosenState[local_stateCount] = (global_foodAccess[index]); //chosenState contains all the data for the state chosen
            local_stateCount++;
        }

    }

    local_stateCount = 0;
    for(index in global_hospitalData){
        if(global_hospitalData[index].State == global_state){ //State will be changed to whatever state clicked on in heat map
            chosenStateHospital[local_stateCount] = (global_hospitalData[index]); //chosenState contains all the data for the state chosen
            local_stateCount++;
        }

    }
    
    //Population Counts
    for(index in chosenState){
        if(index != "columns"){ 
            
            //For Pie Chart - gives average percentages for each mileage
            oneMile_Population += (chosenState[index].OneMileDesert / chosenState[index].Population);
            tenMile_Population += (chosenState[index].TenMileDesert / chosenState[index].Population);
            twentyMile_Population += (chosenState[index].TwentyMileDesert / chosenState[index].Population);
            
            //For Bar Graph - gives the max population count over any mileage
            milesAway_maxCount =  Math.max(milesAway_maxCount, chosenState[index].OneMileDesert);
            milesAway_maxCount =  Math.max(milesAway_maxCount, chosenState[index].TenMileDesert);
            milesAway_maxCount = Math.max(milesAway_maxCount, chosenState[index].TwentyMileDesert);
        }
    }

    averagePercent_OneMile = ((oneMile_Population / local_stateCount) * 100).toFixed(2); //get average percent for one mile desert
    averagePercent_TenMile = ((tenMile_Population / local_stateCount) * 100).toFixed(2); //get average percent for ten mile desert
    averagePercent_TwentyMile = ((twentyMile_Population / local_stateCount) * 100).toFixed(2); //get average percent for twenty mile desert
}