let select = document.getElementById("categoryValueSelector");
let selectedCategory = "";
let selectedCategoryValue = "";

window.onload = function () {
    getDefaultCategoryValues();
};

// get category values for "Category" by default
function getDefaultCategoryValues() {

    selectedCategory = "Category";
    selectedCategoryValue = "ART_AND_DESIGN";

    let selectedCategoryValueList = mainData.map(d => d[selectedCategory]);
    let unique = [...new Set(selectedCategoryValueList)];
    select.innerHTML = "";

    unique.forEach(opt => {
        select.innerHTML += "<option value=\"" + opt + "\">" + opt + "</option>";
    })
}

function categoryChange() {
    selectedCategoryValue = document.getElementById('categoryValueSelector').value;
    barChart.wrangleData();
}

function getCategoryValues() {

    selectedCategory = document.getElementById('categorySelector').value;

    let selectedCategoryValueList = mainData.map(d => d[selectedCategory]);
    let unique = [...new Set(selectedCategoryValueList)];
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
