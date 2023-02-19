"use strict";

/* Selectors */
const courseList = document.querySelector("#course-list");

/**
 * The current index of the row. Head row's index is 0.
 * @type {number}
 */
let rowIndex = 0;

/**
 * Deletes a row from a table by class
 * If the excludeClasses array contains "allEmpty", then the row will be deleted if any of the cells are empty.
 * @param row - The row to check and delete if needed
 * @param rowClasses - The classes of the row (available columns to work with)
 * @param excludeClasses - The classes to exclude
 *
 * @example
 * // Deletes the row if the cell with the class "name" is empty
 * // Because the row has the class "course-name" the delete is valid
 * deleteRowTableByClass(row, ["course-name", "course-time", "course-place"], ["course-name"]);
 *
 * @example
 * // Does nothing because the row doesn't have the class "course-name"
 * deleteRowTableByClass(row, ["course-time", "course-place"], ["course-name"]);
 *
 */
function deleteRowTableByClass(row, rowClasses, excludeClasses) {
    if (!excludeClasses) return;

    let filteredArray = [];

    if (excludeClasses.includes("allEmpty")) {
        filteredArray = rowClasses;
        if (filteredArray.includes("course-comment")) filteredArray.splice(filteredArray.indexOf("course-comment"), 1);
    } else {
        filteredArray = excludeClasses.filter(classValue => rowClasses.includes(classValue));
    }

    for (const excludeClass of filteredArray) {
        const cell = row.querySelector(`.${excludeClass}`);

        if (!cell.innerText.trim()) {
            row.innerHTML = "";
            return;
        }
    }
}

/**
 * Gets all the classes from a row (available columns to work with)
 * @param row - The row to get the classes from
 * @returns {string[]} - The classes of the row
 */
function getAllClassesFromRow(row) {
    const rowCells = row.cells;
    const classes = [];

    for (const cell of rowCells) {
        classes.push(cell.className);
    }

    return classes;
}

/**
 * Adds an index to a row
 * @param row - The row to add the index to
 */
function addIndexToRow(row) {
    row.id = `row-${rowIndex}`;
    rowIndex++;
}

/**
 * Adds classes to the cells of a row
 * @param row - The row to add the classes to
 */
function addClassToRowCells(row) {
    const rowCells = row.cells;

    rowCells[0].classList.add("unused");
    rowCells[1].classList.add("course-name");
    rowCells[2].classList.add("course-code");
    rowCells[3].classList.add("course-time");
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
 * Creates the table header and deletes the old one
 * @param table - The table to create the header for
 */
function createTableHeader(table) {
    table.deleteRow(0)

    const thead = table.createTHead();
    thead.classList.add("table-dark");
    const row = thead.insertRow();

    const unused = document.createElement("th");
    unused.innerHTML = "Unused";

    const courseName = document.createElement("th");
    courseName.innerHTML = "Course name";

    const courseCode = document.createElement("th");
    courseCode.innerHTML = "Code";

    const courseTime = document.createElement("th");
    courseTime.innerHTML = "Date";

    const coursePlace = document.createElement("th");
    coursePlace.innerHTML = "Place";

    const courseWeeks = document.createElement("th");
    courseWeeks.innerHTML = "Weeks";

    const courseComment = document.createElement("th");
    courseComment.innerHTML = "Comment";

    const courseType = document.createElement("th");
    courseType.innerHTML = "Type";

    const courseGroup = document.createElement("th");
    courseGroup.innerHTML = "Group";

    const coursePart = document.createElement("th");
    coursePart.innerHTML = "Part";

    const courseEA = document.createElement("th");
    courseEA.innerHTML = "EA";

    const courseGY = document.createElement("th");
    courseGY.innerHTML = "GY";

    const courseTeacher = document.createElement("th");
    courseTeacher.innerHTML = "Teacher";

    row.appendChild(unused);
    row.appendChild(courseName);
    row.appendChild(courseCode);
    row.appendChild(courseTime);
    row.appendChild(coursePlace);
    row.appendChild(courseWeeks);
    row.appendChild(courseComment);
    row.appendChild(courseType);
    row.appendChild(courseGroup);
    row.appendChild(coursePart);
    row.appendChild(courseEA);
    row.appendChild(courseGY);
    row.appendChild(courseTeacher);
}

/**
 * Deletes all columns from a row by classes name,
 * @param row - The row to delete the columns from
 * @param classes - The classes of the columns to delete
 *
 * @example
 * // Deletes the columns with the classes "course-name" and "course-time"
 * // returns the row without the columns
 * deleteColumnsByClass(row, ["course-name", "course-time"]);
 */
function deleteColumnsByClass(row, classes) {
    for (const className of classes) {
        deleteCellByClass(row, className)
    }
}

function trimRowCells(row) {
    const rowCells = row.cells;

    for (const cell of rowCells) {
        cell.innerText = cell.innerText.trim();
    }
}

/**
 * Get a cell by class name
 * @param row - The row to get the cell from
 * @param className - The class name of the cell
 * @returns {Element} - The cell
 *
 * @example
 * // Returns the cell with the class "course-name"
 * getCellByClass(row, "course-name");
 */
function getCellByClass(row, className) {
    return row.querySelector(`.${className}`);
}

/**
 * Deletes a cell from a row by class name
 * @param row - The row to delete the cell from
 * @param className - The class name of the cell to delete
 *
 * @example
 * // Deletes the cell with the class "course-name"
 * deleteCellByClass(row, "course-name");
 */
function deleteCellByClass(row, className) {
    const cell = row.querySelector(`.${className}`);
    row.deleteCell(cell.cellIndex);
}

/**
 * Changes the course type to a more readable format (EA or GY)
 * @param row - The row to change the course type in
 */
function changeCourseType(row) {
    const cell = getCellByClass(row, "course-type");
    if (cell.innerText === "gyakorlat") {
        cell.innerText = "GY";
    } else if (cell.innerText === "elõadás") {
        cell.innerText = "EA";
    }
}

/**
 * On click, add a course to the timetable and highlight the row in course list
 */
courseList.addEventListener('click', event => {
    if (event.target.tagName !== 'TD') return;
    const row = event.target.parentNode;

    if (!row.classList.contains('table-success')) {
        row.classList.add('table-success');
        addEventToCalendar(
            row.id,
            getCellByClass(row, 'course-name').innerText, //name
            getCellByClass(row, 'course-teacher').innerText, //teacher
            getCellByClass(row, 'course-time').innerText) //time
    } else {
        // was already in calendar, don't add again
        row.classList.remove('table-success');
        deleteEventFromCalendar(row.id);
    }
});