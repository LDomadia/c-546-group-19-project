const image = document.getElementById('placeholder-img');
const imageBtn = document.getElementById('img-btn');
const colorPatternList = document.getElementById('colors-patterns-list');
const colorPatternInput = document.getElementById('colors-patterns-input');
const colorPatternBtn = document.getElementById('colors-patterns-btn');

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
    // check if input is valid
    let liItem = document.createElement('li')
    liItem.innerHTML = inputValue;
    let hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', listName);
    hiddenInput.setAttribute('value', inputValue);
    liItem.appendChild(hiddenInput);
    list.appendChild(liItem);
}