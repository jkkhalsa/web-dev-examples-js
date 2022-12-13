let vowels;
let consonants;
let punctuation;
let punctuationSum;
let vowelSum;
let consonantSum;
const margin = {top:50, bottom:50, left:80, right:80}

function submitText(){
    punctuationSum = 0;
    vowelSum = 0;
    consonantSum = 0;

    punctuation = {
        ".": 0,
        ",": 0,
        "?": 0,
        "!": 0,
        ":": 0,
        ";": 0
    };
    consonants = {
        b: 0,
        c: 0,
        d: 0,
        f: 0,
        g: 0,
        h: 0,
        j: 0,
        k: 0,
        l: 0,
        m: 0,
        n: 0,
        p: 0,
        q: 0,
        r: 0,
        s: 0,
        t: 0,
        v: 0,
        w: 0,
        x: 0,
        z: 0
    };

    vowels = {
        a: 0,
        e: 0,
        i: 0,
        o: 0,
        u: 0,
        y: 0
    };

    //fetch our text and parse it
    const parsing = document.getElementById("wordbox").value.toLowerCase();
    //for each character, check if it's one we're counting - if it is, add one to the required key in the three dictionaries
    for(let char of parsing){
        if(Object.keys(consonants).includes(char)){
            consonants[char] += 1;
            consonantSum += 1;
        }
        else if(Object.keys(vowels).includes(char)){
            vowels[char] += 1;
            vowelSum += 1;
        }
        else if(Object.keys(punctuation).includes(char)){
            punctuation[char] += 1;
            punctuationSum += 1;
        }
    }

    //debug
    console.log(vowels);
    console.log(consonants);
    console.log(punctuation);

    drawDonutChart();
}

function drawDonutChart(){
    console.log("donut chart called");
    const data = {vowels: vowelSum, consonants: consonantSum, punctuation: punctuationSum}

    console.log(data);

    const svg = d3.select("#pie_svg");

    const width = +svg.style('width').replace('px','');
    const height = +svg.style('height').replace('px','');
    const margin = 40
    
    var centerText;

    g = svg.append('g')
        .attr("transform", `translate(${width/2}, ${height/2})`)

    const radius = Math.min(width, height)/2-margin;
    //var donutWidth = 75;

    //set color scale
    var color = d3.scaleOrdinal(d3.schemePurples[3])

    //compute position of each group on donut
    const pie = d3.pie()
        .value(d=>d[1])

    const data_ready = pie(Object.entries(data))

    //doodle on that svg
    g
        .selectAll('g')
        .data(data_ready)
        .join('path')
        .attr('d', d3.arc()
            .innerRadius(75)
            .outerRadius(radius)
        )
        .attr('fill', d => color(d.data[0]))
        .attr("stroke", "black")
        .style("stroke-width", "1px")
        //on events = only way to get the actual arc items with "this" is to put it right here
        .on('mouseover', function(d) {console.log(this); this.style["stroke-width"] = "4px"; writeCenter(this.__data__.data[0], this.__data__.data[1])})
        .on('mouseout', function(d) {this.style["stroke-width"] = "1px"; writeCenter("")})
        .on('click', function(d) {drawBarChart(this)})
    
}

//jank stuff to both clear and write a new label on mouse over
function writeCenter(label, count){
    var toWrite;
    g = d3.select('g')
    g.selectAll('text').remove()

    
    if(label != ""){
        toWrite = label + ": " + count;
    }

    g.append('text')
    .style("text-anchor", "middle")
    .text(toWrite)
}



function drawBarChart(clicked){
    console.log("bar chart called");
    //set up constants from the clicked item
    var barColor = clicked.attributes[1]["nodeValue"];
    console.log(barColor)
    const label = clicked.__data__.data[0];
    var process;
        if(label == "vowels"){
            process = vowels;
        }
        else if(label == "consonants"){
            process = consonants;
        }
        else{
            process = punctuation;
        }
    const max = Math.max.apply(null, Object.values(process));
    
    //process data into a format d3 doesn't go feral at
    const data = Object.keys(process).map((item, i) => ({item, count: Object.values(process)[i]}));

    //console.log(Object.keys(data))
    //console.log(Object.values(data))


    //set up our svg and "h" that we'll use to draw inside
    const svg = d3.select("#bar_svg");
    const width = +svg.style('width').replace('px','');
    const height = +svg.style('height').replace('px','');
    const margin = 40
    const innerHeight = height - margin;
    const innerWidth = width - margin

    svg.selectAll('*').remove()
    g = svg.append('g')

    //set up our tooltip div
    var div = d3.select("body").append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);
    
    //set up our extra credit span
    var span = d3.select("#character-name");

    //set up our axes
    const xScale = d3.scaleBand()
        .domain(data.map(function(d) {return d.item}))
        .range([0, innerWidth])
        .padding(.4)
    svg.append("g")
        .attr("transform", `translate(30, ${innerHeight+15})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        
    console.log(max)
    const yScale = d3.scaleLinear()
        .domain([0, max])
        .range([innerHeight, 0]);
    svg.append("g")
        .call(d3.axisLeft(yScale))
        .attr("transform", "translate(30, 15)")


    //add bars
    svg.selectAll("mybar")
        .data(data)
        .join("rect")
            .attr("x", d => xScale(d.item))
            .attr("y", d => yScale(d.count))
            .attr("width", xScale.bandwidth())
            .attr("height", d => innerHeight-yScale(d.count))
            .attr("fill", barColor)
            .attr("transform", `translate(30, 15)`)
            .attr("stroke", "black")
            .style("stroke-width", "1px")
            //tooltip go brr
            .on('mouseover', function(event, d){
                div.transition()
                    .duration(.200)
                    .style("opacity", .9);
                div.html("character: " + this.__data__.item + "<br/>count: " + this.__data__.count)
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
            })
            
            //EXTRA CREDIT CODE BELOW
            //When we click a bar, we display that character's count to compare with
            //other bar charts
            .on('click', function(d){
                span.html(this.__data__.item + ", appearing " + this.__data__.count + " times in the text")
            })

            ;


    

    
}
