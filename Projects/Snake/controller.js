
const joystickBase = document.getElementById('joystickBase');
const joystickKnob = document.getElementById('joystickKnob');
let joystickActive = false;
let knobX = 0;
let knobY = 0;


const threshold = 20;

joystickKnob.addEventListener('mousedown', startJoystick);
joystickKnob.addEventListener('touchstart', startJoystick);

document.addEventListener('mousemove', moveJoystick);
document.addEventListener('touchmove', moveJoystick);

document.addEventListener('mouseup', endJoystick);
document.addEventListener('touchend', endJoystick);

function startJoystick(event) {
    event.preventDefault();
    joystickActive = true;
    joystickKnob.classList.add('active');
}

function moveJoystick(event) {
    if (!joystickActive) return;

    let clientX, clientY;
    if (event.type.startsWith('mouse')) {
        clientX = event.clientX;
        clientY = event.clientY;
    } else if (event.type.startsWith('touch')) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    }

    const rect = joystickBase.getBoundingClientRect();
    knobX = clientX - rect.left - rect.width / 2;
    knobY = clientY - rect.top - rect.height / 2;

    const distance = Math.sqrt(knobX * knobX + knobY * knobY);
    const maxDistance = rect.width / 2 - joystickKnob.offsetWidth / 2;

    if (distance > maxDistance) {
        knobX = (knobX / distance) * maxDistance;
        knobY = (knobY / distance) * maxDistance;
    }

    joystickKnob.style.transform = `translate(${knobX}px, ${knobY}px)`;

    // Determine direction based on knob position
    if (Math.abs(knobX) > Math.abs(knobY)) {
        if (knobX > threshold) {
            direction = 'RIGHT';
        } else if (knobX < -threshold) {
            direction = 'LEFT';
        }
    } else {
        if (knobY > threshold) {
            direction = 'DOWN';
        } else if (knobY < -threshold) {
            direction = 'UP';
        }
    }
}

function endJoystick() {
    if (!joystickActive) return;
    joystickActive = false;
    joystickKnob.classList.remove('active');
    joystickKnob.style.transform = `translate(0px, 0px)`;
    knobX = 0;
    knobY = 0;
}
