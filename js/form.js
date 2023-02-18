"use strict";

/* Form selectors */
const searchForm = document.querySelector("#search-form");

const courseNameSearch = searchForm.querySelector("#course-name-search");
const detailedSearch = searchForm.querySelector("#detailed-search");

const excludeColumns = detailedSearch.querySelector("#exclude-columns");
const excludeRows = detailedSearch.querySelector("#exclude-rows");

/* Extra selectors */
const loadingSpinner = searchForm.querySelector("#loading-spinner");
const resultNumber = searchForm.querySelector("#result-number");


/* URL to fetch form from (POST) */
const fetchUrl = "https://tanrend.elte.hu/oktatoitanrend.php";
const proxyUrl = 'https://corsproxy.io/?';

/* Reusable form data and options */
const formData = new FormData();
formData.set("felev", "2022-2023-2");
formData.set("darab", "1000");
formData.set("submit", "keresnevre");

const requestOptions = {
    method: "POST",
    body: formData,
    redirect: "follow",
};

searchForm.addEventListener("submit", (event) => {
    /* Prevent from refreshing page and show spinner */
    event.preventDefault();
    loadingSpinner.removeAttribute("hidden");

    /* Get values from form */
    const name = courseNameSearch.value ? courseNameSearch.value : " ";

    /* Set form data*/
    formData.set("mit", name);

    fetch(proxyUrl + fetchUrl, requestOptions)
        .then((response) => response.text())
        .then((response) => {
            try {
                if (!response) {
                    throw Error("Error: No response from server");
                }

                /* Parse the result and grab #resulttable from it */
                const domParser = new DOMParser();
                const resultDoc = domParser.parseFromString(response, "text/html");

                const table = resultDoc.querySelector("#resulttable");
                table.classList.add("table", "table-bordered", "table-secondary", "table-hover", "table-striped", "table-sm", "table-responsive");

                const rows = table.rows;

                /* Show result number */
                showResultNumber(rows)

                /* Exclude columns and rows. The values are the defined classes. */
                const excludeColumnValues = getAllCheckedBoxesValue(excludeColumns);
                const excludeRowValues = getAllCheckedBoxesValue(excludeRows);

                /* Set thead */
                createTableHeader(table)

                /* Calculate rows */
                for (const row of rows) {
                    /* Always do this first */
                    addIndexToRow(row);
                    addClassToRowCells(row);
                    changeCourseType(row);

                    deleteColumnsByClass(row, excludeColumnValues);
                    deleteRowTableByClass(row, getAllClassesFromRow(row), excludeRowValues);
                }

                /* Replace the old table with the new one */
                courseList.replaceChildren(table);
            } finally {
                /* Hide loading spinner */
                loadingSpinner.setAttribute("hidden", "");
            }
        })
        .catch((error) => console.log("error", error));
});

function showResultNumber(rows) {
    const result = rows.length - 1;
    resultNumber.textContent = result + " result" + (result > 1 ? "s" : "");
}

function getAllCheckedBoxesValue(selector) {
    const checkedBoxes = [];

    const checkboxes = selector.querySelectorAll("input[type=checkbox]:checked");
    for (const checkbox of checkboxes) {
        checkedBoxes.push(checkbox.value);
    }

    return checkedBoxes;
}
