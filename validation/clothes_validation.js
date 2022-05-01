function checkTextInput(input, inputName) {
    input = input.trim();
    if (!input) throw `Error: ${inputName} is empty`;
    return input;
}

function checkFileInput(input, inputName) {
    input = input.trim();
    if (!input) throw `Error: ${inputName} has not been selected`;
    return input;
}

function checkSelectInput(input, inputName) {
    input = input.trim();
    if (input === 'null') throw `Error: ${inputName} is empty`;
    return input;
}

function checkListInput(input, inputName) {
    if (!Array.isArray(input)) throw `Error: ${inputName} must be an array`;
    input.forEach(element => {
        element = element.trim().toLowerCase();
        if (!element) throw `Error: ${inputName} contains empty elements`;
    });
    return input;
}

function checkCheckboxInput(input, inputName, acceptableValues) {
    if (!Array.isArray(input)) throw `Error: ${inputName} must be an array`;
    input.forEach(element => {
        element = element.trim().toLowerCase();
        if (!acceptableValues.includes(element)) throw `Error: ${inputName} contains invalid inputs.`;
    });
    return input;
}

module.exports = {
    checkCheckboxInput,
    checkFileInput,
    checkListInput,
    checkSelectInput,
    checkTextInput,
}