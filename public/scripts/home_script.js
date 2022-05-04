const carousels = document.getElementsByClassName('carousel-inner');

for (let i = 0; i < carousels.length; i++) {
    carousels[i].firstElementChild.classList.add('active');
    // console.log(carousels[i]);
}