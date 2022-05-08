(function ($) {
  const outfitMsg = $("#outfit-message"),
    deleteLink = $(".outfit-delete"),
    editLink = $(".card-edit"),
    publicBtn = $("#make-outfits-public"),
    confirmBtn = $("#confirm-public"),
    delOutfitBtn = $("#confirm-delete"),
    errMsg = $(".error-message"),
    formDel = $("#form-delete");

  const carouselImages = $(".carousel-inner");
  carouselImages.each(function () {
    if ($(this)[0].firstElementChild !== null) {
      let doc = $(this)[0].firstElementChild.classList.add("active");
    }
  });

  deleteLink.click(function (event) {
    document.getElementById("delete-modal").style.display = "block";
    formDel.attr("action", this.href);
    event.preventDefault();
  });
  delOutfitBtn.on("click", function (event) {
    $("#server-error").text("");
    $("#server-error").hide("");
    document.getElementById("delete-modal").style.display = "none";
    var requestConfig = {
      method: "DELETE",
      url: formDel[0].action,
    };
    $.ajax(requestConfig).then(function (responseMessage) {
      if (responseMessage.redirect) {
        window.location.replace(window.location.origin + "/outfits");
      } else if (responseMessage.error) {
        errMsg.text(responseMessage.error);
      } else {
        errMsg.text("Error: outfit deletion failed");
      }
    });
    event.preventDefault();
  });

  confirmBtn.on("click", function (event) {
    $("#server-error").text("");
    $("#server-error").hide("");
    if ($(".outfit-card").length === 0)
      outfitMsg.text("Error: user does not have outfits to make public");

    var requestConfig = {
      method: "PATCH",
      url: window.location.origin + "/publicize",
    };
    document.getElementById("delete-modal").style.display = "none";
    $.ajax(requestConfig).then(function (responseMessage) {
      outfitMsg.text(responseMessage);
    });
    document.getElementById("public-modal").style.display = "none";
    event.preventDefault();
  });
})(window.jQuery);
