
class BarChart2 {

    constructor(parentElement, data) {

        this.parentElement = parentElement;
        this.data = data;

        // call initVis method
        this.initVis()
    }

    initVis() {

        let vis = this;

        // SVG drawing area

        vis.margin = { top: 50, right: 30, bottom: 50, left: 60 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right,
            vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        vis.svg = d3
            .select("#vis_content-5")
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

// Scales
        vis.x = d3
            .scaleBand()
            .rangeRound([0, vis.width])
            .padding(0.5);

        // console.log(vis.height);
        vis.y = d3
            .scaleLinear()
            .range([vis.height, 0]);

        vis.yAxis = d3.axisLeft();
        vis.xAxis = d3.axisBottom();

        vis.svg
            .append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(" + 0 + ", " + vis.height + ")");

        vis.svg
            .append("g")
            .attr("class", "axis y-axis");

        // vis.yLabel = d3
        //     .select("g")
        //     .append("text")
        //     .text("Stores")
        //     .attr("class", "axis-label")
        //     .attr("x",100)
        //     .attr("y", 100);

        this.wrangleData();

    }

    wrangleData() {

        let vis = this;

        vis.updateVis();

    }

    updateVis() {

        let vis = this;

        vis.y = d3
            .scaleLinear()
            .domain([0, d3.max(vis.data, function(d) { return d.numApps; })])
            .range([vis.height, 0]);

        //Add this adapted to your data
        vis.x.domain(vis.data.map(d => d.price));

        vis.svg.append("text")      // text label for the x axis
            .attr("x", -50 )
            .attr("y",  50 )
            .attr("font-weight", "bold")
            .attr("transform", "translate(-80, 100) rotate(-90)")
            .style("text-anchor", "middle")
            .text("Number of Apps");

        vis.svg.append("text")      // text label for the x axis
            .attr("x", 300 )
            .attr("y", 365 )
            .attr("font-weight", "bold")
            // .attr("transform", "translate(-80) rotate(-90)")
            .style("text-anchor", "middle")
            .text("Price of the Apps");
        // vis.svg.select(".axis-label")
        //     .text("Billion USD")

        vis.xAxis.scale(vis.x);
        vis.yAxis.scale(vis.y);

        vis.yAxis
            .tickFormat(function(e){
                if(Math.floor(e) != e)
                {
                    return;
                }

                return e;
            });

        vis.svg
            .select(".x-axis")
            .transition()
            .duration(500)
            .call(vis.xAxis);
        vis.svg
            .select(".y-axis")
            .transition()
            .duration(500)
            .call(vis.yAxis);

        vis.hist = vis.svg.selectAll("rect").data(vis.data, d => {
            return d.numApps;
        });
        vis.hist
            .enter()
            .append("rect")
            .attr("class", "bar")
            .merge(vis.hist)
            .transition()
            .duration(500)
            .style("opacity", 0.5)
            .attr("stroke", "black")
            .attr("x", d => vis.x(d.price))
            .transition()
            .duration(100)
            .style("opacity", 1)
            .attr("y", d => vis.y(d.numApps))
            .attr("width", (vis.x.bandwidth() - 5))
            .attr(
                "height",
                d => vis.height - vis.y(d.numApps)
            );

        vis.hist.exit().remove();
        vis.svg.exit().remove();
    }
}
