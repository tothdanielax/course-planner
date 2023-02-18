"use strict";

/* Selectors */
const courseList = document.querySelector("#course-list");

/* Table head row has index 0 */
let runningIndex = 0;

function deleteRowFromTableWithEmptyCells(table, row, exclude) {
    if (!exclude) return;

    const rowCells = row.cells;
    for (const cell of rowCells) {
        if (!cell.innerText.trim()) {
            /* Delete row (deleteRow() function dysfunc.) */
            row.innerHTML = "";
            return;
        }
    }
}

function addIndexToRow(row) {
    row.id = `row-${runningIndex}`;
    runningIndex++;
}

/* For css styling and easier selecting (deleting screws up simple indexing) */
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

    return thead;
}


function createTableHeaderFromRow(table, row) {
    const thead = table.createTHead();
    thead.classList.add("table-dark");
    const newRow = document.createElement("tr");

    // change all td to th
    for (let cell of row.cells) {
        const th = document.createElement("th");
        th.innerHTML = cell.innerHTML;
        th.className = cell.className;
        newRow.appendChild(th);
    }


    // delete first row of tbody (it's now copied to thead)
    table.deleteRow(row.rowIndex);
    thead.appendChild(newRow);
}

/* Do actions and calculations on row, like deleting. Parameters not used yet.  */
function calculateRows(rows, deleteClasses) {
    for (const row of rows) {
        /* Change course type to EA or GY */
        changeCourseType(getCellByClass(row, "course-type"));
    }
}

function deleteColumnsByClass(row, classes) {
    classes = classes || ["unused", "course-weeks", "course-comment", "course-part", "course-ea", "course-gy"];

    for (const className of classes) {
        deleteCellByClass(row, className)
    }
}

function getCellByClass(row, className) {
    return row.querySelector(`.${className}`);
}

function deleteCellByClass(row, className) {
    const cell = row.querySelector(`.${className}`);
    row.deleteCell(cell.cellIndex);
}

function changeCourseType(row) {
    const cell = getCellByClass(row, "course-type");
    if (cell.innerText === "gyakorlat") {
        cell.innerText = "GY";
    } else if (cell.innerText === "elõadás") {
        cell.innerText = "EA";
    }
}


// Add course to timetable
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


function highlightRow(row) {
    row.classList.add('table-success');
}