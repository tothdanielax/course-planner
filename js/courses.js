"use strict";

/* Selectors */
const coursesTable = document.querySelector("#courses-table");

/**
 * The current index of the row.
 * Table head's row index is not 0 (indexed from last row to avoid reference delete problems).
 *
 * @type {number}
 */
let rowIndex = 0;

/**
 * On click,
 * 1. add a course to the timetable and highlight the row in course list
 * 2. remove a course from the timetable and unhighlight the row in course list
 */
coursesTable.addEventListener('click', event => {
    if (event.target.tagName !== 'TD') return;

    const clickedRow = event.target.parentNode;

    /* In the current context 'table-success' class means, that the row is already in the timetable */
    if (clickedRow.classList.contains('table-success')) {
        clickedRow.classList.remove('table-success');
        deleteEventById(clickedRow.id);
    } else {
        clickedRow.classList.add('table-success');
        addEventToTimetable(
            clickedRow.id,
            getElementByClass(clickedRow, 'course-name').innerText,
            getElementByClass(clickedRow, 'course-teacher').innerText,
            getElementByClass(clickedRow, 'course-date').innerText
        );
    }
});

/**
 * Adds index to a row
 *
 * @param row - The row to add the index to
 */
function addIndexToRow(row) {
    row.id = `row-${rowIndex}`;
    rowIndex++;
}

/**
 * Adds classes to the cells of a row
 *
 * @param rowCells - The cells of the row to add the classes to
 */
function addClassToRowCells(rowCells) {
    rowCells[0].classList.add("unused");
    rowCells[1].classList.add("course-name");
    rowCells[2].classList.add("course-code");
    rowCells[3].classList.add("course-date");
    rowCells[4].classList.add("course-place");
    rowCells[5].classList.add("course-weeks");
    rowCells[6].classList.add("course-comment");
    rowCells[7].classList.add("course-type");
    rowCells[8].classList.add("course-group");
    rowCells[9].classList.add("course-part");
    rowCells[10].classList.add("course-ea");
    rowCells[11].classList.add("course-gy");
    rowCells[12].classList.add("course-teacher");
}

/**
 * Creates the table header from the first row, then deletes the first row
 *
 * @param table - The table to create the header for
 */
function createTableHeader(table) {
    /* Delete previous "header" */
    table.deleteRow(0)

    const thead = document.createElement("thead")
    thead.classList.add("table-dark");

    thead.innerHTML = `<tr>
        <th scope="col">Unused</th>
        <th scope="col">Course name</th>
        <th scope="col">Code</th>
        <th scope="col">Date</th>
        <th scope="col">Place</th>
        <th scope="col">Weeks</th>
        <th scope="col">Comment</th>
        <th scope="col">Type</th>
        <th scope="col">Group</th>
        <th scope="col">Part</th>
        <th scope="col">EA</th>
        <th scope="col">GY</th>
        <th scope="col">Teacher</th>
    </tr>`;

    table.appendChild(thead);
}


/**
 * Get a cell by class name in a parent element
 *
 * @param parentElement - The parent element to get the cell from (e.g. a row)
 * @param className - The class name of the cell
 * @returns {Element} - The cell
 */
function getElementByClass(parentElement, className) {
    return parentElement.querySelector(`.${className}`);
}

/**
 * Changes the course type to a more readable format (EA or GY)
 *
 * @param row - The row to change the course type in
 */
function changeCourseType(row) {
    const cell = getElementByClass(row, "course-type");

    if (!cell) return;

    if (cell.innerText === "gyakorlat") {
        cell.innerText = "GY";
    } else if (cell.innerText === "elõadás") {
        cell.innerText = "EA";
    }
}