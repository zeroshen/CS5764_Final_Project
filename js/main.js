
let myPieChart;
let myPieChart2;
let barChart;
let mainData = [];
let areachart;
let piecharts = [];
let boxPlot;
let myVoronoi;
let myBubbles;
let wordCounts, myWords_positive, myWords_negative;
let originalReviewData = [];

let configs = [
    {key: "Category", title: "Category"},
    {key: "ContentRating", title: "ContentRating"}
];

let format = d3.format(".2f")


window.onscroll = function () {
    scrollBar()
};

function scrollBar() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    document.getElementById("myBar").style.width = scrolled + "%";
}

// Date parser to convert strings to date objects
let parseDate = d3.timeParse("%B %d, %Y");

d3.csv("data/googleplaystore_converted.csv", (row) => {

    return {
        installs: +row.Installs,
        type: row.Type
    }

}).then((data) => {

    myPieChart = new PieChart('content-1', "Free Applications", data);

    myPieChart2 = new PieChart('vis_content-1', "Paid Applications", data);

})

// Visualization 2 (Top 10 installed apps)
d3.csv("data/googleplaystore_converted.csv", (row) => {

    row.Installs = +row.Installs;
    return row;

}).then((data) => {
    mainData = data;
    barChart = new BarChart('vis_content-2', data)
})

d3.csv("data/googleplaystore_converted.csv").then(data => {


    data.forEach(function (d) {
        d.LastUpdated = parseDate(d.LastUpdated);
    });
    data = data.filter(function (d) {
        if (d.LastUpdated < new Date(2016, 1, 1)) {
            return false;
        }
        return true;
    });


    console.log(data);
    piecharts[0] = new PieChartI('content-3', data, configs[0]);
    piecharts[1] = new PieChartI('vis_content-3', data, configs[1]);


    areachart = new AreaChart('content-4', data);
});

// React to 'brushed' event and update all bar charts
function brushed() {

    // * TO-DO *
    // Get the extent of the current brush
    let selectionRange = d3.brushSelection(d3.select(".brush").node());

    // Convert the extent into the corresponding domain values
    let selectionDomain = selectionRange.map(areachart.xScale.invert);

    piecharts.forEach(function (d) {
        d.selectionChanged(selectionDomain);
    })


}




// box plot visualization
d3.csv("data/googleplaystore_converted.csv", (row) => {

    row.Rating = +row.Rating;
    return row;

}).then((data) => {

    boxPlot = new BoxPlot('vis_content-6', data);
});


// load review data
let promises = [
    // app contentrating
    d3.csv("data/googleplaystore_converted_withReviews.csv", (data) => {

        data.Rating = +data.Rating;
        data.Installs = +data.Installs;
        data.Reviews = +data.Reviews;
        data.Price = +data.Price;
        return data;

    }),
    d3.csv("data/googleplaystore_user_reviews_cleaned.csv", (data) => {

        // convert strings to numbers
        data.Sentiment_Polarity = +data.Sentiment_Polarity;
        data.Sentiment_absPolarity = Math.abs(+data.Sentiment_Polarity);
        data.Sentiment_Subjectivity = +data.Sentiment_Subjectivity;
        return data;
    }),

    d3.csv("data/word_counts_converted_v2.csv", (data) => {
        // convert strings to numbers
        data.frequency = +data.frequency;
        return data;
    })
];


Promise.all(promises)
    .then(function (data) {
        reviewVis(data)
    })
    .catch(function (err) {
        console.log(err)
    });


function reviewVis(data) {
    let rateData = data[0]
    let reviewData = data[1]
    wordCounts = data[2]

    // console.log('rate data:', rateData)
    // console.log('review data:', reviewData)
    // console.log('word counts:', wordCounts)

    originalReviewData = reviewData;

    // create voronoi-treemap
    myVoronoi = new VoronoiTreemap("voronoi-chart", rateData, reviewData);

    // // create bubble chart
    myBubbles = new PackedBubbles("bubble-chart", reviewData);

    // word cloud
    myWords_positive = new WordCloud("wordcloud-pos", wordCounts, 'Positive');
    myWords_negative = new WordCloud("wordcloud-neg", wordCounts, 'Negative');

}


function reviewcategoryChange() {
    myWords_positive.wrangleData();
    myWords_negative.wrangleData();
}
