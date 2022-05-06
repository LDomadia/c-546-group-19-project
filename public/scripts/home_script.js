(function($) {
    const carouselImages = $('.carousel-inner');
    const likeBtns = $('.like-btn');

    if (carouselImages) {
        for (let i = 0; i < carouselImages.length; i++) {
            carouselImages[i].firstElementChild.classList.add('active');
        }
    }
    
    if (likeBtns) {
        for (let i = 0; i < likeBtns.length; i++) {
            likeBtns[i].addEventListener('click', function(event) {
                event.preventDefault();
                
            });
        }
    }

})(window.jQuery);