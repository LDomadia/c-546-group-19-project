(function ($) {
  const outfitForm = $(".edit-outfit-form"),
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
      return;
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
      return;
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
      return;
    }
    if (stylesInput.val().trim() !== "") {
      outfitForm.find(".outfit-element").remove();
      formErr.empty();
      formErr.text('Click "Add" to add Style to Clothing Item');
      formErr.show();
      formErr.focus();
      event.preventDefault();
      return;
    }
  });
  $(".add-box:checked").each(function () {
    outfitErr.empty().hide();
    let image_name = $(this)
      .parent()
      .parent()
      .siblings(".clothing-item-image")
      .attr("src")
      .split("/")[2];
    let type = $(this).parent().siblings(".clothing-type").text();
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
      if (typesDict[type] > 0) typesDict[type]--;
    }
  });

  $(".add-box:not(:checked)").each(function () {
    let image_name = $(this)
      .parent()
      .parent()
      .siblings(".clothing-item-image")
      .attr("src")
      .split("/")[2];
    let type = $(this).parent().siblings(".clothing-type").text();
    let index = outfitsArr.indexOf(image_name);
    if (index !== -1) {
      outfitsArr.splice(index, 1);
      typesDict[type]--;
    }
  });

  addBox.change(function () {
    outfitErr.empty().hide();
    let image_name = $(this)
      .parent()
      .parent()
      .siblings(".clothing-item-image")
      .attr("src")
      .split("/")[2];
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
      let index = outfitsArr.indexOf(image_name);
      if (index !== -1) {
        outfitsArr.splice(index, 1);
        typesDict[type]--;
      }
    }
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
  $(".chip-btn").each(function (btn) {
    this.addEventListener("click", removeFromList);
    addToList(this.name.trim(), stylesList, "styles[]");
    this.parentElement.remove();
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
