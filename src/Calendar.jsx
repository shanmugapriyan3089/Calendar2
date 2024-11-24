

import  { useState, useEffect } from 'react';
import './Calendar.css';
import 'react-toastify/dist/ReactToastify.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState(null);
  const [toastEvents, setToastEvents] = useState([]);
  const [hiddenBadges, setHiddenBadges] = useState({}); // For managing the toast events 


  const allEvents = [
    {
      id: 1,
      title: 'Team Meeting',
      name: 'John Doe',
      date: '2024-11-25',
      time: '12:00 PM',
      timeIndex: 2,
      position: 'Team Lead',
    },
    {
      id: 2,
      title: 'Workshop',
      name: 'Jane Smith',
      date: '2024-11-26',
      time: '02:00 PM',
      timeIndex: 4,
      position: 'Python Developer',
    },
    {
      id: 3,
      title: 'Project Presentation',
      name: 'Michael Johnson',
      date: '2024-11-26',
      time: '02:00 PM',
      timeIndex: 4,
      position: 'Product Manager',
    },
    {
      id: 4,
      title: 'Annual Review',
      name: 'Emily Davis',
      date: '2024-11-26',
      time: '02:00 PM',
      timeIndex: 4,
      position: 'HR Manager',
    },
    // {
    //   id: 5,
    //   title: 'Client Call',
    //   name: 'Chris Brown',
    //   date: '2024-11-26',
    //   time: '12:00 PM',
    //   timeIndex: 2,
    //   position: 'Account Manager',
    // },
    // {
    //   id: 6,
    //   title: 'Team Sync-Up',
    //   name: 'Laura Wilson',
    //   date: '2024-11-27',
    //   time: '02:00 PM',
    //   timeIndex: 4,
    //   position: 'Backend Developer',
    // },
    // {
    //   id: 7,
    //   title: 'Stand-Up Meeting',
    //   name: 'Tom Lee',
    //   date: '2024-11-25',
    //   time: '10:00 AM',
    //   timeIndex: 0,
    //   position: 'Scrum Master',
    // },
    {
      id: 8,
      title: 'Design Review',
      name: 'Sophia Taylor',
      date: '2024-11-27',
      time: '03:00 PM',
      timeIndex: 5,
      position: 'UI/UX Designer',
    },
  ];
  
  

  
  const daysShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const monthsShort = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const times = [
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
  ];

  

  const openModal = (event) => {
    setModalEvent(event); // Set the clicked event details
    setIsModalOpen(true); // Open the modal
    setToastEvents([]); // Close all toasts
  };
  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setModalEvent(null); // Clear the modal details
  };
  const closeAllToasts = () => {
    setToastEvents([]); // Clear all toasts
  };
  const handleToastClick = (event) => {
    openModal(event); // Open the modal with the event details
  };
  

  const getWeekDates = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(
      currentDate.getDate() -
        (currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1)
    );

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek.getTime() + i * 24 * 60 * 60 * 1000);
      return {
        day: daysShort[i],
        date: date.getDate(),
        fullDate: date.toISOString().split('T')[0],
        month: monthsShort[date.getMonth()],
      };
    });
  };

  const weekDates = getWeekDates();

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (mode === 'today') {
      setCurrentDate(new Date());
    }
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + 7);
    } else if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else if (viewMode === 'year') {
      newDate.setFullYear(currentDate.getFullYear() + 1);
    }
    setCurrentDate(newDate);
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() - 7);
    } else if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else if (viewMode === 'year') {
      newDate.setFullYear(currentDate.getFullYear() - 1);
    }
    setCurrentDate(newDate);
  };

  const getFilteredEvents = () => {
    if (viewMode === 'today') {
        return allEvents.filter((event) => {
          const eventDate = new Date(event.date);
          const today = new Date(currentDate);
          return (
            eventDate.getDate() === today.getDate() &&
            eventDate.getMonth() === today.getMonth() &&
            eventDate.getFullYear() === today.getFullYear()
          );
        });
      }
      

    if (viewMode === 'week') {
      return allEvents.filter((event) =>
        weekDates.some((weekDate) => weekDate.fullDate === event.date)
      );
    }

    if (viewMode === 'month') {
      return allEvents.filter(
        (event) =>
          new Date(event.date).getMonth() === currentDate.getMonth() &&
          new Date(event.date).getFullYear() === currentDate.getFullYear()
      );
    }

    if (viewMode === 'year') {
      return allEvents.filter(
        (event) =>
          new Date(event.date).getFullYear() === currentDate.getFullYear()
      );
    }

    return [];
  };

  const filteredEvents = getFilteredEvents();

  const renderHeaderDate = () => {
    if (viewMode === 'today') {
      return `${currentDate.toLocaleDateString('en-US', { weekday: 'long' })}, 
              ${currentDate.toLocaleDateString('en-US', { day: 'numeric' })} 
              ${currentDate.toLocaleDateString('en-US', { month: 'short' })}`;
    }

    if (viewMode === 'week') {
      const startOfWeek = weekDates[0];
      const endOfWeek = weekDates[weekDates.length - 1];
      return `${startOfWeek.date} ${startOfWeek.month} - ${endOfWeek.date} ${endOfWeek.month}`;
    }

    if (viewMode === 'month') {
      return `${
        monthsShort[currentDate.getMonth()]
      } ${currentDate.getFullYear()}`;
    }

    if (viewMode === 'year') {
      return `${currentDate.getFullYear()}`;
    }

    return '';
  };
  const handleGridCellClick = (events) => {
    if (events.length === 1) {
      // If there's only one event, open the modal directly
      openModal(events[0]);
    } else if (events.length > 1) {
      // If there are multiple events, show toasts
      setToastEvents(events);
    } else {
      // Clear toasts if there are no events
      setToastEvents([]);
    }
  };
  const handleBadgeClick = (eventId) => {
    setHiddenBadges((prev) => ({ ...prev, [eventId]: true }));
};

  

useEffect(() => {
    const dropdownContainer = document.querySelector('.dropdowns');
    if (dropdownContainer) {
      dropdownContainer.style.marginLeft = '20px'; // Ensures a 20px gap dynamically
    }
  }, []);
  
  

  return (
    <div className="calendar-container">
    <header className="calendar-header">
  <h2>Your Todos</h2>
  <div  className="dropdown-box">
  <div className="dropdowns">
    <select
      value={currentDate.getMonth()}
      onChange={(e) =>
        setCurrentDate(
          new Date(currentDate.getFullYear(), parseInt(e.target.value), 1)
        )
      }
    >
      {monthsShort.map((month, index) => (
        <option key={index} value={index}>
          {month}
        </option>
      ))}
    </select>
    <select
      value={currentDate.getFullYear()}
      onChange={(e) =>
        setCurrentDate(
          new Date(parseInt(e.target.value), currentDate.getMonth(), 1)
        )
      }
    >
      {Array.from({ length: 10 }, (_, i) => {
        const year = new Date().getFullYear() + i - 5;
        return (
          <option key={year} value={year}>
            {year}
          </option>
        );
      })}
    </select>
  </div>
  </div>
</header>

<div className="calendar-body">



<div className="header-date">
<div className="arrow-button-container">
    {/* Left arrow button */}
    <button className="arrow-button" onClick={handlePrevious}>
      ❮
    </button>
  </div>
  <div className="arrow-button-container">
    {/* Right arrow button */}
    <button className="arrow-button" onClick={handleNext}>
      ❯
    </button>
  </div>



  <div className="view-mode-buttons">
  <button
    className={`view-button ${viewMode === 'today' ? 'active' : ''}`}
    onClick={() => handleViewModeChange('today')}
  >
    Today
  </button>
  <button
    className={`view-button ${viewMode === 'week' ? 'active' : ''}`}
    onClick={() => handleViewModeChange('week')}
  >
    Week
  </button>
  <button
    className={`view-button ${viewMode === 'month' ? 'active' : ''}`}
    onClick={() => handleViewModeChange('month')}
  >
    Month
  </button>
  <button
    className={`view-button ${viewMode === 'year' ? 'active' : ''}`}
    onClick={() => handleViewModeChange('year')}
  >
    Year
  </button>
</div>

      </div>

      {viewMode === 'today' && (
  <div className="week-grid today-view">
    {/* Left Column: Time Slots */}
    <div className="time-column">
      {times.map((time, index) => (
        <div key={index} className="time-slot">
          {time}
        </div>
      ))}
    </div>

    {/* Right Column: Grid Cells */}
    <div>
      {times.map((_, timeIndex) => (
        <div
          key={timeIndex}
          className="grid-cell"
          onClick={() =>
            handleGridCellClick(
              filteredEvents.filter(
                (event) =>
                  event.date === currentDate.toISOString().split('T')[0] &&
                  event.timeIndex === timeIndex
              )
            )
          }
        >
          {filteredEvents
            .filter(
              (event) =>
                event.date === currentDate.toISOString().split('T')[0] &&
                event.timeIndex === timeIndex
            )
            .map((event) => (
              <div key={event.id} className="event">
                {event.title} ({event.time})
              </div>
            ))}
        </div>
      ))}
    </div>
    {toastEvents.length > 0 && (
      <div className="toast-overlay" onClick={closeAllToasts}>
        <div className="custom-toast-container">
          {toastEvents.map((event) => (
            <div
              key={event.id}
              className="custom-toast"
              onClick={(e) => {
                e.stopPropagation();
                handleToastClick(event);
              }}
            >
              <div>{event.position}</div>
              <div>Interviewer: {event.name}</div>
              <div>Time: {event.time}</div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)}


      {viewMode === 'week' && (
        <>
          <div className="week-header">
            <div className="time-column"></div>
            {weekDates.map(({ day, date, month }, index) => (
              <div key={index} className="weekday-header">
                <div className="day-name">{day}</div>
                <div className="day-date">
                  {date} {month}
                </div>
              </div>
            ))}
          </div>

          <div className="week-grid">
  <div className="time-column">
    {times.map((time, index) => (
      <div key={index} className="time-slot">
        {time}
      </div>
    ))}
  </div>

  {weekDates.map(({ fullDate }, dayIndex) => (
  <div key={dayIndex} className="day-column">
    {times.map((_, timeIndex) => {
      const eventsAtTime = filteredEvents.filter(
        (event) => event.date === fullDate && event.timeIndex === timeIndex
      );

      return (
        <div
          key={`${dayIndex}-${timeIndex}`}
          className="grid-cell"
          onClick={() => handleGridCellClick(eventsAtTime)} // Pass events to the handler
        >
          {/* Show event count badge */}
          {eventsAtTime.length > 1 && (
            <div className="event-count-badge">{eventsAtTime.length}</div>
          )}

          <div className="event-container">
            {eventsAtTime.slice(0, 1).map((event) => (
              <div
                key={event.id}
                className="event"
                style={{
                  gridRow: timeIndex + 1,
                  gridColumn: dayIndex + 2,
                }}
              >
                <div>{event.position}</div>
                <div>Interviewer: {event.name}</div>
                <div>Time: {event.time}</div>
              </div>
            ))}
          </div>
        </div>
      );
    })}
  </div>
))}



</div>

{toastEvents.length > 0 && (
    <div className="toast-overlay" onClick={closeAllToasts}>
        <div className="custom-toast-container">
            {toastEvents.map((event) => (
                <div
                    key={event.id}
                    className="custom-toast"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent overlay click
                        handleToastClick(event); // Handle individual event
                    }}
                >
                    <div>{event.position}</div>
                    <div>Interviewer: {event.name}</div>
                    <div>Time: {event.time}</div>
                </div>
            ))}
        </div>
    </div>
)}







        </>
      )}

{viewMode === 'month' && (
  <div className="month-grid">
    {Array.from({ length: 31 }, (_, i) => {
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
      return (
        <div
          key={i}
          className="month-cell"
          onClick={() =>
            handleGridCellClick(
              filteredEvents.filter(
                (event) =>
                  new Date(event.date).getDate() === i + 1 &&
                  new Date(event.date).getMonth() === currentDate.getMonth()
              )
            )
          }
        >
          <h4>{i + 1}</h4>
          {filteredEvents
            .filter(
              (event) =>
                new Date(event.date).getDate() === i + 1 &&
                new Date(event.date).getMonth() === currentDate.getMonth()
            )
            .map((event) => (
              <div key={event.id} className="event">
                {event.title} ({event.time})
              </div>
            ))}
        </div>
      );
    })}
    {toastEvents.length > 0 && (
      <div className="toast-overlay" onClick={closeAllToasts}>
        <div className="custom-toast-container">
          {toastEvents.map((event) => (
            <div
              key={event.id}
              className="custom-toast"
              onClick={(e) => {
                e.stopPropagation();
                handleToastClick(event);
              }}
            >
              <div>{event.position}</div>
              <div>Interviewer: {event.name}</div>
              <div>Time: {event.time}</div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)}


{viewMode === 'year' && (
  <div className="year-grid">
    {monthsShort.map((month, i) => (
      <div
        key={i}
        className="month-cell"
        onClick={() =>
          handleGridCellClick(
            filteredEvents.filter(
              (event) =>
                new Date(event.date).getMonth() === i &&
                new Date(event.date).getFullYear() === currentDate.getFullYear()
            )
          )
        }
      >
        <h4>{month}</h4>
        {filteredEvents
          .filter(
            (event) =>
              new Date(event.date).getMonth() === i &&
              new Date(event.date).getFullYear() === currentDate.getFullYear()
          )
          .map((event) => (
            <div key={event.id} className="event">
              {event.title} (
              {new Date(event.date).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
              })}
              )
            </div>
          ))}
      </div>
    ))}
    {toastEvents.length > 0 && (
      <div className="toast-overlay" onClick={closeAllToasts}>
        <div className="custom-toast-container">
          {toastEvents.map((event) => (
            <div
              key={event.id}
              className="custom-toast"
              onClick={(e) => {
                e.stopPropagation();
                handleToastClick(event);
              }}
            >
              <div>{event.position}</div>
              <div>Interviewer: {event.name}</div>
              <div>Time: {event.time}</div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)}

{isModalOpen && modalEvent && (
  <div
    className="modal-overlay"
    onClick={(e) => {
      // Close modal if the click is on the overlay, not inside the modal content
      if (e.target.classList.contains("modal-overlay")) {
        closeModal();
      }
    }}
  >
    <div className="modal-content">
      <div className="modal-box">
        <div className="modal-left">
          <p><strong>Interview With:</strong> {modalEvent.name}</p>
          <p><strong>Position:</strong> {modalEvent.position}</p>
          <p><strong>Created By:</strong> HR Manager</p>
          <p><strong>Interview Date:</strong> {modalEvent.date}</p>
          <p><strong>Interview Time:</strong> {modalEvent.time}</p>
          <p><strong>Interview Via:</strong> Google Meet</p>
          <div className="document-container">
            {["Resume.docx", "Aadhaarcard"].map((doc, index) => (
              <div key={index} className="document-box">
                <span className="document-name">{doc}</span>
                <div className="document-icons">
                  {/* Eye Icon */}
                  <svg
                    className="icon-eye"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M1.5 12s3.5-7 10.5-7 10.5 7 10.5 7-3.5 7-10.5 7-10.5-7-10.5-7z"
                    />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                  </svg>

                  {/* Download Icon */}
                  <svg
                    className="icon-download"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v12m0 0l4-4m-4 4l-4-4m4 4v6m-7 0h14"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-right">
          <img
            src="data:image/jpeg;base64,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"
            alt="Google Meet"
            className="google-meet-img"
          />
          <button className="join-button">Join</button>
        </div>
      </div>
    </div>
  </div>
)}






     </div>
    </div>
  );
};

export default Calendar;
