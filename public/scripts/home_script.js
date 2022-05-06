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
                const requestConfig = {
                    method: 'POST', 
                    url: this
                };
                let btn = this;
                let parent = this.parentElement;
                let likes = $(parent).find('.outfit-likes');
                $.ajax(requestConfig).then(function(result) {
                    console.log();
                    if (result.result == 'success') {
                        likes[0].innerText = result.likes + ' likes';
                        btn.innerText = result.status;
                    }
                    else {
                        Swal.fire(
                            'Oh no!',
                            'An error occurred liking this outfit.',
                            'error'
                        );
                    }
                });
            });
        }
    }

})(window.jQuery);