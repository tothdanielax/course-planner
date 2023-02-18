"use strict";

/* Form selectors */
const searchForm = document.querySelector("#search-form");
const courseNameSearch = searchForm.querySelector("#course-name-search");
const excludeEmpty = searchForm.querySelector("#exclude-empty");

/* Extra selectors */
const loadingSpinner = searchForm.querySelector("#loading-spinner");

/* URL to fetch form from (POST) */
const fetchUrl = "https://tanrend.elte.hu/oktatoitanrend.php";
const proxyUrl = 'https://corsproxy.io/?';

/* Reusable form data */
const formData = new FormData();
formData.set("felev", "2022-2023-2");
formData.set("darab", "100");
formData.set("submit", "keresnevre");

searchForm.addEventListener("submit", (event) => {
    /* Prevent from refreshing page */
    event.preventDefault();
    loadingSpinner.removeAttribute("hidden");

    /* Get values from form */
    const name = courseNameSearch.value ? courseNameSearch.value : " ";
    const exclude = excludeEmpty.checked;

    /* Set form data and options */
    formData.set("mit", name);

    const requestOptions = {
        method: "POST",
        body: formData,
        redirect: "follow",
    };

    fetch(proxyUrl + fetchUrl, requestOptions)
        .then((response) => response.text())
        .then((response) => {
            /* Parse the result and grab result table from it */
            const domParser = new DOMParser();
            const resultDoc = domParser.parseFromString(response, "text/html");
            const table = resultDoc.querySelector("#resulttable");
            table.classList.add("table", "table-bordered", "table-secondary", "table-hover", "table-striped", "table-sm", "table-responsive");

            const rows = table.rows;

            /* Set thead */
            createTableHeader(table)

            /* Calculate rows */
            for (const row of rows) {
                /* Always do this first */
                addIndexToRow(row);
                addClassToRowCells(row);

                changeCourseType(row);
                deleteColumnsByClass(row);
                deleteRowFromTableWithEmptyCells(table, row, exclude);
            }

            /* Replace the old table with the new one */
            courseList.replaceChildren(table);
            loadingSpinner.setAttribute("hidden", true);

        })
        .catch((error) => console.log("error", error));
});