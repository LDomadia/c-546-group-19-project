(function ($) {
  const outfitForm = $("#new-outfit-form"),
    nameDiv = $("#name-div"),
    nameInput = $("#name-input"),
    outfitsList = $("#outfits-list"),
    stylesList = $("#styles-list"),
    stylesInput = $("#styles-input"),
    stylesBtn = $("#styles-btn"),
    submitBtn = $("#submit-btn"),
    addBox = $(".add-box"),
    publicBox = $(".public-box"),
    outfitErr = $("#outfit-err"),
    formErr = $("#form-err");

  outfitErr.removeClass();
  outfitErr.hide();
  formErr.removeClass();
  formErr.hide();
  var typesDict = {};
  var outfitsArr = [];

  outfitForm.submit(function (event) {
    $("#server-error").text("");
    $("#server-error").hide();
    try {
      outfitErr.removeClass();
      outfitErr.hide();
      formErr.removeClass();
      formErr.hide();
      if (outfitsArr.length < 2) {
        throw "Please select at least two clothing items for your outfit";
      }
      outfitsArr.forEach((element) => {
        let hiddenInput = document.createElement("input");
        hiddenInput.setAttribute("type", "hidden");
        hiddenInput.setAttribute("name", "outfits[]");
        hiddenInput.setAttribute("value", element);
        hiddenInput.setAttribute("class", "outfit-element");
        outfitForm.append(hiddenInput);
      });
    } catch (e) {
      outfitErr.empty();
      outfitErr.text(e);
      outfitErr.show();
      outfitErr.focus();
      event.preventDefault();
    }

    try {
      if (nameInput.val().trim() === "") {
        nameInput.focus();
        throw "Please enter a name for your outfit";
      }
    } catch (e) {
      outfitForm.find(".outfit-element").remove();
      nameInput.val("");
      formErr.empty();
      formErr.text(e);
      formErr.show();
      formErr.focus();
      event.preventDefault();
    }

    try {
      let setStyles = new Array();
      let listStyles = stylesList[0].children;
      for (let i = 0; i < listStyles.length; i++) {
        const chip = listStyles[i].innerText.trim().toLowerCase();
        if (setStyles.includes(chip)) {
          throw "Styles cannot contain duplicates";
        } else {
          setStyles.push(chip);
        }
      }
    } catch (e) {
      outfitForm.find(".outfit-element").remove();
      formErr.empty();
      formErr.text(e);
      formErr.show();
      formErr.focus();
      event.preventDefault();
    }
    if (stylesInput.val().trim() !== "") {
      outfitForm.find(".outfit-element").remove();
      formErr.empty();
      formErr.text('Click "Add" to add Style to Clothing Item');
      formErr.show();
      formErr.focus();
      event.preventDefault();
    }
  });
  addBox.change(function () {
    outfitErr.empty().hide();
    let image_name = $(this)
      .parent()
      .parent()
      .siblings(".clothing-item-image")
      .attr("src")
      .replace("/uploads/", "");
    let type = $(this).parent().siblings(".clothing-type").text();
    if ($(this).is(":checked")) {
      outfitsArr.push(image_name);
      if (!typesDict[type] || typesDict[type] <= 0) {
        typesDict[type] = 1;
      } else if (type !== "Type: Accessory") {
        outfitErr.empty();
        outfitErr.text(
          "You cannot have multiple of the same types (except for accessories) in an outfit"
        );
        outfitErr.show();
        outfitErr.focus();
        $(this).prop("checked", false);
        outfitsArr.splice(outfitsArr.indexOf(image_name), 1);
      } else {
        typesDict[type]++;
      }
    } else {
      outfitsArr.splice(outfitsArr.indexOf(image_name), 1);
      typesDict[type] = 0;
    }
    // if ($(this).is(":checked")) {
    //   sib_pub_box.removeAttr("disabled");
    // } else {
    //   sib_pub_box.attr("disabled", true);
    // }
  });

  stylesBtn.click(function (event) {
    event.preventDefault();
    let inputValue = escapeInput(stylesInput.val().trim());
    if (inputValue === "") {
      formErr.empty();
      formErr.text("Empty styles cannot be added");
      formErr.show();
      formErr.focus();
      return;
    }
    addToList(inputValue, stylesList, "styles[]");
    stylesInput.val("");
    stylesInput.focus();
  });
  stylesInput.keydown((event) => {
    if (event.key == "Enter") {
      event.preventDefault();
      let inputValue = escapeInput(stylesInput.val().trim());
      if (inputValue === "") {
        formErr.empty();
        formErr.text("Empty styles cannot be added");
        formErr.show();
        formErr.focus();
        return;
      }
      addToList(inputValue, stylesList, "styles[]");
      stylesInput.val("");
      stylesInput.focus();
    }
  });

  function addToList(inputValue, list, listName) {
    if (inputValue) {
      let btn = document.createElement("button");
      btn.setAttribute("type", "button");
      btn.setAttribute("class", "chip-btn");
      btn.setAttribute("aria-label", "delete " + inputValue);
      btn.setAttribute("title", "delete " + inputValue);

      btn.addEventListener("click", removeFromList);

      let icon = document.createElement("i");
      icon.setAttribute("class", "fa-solid fa-circle-xmark");

      let liItem = document.createElement("li");
      liItem.innerHTML = inputValue;
      let hiddenInput = document.createElement("input");
      hiddenInput.setAttribute("type", "hidden");
      hiddenInput.setAttribute("name", listName);
      hiddenInput.setAttribute("value", inputValue);
      btn.append(icon);
      liItem.append(hiddenInput);
      liItem.append(btn);
      list.append(liItem);
    }
  }
  function removeFromList() {
    this.parentElement.remove();
  }
  function escapeInput(input) {
    return String(input)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
  }
})(window.jQuery);
