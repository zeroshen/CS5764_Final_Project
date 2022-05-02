/* * * * * * * * * * * * * *
*      packedBubbles       *
* * * * * * * * * * * * * */

class PackedBubbles {

    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.displayData = [];
        this.AppName = null;

        this.initVis();
    }


    /*
     * Initialize visualization (static content, e.g. SVG area or axes)
     */

    initVis() {
        let vis = this;

        vis.margin = {top: 80, right: 20, bottom: 80, left: 20};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

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
            .range([4, 20])
            .domain([0, 1])  // Sentiment_absPolarity


        // create a tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'bubbleTooltip')

        // draw legend
        let legendHeight = 13,
            interLegend = 4,
            colorWidth = legendHeight * 2,
            nodes = [
                {'name': 'Neutral', 'color':'#0000FF'},
                {'name': 'Negative', 'color':'#FF0000'},
                {'name': 'Positive', 'color':'#008000'},
            ];


        vis.legendContainer = vis.svg
            .append("g")
            .classed("legend", true)
            .attr("transform", "translate(" + [0, vis.height/2] + ")");

        vis.legends = vis.legendContainer
            .selectAll(".legend")
            .data(nodes)
            .enter();

        vis.legend = vis.legends
            .append("g")
            .classed("legend", true)
            .attr("transform", function (d, i) {
                return "translate(" + [0, -i * (legendHeight + interLegend)] + ")";
            })

        vis.legend
            .append("rect")
            .classed("legend-color", true)
            .attr("y", -legendHeight)
            .attr("width", colorWidth)
            .attr("height", legendHeight)
            .style("fill", function (d) {
                return d.color;
            });

        vis.legend
            .append("text")
            .classed("tiny", true)
            .attr("transform", "translate(" + [colorWidth + 5, -2] + ")")
            .text(function (d) {
                return d.name;
            })
            .style("font-size", 12);

        vis.legendContainer
            .append("text")
            .attr("transform", "translate(" + [0, -nodes.length * (legendHeight + interLegend) - 5] + ")")
            .text("(Circle size: Sentiment polarity)");

        vis.legendContainer
            .append("text")
            .attr("transform", "translate(" + [0, -nodes.length * (legendHeight + interLegend) - 5 - 20] + ")")
            .text("Review sentiment");



        // (Filter, aggregate, modify data)
        vis.wrangleData(vis.AppName);
    }


    /*
     * Data wrangling
     */
    wrangleData(appName) {
    // wrangleData() {
        let vis = this;

        vis.AppName = appName

        if (vis.AppName != null && vis.AppName.length !== 0) {
            vis.displayData = originalReviewData.filter(function (row) {
                return row.App === vis.AppName;
            });
        } else {
            vis.displayData = [];
        }
        // console.log('originalreview:', originalReviewData)
        // console.log('AppName:', vis.AppName, '; displayData:', vis.displayData)

        // Update the visualization
        vis.updateVis();
    }


    /*
     * The drawing function
     */

    updateVis() {
        let vis = this;

        vis.svg.selectAll('.appName').remove()

        vis.svg
            .append("text")
            .attr('class', 'appName')
            .attr("transform", "translate(" + [0, 0] + ")")
            .attr("text-anchor", "center")
            .text(function (d) {
                if (vis.AppName!==null && vis.displayData.length == 0){
                    let text = vis.AppName + ": \n No review data available"
                    return text
                } else if (vis.AppName!==null) {
                    return vis.AppName
                }

            })
            .style("font-size", 32)


        // Features of the forces applied to the nodes:
        vis.simulation = d3.forceSimulation(vis.displayData)
            .force("center", d3.forceCenter().x(vis.width / 2).y(vis.height / 2)) // Attraction to the center of the svg area
            .force("charge", d3.forceManyBody().strength(0.1)) // Nodes are attracted one each other of value is > 0
            .force("collide", d3.forceCollide().strength(.2).radius(function (d) {
                return (vis.size(Math.abs(d.Sentiment_Polarity)) + 6)
            }).iterations(1)) // Force that avoids circle overlapping
            .on("tick", ticked)


        // plot bubbles
        function ticked() {
        vis.bubble = vis.svg
            .selectAll(".bubble")
            .data(vis.displayData)

        vis.bubble
            .enter()
            .append("circle")
            .attr("class", "bubble")
            .attr("r", function (d) {
                return vis.size(Math.abs(d.Sentiment_Polarity))
            })
            .style("fill", function (d) {
                return vis.color(d.Sentiment)
            })
            .style("fill-opacity", 0.8)
            .style("stroke", "black")
            .style("stroke-width", 1)
            .on("mousemove", function (event, d) {
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .attr('fill', 'rgba(173,222,255,0.62)')

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX - vis.width / 4 + "px")
                    .style("top", event.pageY + 25 + "px")
                    .html(`<div style="border: thin solid grey; border-radius: 2px; background: lightgrey; padding: 10px">
                                 <h3>${d.App}<h3>
                                 <h4> Sentiment: ${d.Sentiment}</h4>
                                 <h4> Review: ${d.Translated_Review}</h4>
                                 <h4> Sentiment_Polarity: ${format(d.Sentiment_Polarity)}</h4>
                                 <h4> Sentiment_Subjectivity: ${format(d.Sentiment_Subjectivity)}</h4>
                                </div>`);
            })
            .on('mouseout', function (event, d) {
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .attr("fill", "#8E7060")

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
            .call(d3.drag() // call specific function when circle is dragged
                .on("start", function (event, d) {
                    if (!event.active) vis.simulation.alphaTarget(.03).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on("drag", function (event, d) {
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on("end", function (event, d) {
                    if (!event.active) vis.simulation.alphaTarget(.03);
                    d.fx = null;
                    d.fy = null;
                })
            )
            .merge(vis.bubble)
            .attr("cx", function(d){return d.x; })
            .attr("cy", function(d){return d.y; })

        vis.bubble.exit().remove();

        }



    }


}
