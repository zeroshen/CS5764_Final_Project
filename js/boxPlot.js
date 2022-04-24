// class for Box plot

class BoxPlot {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = [];

        this.initVis();
    }


    /*
    * Initialize visualization (static content; e.g. SVG area, axes)
    */
    initVis() {
        let vis = this;

        vis.margin = {top: 100, right: 40, bottom: 70, left: 100};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


        vis.svg.append("text")
            .attr("y", -50)
            .attr("class", "boxPlotTitle")
            .text("Distribution of Rating per Category");

        // vis.svg.append("text")      // text label for the x axis
        //     .attr("x", 420)
        //     .attr("y", 355)
        //     .attr("font-weight", "bold")
        //     // .attr("transform", "translate(-80) rotate(-90)")
        //     .style("text-anchor", "middle")
        //     .text("Category");

        vis.svg.append("text")      // text label for the y axis
            .attr("x", -90)
            .attr("y", 40)
            .attr("font-weight", "bold")
            .attr("transform", "translate(-80) rotate(-90)")
            .style("text-anchor", "middle")
            .text("Rating");

        vis.x = d3.scaleBand()
            .rangeRound([0, vis.width])
            .paddingInner(1)
            .paddingOuter(.5);

        vis.y = d3.scaleLinear()
            .range([vis.height - 10, 0]);

        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }

    /*
    * Data wrangling
    */
    wrangleData() {
        let vis = this;

        // Compute quartiles, median, inter quantile range min and max --> this is then used to draw the box.
        vis.displayData = d3.rollup(vis.data, function (d) {

            let q1 = d3.quantile(d.map(function (g) {
                if (g.Rating === null || g.Rating === "") {
                    return 0;
                }
                return g.Rating;
            }).sort(d3.ascending), .25);

            let median = d3.quantile(d.map(function (g) {
                if (g.Rating === null || g.Rating === "") {
                    return 0;
                }
                return g.Rating;
            }).sort(d3.ascending), .5);

            let q3 = d3.quantile(d.map(function (g) {
                if (g.Rating === null || g.Rating === "") {
                    return 0;
                }
                return g.Rating;
            }).sort(d3.ascending), .75);

            let interQuantileRange = q3 - q1;
            let min = q1 - 1.5 * interQuantileRange;
            let max = q3 + 1.5 * interQuantileRange;

            if (max > 5) {
                max = 5;
            }

            if (min < 0) {
                min = 0;
            }

            return ({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
        }, d => d.ContentRating);


        // Update the visualization
        vis.updateVis();
    }


    /*
     * The drawing function - should use the D3 update sequence (enter, update, exit)
     */
    updateVis() {
        let vis = this;

        console.log(vis.displayData)
        vis.x.domain(vis.data.map(d => d.ContentRating));

        vis.y.domain([0, d3.max(vis.data, function (d) {
            return d.Rating;
        })]);

        vis.svg.append("g")
            .attr("class", "xAxisBoxPlot")
            .attr("transform", "translate(0," + (vis.height - 10) + ")")
            .call(d3.axisBottom(vis.x));


        vis.svg.append("g")
            .attr("class", "yAxisBoxPlot")
            .call(d3.axisLeft(vis.y));

        // Show the main vertical line
        vis.svg
            .selectAll("vertLines")
            .data(vis.displayData)
            .enter()
            .append("line")
            .attr("x1", function (d) {
                return (vis.x(d[0]))
            })
            .attr("x2", function (d) {
                return (vis.x(d[0]))
            })
            .attr("y1", function (d) {
                return (vis.y(d[1].min))
            })
            .attr("y2", function (d) {
                return (vis.y(d[1].max))
            })
            .attr("stroke", "black")
            .style("width", 40);


        // rectangle for the main box
        vis.boxWidth = 50;

        vis.svg
            .selectAll("boxes")
            .data(vis.displayData)
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return (vis.x(d[0]) - vis.boxWidth / 2)
            })
            .attr("y", function (d) {
                return (vis.y(d[1].q3))
            })
            .attr("height", function (d) {
                return (vis.y(d[1].q1) - vis.y(d[1].q3))
            })
            .attr("width", vis.boxWidth)
            .attr("stroke", "black")
            .style("fill", "#69b3a2");


        // Show the median
        vis.svg
            .selectAll("medianLines")
            .data(vis.displayData)
            .enter()
            .append("line")
            .attr("x1", function (d) {
                return (vis.x(d[0]) - vis.boxWidth / 2)
            })
            .attr("x2", function (d) {
                return (vis.x(d[0]) + vis.boxWidth / 2)
            })
            .attr("y1", function (d) {
                return (vis.y(d[1].median))
            })
            .attr("y2", function (d) {
                return (vis.y(d[1].median))
            })
            .attr("stroke", "black")
            .style("width", 80);

    }

}

