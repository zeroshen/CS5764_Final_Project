/*
 * BarChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the bar charts
 * @param _data						-- the dataset '
 */

class BarChart {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = data;

        //console.log(this.displayData);

        this.initVis();
    }


    /*
     * Initialize visualization (static content; e.g. SVG area, axes)
     */

    initVis() {
        let vis = this;

        vis.margin = {top: 30, right: 40, bottom: 10, left: 200};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 350 - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.title = vis.svg.append("text")
            .attr("class", "bargraph-title")
            .attr("transform", "translate(" + -150 + "," + 0 + ")")
            .text(selectedCategory)

        vis.x = d3.scaleBand()
            .rangeRound([0, vis.height])
            .paddingInner(0.1);

        vis.y = d3.scaleLinear()
            .range([0, vis.width - 200]);

        vis.xAxis = d3.axisLeft()
            .scale(vis.x);

        vis.xAxisGroup = vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(150,0)");

        vis.svg.select(".x-axis")
            .call(vis.xAxis);

        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }


    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;

        // Filter by selected category and the specified value
        // Example: selected category : 'Category', value: 'ART_AND_DESIGN'

        if (!selectedCategory || selectedCategory.length === 0) {
            selectedCategory = "Category";
            selectedCategoryValue = "ART_AND_DESIGN";
        }

        switch (selectedCategory) {
            case 'Category':
                vis.displayData = mainData.filter(d => d['Category'] === selectedCategoryValue)
                break;
            case 'ContentRating':
                vis.displayData = mainData.filter(d => d['ContentRating'] === selectedCategoryValue)
                break;
            case 'Type':
                vis.displayData = mainData.filter(d => d['Type'] === selectedCategoryValue)
                break;
            case 'Genres':
                vis.displayData = mainData.filter(d => d['Genres'] === selectedCategoryValue)
                break;
        }

        // sort by descending order and get top 10
        vis.displayData = vis.displayData.sort(function (a, b) {
            return b.Installs - a.Installs;
        }).slice(0, 10);

        // Update the visualization
        vis.updateVis();
    }


    /*
     * The drawing function - should use the D3 update sequence (enter, update, exit)
     */

    updateVis() {
        let vis = this;
        //console.log(this.displayData);

        vis.title.text(selectedCategory + ": " + selectedCategoryValue);

        vis.y.domain([0, d3.max(vis.displayData, function (d) {
            return d['Installs']
        })]);

        vis.x.domain(vis.displayData.map(d => d['App']));

        vis.bars = vis.svg.selectAll("rect.bar")
            .data(vis.displayData);

        vis.bars.enter()
            .append("rect")
            .merge(vis.bars)
            .attr("class", "bar")
            .transition()
            .delay(25)
            .duration(200)
            .attr("stroke", "black")
            .attr("x", 150)
            .attr("y", (d) => vis.x(d['App']))
            .attr("height", vis.x.bandwidth())
            .attr("width", (d) => vis.y(d['Installs']))
            .style("opacity", 1);

        vis.bars.exit()
            .remove();

        vis.labs = vis.svg.selectAll("text.barlabs")
            .data(vis.displayData);

        vis.labs.enter()
            .append("text")
            .merge(vis.labs)
            .attr("class", "barlabs")
            .attr("y", (d) => vis.x(d['App']) + 25)
            .attr("x", (d) => 160 + vis.y(d['Installs']))
            .style("opacity", 0)
            .transition()
            .delay(50)
            .duration(200)
            .style("opacity", 1)
            .attr("stroke", "black")
            .text((d) => d['Installs'] / 100 + 'K');

        vis.labs.exit()
            .remove();

        vis.svg.select(".x-axis")
            .transition()
            .duration(100)
            .call(vis.xAxis);
    }

}
