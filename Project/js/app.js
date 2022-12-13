// Intersection Observer acts upon elements as they scroll in and out of the view
const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        // element is visible
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            document
                .getElementById(`${entry.target.id}-circle`)
                .setAttribute("fill", "red");
            if (entry.target.id == "header"){
                d3.select("#state_svg")
                    .style("opacity", 0)
            }
            else{
                d3.select("#state_svg")
                    .transition()
                        .duration(200)
                        .style("opacity", 1)
            }
        }
        // element is not visible
        else {
            entry.target.classList.remove("show");
            document
                .getElementById(`${entry.target.id}-circle`)
                .setAttribute("fill", "lightgray");
        }
    });
});

const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((element) => obs.observe(element));
