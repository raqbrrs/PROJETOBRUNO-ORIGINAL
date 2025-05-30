// Banco de dados simulado usando localStorage
const AppointmentDB = {
  // Salvar agendamento
  save: function(appointment) {
    let appointments = this.getAll();
    appointments.push(appointment);
    localStorage.setItem('odontolux_appointments', JSON.stringify(appointments));
  },
  
  // Obter todos agendamentos
  getAll: function() {
    const data = localStorage.getItem('odontolux_appointments');
    return data ? JSON.parse(data) : [];
  },
  
  // Obter agendamentos por data
  getByDate: function(date) {
    const appointments = this.getAll();
    return appointments.filter(app => app.date === date);
  },
  
  // Limpar todos agendamentos (para testes)
  clear: function() {
    localStorage.removeItem('odontolux_appointments');
  }
};

// Pegar dados da URL (simulação)
const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get('name') || 'Carlos Silva';
const service = urlParams.get('service') || 'Consulta Geral';
const date = urlParams.get('date') || '15/11/2023 - 14:30';

// Salvar o agendamento no banco de dados simulado
const appointment = {
  id: Date.now(), // ID único
  name: name,
  service: service,
  date: date.split(' - ')[0], // Apenas a data
  time: date.split(' - ')[1], // Apenas o horário
  fullDate: date, // Data completa
  timestamp: new Date(date.split(' - ')[0].split('/').reverse().join('-') + 'T' + date.split(' - ')[1] + ':00').getTime()
};

AppointmentDB.save(appointment);

// Preencher detalhes da confirmação
document.getElementById('confirm-name').textContent = name;
document.getElementById('confirm-service').textContent = service;
document.getElementById('confirm-date').textContent = date;

function renderCalendar(month, year) {
    const calendarDays = document.getElementById('calendar-days');
    calendarDays.innerHTML = '';
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    // Dias do mês anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = 0; i < startingDay; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day other-month';
        dayElement.innerHTML = `<div class="day-number">${prevMonthLastDay - startingDay + i + 1}</div>`;
        calendarDays.appendChild(dayElement);
    }
    
    // Dias do mês atual
    const today = new Date();
    const allAppointments = AppointmentDB.getAll();
    
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        const currentDate = new Date(year, month, i);
        const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        dayElement.className = `calendar-day ${isToday ? 'today' : ''}`;
        
        // Formatar data para comparação (dd/mm/aaaa)
        const formattedDate = `${i.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`;
        
        // Filtrar agendamentos para este dia
        const dayAppointments = allAppointments.filter(app => app.date === formattedDate);
        
        let appointmentsHTML = '';
        dayAppointments.forEach(app => {
            appointmentsHTML += `<div class="appointment-badge">${app.time} - ${app.name.split(' ')[0]}</div>`;
        });
        
        dayElement.innerHTML = `<div class="day-number">${i}</div>${appointmentsHTML}`;
        calendarDays.appendChild(dayElement);
    }
    
    // Dias do próximo mês
    const daysToShow = 42 - (startingDay + daysInMonth); // 6 semanas
    for (let i = 1; i <= daysToShow; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day other-month';
        dayElement.innerHTML = `<div class="day-number">${i}</div>`;
        calendarDays.appendChild(dayElement);
    }
    
    // Atualizar título do mês
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    document.querySelector('.calendar-title').textContent = `${monthNames[month]} ${year}`;
}