(function ($) {
    // Let's start writing AJAX calls!
    //page load
    var
        commentList = $('#comments'),
        commentForm = $('#commentForm'),
        commentInput = $('#comment_term'),
        errorDiv = $('#error'),
        noComment = $('#no_comments')

    const carouselImages = $('.carousel-inner');
    const likeBtns = $('.like-btn');
    const saveBtns = $('.save-btn');

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
                    console.log(result);
                    if (result.result == 'success') {
                        likes[0].innerText = result.likes + ' likes';
                        btn.innerHTML = result.icon;
                    }
                    else {
                        Swal.fire(
                            'Oh no!',
                            'An error occurred liking/disliking this outfit.',
                            'error'
                        );
                    }
                });
            });
        }
    }

    if (saveBtns) {
        for (let i = 0; i < saveBtns.length; i++) {
            saveBtns[i].addEventListener('click', function(event) {
                event.preventDefault();
                const requestConfig = {
                    method: 'POST', 
                    url: this
                };
                let btn = this;
                $.ajax(requestConfig).then(function(result) {
                    if (result.result == 'success') {
                        btn.innerHTML = result.icon;
                    }
                    else {
                        Swal.fire(
                            'Oh no!',
                            'An error occurred saving/unsaving this outfit.',
                            'error'
                        );
                    }
                });
            });
        }
    }

    function checkString(string) {
        if (!string) throw "must provide text input"
        if (typeof string !== 'string') throw 'invalid string input';
        if (string.trim().length === 0)
            throw 'string cannot be an empty string or just spaces';
        return string;
    }

    //get all comments
    var allComments = {
        method: "GET",
        //https://stackoverflow.com/questions/1696429/get-the-current-url-but-without-the-http-part-bookmarklet
        //equivalent to geting /detailed/:id/comment
        url: window.location.pathname + '/comment',
    }

    $.ajax(allComments).then(function (responseMessage) {
        //get all comments
        //responses with list of comment objects
        // commentList = []; //empty out

        //list of all comments
        let comments = responseMessage.comments;


        if (comments.length == 0) {
            commentList.hide();
            let p = $("<p></p>");
            let s = "no comments yet. be the first one to comment!"
            p.append(s);
            //show the no comment
            noComment.append(p);
            noComment.show();
        }
        else {
            noComment.hide();
            for (let i = 0; i < comments.length; i++) {
                //add each comment to the list
                let l = $("<li></li>");
                let s = comments[i].commenter + ': ' + comments[i].text;
                l.append(s);
                //need to empty
                commentList.append(l);
                commentList.show();
            }
        }
    })


    //add comment
    commentForm.submit(function (event) {

        event.preventDefault();

        var comment = commentInput.val();

        //https://stackoverflow.com/questions/10633605/clear-form-values-after-submission-ajax
        commentForm[0].reset();

        //error check comment input 
        try {
            comment = checkString(comment);
        }
        catch (e) {
            errorDiv.empty();
            errorDiv.show();
            errorDiv.text(e);
            return;
        }

        //deal with commenter in routes

        var requestConfig = {
            method: "POST",
            //https://stackoverflow.com/questions/1696429/get-the-current-url-but-without-the-http-part-bookmarklet
            url: window.location.pathname + '/comment',
            data: { comment: comment }
            //request.body.comment

        }

        $.ajax(requestConfig).then(function (responseMessage) {
            //add comment successful
            if (responseMessage.success) {
                //return singular new comment
                let newComment = responseMessage.comment;

                let l = $("<li></li>");
                let s = newComment.commenter + ": " + newComment.text
                l.append(s);
                //need to empty
                commentList.append(l);
                commentList.show();
                noComment.hide();
                errorDiv.hide();

            }
            else{
                //TODO test 
                let e = responseMessage.error;
                errorDiv.empty();
                errorDiv.show();
                errorDiv.text(e);
                return;
            }

        })

    })

})(window.jQuery);
