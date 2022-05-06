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
                let parent = this.parentElement;
                let likes = $(parent).find('.outfit-likes');
                console.log(likes.innerText);
                $.ajax(requestConfig).then(function(result) {
                    if (result.result == 'success') {
                        console.log('success!');
                        likes.innerText = result.likes;
                    }
                    else {
                        console.log(result);
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