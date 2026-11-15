// State variables
let currentValue = '0';
let previousValue = '';
let currentOperator = null;
let shouldResetDisplay = false;

const displayEl = document.getElementById('display');
const prevDisplayEl = document.getElementById('prev-display');
const clearBtn = document.getElementById('clear-btn');
const particleContainer = document.getElementById('particle-container');

function createFlyingParticle(text, color, sourceElement) {
    const particle = document.createElement('div');
    particle.className = 'flying-particle';
    particle.textContent = text;
    particle.style.color = color;

    // Get source element coordinates for burst point
    const rect = sourceElement.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;

    // Calculate random trajectory parameters
    const angle = (Math.random() * 360) * (Math.PI / 180);
    const distance = 180 + Math.random() * 260; // Flying distance
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 80; // Upward bias
    const rot = (Math.random() - 0.5) * 90; // Rotation

    // Set CSS variables for animation trajectory
    particle.style.setProperty('--dx', `${dx}px`);
    particle.style.setProperty('--dy', `${dy}px`);
    particle.style.setProperty('--rot', `${rot}deg`);

    // Adjust particle font size based on text length
    if (text.length > 2) {
        particle.style.fontSize = '2.2rem';
    } else {
        particle.style.fontSize = '3.5rem';
    }

    particleContainer.appendChild(particle);

    // Clean up DOM node after animation completes
    setTimeout(() => {
        particle.remove();
    }, 1200);
}

function updateDisplay() {
    // Adjust display text size for long digits
    if (currentValue.length > 8) {
        displayEl.style.fontSize = '2.2rem';
    } else if (currentValue.length > 5) {
        displayEl.style.fontSize = '2.7rem';
    } else {
        displayEl.style.fontSize = '3.2rem';
    }

    displayEl.textContent = currentValue;

    // Update Clear button label (C or AC)
    if (currentValue !== '0' || previousValue !== '') {
        clearBtn.textContent = 'C';
    } else {
        clearBtn.textContent = 'AC';
    }

    // Update operator display string
    if (currentOperator) {
        const opSymbol = getOperatorSymbol(currentOperator);
        prevDisplayEl.textContent = `${previousValue} ${opSymbol}`;
    } else {
        prevDisplayEl.textContent = '';
    }
}

function getOperatorSymbol(op) {
    switch (op) {
        case '+': return '+';
        case '-': return '−';
        case '*': return '×';
        case '/': return '÷';
        default: return '';
    }
}

function handleNumber(numStr, element) {
    if (shouldResetDisplay) {
        currentValue = numStr === '.' ? '0.' : numStr;
        shouldResetDisplay = false;
    } else {
        if (numStr === '.') {
            if (!currentValue.includes('.')) {
                currentValue += '.';
            }
        } else {
            if (currentValue === '0') {
                currentValue = numStr;
            } else {
                currentValue += numStr;
            }
        }
    }
    updateDisplay();

    // Trigger flying particle effect (White/Cyan glow for numbers)
    createFlyingParticle(numStr, '#ffffff', element);
}

function handleOperator(op, element) {
    if (currentOperator && !shouldResetDisplay) {
        compute();
    }

    previousValue = currentValue;
    currentOperator = op;
    shouldResetDisplay = true;
    updateDisplay();

    // Trigger flying particle effect (Orange glow for operators)
    createFlyingParticle(getOperatorSymbol(op), '#ff9f0a', element);
}

function compute() {
    let computation;
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);

    if (isNaN(prev) || isNaN(current)) return;

    switch (currentOperator) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            computation = current === 0 ? 'خطأ' : prev / current;
            break;
        default:
            return;
    }

    // Round precision issues
    if (typeof computation === 'number') {
        computation = Math.round(computation * 1e8) / 1e8;
    }

    currentValue = String(computation);
    currentOperator = null;
    previousValue = '';
    shouldResetDisplay = true;
    updateDisplay();
}

function handleClear(element) {
    if (currentValue !== '0') {
        currentValue = '0';
    } else {
        previousValue = '';
        currentOperator = null;
    }
    updateDisplay();
    createFlyingParticle('C', '#a5a5a5', element);
}

function handlePercent(element) {
    const current = parseFloat(currentValue);
    if (!isNaN(current)) {
        currentValue = String(current / 100);
        updateDisplay();
        createFlyingParticle('%', '#636875', element);
    }
}

function handleToggleSign(element) {
    const current = parseFloat(currentValue);
    if (!isNaN(current) && current !== 0) {
        currentValue = String(current * -1);
        updateDisplay();
        createFlyingParticle('±', '#636875', element);
    }
}

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const action = button.dataset.action;
        const val = button.dataset.val;

        if (!action) {
            handleNumber(val, button);
        } else if (action === 'operator') {
            handleOperator(val, button);
        } else if (action === 'calculate') {
            if (currentOperator) {
                const resultText = currentValue;
                compute();
                createFlyingParticle('=', '#ff9f0a', button);
            }
        } else if (action === 'clear') {
            handleClear(button);
        } else if (action === 'percent') {
            handlePercent(button);
        } else if (action === 'toggle-sign') {
            handleToggleSign(button);
        }
    });
});

// Physical Keyboard Support
window.addEventListener('keydown', (e) => {
    let targetBtn = null;

    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        targetBtn = document.querySelector(`.btn[data-val="${e.key}"]`);
        if (targetBtn) handleNumber(e.key, targetBtn);
    } else if (e.key === '+') {
        targetBtn = document.querySelector(`.btn[data-val="+"]`);
        if (targetBtn) handleOperator('+', targetBtn);
    } else if (e.key === '-') {
        targetBtn = document.querySelector(`.btn[data-val="-"]`);
        if (targetBtn) handleOperator('-', targetBtn);
    } else if (e.key === '*') {
        targetBtn = document.querySelector(`.btn[data-val="*"]`);
        if (targetBtn) handleOperator('*', targetBtn);
    } else if (e.key === '/') {
        e.preventDefault();
        targetBtn = document.querySelector(`.btn[data-val="/"]`);
        if (targetBtn) handleOperator('/', targetBtn);
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        targetBtn = document.querySelector(`.btn[data-action="calculate"]`);
        if (targetBtn) {
            compute();
            createFlyingParticle('=', '#ff9f0a', targetBtn);
        }
    } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        targetBtn = document.getElementById('clear-btn');
        if (targetBtn) handleClear(targetBtn);
    } else if (e.key === '%') {
        targetBtn = document.querySelector(`.btn[data-action="percent"]`);
        if (targetBtn) handlePercent(targetBtn);
    }

    // Visual active button trigger
    if (targetBtn) {
        targetBtn.classList.add('active');
        setTimeout(() => targetBtn.classList.remove('active'), 120);
    }
});