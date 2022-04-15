let countFree = 0;
let countPaid = 0;
let totalFree = 0;
let totalPaid = 0;
let myPieChart;
let myPieChart2;
let barChart;
let mainData = [];
let areachart;
let piecharts = [];
let numApps1 = 0;
let numApps2 = 0;

let configs = [
    {key: "Category", title: "Category"},
    {key: "ContentRating", title: "ContentRating"}
];


// Date parser to convert strings to date objects
let parseDate = d3.timeParse("%B %d, %Y");

d3.csv("data/googleplaystore_converted.csv", (row) => {
    // convertrow.value = +row.value

    // TODO: move this logic to pieChart.js wrangleData method
    if (row.Type == "Free" && row.Installs >= 10000000) {
        countFree += 1;
        return {
            installs: +row.Installs,
            type: row.Type
        };
    } else if (row.Type == "Free" && row.Installs < 10000000) {
        totalFree += 1;
        return {
            installs: +row.Installs,
            type: row.Type
        };
    } else if (row.Type == "Paid" && row.Installs >= 10000000) {
        countPaid += 1;
        return {
            installs: +row.Installs,
            type: row.Type
        };
    } else if (row.Type == "Paid" && row.Installs < 10000000) {
        totalPaid += 1;
        return {
            installs: +row.Installs,
            type: row.Type
        };
    }
}).then((data) => {

    myPieChart = new PieChart('content-1', "Free Applications", countFree, totalFree);

    myPieChart2 = new PieChart('vis_content-1', "Paid Applications", countPaid, totalPaid);

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


    data.forEach(function(d){
        d.LastUpdated = parseDate(d.LastUpdated);
    });
    data = data.filter(function(d){
        if(d.LastUpdated < new Date(2016, 1, 1)){
            return false;
        }
        return true;
    });


    console.log(data);
    piecharts[0] = new PieChartI('content-3', data, configs[0]);
    piecharts[1] = new PieChartI('vis_content-3', data, configs[1]);



    areachart = new AreaChart('content-4',data);
});

// React to 'brushed' event and update all bar charts
function brushed() {

    // * TO-DO *
    // Get the extent of the current brush
    let selectionRange = d3.brushSelection(d3.select(".brush").node());

    // Convert the extent into the corresponding domain values
    let selectionDomain = selectionRange.map(areachart.xScale.invert);

    piecharts.forEach(function(d) {
        d.selectionChanged(selectionDomain);
    })


}


// load review data
loadData();

function loadData() {
    d3.csv("data/googleplaystore_user_reviews_cleaned.csv", (data)=>{

        // consider to merge with the dataset 1 to get app category and other infor
        // do this later

        // convert strings to numbers
        data.Sentiment_Polarity = +data.Sentiment_Polarity;
        data.Sentiment_absPolarity = Math.abs(+data.Sentiment_Polarity);
        data.Sentiment_Subjectivity = +data.Sentiment_Subjectivity;
        return data
    }). then((data)=>{

        console.log('review data:', data)
        // instantiate packedBubbles
        // myBubbles = new PackedBubbles("bubble-chart", data);

        // too much data if use all review data, need to find a way to aggregate the data later
        myBubbles = new PackedBubbles("bubble-chart", data.slice(0, 250));

    });
}

    d3.csv("data/googleplaystore_converted.csv", (row) => {

        if (row.Price > 0 && row.Price <= 3.49 && row.Installs >= 10000000) {
            numApps1 += 1;
            return {
                installs: +row.Installs,
                price: +row.Price
            };
        } else if (row.Price > 3.49 && row.Price <= 6.99 && row.Installs >= 10000000) {
            numApps2 += 1;
            return {
                installs: +row.Installs,
                price: +row.Price
            };
        }
    }).then(csv => {

        let priceQ = [];

        csv.forEach(function (d) {
            // console.log(d.price);
            priceQ.push(d.price);
        })

        let data = [{numApps: numApps1, price: "0$ < Price of the App <= 3.49$"}, {numApps: numApps2, price: "3.49$ < Price of the App <= 6.99$"}]

        myBarChart = new BarChart2('vis_content-5', data);

        // console.log(Math.max.apply(Math, priceQ));
        // console.log(Math.min.apply(Math, priceQ));
        // console.log(countPaid);
        // console.log(numApps1);
        // console.log(numApps2);
    });


