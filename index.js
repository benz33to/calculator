const display = document.querySelector('#display');
const history = document.querySelector('#history');
const buttonsContainer = document.querySelector('.calculator-buttons');
let operator1 = "";
let operator2 = "";
let operandAction = null;
let resolved = false;
let operation = "";

const calculatorButtons = {
    reset: {
        value: "C", type: "action", classes: ["button", "operand"], action: null, keyCode: 46,
    },
    divide: {
        value: "/", type: "operand", classes: ["button", "operand"], action: (operator1, operator2) => (operator1 / operator2), keyCode: 111,
    },
    multiply: {
        value: "*", type: "operand", classes: ["button", "operand"], action: (operator1, operator2) => (operator1 * operator2), keyCode: 106,
    },
    subtract: {
        value: "-", type: "operand", classes: ["button", "operand"], action: (operator1, operator2) => (operator1 - operator2), keyCode: 109,
    },
    seven: {
        value: 7, type: "operator", classes: ["button", "operator"], action: null, keyCode: 103,
    },
    eight: {
        value: 8, type: "operator", classes: ["button", "operator"], action: null, keyCode: 104,
    },
    nine: {
        value: 9, type: "operator", classes: ["button", "operator"], action: null, keyCode: 105,
    },
    add: {
        value: "+", type: "operand", classes: ["button", "operand"], action: (operator1, operator2) => (operator1 + operator2), keyCode: 107,
    },
    four: {
        value: 4, type: "operator", classes: ["button", "operator"], action: null, keyCode: 100,
    },
    five: {
        value: 5, type: "operator", classes: ["button", "operator"], action: null, keyCode: 101,
    },
    six: {
        value: 6, type: "operator", classes: ["button", "operator"], action: null, keyCode: 102,
    },
    equals: {
        value: "=", type: "action", classes: ["button", "equals", "grid-row-span-2"], action: (result) => display.innerText = result, keyCode: 13,
    },
    one: {
        value: 1, type: "operator", classes: ["button", "operator"], action: null, keyCode: 97,
    },
    two: {
        value: 2, type: "operator", classes: ["button", "operator"], action: null, keyCode: 98,
    },
    three: {
        value: 3, type: "operator", classes: ["button", "operator"], action: null, keyCode: 99,
    },
    zero: {
        value: 0, type: "operator", classes: ["button", "operator", "grid-row-span-3"], action: null, keyCode: 96,
    },
    comma: {
        value: ".", type: "operator", classes: ["button", "operator"], action: null, keyCode: 110,
    },
}

function generateCalculator() {
    for (button in calculatorButtons) {
        const newButton = getNewButton(button);
        newButton.addEventListener('click', onButtonPressed);
        newButton.addEventListener('transitionend', removeTransition)
        buttonsContainer.appendChild(newButton);
    };
    addEventListener('keydown', onButtonPressed);
}

function removeTransition(e) {
    if (e.propertyName !== 'transform') return;
    this.classList.remove('pressed');
}

function onButtonPressed(event) {
    const button = event.keyCode
        ? document.querySelector(`div[data-key="${event.keyCode}"]`)
        : event.target;
    if (!button) {
        return;
    }
    button.classList.add('pressed');
    const buttonPressed = button.getAttribute("data-button");
    const buttonPressedType = calculatorButtons[buttonPressed].type;
    if ((buttonPressed === 'equals' || buttonPressedType === 'operand') && operator1 === "") {
        return;
    }
    buttonPressedType === 'operator'
        ? setOperators(buttonPressed)
        : buttonPressedType === 'operand'
            ? setOperand(buttonPressed)
            : doAction(buttonPressed);
}

function getNewButton(button) {
    const newButton = document.createElement('div');
    const classList = calculatorButtons[button].classes;
    newButton.innerText = calculatorButtons[button].value;
    newButton.setAttribute('data-button', button);
    newButton.setAttribute('data-key', calculatorButtons[button].keyCode);
    newButton.classList.add(...classList);
    return newButton;
}

function setOperators(buttonPressed) {
    const valueToAdd = calculatorButtons[buttonPressed].value;
    setNewOperation(valueToAdd.toString());
};

function setNewOperation(valueToAdd) {
    if (resolved && operandAction === null) {
        operator1 = valueToAdd;
        resolved = false;
        updateDisplay(operator1);
        return;
    }
    if (operandAction === null) {
        operator1 += valueToAdd;
        updateDisplay(operator1);
    } else {
        operator2 += valueToAdd;
        updateDisplay(operator2);
    }
};

function setOperand(buttonPressed) {
    if (operandAction) {
        return;
    }
    const operand = calculatorButtons[buttonPressed].value;
    operandAction = calculatorButtons[buttonPressed].action;
    operation = buttonPressed;
    updateDisplay(operand);
};

function doAction(buttonPressed) {
    if (buttonPressed === 'reset') {
        initialize();
    }
    if (buttonPressed === 'equals') {
        operate(operator1, operator2, operandAction);
    }
};

function initialize(number = null) {
    resolved = number ? true : false;
    operator1 = number ? number.toString() : "";
    operator2 = "";
    operandAction = null;
    operation = "";
    number === null && resetHistory();
    updateDisplay(number || 0);
};

function operate(operator1, operator2, operandAction) {
    if (operator1 === "" || operator2 === "" || !operandAction) {  //Do nothing if operators or operand misses
        return;
    }
    if (operation === 'divide' &&  +operator2 === 0) {
        alert(`Can't divide by ${operator2}`);
        initialize();
        return;
    }
    const result = parseFloat(operandAction(Number(operator1), Number(operator2)).toFixed(4));
    const operationSign = calculatorButtons[operation].value;
    updateHistory(operator1, operator2, operationSign);
    initialize(result);
};

function updateDisplay(value) {
    display.innerText = value;
};

function updateHistory(operator1, operator2, operand) {
    history.innerText = `${operator1} ${operand} ${operator2} =`;
}

function resetHistory() {
    history.innerText = "";
}

generateCalculator();

// TO-DO: Calculation history