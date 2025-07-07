document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const monthYearEl = document.getElementById('month-year');
    const calendarDaysEl = document.querySelector('.calendar-days'); // <--- FIX: Was getElementById
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const gedungButtons = document.querySelectorAll('.btn-gedung');
    const bookingForm = document.getElementById('booking-form');
    const backToCalendarBtn = document.getElementById('back-to-calendar');
    const newBookingBtn = document.getElementById('new-booking');

    const calendarView = document.querySelector('.calendar-view');
    const formView = document.querySelector('.form-view');
    const confirmationView = document.querySelector('.confirmation-view');

    const selectedDateInput = document.getElementById('selected-date');
    const selectedGedungInput = document.getElementById('selected-gedung');

    // --- STATE ---
    let currentDate = new Date();
    let selectedGedung = 'A'; // Default Gedung A
    
    // --- MOCK BOOKED DATES (SIMULASI DATABASE) ---
    // Format: 'YYYY-MM-DD'
    const bookedDates = {
        'A': ['2025-07-15', '2025-07-20', '2025-08-05'],
        'B': ['2025-07-18', '2025-07-22', '2025-08-10']
    };

    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    // --- FUNCTIONS ---
    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        monthYearEl.textContent = `${monthNames[month]} ${year}`;
        calendarDaysEl.innerHTML = '';

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
        
        // Adjust for weeks starting on Sunday (getDay() returns 0 for Sunday)
        const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        dayNames.forEach(day => {
            const dayEl = document.createElement('div');
            dayEl.classList.add('day-name');
            dayEl.textContent = day;
            calendarDaysEl.appendChild(dayEl);
        });

        // Calculate previous month's padding days
        const lastDateOfPrevMonth = new Date(year, month, 0).getDate();
        for (let i = firstDayOfMonth; i > 0; i--) {
            const dayEl = document.createElement('div');
            dayEl.classList.add('other-month');
            dayEl.textContent = lastDateOfPrevMonth - i + 1;
            calendarDaysEl.appendChild(dayEl);
        }

        // Current month's days
        for (let i = 1; i <= lastDateOfMonth; i++) {
            const dayEl = document.createElement('div');
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            
            dayEl.textContent = i;

            const today = new Date();
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayEl.classList.add('today');
            }

            if (bookedDates[selectedGedung].includes(dateStr)) {
                dayEl.classList.add('booked');
            } else {
                dayEl.classList.add('available');
                dayEl.dataset.date = dateStr;
                dayEl.addEventListener('click', () => {
                    selectedDateInput.value = dateStr;
                    selectedGedungInput.value = selectedGedung;
                    showView('form');
                });
            }
            calendarDaysEl.appendChild(dayEl);
        }
    };

    const showView = (viewName) => {
        calendarView.classList.add('hidden');
        formView.classList.add('hidden');
        confirmationView.classList.add('hidden');

        if (viewName === 'calendar') {
            calendarView.classList.remove('hidden');
        } else if (viewName === 'form') {
            formView.classList.remove('hidden');
        } else if (viewName === 'confirmation') {
            confirmationView.classList.remove('hidden');
        }
    };



    // --- EVENT LISTENERS ---
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    gedungButtons.forEach(button => {
        button.addEventListener('click', () => {
            gedungButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedGedung = button.dataset.gedung;
            renderCalendar();
        });
    });

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Form submitted!');
        console.log('Gedung:', selectedGedungInput.value);
        console.log('Tanggal:', selectedDateInput.value);
        
        bookedDates[selectedGedungInput.value].push(selectedDateInput.value);
        bookingForm.reset();
        showView('confirmation');
    });

    backToCalendarBtn.addEventListener('click', () => {
        showView('calendar');
    });
    
    newBookingBtn.addEventListener('click', () => {
        renderCalendar();
        showView('calendar');
    });

    // --- INITIAL RENDER ---
    renderCalendar();
});
