const image = document.getElementById('placeholder-img');
const imageBtn = document.getElementById('img-btn');

if (imageBtn) {
    imageBtn.addEventListener("change", function() {
        changeImage(this);
    })
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