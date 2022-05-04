const carouselImages = document.getElementsByClassName('carousel-inner');

for (let i = 0; i < carouselImages.length; i++) {
    carouselImages[i].firstElementChild.classList.add('active');
}