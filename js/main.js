let countFree = 0;
let countPaid = 0;
let totalFree = 0;
let totalPaid = 0;
let myPieChart;
let myPieChart2;
let barChart;
let mainData = [];

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


