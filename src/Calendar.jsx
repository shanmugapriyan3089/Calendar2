
import  { useState } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
import './Calendar.css';
import 'react-toastify/dist/ReactToastify.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week');
  const [toastEvents, setToastEvents] = useState([]);

  'week', 'month', 'year';

  const allEvents1 = [
    {
      id: 1,
      title: 'Team Meeting',
      date: '2024-11-20',
      time: '12:00 PM',
      timeIndex: 2,
    },
    {
      id: 2,
      title: 'Workshop',
      date: '2024-11-20',
      time: '02:00 PM',
      timeIndex: 4,
    },
    {
      id: 3,
      title: 'Project Presentation',
      date: '2024-11-20',
      time: '02:00 PM',
      timeIndex: 4,
    },
    {
      id: 4,
      title: 'Annual Review',
      date: '2024-11-20',
      time: '02:00 PM',
      timeIndex: 4,
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
      return allEvents1.filter(
        (event) => event.date === currentDate.toISOString().split('T')[0] // Compare only the date part
      );
    }

    if (viewMode === 'week') {
      return allEvents1.filter((event) =>
        weekDates.some((weekDate) => weekDate.fullDate === event.date)
      );
    }

    if (viewMode === 'month') {
      return allEvents1.filter(
        (event) =>
          new Date(event.date).getMonth() === currentDate.getMonth() &&
          new Date(event.date).getFullYear() === currentDate.getFullYear()
      );
    }

    if (viewMode === 'year') {
      return allEvents1.filter(
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
    if (events.length > 0) {
      setToastEvents(events);
      setTimeout(() => {
        setToastEvents([]);
      }, 5000);
    }
  };

  return (
    <div className="calendar-container">
      <header className="calendar-header">
        <h2>Your Todos</h2>
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
      </header>

      <div className="header-date">
        <button onClick={handlePrevious} className="arrow-button">
          ❮
        </button>
        <h3>{renderHeaderDate()}</h3>
        <button onClick={handleNext} className="arrow-button">
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

      {viewMode === 'today' && (
        <div className="week-grid">
          <div className="time-column">
            {times.map((time, index) => (
              <div key={index} className="time-slot">
                {time}
              </div>
            ))}
          </div>
          <div className="grid-cell">
            {times.map((_, timeIndex) => (
              <div key={timeIndex} className="time-slot">
                {filteredEvents
                  .filter((event) => event.timeIndex === timeIndex)
                  .map((event) => (
                    <div key={event.id} className="event">
                      {event.title} ({event.time})
                    </div>
                  ))}
              </div>
            ))}
          </div>
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
                {times.map((_, timeIndex) => (
                  <div
                    key={`${dayIndex}-${timeIndex}`}
                    className="grid-cell"
                    onClick={() =>
                      handleGridCellClick(
                        filteredEvents.filter(
                          (event) =>
                            event.date === fullDate &&
                            event.timeIndex === timeIndex
                        )
                      )
                    }
                  >
                    <div className="event-container">
                      {filteredEvents
                        .filter(
                          (event) =>
                            event.date === fullDate &&
                            event.timeIndex === timeIndex
                        )
                        .map((event) => (
                          <div
                            key={event.id}
                            className="event"
                            style={{
                              gridRow: timeIndex + 1,
                              gridColumn: dayIndex + 2,
                            }}
                          >
                            {event.title} ({event.time})
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {toastEvents.length > 0 && (
            <div className="custom-toast-container">
              {toastEvents.map((event) => (
                <div key={event.id} className="custom-toast">
                  <strong>{event.title}</strong>
                  <p>{event.time}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {viewMode === 'month' && (
        <div className="month-grid">
          {Array.from({ length: 31 }, (_, i) => (
            <div key={i} className="month-cell">
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
          ))}
        </div>
      )}

      {viewMode === 'year' && (
        <div className="year-grid">
          {monthsShort.map((month, i) => (
            <div key={i} className="month-cell">
              <h4>{month}</h4>
              {allEvents1
                .filter(
                  (event) =>
                    new Date(event.date).getMonth() === i &&
                    new Date(event.date).getFullYear() ===
                      currentDate.getFullYear()
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
        </div>
      )}
    </div>
  );
};

export default Calendar;
