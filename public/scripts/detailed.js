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
            console.log("no comments");
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



    commentForm.submit(function (event) {
        event.preventDefault();

        var comment = commentInput.val();

        //console.log(comment);

        //deal with commenter in routes

        var requestConfig = {
            method: "POST",
            //https://stackoverflow.com/questions/1696429/get-the-current-url-but-without-the-http-part-bookmarklet
            url: window.location.pathname + '/comment',
            data: { comment: comment }
            //request.body.comment

        }

        $.ajax(requestConfig).then(function (responseMessage) {
            console.log(responseMessage.comment);
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

        })

    })

})(window.jQuery);
