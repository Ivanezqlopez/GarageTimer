// Clase para manejar cada vehículo
class VehicleTimer {
    constructor(patente, savedData = null) {
        this.patente = patente;
        this.totalSeconds = 0;
        this.timerInterval = null;
        this.isPaused = false;
        this.lastStart = null; // Timestamp cuando se inició o reanudó el temporizador
        this.createdAt = null; // Hora de creación
        
        const [prefix, resto] = this.patente.split('-');
        this.prefijo = parseInt(prefix, 10);
        this.digits = resto.slice(0, 3);
        this.letra = resto.slice(3);
    
        if (isNaN(this.prefijo) || this.digits.length !== 3 || (this.letra !== 'A' && this.letra !== 'C')) {
            console.error(`Patente inválida: ${this.patente}`);
            return;
        }
    
        if (savedData) {
            this.totalSeconds = savedData.totalSeconds || 0;
            this.isPaused = savedData.isPaused || false;
            this.lastStart = savedData.lastStart || null;
            this.createdAt = savedData.createdAt || null;
    
            if (!this.isPaused && this.lastStart) {
                const now = Date.now();
                const elapsed = Math.floor((now - this.lastStart) / 1000);
                this.totalSeconds += elapsed;
            }
        } else {
            this.createdAt = new Date().toISOString();
        }
    
        this.createVehicleElement();
        this.updateTimerDisplay();
        this.updatePriceDisplay();
    
        if (!this.isPaused && this.lastStart) {
            this.startTimer(false);
        }
    }
    
    
    
    

    createVehicleElement() {
        this.vehicleElement = document.createElement('div');
        this.vehicleElement.classList.add('vehicle');

        const header = document.createElement('div');
        header.classList.add('vehicle-header');

        const title = document.createElement('h2');
        title.textContent = `${this.patente}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.classList.add('deleteBtn');
        deleteBtn.addEventListener('click', () => this.deleteVehicle());

        header.appendChild(title);
        header.appendChild(deleteBtn);
        this.vehicleElement.appendChild(header);

        this.timerDisplay = document.createElement('div');
        this.timerDisplay.classList.add('timer');
        this.vehicleElement.appendChild(this.timerDisplay);

        this.priceDisplay = document.createElement('div');
        this.priceDisplay.classList.add('price');
        this.vehicleElement.appendChild(this.priceDisplay);

        this.createdAtDisplay = document.createElement('div');
        this.createdAtDisplay.classList.add('created-at');
        this.createdAtDisplay.textContent = `Agregado: ${this.formatDate(this.createdAt)}`;
        this.vehicleElement.appendChild(this.createdAtDisplay);

        this.controls = document.createElement('div');
        this.controls.classList.add('controls');

        this.pauseBtn = document.createElement('button');
        this.pauseBtn.textContent = 'Detener';
        this.pauseBtn.classList.add('pauseBtn');
        this.pauseBtn.addEventListener('click', () => this.pauseTimer());

        this.resumeBtn = document.createElement('button');
        this.resumeBtn.textContent = 'Reanudar';
        this.resumeBtn.classList.add('resumeBtn');
        this.resumeBtn.style.display = 'none';
        this.resumeBtn.addEventListener('click', () => this.resumeTimer());

        this.resetBtn = document.createElement('button');
        this.resetBtn.textContent = 'Reiniciar';
        this.resetBtn.classList.add('resetBtn');
        this.resetBtn.addEventListener('click', () => this.resetTimer());

        this.controls.appendChild(this.pauseBtn);
        this.controls.appendChild(this.resumeBtn);
        this.controls.appendChild(this.resetBtn);

        this.vehicleElement.appendChild(this.controls);

        document.getElementById('vehiclesSection').appendChild(this.vehicleElement);
        this.updateButtons();
    }

    formatDate(isoString) {
        const date = new Date(isoString);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        return date.toLocaleDateString('es-ES', options);
    }

    updateButtons() {
        if (!this.isPaused && this.lastStart) {
            this.pauseBtn.style.display = 'inline-block';
            this.resumeBtn.style.display = 'none';
        } else if (this.isPaused) {
            this.pauseBtn.style.display = 'none';
            this.resumeBtn.style.display = 'inline-block';
        } else {
            this.pauseBtn.style.display = 'inline-block';
            this.resumeBtn.style.display = 'none';
        }
    }

    updateTimerDisplay() {
        let hours = Math.floor(this.totalSeconds / 3600);
        let minutes = Math.floor((this.totalSeconds % 3600) / 60);
        let seconds = this.totalSeconds % 60;

        hours = String(hours).padStart(2, '0');
        minutes = String(minutes).padStart(2, '0');
        seconds = String(seconds).padStart(2, '0');

        this.timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
        this.updatePriceDisplay();
    }

    updatePriceDisplay() {
        let price = 0;
        if (this.letra === 'A') {
            if (this.totalSeconds >= 14400) {
                price = 13000;
            } else if (this.totalSeconds >= 13200) {
                price = 12100;
            } else if (this.totalSeconds >= 12600) {
                price = 11600;
            } else if (this.totalSeconds >= 11700) {
                price = 10800;
            } else if (this.totalSeconds >= 10800) {
                price = 9900;
            } else if (this.totalSeconds >= 9600) {
                price = 8800;
            } else if (this.totalSeconds >= 9000) {
                price = 8300;
            } else if (this.totalSeconds >= 8100) {
                price = 7500;
            } else if (this.totalSeconds >= 7200) {
                price = 6600;
            } else if (this.totalSeconds >= 6000) {
                price = 5500;
            } else if (this.totalSeconds >= 5400) {
                price = 5000;
            } else if (this.totalSeconds >= 4500) {
                price = 4200;
            } else if (this.totalSeconds >= 3600) {
                price = 3300;
            }
        } else if (this.letra === 'C') {
            if (this.totalSeconds >= 14400) {
                price = 19000;
            } else if (this.totalSeconds >= 13200) {
                price = 17600;
            } else if (this.totalSeconds >= 12600) {
                price = 16800;
            } else if (this.totalSeconds >= 11700) {
                price = 15600;
            } else if (this.totalSeconds >= 10800) {
                price = 14400;
            } else if (this.totalSeconds >= 9600) {
                price = 12800;
            } else if (this.totalSeconds >= 9000) {
                price = 12000;
            } else if (this.totalSeconds >= 8100) {
                price = 10800;
            } else if (this.totalSeconds >= 7200) {
                price = 9600;
            } else if (this.totalSeconds >= 6000) {
                price = 8000;
            } else if (this.totalSeconds >= 5400) {
                price = 7200;
            } else if (this.totalSeconds >= 4500) {
                price = 6000;
            } else if (this.totalSeconds >= 3600) {
                price = 4800;
            }
        }
        this.priceDisplay.textContent = `Precio: $${price}`;
    }

    startTimer(updateStorage = true) {
        if (this.timerInterval) return;
        if (!this.lastStart) {
            this.lastStart = Date.now(); // Registra el tiempo de inicio si no está registrado
        }
    
        this.timerInterval = setInterval(() => {
            const now = Date.now();
            this.totalSeconds = Math.floor((now - this.lastStart) / 1000);
            this.updateTimerDisplay();
            if (updateStorage) {
                this.saveToLocalStorage();
            }
        }, 1000);
        
        this.isPaused = false;
    
        this.pauseBtn.style.display = 'inline-block';
        this.resumeBtn.style.display = 'none';
    
        if (updateStorage) {
            this.saveToLocalStorage();
        }
    }
    
    
    
    

    pauseTimer() {
        if (!this.timerInterval) return;
        clearInterval(this.timerInterval); 
        this.timerInterval = null;
        this.isPaused = true;
    
        this.pauseBtn.style.display = 'none';
        this.resumeBtn.style.display = 'inline-block';
    
        this.saveToLocalStorage();
    }

    resumeTimer() {
        if (this.timerInterval || !this.isPaused) return;
        this.lastStart = Date.now() - (this.totalSeconds * 1000); // Ajusta `lastStart` según el tiempo acumulado
        this.timerInterval = setInterval(() => {
            const now = Date.now();
            this.totalSeconds = Math.floor((now - this.lastStart) / 1000);
            this.updateTimerDisplay();
            this.saveToLocalStorage();
        }, 1000);
        
        this.isPaused = false;
    
        this.pauseBtn.style.display = 'inline-block';
        this.resumeBtn.style.display = 'none';
    }
    
    

    resetTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.timerInterval = null;
        this.totalSeconds = 0;
        this.isPaused = true;
        this.lastStart = null;
    
        this.updateTimerDisplay();
        this.updateButtons();
    
        this.saveToLocalStorage();
    }

    deleteVehicle() {
        const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar el vehículo con patente ${this.patente}?`);
        if (!confirmDelete) return;

        if (this.timerInterval) {
            cancelAnimationFrame(this.timerInterval);
        }

        freePrefix(this.patente);
        this.vehicleElement.remove();

        const vehicles = JSON.parse(localStorage.getItem('vehicles')) || {};
        delete vehicles[this.patente];
        localStorage.setItem('vehicles', JSON.stringify(vehicles));

        console.log(`Vehículo eliminado: ${this.patente}`);
    }

    saveToLocalStorage() {
        const vehicles = JSON.parse(localStorage.getItem('vehicles')) || {};

        vehicles[this.patente] = {
            totalSeconds: this.totalSeconds,
            isPaused: this.isPaused,
            lastStart: this.lastStart,
            createdAt: this.createdAt
        };

        localStorage.setItem('vehicles', JSON.stringify(vehicles));
    }
}

// Función actualizada para obtener el siguiente prefijo
function getNextPrefix(digits) {
    const patenteKey = digits;
    const availablePrefixes = JSON.parse(localStorage.getItem('availablePrefixes')) || {};

    if (availablePrefixes[patenteKey] && availablePrefixes[patenteKey].length > 0) {
        const prefix = Math.min(...availablePrefixes[patenteKey]);
        console.log(`Asignando prefijo disponible: ${prefix}-${digits}`);
        availablePrefixes[patenteKey] = availablePrefixes[patenteKey].filter(p => p !== prefix);
        localStorage.setItem('availablePrefixes', JSON.stringify(availablePrefixes));
        return prefix;
    } else {
        const vehiclesData = JSON.parse(localStorage.getItem('vehicles')) || {};
        let maxPrefix = 0;

        for (const patente in vehiclesData) {
            if (vehiclesData.hasOwnProperty(patente)) {
                const [prefix, resto] = patente.split('-');
                const patenteDigits = resto.slice(0, 3);
                if (patenteDigits === digits) {
                    maxPrefix = Math.max(maxPrefix, parseInt(prefix, 10));
                }
            }
        }
        const nextPrefix = maxPrefix + 1;
        console.log(`Asignando nuevo prefijo: ${nextPrefix}-${digits}`);
        return nextPrefix;
    }
}

// Función actualizada para liberar un prefijo
function freePrefix(patente) {
    const [prefix, resto] = patente.split('-');
    const digits = resto.slice(0, 3);
    const patenteKey = digits;

    const availablePrefixes = JSON.parse(localStorage.getItem('availablePrefixes')) || {};
    if (!availablePrefixes[patenteKey]) {
        availablePrefixes[patenteKey] = [];
    }
    availablePrefixes[patenteKey].push(parseInt(prefix, 10));

    localStorage.setItem('availablePrefixes', JSON.stringify(availablePrefixes));
}

// Evento actualizado para agregar vehículo
document.getElementById('agregarVehiculo').addEventListener('click', () => {
    const patenteInput = document.getElementById('patente');
    let patente = patenteInput.value.trim().toUpperCase();

    if (patente === "") {
        alert("Por favor, ingresa un número de patente.");
        return;
    }

    const patenteRegex = /^\d{3}[AC]$/;
    if (!patenteRegex.test(patente)) {
        alert("Formato de patente inválido. Debe ser tres dígitos seguidos de la letra 'A' o 'C' (ejemplo: 123A).");
        return;
    }

    const digits = patente.slice(0, 3);
    const letter = patente.slice(3);
    const prefix = getNextPrefix(digits);
    const fullPatente = `${prefix}-${digits}${letter}`;

    const vehiclesData = JSON.parse(localStorage.getItem('vehicles')) || {};
    if (vehiclesData.hasOwnProperty(fullPatente)) {
        alert("Este vehículo ya ha sido agregado.");
        return;
    }

    const newVehicle = new VehicleTimer(fullPatente);
    newVehicle.startTimer();

    vehiclesData[fullPatente] = {
        totalSeconds: newVehicle.totalSeconds,
        isPaused: newVehicle.isPaused,
        lastStart: newVehicle.lastStart,
        createdAt: newVehicle.createdAt
    };
    localStorage.setItem('vehicles', JSON.stringify(vehiclesData));

    patenteInput.value = "";
});

// Cargar vehículos guardados al iniciar la página
window.addEventListener('load', () => {
    const vehiclesData = JSON.parse(localStorage.getItem('vehicles')) || {};

    for (const patente in vehiclesData) {
        const vehicleData = vehiclesData[patente];
        const vehicle = new VehicleTimer(patente, vehicleData);
        if (!vehicle.isPaused) {
            vehicle.startTimer(false); // Iniciar el temporizador para aquellos que no estén pausados
        }
    }
});