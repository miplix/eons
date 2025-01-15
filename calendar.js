import SunCalc from 'https://cdn.skypack.dev/suncalc';

class AlternativeCalendar {
  constructor() {
    this.startDate = new Date('2025-01-15');
    this.currentEon = 9;
    this.currentCycle = 1;
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
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    this.initializeDisplay();
    this.updateCalendar();
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

  calculateEraDay() {
    const now = new Date();
    const diffTime = Math.abs(now - this.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getMoonPhase() {
    const now = new Date();
    const moonIllumination = SunCalc.getMoonIllumination(now);
    return moonIllumination.phase;
  }

  getNextFullMoon() {
    const now = new Date();
    const minskOffset = 3; // UTC+3 for Minsk
    let date = new Date();
    let found = false;
    
    while (!found) {
      const illumination = SunCalc.getMoonIllumination(date);
      if (illumination.phase >= 0.49 && illumination.phase <= 0.51 && date > now) {
        // Convert to Minsk time
        const minskTime = new Date(date.getTime() + (minskOffset * 60 * 60 * 1000));
        return minskTime;
      }
      date.setHours(date.getHours() + 1);
    }
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
    
    const phi = 2 * Math.PI * phase;
    const x = cx + r * Math.cos(phi);
    const y = cy + r * Math.sin(phi);
    
    const path = `M${cx},${cy - r} A${r},${r} 0 0,1 ${cx},${cy + r} A${r},${r} 0 0,1 ${cx},${cy - r}
                  M${cx},${cy - r} A${r},${r} 0 0,${phase < 0.5 ? 1 : 0} ${x},${y}`;
    
    this.elements.moonMask.setAttribute('d', path);
  }

  updateCalendar() {
    const now = new Date();
    
    this.elements.gregorianDate.textContent = now.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const sunrise = this.getSunriseTimes();
    this.elements.sunriseTime.textContent = `Рассвет: ${sunrise.toLocaleTimeString('ru-RU')}`;

    this.elements.eonNumber.textContent = this.currentEon;

    const subtitle = document.querySelector('.eon-subtitle');
    subtitle.textContent = this.eonDescriptions[this.currentEon] || '';

    const era = this.calculateEraDay();
    this.elements.eraNumber.textContent = era;

    const moonPhase = this.getMoonPhase();
    this.updateMoonDisplay(moonPhase);
    
    this.elements.cycleNumber.textContent = this.currentCycle;

    const nextFullMoon = this.getNextFullMoon();
    if (nextFullMoon && this.elements.nextFullMoon) {
      this.elements.nextFullMoon.textContent = `Следующее полнолуние: ${nextFullMoon.toLocaleDateString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    }
  }
}

const calendar = new AlternativeCalendar();
