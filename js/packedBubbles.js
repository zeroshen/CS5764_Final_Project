/* * * * * * * * * * * * * *
*      packedBubbles       *
* * * * * * * * * * * * * */

class PackedBubbles {

    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;
        // this.filteredData = this.data;

        this.initVis();
    }


    /*
     * Initialize visualization (static content, e.g. SVG area or axes)
     */

    initVis() {
        let vis = this;

        vis.margin = { top: 20, right: 20, bottom: 200, left: 60 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right,
            vis.height = 500 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");



        // Scales and axes
        vis.color = d3.scaleOrdinal()
            .range(['#008000', '#0000FF', '#FF0000'])
            .domain(['Positive', 'Neutral', 'Negative']);

        vis.size = d3.scaleLinear()
            .range([8, 12])
            .domain([0, 1])  // Sentiment_absPolarity



        // create a tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'bubbleTooltip')

        // Features of the forces applied to the nodes:
        vis.simulation = d3.forceSimulation()
            .force("center", d3.forceCenter().x(vis.width / 2).y(vis.height / 2)) // Attraction to the center of the svg area
            .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
            .force("collide", d3.forceCollide().strength(.2).radius(function(d){
                // return (vis.size(Math.abs(d.Sentiment_Polarity))+3)
                return 30
            })
                .iterations(1)) // Force that avoids circle overlapping



        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }



    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;


        // Update the visualization
        vis.updateVis();
    }



    /*
     * The drawing function
     */

    updateVis() {
        let vis = this;




        // plot bubbles
        vis.bubble = vis.svg.append("g").selectAll("circle")
            .data(vis.data);

        // enter
        vis.bubble
            .enter()
            .append("circle")
            .attr("class", "bubble")
            .attr("r", function(d){ return vis.size(Math.abs(d.Sentiment_Polarity))})
            .attr("cx", vis.width / 2)
            .attr("cy", vis.height / 2)
            .style("fill", function(d){ return vis.color(d.Sentiment)})
            .style("fill-opacity", 0.8)
            .attr("stroke", "black")
            .style("stroke-width", 1)
            // .on("mousemove", function(event, d) {
            //     d3.select(this)
            //         .attr('stroke-width', '2px')
            //         .attr('stroke', 'black')
            //         .attr('fill', 'rgba(173,222,255,0.62)')
            //
            //     vis.tooltip
            //         .style("opacity", 1)
            //         .style("left", event.pageX - vis.width/4 + "px")
            //         .style("top", event.pageY + 25 + "px")
            //         .html(`<div style="border: thin solid grey; border-radius: 2px; background: lightgrey; padding: 10px">
            //                      <h3>${d.App}<h3>
            //                      <h4> Sentiment: ${d.Sentiment}</h4>
            //                      <h4> Review: ${d.Translated_Review}</h4>
            //                      <h4> Sentiment_Polarity: ${d.Sentiment_Polarity}</h4>
            //                      <h4> Sentiment_Subjectivity: ${d.Sentiment_Subjectivity}</h4>
            //                     </div>`);
            // })
            // .on('mouseout', function(event, d){
            //     d3.select(this)
            //         .attr('stroke-width', '0px')
            //         .attr("fill", "#8E7060")
            //
            //     vis.tooltip
            //         .style("opacity", 0)
            //         .style("left", 0)
            //         .style("top", 0)
            //         .html(``);
            // })
            // .call(d3.drag() // call specific function when circle is dragged
            //         .on("start", function (event, d) {
            //             if (!event.active) vis.simulation.alphaTarget(.03).restart();
            //                 d.fx = d.x;
            //                 d.fy = d.y;
            //          })
            //         .on("drag", function (event, d) {
            //             d.fx = event.x;
            //             d.fy = event.y;
            //         })
            //         .on("end", function (event, d) {
            //             if (!event.active) vis.simulation.alphaTarget(.03);
            //             d.fx = null;
            //             d.fy = null;
            //         })
            // );

        vis.simulation
            .nodes(vis.data)
            .on("tick", function(d){
                vis.bubble
                    .attr("cx", function(d){
                        console.log('test:', d.x)
                        return d.x; })
                    .attr("cy", function(d){ return d.y; })
            });



    }


}
