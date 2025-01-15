import SunCalc from 'https://cdn.skypack.dev/suncalc';

class AlternativeCalendar {
  constructor() {
    this.startDate = new Date('2025-01-15');
    this.currentEon = 9; // Starting with 9 Eon as specified
    this.currentCycle = 1; // Setting current cycle to 1 as requested
    this.location = {
      latitude: 53.9006, // Minsk latitude
      longitude: 27.5590 // Minsk longitude
    };
    
    this.eonDescriptions = {
      1: 'Эон Огня',
      2: 'Эон Воды(Веды)',
      3: 'Эон Творчества',
      4: 'Эон Каменной Виры',
      5: 'Эон Единства',
      6: 'Эон Внутреннего развития',
      7: 'Эон Праздника и Перерождения',
      8: 'Эон Таинства и Внутренней Силы',
      9: 'Эон Творца'
    };
    
    this.initializeDisplay();
    this.updateCalendar();
    
    // Update every minute
    setInterval(() => this.updateCalendar(), 60000);
  }

  initializeDisplay() {
    this.elements = {
      gregorianDate: document.querySelector('.gregorian-date'),
      sunriseTime: document.querySelector('.sunrise-time'),
      eonNumber: document.querySelector('.eon-display .number'),
      eraNumber: document.querySelector('.era-display .number'),
      cycleNumber: document.querySelector('.cycle-display .number'),
      moonMask: document.querySelector('.moon-mask'),
      nextFullMoon: document.querySelector('.next-full-moon')
    };
  }

  getDayOfWeek(date) {
    return date.getDay() === 0 ? 7 : date.getDay();
  }

  calculateEraDay() {
    const now = new Date();
    const diffTime = Math.abs(now - this.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  async getMoonPhase() {
    const now = new Date();
    const moonIllumination = SunCalc.getMoonIllumination(now);
    return moonIllumination.phase;
  }

  getNextFullMoon() {
    const now = new Date();
    const phase = SunCalc.getMoonIllumination(now).phase;
    let date = new Date();
    
    // Increment by day until we find the next full moon
    while (SunCalc.getMoonIllumination(date).phase < 0.5 || 
           SunCalc.getMoonIllumination(date).phase > 0.51) {
      date.setDate(date.getDate() + 1);
    }
    
    return date;
  }

  getSunriseTimes() {
    const now = new Date();
    const times = SunCalc.getTimes(now, this.location.latitude, this.location.longitude);
    return times.sunrise;
  }

  updateMoonDisplay(phase) {
    const r = 45;
    const cx = 50;
    const cy = 50;
    
    // Calculate moon phase mask
    const phi = 2 * Math.PI * phase;
    const x = cx + r * Math.cos(phi);
    const y = cy + r * Math.sin(phi);
    
    const path = `M${cx},${cy - r} A${r},${r} 0 0,1 ${cx},${cy + r} A${r},${r} 0 0,1 ${cx},${cy - r}
                  M${cx},${cy - r} A${r},${r} 0 0,${phase < 0.5 ? 1 : 0} ${x},${y}`;
    
    this.elements.moonMask.setAttribute('d', path);
  }

  async updateCalendar() {
    const now = new Date();
    
    // Update Gregorian date
    this.elements.gregorianDate.textContent = now.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Update sunrise time
    const sunrise = this.getSunriseTimes();
    this.elements.sunriseTime.textContent = `Рассвет: ${sunrise.toLocaleTimeString('ru-RU')}`;

    // Update Eon (based on day of week)
    const eon = this.getDayOfWeek(now);
    this.elements.eonNumber.textContent = this.currentEon;

    // Update Eon subtitle
    const subtitle = document.querySelector('.eon-subtitle');
    subtitle.textContent = this.eonDescriptions[this.currentEon] || '';

    // Update Era
    const era = this.calculateEraDay();
    this.elements.eraNumber.textContent = era;

    // Update moon phase display
    const moonPhase = await this.getMoonPhase();
    this.updateMoonDisplay(moonPhase);
    
    // Always display cycle 1 as requested
    this.elements.cycleNumber.textContent = this.currentCycle;

    // Update next full moon date
    const nextFullMoon = this.getNextFullMoon();
    this.elements.nextFullMoon.textContent = `Следующий цикл начнется ${nextFullMoon.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`;
  }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AlternativeCalendar();
});
