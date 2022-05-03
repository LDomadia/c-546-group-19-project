const image = document.getElementById('placeholder-img');
const imageDiv = document.getElementById('img-div')
const imageBtn = document.getElementById('img-btn');
const nameDiv = document.getElementById('name-div')
const nameInput = document.getElementById('name-input');
const typeDiv = document.getElementById('type-div');
const typeInput = document.getElementById('type-input');
const sizeDiv = document.getElementById('size-div');
const sizeInput = document.getElementById('size-input');
const colorPatternDiv = document.getElementById('colors-patterns-div');
const colorPatternList = document.getElementById('colors-patterns-list');
const colorPatternInput = document.getElementById('colors-patterns-input');
const colorPatternBtn = document.getElementById('colors-patterns-btn');
const stylesDiv = document.getElementById('styles-div');
const stylesList = document.getElementById('styles-list');
const stylesInput = document.getElementById('styles-input');
const brandDiv = document.getElementById('brand-div');
const brandInput = document.getElementById('brand-input');
const stylesBtn = document.getElementById('styles-btn');
const submitBtn = document.getElementById('submit-btn');
const form = document.getElementById('new-clothing-form');
const chips = document.getElementsByClassName('chip-btn')

if (imageBtn) {
    imageBtn.addEventListener("change", function() {
        changeImage(this);
    });
}

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

if (chips) {
    for (let i = 0; i < chips.length; i++) {
        chips[i].addEventListener('click', removeFromList);
    }
}

if (form) {
    form.addEventListener("submit", (event) => {
        try {
            let errorInputs = document.getElementsByClassName('error-input');
            while (errorInputs.length > 0) {
                errorInputs[0].classList.remove('error-input');
            }

            let errorsMessages = document.getElementsByClassName('error-message');
            while (errorsMessages.length > 0) {
                errorsMessages[0].remove();
            }

            let nameValue = nameInput.value.trim();
            if (!nameValue) {
                let error = document.createElement('p');
                error.classList.add('error-message');
                error.innerHTML = 'Clothing Name is Required';
                nameInput.classList.add('error-input');
                nameDiv.append(error);
            }

            let imageValue = imageBtn.value.trim();
            if (!imageBtn.classList.contains('edit-form')) {
                if (!imageValue) {
                    let error = document.createElement('p');
                    error.classList.add('error-message');
                    error.innerHTML = 'Image is Required';
                    imageBtn.classList.add('error-input');
                    imageDiv.append(error);
                }
            }
            
            let typeValue = typeInput.value.trim();
            if (!typeValue || typeValue == 'null') {
                let error = document.createElement('p');
                error.classList.add('error-message');
                error.innerHTML = 'Type is Required';
                typeInput.classList.add('error-input');
                typeDiv.append(error);
            }

            let sizeValue = sizeInput.value;
            if (sizeValue) {
                if (!sizeValue.trim()) {
                    let error = document.createElement('p');
                    error.classList.add('error-message');
                    error.innerHTML = 'Size cannot contain empty spaces';
                    sizeInput.classList.add('error-input');
                    sizeDiv.append(error);
                }
            }

            let brandValue = brandInput.value;
            if (brandValue) {
                if (!brandValue.trim()) {
                    let error = document.createElement('p');
                    error.classList.add('error-message');
                    error.innerHTML = 'Brand Name cannot contain empty spaces';
                    brandInput.classList.add('error-input');
                    brandDiv.append(error);
                }
            }

            let colorPatternValue = colorPatternInput.value;
            if (colorPatternValue.trim()) {
                let error = document.createElement('p');
                error.classList.add('error-message');
                error.innerHTML = 'Click "Add" to add Color/Pattern to Clothing Item';
                colorPatternInput.classList.add('error-input');
                colorPatternDiv.append(error);
            }

            let stylesValue = stylesInput.value;
            if (stylesValue.trim()) {
                let error = document.createElement('p');
                error.classList.add('error-message');
                error.innerHTML = 'Click "Add" to add Style to Clothing Item';
                stylesInput.classList.add('error-input');
                stylesDiv.append(error);
            }

            if (document.getElementsByClassName('error-message').length > 0) throw 'Error';
        } catch (e) {
            event.preventDefault();
        }
    });
}

function changeImage(input) {
    var reader;
    if (input.files && input.files[0]) {
        reader = new FileReader();
        reader.onload = function(e) {
            image.setAttribute('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
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