/* * * * * * * * * * * * * *
*      VoronoiTreemap      *
* reference:https://bl.ocks.org/Kcnarf/fa95aa7b076f537c00aed614c29bb568
* * * * * * * * * * * * * */


class VoronoiTreemap {

    constructor(_parentElement, _data, reviewdata) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.reviewdata = reviewdata;
        this.displayData = [];
        this.displayReview = [];

        this.initVis();


    }


    /*
     * Initialize visualization (static content, e.g. SVG area or axes)
     */

    initVis() {
        let vis = this;

        vis.margin = {top: 100, right: 50, bottom: 100, left: 50};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // initialize voronoi treemap
        vis.voronoiTreemap = d3.voronoiTreemap();
        vis.treemapRadius = 100
        vis.treemapCenter = [vis.width / 2, vis.height / 2 + 5]
        vis.selectedCategory = 'Installs'     //'Reviews'   //'Rating'  //'Installs'
        vis.slice = 50

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

        vis.drawingArea = vis.svg
            .append("g")
            .classed("drawingArea", true)
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.treemapContainer = vis.drawingArea
            .append("g")
            .classed("treemap-container", true)
            .attr("transform", "translate(" + vis.treemapCenter + ")")


        // Scales and axes
        vis.fontScale = d3.scaleLinear()
            .range([8, 20])
            .clamp(true);


        // draw Title
        vis.drawingArea.append("text")
            .attr("id", "title")
            .attr("transform", "translate(" + [vis.width / 2, -60] + ")")
            .attr("text-anchor", "middle")
            .text("Top " + vis.slice + " installed applications for each 'Content Rating' category")


        // drawLegends(rootData);

        // tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'voronoiTooltip')


        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }


    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;

        // convert data to hierarchy structure
        function buildHierarchy(arry) {

            let roots = {};
            roots.name = 'ContentRating';
            roots.children = [];

            let contentRating_list = [...new Set(arry.map(item => item[roots.name]))];
            let color_list = ["#f58321", "#ef1621", "#77bc45",
                "#4aaaea", "#f575a3", "#592c94"]

            contentRating_list.forEach((name, i) => {
                    let filtered_arry = arry.filter(function (d) {
                        return d[roots.name] === name
                    })
                    // console.log('filtered_data:', filtered_arry)

                    // select apps which have review data?

                    // Sort and then filter by top 10
                    filtered_arry.sort((a, b) => {
                        return b[vis.selectedCategory] - a[vis.selectedCategory]
                    })

                    let selected_array = filtered_arry.slice(0, vis.slice)
                    // let selected_array = filtered_arry.slice(0, vis.slice).concat(
                    //     filtered_arry.slice(filtered_arry.length-vis.slice, filtered_arry.length))


                    let cat = {
                        "name": name,
                        "color": color_list[i],
                        "children": selected_array
                    };

                    roots.children.push(cat);

                }
            )


            return roots;
        }

        vis.displayData = buildHierarchy(vis.data)

        console.log('Displaydata:', vis.displayData)


        // set polygon size
        function computeCirclingPolygon(radius) {
            let points = 60,
                increment = 2 * Math.PI / points,
                circlingPolygon = [];

            for (let a = 0, i = 0; i < points; i++, a += increment) {
                circlingPolygon.push(
                    [radius + radius * Math.cos(a), radius + radius * Math.sin(a)]
                )
            }

            return circlingPolygon;
        };

        vis.circlingPolygon = computeCirclingPolygon(vis.treemapRadius);


        // Update the visualization
        vis.updateVis();
    }


    /*
     * The drawing function
     */

    updateVis() {
        let vis = this;

        // vis.fontScale.domain([0, 20]);

        // console.log('ttt:', d3.min(vis.data, function (d){ return d.Installs}))
        vis.fontScale.domain([d3.min(vis.data, function (d) {
            return d[vis.selectedCategory]
        }),
            d3.max(vis.data, function (d) {
                return d[vis.selectedCategory]
            })]);


        vis.treemapContainer.append("path")
            .classed("contentRating", true)
            .attr("transform", "translate(" + [-vis.treemapRadius, -vis.treemapRadius] + ")")
            .attr("d", "M" + vis.circlingPolygon.join(",") + "Z");


        vis.hierarchy = d3.hierarchy(vis.displayData)
            .sum(function (d) {
                return d[vis.selectedCategory];
            })  // also check out Rating and Reviews
        console.log('hierarchy:', vis.hierarchy)

        vis.voronoiTreemap
            .clip(vis.circlingPolygon)
            (vis.hierarchy);

        drawTreemap(vis.hierarchy);

        function drawTreemap(hierarchy) {
            let leaves = hierarchy.leaves();

            let cells = vis.treemapContainer
                .append("g")
                .classed('cells', true)
                .attr("transform", "translate(" + [-vis.treemapRadius, -vis.treemapRadius] + ")")
                .selectAll(".cell")
                .data(leaves)
                .enter()
                .append("path")
                .classed("cell", true)
                .attr("d", function (d) {
                    return "M" + d.polygon.join(",") + "z";
                })
                .attr("fill", function (d) {
                    return d.parent.data.color;
                })
                // .on("click", function (event, d) {
                //     // update bubble chart on click
                //     myBubbles.wrangleData(d.data.App);
                // })
                .on("mousemove", function (event, d) {
                    d3.select(this)
                        .attr('stroke-width', '2px')
                        .attr('stroke', 'black')

                    vis.tooltip
                        .style("opacity", 1)
                        .style("left", event.pageX - vis.width / 4 + "px")
                        .style("top", event.pageY + 25 + "px")
                        .html(`<div style="border: thin solid grey; border-radius: 2px; background: lightgrey; padding: 10px">
                                 <h3>${d.data.App}<h3>
                                 <h4> Installs: ${d.data.Installs}</h4>
                                 <h4> Reviews: ${d.data.Reviews}</h4>
                                 <h4> Rating: ${d.data.Rating}</h4>
                                 <h4> Price: ${d.data.Price}</h4>
                                 <h4> Genres: ${d.data.Genres}</h4>
                                </div>`);

                    myBubbles.wrangleData(d.data.App);


                })
                .on('mouseout', function (event, d) {
                    d3.select(this)
                        .attr('stroke-width', '0px')

                    vis.tooltip
                        .style("opacity", 0)
                        .style("left", 0)
                        .style("top", 0)
                        .html(``);
                })

        }

        // draw legend
        let legendHeight = 13,
            interLegend = 4,
            colorWidth = legendHeight * 2,
            nodes = vis.displayData.children.reverse();

        console.log('nodes', nodes)

        vis.legendContainer = vis.drawingArea
            .append("g")
            .classed("legend", true)
            .attr("transform", "translate(" + [0, vis.height - 20] + ")");

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
            .text("Content Rating");


    }


}
