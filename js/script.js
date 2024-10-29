// Clase para manejar cada vehículo
class VehicleTimer {
    constructor(patente, savedData = null) {
        this.patente = patente;
        this.totalSeconds = 0;
        this.timerInterval = null;
        this.isPaused = false;
        this.lastStart = null; // Timestamp cuando se inició o reanudó el temporizador
        this.createdAt = null; // Hora de creación
        this.note = savedData?.note || '';
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

        this.noteInput = document.createElement('textarea');
        this.noteInput.placeholder = 'Añadir una nota...';
        this.noteInput.value = this.note;
        this.noteInput.addEventListener('input', () => this.saveToLocalStorage());

        this.vehicleElement.appendChild(this.noteInput);

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
        this.pauseBtn.textContent = 'Pausar';
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
            if (this.totalSeconds >= 14400) {/*04:00:00*/
                price = 13000;
            } else if (this.totalSeconds >= 14100) {/*03:55:00*/
                price = 13000;
            } else if (this.totalSeconds >= 13800) {/*03:50:00*/
                price = 12700;
            } else if (this.totalSeconds >= 13500) {/*03:45:00*/
                price = 12400;
            } else if (this.totalSeconds >= 13200) {/*03:40:00*/
                price = 12100;
            } else if (this.totalSeconds >= 12900) {/*03:35:00*/
                price = 11900;
            } else if (this.totalSeconds >= 12600) {/*03:30:00*/
                price = 11600;
            } else if (this.totalSeconds >= 12300) {/*03:25:00*/
                price = 11400;
            } else if (this.totalSeconds >= 12000) {/*03:20:00*/
                price = 11000;
            } else if (this.totalSeconds >= 11700) {/*03:15:00*/
                price = 10800;
            } else if (this.totalSeconds >= 11400) {/*03:10:00*/
                price = 10500;
            } else if (this.totalSeconds >= 11100) {/*03:05:00*/
                price = 10200;
            } else if (this.totalSeconds >= 10800) {/*03:00:00*/
                price = 9900;
            } else if (this.totalSeconds >= 10500) {/*02:55:00*/
                price = 9700;
            } else if (this.totalSeconds >= 10200) {/*02:50:00*/
                price = 9400;
            } else if (this.totalSeconds >=  9900) {/*02:45:00*/
                price = 9100;
            } else if (this.totalSeconds >= 9600) {/*02:40:00*/
                price = 8800;
            } else if (this.totalSeconds >= 9300) {/*02:35:00*/
                price = 8600;
            } else if (this.totalSeconds >= 9000) {/*02:30:00*/
                price = 8300;
            } else if (this.totalSeconds >= 8700) {/*02:25:00*/
                price = 8100;
            } else if (this.totalSeconds >= 8400) {/*02:20:00*/
                price = 7800;
            } else if (this.totalSeconds >= 8100) {/*02:15:00*/
                price = 7500;
            } else if (this.totalSeconds >= 7800) {/*02:10:00*/
                price = 7200;
            } else if (this.totalSeconds >= 7500) {/*02:05:00*/
                price = 6900;
            } else if (this.totalSeconds >= 7200) {/*02:00:00*/
                price = 6600;
            } else if (this.totalSeconds >= 6900) {/*01:55:00*/
                price = 6400;
            } else if (this.totalSeconds >= 6600) {/*01:50:00*/
                price = 6100;
            } else if (this.totalSeconds >= 6300) {/*01:45:00*/
                price = 5800;
            } else if (this.totalSeconds >= 6000) {/*01:40:00*/
                price = 5500;
            } else if (this.totalSeconds >= 5700) {/*01:35:00*/
                price = 5300;
            } else if (this.totalSeconds >= 5400) { /*01:30:00*/
                price = 5000;
            } else if (this.totalSeconds >= 5100) { /*01:25:00*/
                price = 4800;
            } else if (this.totalSeconds >= 4800) { /*01:20:00*/
                price = 4500;
            } else if (this.totalSeconds >= 4500) { /*01:15:00*/
                price = 4200;
            } else if (this.totalSeconds >= 4200) { /*01:10:00*/
                price = 3900;
            } else if (this.totalSeconds >= 3900) { /*01:05:00*/
                price = 3600;
            } else if (this.totalSeconds >= 0) {/*00:00:00*/
                price = 3300;
            }
        } else if (this.letra === 'C') {
            if (this.totalSeconds >= 14400) {
                price = 19000;
            } else if (this.totalSeconds >= 14100) {/*03:55:00*/
                price = 18800;
            } else if (this.totalSeconds >= 13800) {/*03:50:00*/
                price = 18400;
            } else if (this.totalSeconds >= 13500) {/*03:45:00*/
                price = 18000;
            } else if (this.totalSeconds >= 13200) {/*03:40:00*/
                price = 17600;
            } else if (this.totalSeconds >= 12900) {/*03:35:00*/
                price = 17200;
            } else if (this.totalSeconds >= 12600) {/*03:30:00*/
                price = 16800;
            } else if (this.totalSeconds >= 12300) {/*03:25:00*/
                price = 16400;
            } else if (this.totalSeconds >= 12000) {/*03:20:00*/
                price = 16000;
            } else if (this.totalSeconds >= 11700) {/*03:15:00*/
                price = 15600;
            } else if (this.totalSeconds >= 11400) {/*03:10:00*/
                price = 15200;
            } else if (this.totalSeconds >= 11100) {/*03:05:00*/
                price = 14800;
            } else if (this.totalSeconds >= 10800) {/*03:00:00*/
                price = 14400;
            } else if (this.totalSeconds >= 10500) {/*02:55:00*/
                price = 14000;
            } else if (this.totalSeconds >= 10200) {/*02:50:00*/
                price = 13600;
            } else if (this.totalSeconds >=  9900) {/*02:45:00*/
                price = 13200;
            } else if (this.totalSeconds >= 9600) {/*02:40:00*/
                price = 12800;
            } else if (this.totalSeconds >= 9300) {/*02:35:00*/
                price = 12400;
            } else if (this.totalSeconds >= 9000) {/*02:30:00*/
                price = 12000;
            } else if (this.totalSeconds >= 8700) {/*02:25:00*/
                price = 11600;
            } else if (this.totalSeconds >= 8400) {/*02:20:00*/
                price = 11200;
            } else if (this.totalSeconds >= 8100) {/*02:15:00*/
                price = 10800;
            } else if (this.totalSeconds >= 7800) {/*02:10:00*/
                price = 10400;
            } else if (this.totalSeconds >= 7500) {/*02:05:00*/
                price = 10000;
            } else if (this.totalSeconds >= 7200) {/*02:00:00*/
                price = 9600;
            } else if (this.totalSeconds >= 6900) {/*01:55:00*/
                price = 9200;
            } else if (this.totalSeconds >= 6600) {/*01:50:00*/
                price = 8800;
            } else if (this.totalSeconds >= 6300) {/*01:45:00*/
                price = 8400;
            } else if (this.totalSeconds >= 6000) {/*01:40:00*/
                price = 8000;
            } else if (this.totalSeconds >= 5700) {/*01:35:00*/
                price = 7600;
            } else if (this.totalSeconds >= 5400) { /*01:30:00*/
                price = 7200;
            } else if (this.totalSeconds >= 5100) { /*01:25:00*/
                price = 6800;
            } else if (this.totalSeconds >= 4800) { /*01:20:00*/
                price = 6400;
            } else if (this.totalSeconds >= 4500) { /*01:15:00*/
                price = 6000;
            } else if (this.totalSeconds >= 4200) { /*01:10:00*/
                price = 5600;
            } else if (this.totalSeconds >= 3900) { /*01:05:00*/
                price = 5200;
            } else if (this.totalSeconds >= 0) {/*00:00:00*/
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
            console.log("Total Seconds: ", this.totalSeconds); // Log para verificar los segundos transcurridos
            this.updateTimerDisplay(); // Asegúrate de que esto se llame aquí
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
            createdAt: this.createdAt,
            note: this.noteInput.value // Guardar la nota
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

// Crear el input de búsqueda debajo del botón "Agregar Vehículo"
const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.placeholder = 'Buscar';
searchInput.classList.add('search-input');
document.getElementById('vehiclesSection').before(searchInput);


// Evento para buscar y filtrar vehículos por patente
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim().toUpperCase();
    const vehicles = document.querySelectorAll('.vehicle');

    vehicles.forEach(vehicle => {
        const patente = vehicle.querySelector('.vehicle-header h2').textContent;
        if (patente.includes(searchTerm)) {
            vehicle.style.display = 'block';
        } else {
            vehicle.style.display = 'none';
        }
    });
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
