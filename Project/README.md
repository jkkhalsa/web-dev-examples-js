American Food Access
*by James Khalsa, Ninad Kulkarni, Jenna Spero, and Roman Smith*
======
## Overview
![A teaser image of the webpage, showing the heatmap with Maryland selected.](https://github.com/asu-cse494-s2022/James-Jenna-Ninad-Roman/blob/main/img/teaser.png)

A "food desert" is an area where access to fresh food is limited, usually by distance and the number of affordable supermarkets in the area. We know that food is wildly important for humans, touching every aspect of our cultural lives and physical health in some way or another.

We aim to tell a story around American food deserts. By contrasting the prevalence and location of these food deserts next to other cultural indicators (medical cost around these areas, housing built in food deserts, geographic locations affected), we hope to show a clearer picture about the severity of America's food deserts and the type of life people in food deserts experience on the daily. Given this data, we encourage you to draw your own conclusions about the systems which cause these food deserts.

## Data Description

The two main datasets used are the [CORGIS Food Access dataset](https://corgis-edu.github.io/corgis/csv/food_access/) and the [CORGIS Hospitals dataset](https://corgis-edu.github.io/corgis/csv/hospitals/).  These are the datasets which our charts draw from.

Both datasets are tabular.  The Food Access dataset is majority quantative, ordered data, dealing with subsets of population numbers.  There are only two categorical attributes - state and county - used to group the quantative data together.  By contrast, the portion of the Hospitals dataset we used has an even split of quantative and categorical data.  The cost of care at the hospital is quantative and ordered, in dollars, while the hospital quality rating is ordered and ordinal (a scale of 1 to 5).  Hospital name and location are categorical and used for grouping or identification.

Once wrangled, the data becomes hierarchical - grouped by state, then by county, for ease of use.

Preprocessing of the data was done via d3.csv functions to wrangle the data into a single structure.  This structure is described in the data.js file, but the description has been copied below for convenience.

> **statesData** is an object to store all data being used.  It's a multiple tiered dictionary, with the first tier's keys being a list of all 51 states' names.  These states carry the following keys:


| Key | Value Description |
| --- | --- |
|Hospitals | object with hospital information | 
|countyDeserts | object with food desert information |

>The "hospitals" key is attached to an object with hospital information.  Each line of the **Hospitals** object carries the following keys:

| Key | Value Description |
| --- | ----------- |
|State | hospital location (state postal code)|
|City | hospital location (name of city)|
|Name | name of hospital |
|Quality | integer rating.  one to five stars.  -1 means no rating.|
|Cost | float, in dollars.  Cost of heart care at the hospital.  Averaged between heart attack and heart failure care.|

>The "countyDeserts" key is attached to an object with food desert information.
>Each line of the **countyDeserts** object carries the following keys:

| Key | Value Description |
| --- | ----------- |
|state | location   |
|county | location (unique) |
|population | overall population in entire county - 2010 census |
|OneMileDesert |population count beyond 1 mile from supermarket|
TenMileDesert |population count beyond 10 miles from supermarket
TwentyMileDesert | population count beyond 20 miles from supermarket
OneMileHousing | housing units WITHOUT VEHICLE beyond 1 mile from supermarket
TenMileHousing | housing units WITHOUT VEHICLE beyond 10 miles from supermarket
TwentyMileHousing | housing units WITHOUT VEHICLE beyond 20 miles from supermarket

Additional CSVs were needed to put the data to use. We used a [DSV](https://github.com/grammakov/USA-cities-and-states) to get the relevant county-city pairings.  This helped us link the two CORGIS datasets, which provide location information in different ways.  Additionally, Alaska has a different naming convention for its counties than any other state does - a naming convention which isn't standardized.  Instead of hard-coding these, we used the alaskaFIPS.csv found in the data folder to fetch Alaskan county names.  This csv was created by James from the [FCC's comprehensive list of FIPS codes](https://transition.fcc.gov/oet/info/maps/census/fips/fips.txt).

## Goals and Tasks
This visualization tells a story around American food deserts, and presents data about specific counties' deserts in quick succession to do so.  The user gets to discover for themselves the severity of each county's food deserts and compare counties and states to their surrounding regions.  Our goal is for the user to explore the dataset and come away with a better idea of what American food deserts look like.  After all, people tend to learn best when they can make connections for themselves.

## Idioms
### Overview
The interface first shows you a heatmap and gives the user the option to select a state.  All other graphs are linked to that selected state.  By selecting a state and scrolling through, the user automatically drills down into that state, seeing a variety of state-specific information.

### Visualizations
The implemented visualizations are as follows.


#### Heatmap
![An image of the heatmap, both state and county view, with Arizona selected](https://github.com/asu-cse494-s2022/James-Jenna-Ninad-Roman/blob/main/img/AZheatmap.png)
The heatmap shows a map of the United States, divided by state borders.  To the left side is another map of a selected state - selected either by clicking, or Arizona by default - with the counties coded the same as the states in the original heatmap.

The encoding choices here are simple enough.  Red states have severe food deserts.  Green states are less severe.  Shades ranging between these two colors show scaling severity.  The worst state shown is always the brightest red, while the best state shown is always the brightest green.  The heatmap is intended to be used as a comparison tool - each color doesn't map to a specific number or percentage, only to how relatively better or worse the region is than its neighbors.  The map is used because users will be familiar with the borders of the United States' states, and familiar with the borders of their own states.

The interaction on the main US chart is clicking.  Clicking a state brings up a sidebar where the user can see that state's counties, broken down in the same way as the original map.  The same encoding is used in order to keep it simple for the user.  Clicking is chosen for its high discoverability - when the user mouses over a state and sees the cursor change to the little hand, they know instantly it's clickable.

The user can interact with a state sidebar by hovering over the counties shown.  Hovering brings up a tooltip stating the name of the county being hovered over.  This is done because while users most likely know the names of the states off the map, it's much less likely that they'll know the names of counties that aren't in their own state off the top of their head.

There are no complex algorithms needed to create this chart.  The most complex thing is the color scheme, and that's done with an ordered list and one of D3's built-in interpolators.

#### Pie Chart
![An image of the pie chart with Arizona selected and 20 mile desert hovered over](https://github.com/asu-cse494-s2022/James-Jenna-Ninad-Roman/blob/main/img/AZpie.png)
The pie chart shows a ring divided into percentages, based on the overall population of the state.  There are three sections in each ring - one for one-mile food deserts, one for ten-mile food deserts, and the last for twenty-mile food deserts.  The percentage each section takes up is based on the percent of people in the state's food deserts who suffer from that specific distance.

Severity is redundantly encoded with color and the hover interaction - darker colors indicating the more severe ten and twenty-mile food deserts.

Technically this graph shows two different things - the percentage of people in a food desert relative to others in a food desert, and the percentage of people in a food desert relative to the entire population.  This was a deliberate choice.  If the pie chart showed only the percentage relative to the entire population, some states would have vanishingly small ten or twenty mile deserts (mostly East Coast states with very small areas).  Showing it the way we do allows the user to conceptualize the relative size of each desert, while the hover shows each relative to the whole population.

The interaction is hovering, as explained above - mousing over an arc on the pie chart brings up text in the middle to show the overall percentage of affected people.

No complex algorithms are needed here, only aggregation of data.


#### Bar Graph
![An image of the bar graph with Arizona selected](https://github.com/asu-cse494-s2022/James-Jenna-Ninad-Roman/blob/main/img/AZbar.png)
Three bars are displayed.  For the selected state, the bar graph checks which county is worst affected by each distance of food desert, and graphs the overall population in that county.

Interact with the graph by hovering over each bar to find out what county is the worst, and the exact number of people affected.  Combined with the sidebar county heatmap, this can be interesting to match up the counties - sometimes the county with the worst one-mile desert won't be the worst overall in the state!

Color isn't actually an encoding channel here.  Positioning on both axes is, as is normal for a bar chart.  The categorical one, ten, and twenty mile deserts are ordered in terms of severity on the x axis, while the y axis changes based on the population that needs to be shown.  Length here is used to encode the population numbers, giving the viewer a very accurate representation of how the population in each desert relates to the others.

No complex algorithms are needed here, only aggregation of data.


#### Bubble Chart
![An image of the bubble chart with Arizona selected](https://github.com/asu-cse494-s2022/James-Jenna-Ninad-Roman/blob/main/img/AZbubble.png)

Each rated hospital in the state is displayed as a bubble, with the color indicating the rating - green for better hospitals, red for worse.  The size of the bubble indicates the number of people affected by a food desert who have access to that hospital, based on the county the hospital lies in.

The color and size encodings were chosen to give an overall impression of the type of healthcare available to people in food deserts.  If a state has mostly bad hospitals in food deserts, the graph will be overwhelmingly dark orange to red, as larger populations will overwhelm the smaller good hopsital bubbles.

The user may interact with this chart by mousing over the bubbles to find out exact ratings, population numbers, and the name and location of the hoospital shown.  Like the bar graph, this is intended to let the user draw conclusions with the sidebar heatmap of counties!  We chose not to use text to label the bubbles because we didn't want to mess with the overall impression of color and size by drawing a viewer's attention to something readable.

To facilitate the animation used in this graph, we used the d3.forceSimulation algorithm.  We also wrote something to match cities to their respective counties, using the information in the USA-cities-and-states DSV file described in the data section.


#### Line Graph
![An image of the line graph with Arizona selected](https://github.com/asu-cse494-s2022/James-Jenna-Ninad-Roman/blob/main/img/AZline.png)
The line graph shows the correlation between cost of medical care - specifically heart care - in each county, versus the percentage of that county living in a ten mile food desert.  A line graph is chosen to draw continuity between the data points and make sharp spikes or dips more obvious.

The encoding of a line is used to show trends in the data.  It's easier for a person to read trends in a wiggly line than in a collection of points.  Putting the cost of care on the y axis implies that the cost of care, in some sense, depends on the percentage of people in that county who are in a food desert - an assumption that can be either confirmed or denied based on the user's interpretation of the chart.

The user cannot interact with this chart beyond selecting a different state in the heatmap.  To that end, the "Reset" button is prominently visible.

The most complex algorithmic thing done in this chart is matching county names - which don't have a standard format - to each other from different datasets.  This is also a problem run into, to a lesser extent, in the heatmap.  It's done with a clever combination of splicing and concatenation to get the base county name into a standard format.


#### Scatterplot
![An image of the scatterplot with Arizona selected](https://github.com/asu-cse494-s2022/James-Jenna-Ninad-Roman/blob/main/img/AZvehicle.png)
The scatterplot breaks down the homes in each county's ten mile food desert that don't have a vehicle and puts them against the population of that food desert.  Points lower on the y axis represent counties with more vehicles, who would have an easier time of getting to a grocery store, while points higher represent a lack of transportation.  Points more to the right show counties with more people in that food desert.

The position encoding is shown here because it makes it easy to conceptualize severity.  If a person sees points clustered to the bottom left or bottom middle of the chart, it's easy to write off the food desert as a rural area, while points spiking high up draw the eye and show counties in crisis.

Interacting with this graph by hovering a cursor over the data points shows the name of the specific county shown in that point.  Like the bar graph, this lets the user draw correlations between the county heatmap at the left and the severity of the county shown on the scatterplot.  A county that looks perfectly fine on the heatmap might be made worse in actuality by a lack of vehicles, or vice versa.
   

### Linkages
Each view is linked to the heatmap.  When a state is selected in the heatmap (by clicking), the other views update to show data specific to that state.  The user can then scroll through, with the state's individual heatmap at the side for reference, to see the additional data the other charts provide.  When they're done, the reset button is always on-screen to bring them back up for another state.


## Reflection
In our initial proposal, we were pretty specific on which data we wanted to include for each graph. These details continued into our work in progress and final product. Our base design stayed the same which includes a bar graph, pie chart, bubble chart, line graph, and scatterplot along with the data we wanted to include with each. Of course, our design became much more detailed going from the inital proposal to the final product. A CSS 'dark' theme was implemented into our layout along with an interpolation color of red, yellow, and green. Our heatmap general idea stayed the same, and we added the clicked-on state to the side bar which is visible as you scroll down. Because all of our ideas stayed the same from the original proposal, it was very realistic. It was not too in-depth and was very practical given our timeline. 
    
There were some general challenges such as getting errors on our graphs that we had to overcome. Ultimately, we were able to fix each error. Another minor challenge was merging errors when trying to commit and push. We eventually made sure that each person was working on one file at a time, or branching changes if that was impossible. Additionally, when implementing our heat map, we hoped to get some animation to work when clicking on the state. This animation would visually transition the state that was clicked on to the left side. However, we settled with just placing the clicked-on state into the side bar without that specific animation. To give a more exciting view, we did end up creating animation for each graph as you scroll.

Next time, we could plan more accordingly, so our project timeline goes smoother. Up until the deadline, we still had a few errors, so it would be nice to have everything completed a day or two before the deadline. An internal deadline would give us more time to do any last modifications to make the overall display looking great. We could also implement more animation, such as the heatmap animation that gave us difficulties. 


## Team Workload
#### James Khalsa
Heat Map (both state and county-level), linking all charts, assorted usability/interactivity edits on most charts

#### Ninad Kulkarni
Bubble Chart, Bootstrap formatting, Layout/CSS

#### Jenna Spero
Pie Chart, Bar Graph, Layout

#### Roman Smith
Scatter Plot, Line Graph