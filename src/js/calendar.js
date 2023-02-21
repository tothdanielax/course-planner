"use strict";

/* Selectors */
const timeTable = document.querySelector('#timetable');

const daysOfWeek = ['Hétfo', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek'];

/* FullCalendar instance */
const calendar = new FullCalendar.Calendar(timeTable, {
    themeSystem: 'bootstrap5',
    schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
    headerToolbar: {
        // Display nothing at the top
        left: '',
        center: '',
        right: '',
    },
    initialView: 'timeGridWeek',
    dayMinWidth: 150,
    locale: 'en',
    allDaySlot: false,
    dayHeaderFormat: {
        weekday: 'long', // monday, tuesday, etc
    },
    slotDuration: '00:30:00',
    weekends: false,
    slotMinTime: '7:00:00',
    slotMaxTime: '21:00:00',
    snapDuration: '00:15:00', // drag time
    slotLabelFormat: {
        hour: '2-digit',
        minute: '2-digit',
        omitZeroMinute: false,
        hour12: false,
    },
    height: "auto",
    expandRows: true, // fix last row display
    contentHeight: 'auto',
    editable: true,
    eventResizableFromStart: true,
    eventDidMount: arg => addRemoveButton(arg), // fires when an event is added to the calendar
    /*eventsSet: events => {
        for (const currentElement of events) {
            for (const thatElement of events) {
                if (currentElement.id == thatElement.id) continue;

                if (
                    currentElement.start < thatElement.end &&
                    thatElement.start < currentElement.end
                ) {
                    // Events overlap, add a class to the event
                    console.log(calendar.getEventById(currentElement.id))


                    //.addClass('bg-danger');
                }
            }
        }*/
    eventClassNames: arg => {
        const events = calendar.getEvents();

        for (const event of events) {
            if (arg.event.id == event.id) continue;

            if (arg.event.start < event.end && event.start < arg.event.start
                || arg.event.start < event.start && event.start < arg.event.end
                || new Date(arg.event.start).getTime() === new Date(event.start).getTime()
            ) {
                // Events overlap, add a class to the event
                return ['bg-danger'];
            }
        }
    }

})

/* Render calendar */
document.addEventListener('DOMContentLoaded', () => calendar.render());

/**
 * Adds a remove button to the event
 *
 * @param arg - The event to add the button to
 */
function addRemoveButton(arg) {
    /* Create */
    const removeBtn = document.createElement('span');
    removeBtn.classList.add('removebtn');
    removeBtn.innerText = 'X';

    removeBtn.addEventListener('click', () => {
        if (coursesTable.querySelector(`#${arg.event.id}`)) {
            coursesTable.querySelector(`#${arg.event.id}`).classList.remove('table-success');
        }

        arg.event.remove();
    });

    /* Append */
    const timeRow = arg.el.querySelector('.fc-event-time');
    timeRow.appendChild(removeBtn);
}

/**
 * Adds an event to the calendar
 *
 * @param rowID - The id of the row
 * @param name - The name of the course
 * @param teacher - The name of the teacher
 * @param time - The time of the course
 */
function addEventToTimetable(rowID, name, group, teacher, time) {
    const tokens = time.split(' ');
    const timeTokens = tokens[1].split('-');

    calendar.addEvent({
        id: rowID,
        title:
            `#${group} - ${name} -
            ${teacher}`,
        daysOfWeek: [getIndexOfDay(tokens[0])],
        startTime: timeTokens[0],
        endTime: timeTokens[1]
    });
}

/**
 * Deletes an event from the calendar by event id
 *
 * @param id - The id of the event to delete
 */
function deleteEventById(id) {
    calendar.getEventById(id).remove();
}

/**
 * Get the day of the week from the day name
 *
 * @param day - The name of the day
 * @returns {number} - The index of the day in the daysOfWeek array (indexed from 1), weekends are not included.
 * 0 if the day is not found.
 */
function getIndexOfDay(day) {
    return daysOfWeek.indexOf(day) + 1;
}