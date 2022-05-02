/*
 * AreaChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the area chart
 * @param _data						-- the dataset 'household characteristics'
 */


class AreaChart {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = [];

        this.initVis();


    }


    /*
     * Initialize visualization (static content; e.g. SVG area, axes, brush component)
     */

    initVis() {
        let vis = this;

        vis.margin = {top: 60, right: 30, bottom: 40, left: 60};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;



        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


        vis.svg.append("text")
            .attr("y", -20)
            .text("Counts of All Applications with Last Undated Time");
        // Scales and axes
        vis.x = d3.scaleTime()
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .ticks(6);

        vis.svg.append("g")
            .attr("class", "yScale-axis axis");

        vis.svg.append("g")
            .attr("class", "xScale-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");


        // Append a path for the area function, so that it is later behind the brush overlay
        vis.timePath = vis.svg.append("path")
            .attr("class", "area");



        vis.brush = d3.brushX()
            .extent([[0, 0], [vis.width, vis.height]])
            .on("brush", brushed);
        // TO-DO: Add Brushing to Chart
        vis.svg.append("g")
            .attr("class", "xScale brush")
            .call(vis.brush)
            .selectAll("rect")
            .attr("y", -6)
            .attr("height", vis.height + 7);


        vis.svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);

        vis.svg.append("text")      // text label for the y axis
            .attr("x", -60)
            .attr("y", 40)
            .attr("transform", "translate(-80) rotate(-90)")
            .style("text-anchor", "middle")
            .text("Counts");

        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }


    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;

        // (1) Group data by date and count survey results for each day
        // (2) Sort data by day

        vis.displayData = vis.data;
        vis.rollupValue2 = d3.rollup(vis.displayData, leaves=>leaves.length, d=>d.LastUpdated);
        vis.arrayValue2 = Array.from(vis.rollupValue2, ([date, value]) => ({date, value}));


        console.log(vis.arrayValue2)
        vis.displayData= vis.arrayValue2.sort((a,b) => a.date.getTime() - b.date.getTime());


        console.log(this.displayData);

        // * TO-DO *


        // Update the visualization
        vis.updateVis();
    }



    /*
     * The drawing function
     */

    updateVis() {
        let vis = this;

        // Update domain
        vis.x.domain(d3.extent(vis.displayData, function (d) {
            return d.date;
        }));
        vis.y.domain([0, d3.max(vis.displayData, function (d) {
            return d.value + 5;
        })]);


        // D3 area path generator
        vis.area = d3.area()
            .curve(d3.curveCardinal)
            .x(function (d) {
                return vis.x(d.date);
            })
            .y0(vis.height)
            .y1(function (d) {
                return vis.y(d.value);
            });


        // Call the area function and update the path
        // D3 uses each data point and passes it to the area function. The area function translates the data into positions on the path in the SVG.
        vis.timePath
            .datum(vis.displayData)
            .attr("d", vis.area);


        vis.xScale = d3.scaleTime()
            .range([0, vis.width])
            .domain(d3.extent(vis.displayData, function(d) { return d.date; }));
        // Update axes
        vis.svg.select(".yScale-axis").call(vis.yAxis);
        vis.svg.select(".xScale-axis").call(vis.xAxis);

    }
}

