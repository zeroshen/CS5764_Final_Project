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
    piecharts[0] = new PieChartI('vis_content-3', data, configs[1]);



    areachart = new AreaChart('content-4',data);
});

// React to 'brushed' event and update all bar charts
function brushed() {

    // * TO-DO *
    // Get the extent of the current brush
    let selectionRange = d3.brushSelection(d3.select(".brush").node());

    // Convert the extent into the corresponding domain values
    let selectionDomain = selectionRange.map(areachart.xScale.invert);


}


