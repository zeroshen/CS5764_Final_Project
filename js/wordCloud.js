/* * * * * * * * * * * * * *
*      packedBubbles       *
* reference: https://d3-graph-gallery.com/graph/wordcloud_size.html
* * * * * * * * * * * * * */

class WordCloud {

    constructor(_parentElement, wordCounts, sentiment) {
        this.parentElement = _parentElement;
        this.data = wordCounts;
        this.Sentiment = sentiment;
        this.displayData = [];
        this.Category = 'GAME';

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
        vis.fontScale = d3.scaleLinear()
            .range([10, 80])
            .clamp(true);

        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }


    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;

        // Get the currently selected option in D3
        vis.Category = d3.select("#reviewcategorySelector").property("value");


        if (vis.Category != null && vis.Category.length !== 0) {
            vis.displayData = vis.data.filter(function (row) {
                return row.Category === vis.Category;
            });
        }

        // select sentiment
        vis.displayData = vis.displayData.filter(function (row) {
            return row.Sentiment === vis.Sentiment;
        });

        // sort and filter top 200
        vis.displayData.sort((a,b) => {return b['frequency'] - a['frequency']})
        vis.displayData = vis.displayData.slice(0, 30)

        // update fontScale
        vis.fontScale.domain([d3.min(vis.displayData, function (d) {
            return d.frequency
        }),
            d3.max(vis.displayData, function (d) {
                return d.frequency
            })]);

        // create a new column for size
        vis.displayData = vis.displayData.map(function(d) {
            return {text: d.words, size:vis.fontScale(d.frequency)
            }; })

        // console.log('wordCloud:', vis.displayData)



        // Update the visualization
        vis.updateVis();
    }


    /*
     * The drawing function
     */

    updateVis() {
        let vis = this;


        vis.layout = d3.layout.cloud()
            .size([vis.width, vis.height])
            .words(vis.displayData)
            .padding(5)        //space between words
            .rotate(function() { return ~~(Math.random() * 2) * 90; })
            .font("Impact")
            .fontSize(function(d) { return d.size; })      // font size of words
            .on("end", draw);
        vis.layout.start();


        //Draw the word cloud
        function draw(words) {
            vis.cloud = vis.svg
                .attr("transform", "translate(" + vis.layout.size()[0] / 2 + "," + vis.layout.size()[1] + ")")
                .selectAll("g text")
                .data(words)

            //Entering words
            vis.cloud.enter()
                .append("text")
                .attr("class", "worldcloud")
                .style("font-family", "Impact")
                // .style("fill", function() { return "hsl(" + Math.random() * 360 + ",100%,50%)"; })
                .style("fill", function() {
                    if (vis.Sentiment === "Positive") {
                        return "#31B346";
                } else {
                       return "#FF3933";
                    }
                })
                .attr("text-anchor", "middle")
                .attr('font-size', function(d) {return d.size; })
                .text(function(d) { return d.text; });

            //Entering and existing words
            vis.cloud
                .style("font-size", function(d) { return d.size; })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                });

            //Exiting words
            vis.cloud.exit().remove();
        }






    }


}
