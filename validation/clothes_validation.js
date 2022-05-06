function checkTextInput(input, inputName) {
    if (!input) throw `Error: ${inputName} is required`;
    if (typeof input !== 'string') throw `Error: ${inputName} must be a string`;
    input = input.trim();
    if (!input) throw `Error: ${inputName} is empty`;
    return input;
}

function checkNumericTextInput(input, inputName, convert) {
    if (!input) throw `Error: ${inputName} is required`;
    if (typeof input !== 'string') throw `Error: ${inputName} must be a string`;
    input = input.trim();
    if (!input) throw `Error: ${inputName} is empty`;

    parse_input = parseInt(input)

    if(isNaN(parse_input) || !Number.isInteger(parse_input)){
        throw `Error ${inputName} cannot be converted to an integer`
    }
    if(!convert){
        return input
    }
    else{
        return parse_input;
    }
}

function checkFileInput(input, inputName) {
    if (!input) throw `Error: ${inputName} is required`;
    if (typeof input !== 'string') throw `Error: ${inputName} must be a string`;
    input = input.trim();
    if (!input) throw `Error: ${inputName} has not been selected`;
    return input;
}

function checkSelectInput(input, inputName, acceptableValues) {
    if (!input) throw `Error: ${inputName} is required`;
    if (typeof input !== 'string') throw `Error: ${inputName} must be a string`;
    input = input.trim();
    if (input === 'null') throw `Error: ${inputName} is empty`;
    if (!acceptableValues.includes(input)) throw `Error: ${inputName} contains invalid inputs.`;
    return input;
}

function checkListInput(input, inputName) {
    if (!input) throw `Error: ${inputName} is empty`;
    if (!Array.isArray(input)) throw `Error: ${inputName} must be an array`;
    input.forEach(element => {
        element = element.trim().toLowerCase();
        if (!element) throw `Error: ${inputName} contains empty elements`;
    });
    return input;
}

function checkCheckboxInput(input, inputName, acceptableValues) {
    if (!input) throw `Error: ${inputName} is empty`;
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
    checkNumericTextInput
}