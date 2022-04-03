let countFree = 0;
let countPaid = 0;
let totalFree = 0;
let totalPaid = 0;
let myPieChart;
let myPieChart2;

d3.csv("data/googleplaystore_converted.csv", (row) => {
    // convertrow.value = +row.value
    if (row.Type == "Free" && row.Installs >= 10000000) {
        countFree += 1;
        return {
            installs: +row.Installs,
            type: row.Type
        };
    }
    else if (row.Type == "Free" && row.Installs < 10000000) {
        totalFree += 1;
        return {
            installs: +row.Installs,
            type: row.Type
        };
    }
    else if (row.Type == "Paid" && row.Installs >= 10000000) {
        countPaid += 1;
        return {
            installs: +row.Installs,
            type: row.Type
        };
    }
    else if (row.Type == "Paid" && row.Installs < 10000000) {
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
