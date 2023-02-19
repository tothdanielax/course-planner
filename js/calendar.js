"use strict";


/* Selectors */
const timeTable = document.querySelector('#time-table')

/* FullCalendar instance */
const calendar = new FullCalendar.Calendar(timeTable, {
    themeSystem: 'bootstrap5',
    schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
    headerToolbar: {
        // Display nothing at the top
        left: '', center: '', right: '',
    },
    initialView: 'timeGridWeek',
    dayMinWidth: 150,
    //stickyFooterScrollbar : true,
    locale: 'hu', // magyar
    allDaySlot: false, // all day off
    dayHeaderFormat: {
        weekday: 'long', // hétfő, kedd..
    },
    slotDuration: '00:30:00', // 30 minutes
    weekends: false, // dont show weekends
    slotMinTime: '7:00:00', // first time
    slotMaxTime: '21:00:00', // last time
    snapDuration: '00:15:00', // snap to 30 minutes
    slotLabelFormat: {
        hour: '2-digit', // 06
        minute: '2-digit', // 06
        omitZeroMinute: false, // 6:00 is not 6
        hour12: false, // 24:00 format
    }, height: "auto", // set timetable height
    expandRows: true, // fix last row display
    contentHeight: 'auto', // fix last row display
    /* customButtons: {
         addEventButton: {
             text: 'Add custom event', click: function () {
             }
         }
     },*/
    eventDidMount: arg => addRemoveButton(arg),
    editable: true,
    eventResizableFromStart: true,
})

/**
 * Adds a remove button to the event
 * @param arg - The event to add the button to
 */
function addRemoveButton(arg) {
    const el = arg.el.querySelector('.fc-event-time');
    const removeBtn = document.createElement('span');
    removeBtn.classList.add('removebtn');
    removeBtn.innerText = 'X';
    el.appendChild(removeBtn);

    removeBtn.addEventListener('click', () => {
        if (courseList.querySelector(`#${arg.event.id}`)) {
            courseList.querySelector(`#${arg.event.id}`).classList.remove('table-success');
        }

        arg.event.remove();
    });
}

/* Render calendar */
document.addEventListener('DOMContentLoaded', () => calendar.render());

const daysOfWeek = ['Hétfo', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek'];

/**
 * Adds an event to the calendar
 * @param rowID - The id of the row
 * @param name - The name of the course
 * @param teacher - The name of the teacher
 * @param time - The time of the course
 */
function addEventToCalendar(rowID, name, teacher, time) {
    const tokens = time.split(' ');
    const timeTokens = tokens[1].split('-');

    calendar.addEvent({
        id: rowID,
        title:
            `${name} -
            ${teacher}`,
        daysOfWeek: [getDay(tokens[0])],
        startTime: timeTokens[0],
        endTime: timeTokens[1]
    });
}

/**
 * Deletes an event from the calendar
 * @param id - The id of the event to delete
 */
function deleteEventFromCalendar(id) {
    calendar.getEventById(id).remove();
}

/**
 * Get the day of the week from the day name
 * @param day - The day name
 * @returns {string} - The day of the week
 */
function getDay(day) {
    return String(daysOfWeek.indexOf(day) + 1);
}