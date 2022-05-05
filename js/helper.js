let select = document.getElementById("categoryValueSelector");
// set default category value to ALL
let selectedCategory = "All";
let selectedCategoryValue = "";

function categoryChange() {
    selectedCategoryValue = document.getElementById('categoryValueSelector').value;
    barChart.wrangleData();
}

function getCategoryValues() {

    selectedCategory = document.getElementById('categorySelector').value;

    if (selectedCategory === 'All') {
        select.innerHTML = "<option value=\"\"></option>";
        selectedCategoryValue = "";
        barChart.wrangleData();
        return;
    }

    let selectedCategoryValueList = mainData.map(d => d[selectedCategory]);
    let unique = [...new Set(selectedCategoryValueList)].sort();
    select.innerHTML = "";

    unique.forEach(opt => {
        // filter out Type empty and 0
        if (opt === "" || opt === "0") {
            return;
        }
        select.innerHTML += "<option value=\"" + opt + "\">" + opt + "</option>";
    })

    selectedCategoryValue = document.getElementById('categoryValueSelector').value;
    barChart.wrangleData();
}



