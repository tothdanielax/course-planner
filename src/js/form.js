"use strict";

/* Form selectors */
const searchForm = document.querySelector("#search-form");
const searchBar = searchForm.querySelector("#search-bar");

/* Filters */
const detailedSearch = searchForm.querySelector("#detailed-search");
const searchType = detailedSearch.querySelector("#search-type");
const excludeColumns = detailedSearch.querySelector("#exclude-columns");
const excludeRows = detailedSearch.querySelector("#exclude-empty-rows");
const uniqueFilters = detailedSearch.querySelector("#unique-filters");
const uniqueFiltersAddButton = uniqueFilters.querySelector("#unique-filters-add");

/* Extra selectors */

/**
 * Loading spinner element next to the search button. Indicates that the search is in progress.
 *
 * @type {Element}
 */
const loadingSpinner = searchForm.querySelector("#loading-spinner");

/**
 * Result number element next to the search button. Indicates how many results were found.
 *
 * @type {Element}
 */
const resultNumber = searchForm.querySelector("#result-number");

/**
 * URL to fetch form from (POST)
 *
 * @type {string}
 */
const fetchUrl = "https://tanrend.elte.hu/oktatoitanrend.php";

/**
 * Proxy URL to bypass CORS (must)
 *
 * @type {string}
 */
const proxyUrl = 'https://corsproxy.io/?';

/**
 * Reusable form data for the fetch
 *
 * @type {FormData}
 */
const formData = new FormData();
formData.set("felev", "2022-2023-2");
formData.set("darab", "100");

/**
 * Reusable request options for the fetch
 *
 * @type {{redirect: string, method: string, body: FormData}}
 */
const requestOptions = {
    method: "POST",
    body: formData,
    redirect: "follow",
};

searchForm.addEventListener("submit", (event) => {
    /* Prevent from refreshing page */
    event.preventDefault();

    loadingSpinner.removeAttribute("hidden");

    const search = searchBar.value ? searchBar.value : " ";

    /* Set form data*/
    formData.set("submit", getCheckedRadioValue(searchType));
    formData.set("mit", search);

    fetch(proxyUrl + fetchUrl, requestOptions)
        .then((response) => response.text())
        .then((response) => {

            /* Parse the result and grab #resulttable from it */
            const domParser = new DOMParser();
            const resultDoc = domParser.parseFromString(response, "text/html");

            const resultTable = resultDoc.querySelector("#resulttable");
            const resultRows = resultTable.rows;

            /* Get values from filters. The values are the defined classes. */
            const excludeColumnValues = getAllCheckedBoxesValue(excludeColumns);
            const excludeRowByEmptyValues = getAllCheckedBoxesValue(excludeRows);
            const uniquePairs = getAllUniquePairs();

            createTableHeader(resultTable);

            rowLoop:
                for (let i = resultRows.length - 1; i >= 0; i--) {
                    const row = resultRows[i];
                    const rowCells = row.cells;

                    /* Always do these 2 first */
                    addIndexToRow(row);
                    addClassToRowCells(rowCells);
                    changeCourseType(row);

                    cellsLoop:
                        for (let i = rowCells.length - 1; i >= 0; i--) {
                            const cell = rowCells[i];

                            if (excludeColumnValues.includes(cell.className)) {
                                cell.remove();
                                continue;
                            }

                            cell.innerText = cell.innerText.trim();

                            if (excludeRowByEmptyValues.includes(cell.className) || excludeRowByEmptyValues.includes("allEmpty")) {
                                if (cell.className !== "course-comment" && !cell.innerText) {
                                    row.remove();
                                    continue rowLoop;
                                }
                            }
                        }

                    if (i !== 0) {
                        for (const pair of uniquePairs) {
                            const [term, value] = pair;

                            if(!term || !value) continue;


                            const cell = row.querySelector(`.${term}`);

                            // create an accent-insensitive regex using plain JavaScript
                            const regex = new RegExp(removeAccents(value), 'iu');

                            console.log(regex.toString())


                            if (cell && !regex.test(removeAccents(cell.innerText))) {
                                row.remove();
                                continue rowLoop;
                            }
                        }

                    }
                }

            loadingSpinner.setAttribute("hidden", "");

            showResultNumber(resultRows);

            if (resultNumber.innerText === "No result") {
                coursesTable.setAttribute("hidden", "");
            } else {
                coursesTable.innerHTML = resultTable.innerHTML;
                coursesTable.removeAttribute("hidden");
            }

        })
        .catch((error) => console.log("error", error));
});

function removeAccents(str) {
    return str.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

uniqueFiltersAddButton.addEventListener("click", (event) => {
    const addCol = event.target.parentNode;
    const clickedRow = addCol.parentNode;

    /* Delete the add button */
    addCol.remove();

    /* Create new row  */
    const newRow = clickedRow.cloneNode(true);
    newRow.appendChild(addCol);
    newRow.querySelector('input').value = "";

    /* Add delete button to old row */
    const deleteCol = document.createElement('div');
    deleteCol.className = "col";
    deleteCol.innerHTML = '<button name="remove" class="btn btn-danger float-end">Remove</button>';

    deleteCol.querySelector('button[name="remove"]').addEventListener("click", (event) => {
        const clickedRow = event.target.parentNode.parentNode;
        clickedRow.remove();
    });

    clickedRow.appendChild(deleteCol);
    uniqueFilters.appendChild(newRow);
});

/**
 * Shows the number of result rows next to the search button
 *
 * @param rows - The rows of the table
 * */
function showResultNumber(rows) {
    const result = rows.length - 1;
    if (result <= 0) {
        resultNumber.textContent = "No result";
        resultNumber.classList.remove("bg-success");
        resultNumber.classList.add("bg-danger");
    } else {
        resultNumber.textContent = result + " result" + (result > 1 ? "s" : "");
        resultNumber.classList.add("bg-success");
        resultNumber.classList.remove("bg-danger");
    }
}

/**
 * Gets all checked checkboxes' values from parentElement
 *
 * @param parentElement - The parent element of the checkboxes (e.g. form)
 * @returns {*[]} - The values of the checked checkboxes
 */
function getAllCheckedBoxesValue(parentElement) {
    const checkedBoxes = [];

    const checkboxes = parentElement.querySelectorAll("input[type=checkbox]:checked");
    for (const checkbox of checkboxes) {
        checkedBoxes.push(checkbox.value);
    }

    return checkedBoxes;
}

/**
 * Gets radio button's value from parentElement
 *
 * @param parentElement - The parent element of the radio buttons (e.g. form)
 * @returns {string | number | any} - The value of the checked radio button
 */
function getCheckedRadioValue(parentElement) {
    return parentElement.querySelector("input[type=radio]:checked").value;
}

/**
 * Gets all unique filter pairs
 *
 * @returns {*[]} - The pairs of the unique filters
 */
function getAllUniquePairs() {
    const uniquePairs = [];

    const rows = uniqueFilters.querySelectorAll("#unique-filters .row");
    for (const row of rows) {
        const select = row.querySelector("select[name='unique-select']").value;
        const value = row.querySelector("input[name='unique-value']").value;
        uniquePairs.push([select, value]);
    }

    return uniquePairs;
}