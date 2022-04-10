class PieChartI {

    constructor(parentElement, data, config) {
        this.parentElement = parentElement;
        this.data = data;
        this.config = config;
        this.displayData = data;
        this.circleColors = ['#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#d6604d'];

        console.log(this.displayData);

        this.initVis();
    }




    /*
     * Initialize visualization (static content; e.g. SVG area, axes)
     */

    initVis() {
        let vis = this;

        vis.margin = {top: 10, right: 50, bottom: 10, left: 50};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // add title
        vis.svg.append('g')
            .attr('class', 'title pie-title')
            .append('text')
            .text('Title for Pie Chart')
            .attr('transform', `translate(${vis.width / 2}, 20)`)
            .attr('text-anchor', 'middle');


        // TODO
        // pie chart setup
        vis.pieChartGroup = vis.svg
            .append('g')
            .attr('class', 'pie-chart')
            .attr("transform", "translate(" + vis.width / 2 + "," + vis.height / 2 + ")");


        vis.pie = d3.pie()
            .value(d => d.value);


        // Pie chart settings
        vis.outerRadius = vis.width / 4;
        vis.innerRadius = 0;

        // Path generator for the pie segments
        vis.arc = d3.arc()
            .innerRadius(vis.innerRadius)
            .outerRadius(vis.outerRadius);

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'pieTooltip');


        // call next method in pipeline
        vis.wrangleData();
    }




    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;

        // (1) Group data by key variable (e.g. 'electricity') and count leaves
        // (2) Sort columns descending

        vis.rollupValue = d3.rollup(vis.displayData, leaves=>leaves.length, d=>d[vis.config.key]);
        vis.arrayValue = Array.from(vis.rollupValue, ([key, value]) => ({key, value}));

        console.log(vis.arrayValue)
        vis.sorted= vis.arrayValue.sort((a,b) => b.value - a.value);
        console.log(vis.sorted)
        // * TO-DO *

        vis.displayData = []

        // generate random data
        for (let i = 0; i < 5; i++) {
            let random = vis.sorted[i].value
            console.log(vis.sorted[i].key)
            vis.displayData.push({
                value: random,
                string: vis.sorted[i].key,
                color: vis.circleColors[i]
            })
        }


        // Update the visualization
        vis.updateVis();
    }



    /*
     * The drawing function - should use the D3 update sequence (enter, update, exit)
     */

    updateVis() {
        let vis = this;

        vis.arcChart = vis.pieChartGroup.selectAll(".arc")
            .data(vis.pie(vis.displayData))



        vis.arcChart.enter()
            .append("path")
            .attr("class", "arc")
            .merge(vis.arcChart)
            .attr("d", vis.arc)
            .attr("fill", d => d.data.color)
            .on('mouseover', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .attr('fill', 'rgba(173,222,255,0.62)')
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                        <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                             <h3> Kind: ${d.data.string}<h3>
                             <h4> value: ${d.value}</h4>                            
                         </div>`);
            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .attr("fill", d => d.data.color)
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });

        vis.arcChart.exit().remove();
    }



    /*
     * Filter data when the user changes the selection
     * Example for brushRegion: 07/16/2016 to 07/28/2016
     */

    selectionChanged(brushRegion) {
        let vis = this;

        // Filter data accordingly without changing the original data


        // * TO-DO *
        vis.displayData=vis.data.filter(function(d) {
            return ((d.survey >= brushRegion[0]) && (d.survey <= brushRegion[1]))
        });

        // Update the visualization
        vis.wrangleData();
    }
}