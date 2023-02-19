"use strict";

/* Form selectors */
const searchForm = document.querySelector("#search-form");

const searchBar = searchForm.querySelector("#search-bar");
const detailedSearch = searchForm.querySelector("#detailed-search");

const excludeColumns = detailedSearch.querySelector("#exclude-columns");
const excludeRows = detailedSearch.querySelector("#exclude-rows");

/* Extra selectors */
/**
 * Loading spinner element next to the search button
 * @type {Element}
 */
const loadingSpinner = searchForm.querySelector("#loading-spinner");

/**
 * Result number element next to the search button
 * @type {Element}
 */
const resultNumber = searchForm.querySelector("#result-number");

/**
 * URL to fetch form from (POST)
 * @type {string}
 */
const fetchUrl = "https://tanrend.elte.hu/oktatoitanrend.php";

/**
 * Proxy URL to bypass CORS
 * @type {string}
 */
const proxyUrl = 'https://corsproxy.io/?';

/**
 * Reusable form data for the fetch
 * @type {FormData}
 */
const formData = new FormData();
formData.set("felev", "2022-2023-2");
formData.set("darab", "1000");
formData.set("submit", "keresnevre");

/**
 * Reusable request options for the fetch
 * @type {{redirect: string, method: string, body: FormData}}
 */
const requestOptions = {
    method: "POST",
    body: formData,
    redirect: "follow",
};

/**
 * Event listener for the search form submit (button or form?) TODO
 */
searchForm.addEventListener("submit", (event) => {
    /* Prevent from refreshing page and show spinner */
    event.preventDefault();
    loadingSpinner.removeAttribute("hidden");

    /**
     * The name of the course to search for
     * @type {string}
     */
    const name = searchBar.value ? searchBar.value : " ";

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

                /**
                 * The table element from the result
                 * @type {Element}
                 */
                const table = resultDoc.querySelector("#resulttable");
                table.classList.add("table", "table-bordered", "table-secondary", "table-hover", "table-striped", "table-sm", "table-responsive");

                /**
                 * The rows of the table
                 * @type {HTMLCollectionOf<Element>}
                 */
                const rows = table.rows;

                /* Show result number */
                showResultNumber(rows);

                /* Exclude columns and rows. The values are the defined classes. */
                const excludeColumnValues = getAllCheckedBoxesValue(excludeColumns);
                const excludeRowValues = getAllCheckedBoxesValue(excludeRows);

                /* Set thead */
                createTableHeader(table);

                /* Calculate rows */
                for (const row of rows) {
                    /* Always do this first */
                    addIndexToRow(row);
                    addClassToRowCells(row);
                    trimRowCells(row);
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

/**
 * Shows the number of rows (results) next to the search button
 * @param rows - The rows of the table
 * */
function showResultNumber(rows) {
    const result = rows.length - 1;
    resultNumber.textContent = result + " result" + (result > 1 ? "s" : "");
}

/**
 * Gets all checked checkboxes' values from selector
 * @param selector - The selector of the checkboxes parent element (e.g. form)
 * @returns {string[]} - The values of the checked checkboxes
 *
 * @example
 * // returns excludeColumns checked checkboxes' values
 * getAllCheckedBoxesValue(excludeColumns)
 */
function getAllCheckedBoxesValue(selector) {
    const checkedBoxes = [];

    const checkboxes = selector.querySelectorAll("input[type=checkbox]:checked");
    for (const checkbox of checkboxes) {
        checkedBoxes.push(checkbox.value);
    }

    return checkedBoxes;
}
