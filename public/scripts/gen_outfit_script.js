const nameDiv = document.getElementById('name-div')
const nameInput = document.getElementById('name-input');
const colorPatternList = document.getElementById('colors-patterns-list');
const colorPatternInput = document.getElementById('colors-patterns-input');
const colorPatternBtn = document.getElementById('colors-patterns-btn');
const stylesList = document.getElementById('styles-list');
const stylesInput = document.getElementById('styles-input');
const stylesBtn = document.getElementById('styles-btn');
const submitBtn = document.getElementById('submit-btn');
const form = document.getElementById('generate-outfit-form');


if (colorPatternBtn) {
    colorPatternBtn.addEventListener("click", function() {
        addToList(colorPatternInput, colorPatternList, 'colors-patterns[]');
    });
}

if (colorPatternInput) {
    colorPatternInput.addEventListener('keydown', (event) => {
        if (event.key == 'Enter') {
            event.preventDefault();
            addToList(colorPatternInput, colorPatternList, 'colors-patterns[]');
        }
    });
}

if (stylesBtn) {
    stylesBtn.addEventListener("click", function() {
        addToList(stylesInput, stylesList, 'styles[]');
    });
}

if (stylesInput) {
    stylesInput.addEventListener('keydown', (event) => {
        if (event.key == 'Enter') {
            event.preventDefault();
            addToList(stylesInput, stylesList, 'styles[]');
        }
    });
}

if (form) {
    form.addEventListener("submit", (event) => {
        try {
            nameInput.classList.remove('error-input');

            let errors = document.getElementsByClassName('error-message');
            while (errors.length > 0) {
                errors[0].remove();
            }

            let nameValue = nameInput.value.trim();
            if (!nameValue) {
                let error = document.createElement('p');
                error.classList.add('error-message');
                error.innerHTML = 'Outfit Name is Required';
                nameInput.classList.add('error-input');
                nameDiv.append(error);
            }
            
            if (document.getElementsByClassName('error-message').length > 0) throw 'Error';
        } catch (e) {
            event.preventDefault();
        }
    });
}

function addToList(input, list, listName) {
    let inputValue = input.value.trim();
    if (inputValue) {
        let btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('class', 'chip-btn');
        btn.setAttribute('aria-label', 'delete ' + inputValue);
        btn.setAttribute('title', 'delete ' + inputValue);

        btn.addEventListener('click', removeFromList)

        let icon = document.createElement('i');
        icon.setAttribute('class', 'fa-solid fa-circle-xmark');

        let liItem = document.createElement('li')
        liItem.innerHTML = inputValue;
        let hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', listName);
        hiddenInput.setAttribute('value', inputValue);
        btn.appendChild(icon);
        liItem.appendChild(hiddenInput);
        liItem.appendChild(btn);
        list.appendChild(liItem);
        input.value = "";
        input.focus();
    }
}

function removeFromList() {
    this.parentElement.remove();
}