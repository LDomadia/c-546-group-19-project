
(function ($) {
    // Let's start writing AJAX calls!
    //page load
    var
        number_likes = $('#number_likes'),
        commentList = $('#comments'),
        saveButton = $('#save'),
        likeButton = $('#like'),
        commentForm = $('#commentForm'),
        commentInput = $('#comment_term'),
        errorDiv = $('#error')

    // likeButton.click(function(event){
    //     event.preventDefault();
    //     var currentLink = $(this);
    //     console.log(currentLink);
    //     var currentId = currentLink.data('id');

    //     //post 
    //     var requestConfig = {
    //         method : "POST",
    //         url : "/api/detailed/"+currentId +'/like'
    //     }

    //     $.ajax(requestConfig).then(function(responseMessage){
    //         console.log(responseMessage);
    //     })
    // })

    commentForm.submit(function (event) {
        event.preventDefault();
        
        var comment = commentInput.val();
        console.log(comment);

        //deal with commenter in routes

        var requestConfig = {
            method: "POST",
            //https://stackoverflow.com/questions/1696429/get-the-current-url-but-without-the-http-part-bookmarklet
            url: window.location.pathname + '/comment',
            data : {comment: comment}
                //request.body.comment
            
        }

        $.ajax(requestConfig).then(function (responseMessage) {
            console.log(responseMessage);
            //add response message to comments and display
        })

    })

})(window.jQuery);
