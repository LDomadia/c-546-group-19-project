(function ($) {
    // Let's start writing AJAX calls!
    //page load
    var
        number_likes = $('#number_likes'),
        saveButton = $('#save'),
        likeButton = $('#like'),
        commentList = $('#comments'),
        commentForm = $('#commentForm'),
        commentInput = $('#comment_term'),
        errorDiv = $('#error'),
        noComment = $('#no_comments')

    function checkString(string) {
        if (!string) throw "must provide text input"
        if (typeof string !== 'string') throw 'invalid string input';
        if (string.trim().length === 0)
            throw 'string cannot be an empty string or just spaces';
        return string;
    }


    //get likes
    var getLikes = {
        method: "GET",
        //https://stackoverflow.com/questions/1696429/get-the-current-url-but-without-the-http-part-bookmarklet
        //equivalent to geting /detailed/:id/comment
        url: window.location.pathname + '/likes',
    }
    $.ajax(getLikes).then(function (responseMessage) {
        //get likes
        let likes = responseMessage.likes;
        number_likes.text = likes;
        number_likes.show;
    })

    //copy 
    likeButton.click(function (event) {
        console.log("here");
        event.preventDefault();
        //dont do anything if user already likes the outfit

        var addLike = {
            method: "POST",
            //https://stackoverflow.com/questions/1696429/get-the-current-url-but-without-the-http-part-bookmarklet
            //equivalent to geting /detailed/:id/comment
            url: window.location.pathname + '/likes',
        }

        $.ajax(addLike).then(function (responseMessage) {
            //get likes

            let likes = responseMessage.likes;
            console.log(likes);
            number_likes.text = likes;
            number_likes.show;
        })

    })



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
        try {
            comment = checkString(comment);
        }
        catch (e) {
            errorDiv.empty();
            errorDiv.show();
            errorDiv.text(e);

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
            if (responseMessage.success) {

                //console.log(responseMessage.comment);
                //display comments

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

            }

        })

    })

})(window.jQuery);
