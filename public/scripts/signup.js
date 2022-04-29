(function ($) {
  function checkUsername(username) {
    if (!username) throw "must provide username";
    if (typeof username !== "string")
      throw "Error: username should be a string";
    if (username.indexOf(" ") >= 0)
      throw "Error: username should not have any spaces";
    username = username.trim();
    if (username.length < 2)
      throw "Error: username must have at least two characters";
    //check for alphnumeric
    //https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript

    for (let i = 0; i < username.length; i++) {
      let code = username.charCodeAt(i);
      if (
        !(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)
      ) {
        // lower alpha (a-z)
        throw "username must have only alphanumeric characters";
      }
    }

    return username;
  }

  function checkPassword(password) {
    if (!password) throw "must provide password";
    if (typeof password !== "string")
      throw "Error: password should be a string";
    if (password.indexOf(" ") >= 0)
      throw "Error: password should not have any spaces";
    password = password.trim();
    if (password.length < 8)
      throw "Error: password must have at least eight characters";
    return password;
  }

  function checkId(id) {
    if (!id) throw "must provide s";
    if (typeof id !== "string") throw "invalid string input";
    if (id.trim().length === 0)
      throw "Id cannot be an empty string or just spaces";
    id = id.trim();
    if (!ObjectId.isValid(id)) throw "invalid object ID";

    return id;
  }

  function checkString(string) {
    if (!string) throw "must provide text input";
    if (typeof string !== "string") throw "invalid string input";
    if (string.trim().length === 0)
      throw "string cannot be an empty string or just spaces";
    return string;
  }

  var signupForm = $(".user-sign-up"),
    usernameInput = $(".username-input"),
    pswInput = $(".psw-input"),
    pswConfirm = $(".psw-confirm");

  signupForm.submit(function (event) {
    event.preventDefault();
    var username = usernameInput.val();
    try {
      username = checkUsername(username);
    } catch (e) {
      alert(e);
      usernameInput.empty();
      return;
    }

    var password = pswInput.val();
    try {
      password = checkPassword(password);
    } catch (e) {
      alert(e);
      pswInput.empty();
      pswConfirm.empty();
      return;
    }

    var confirmPsw = pswConfirm.val();
    try {
      confirmPsw = checkPassword(confirmPsw);
    } catch (e) {
      alert(e);
      pswInput.empty();
      pswConfirm.empty();
      return;
    }
    var requestConfig = {
      method: "POST",
      url: "http://localhost:3000/account/signup",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      username: username,
      psw: pswInput,
      pswRepeat: pswConfirm,
    };
    $.ajax(requestConfig)
      .then(function (responseMessage) {
        window.location.replace("http://localhost:3000/home");
      })
      .fail(function (jqXHR, status, error) {
        alert("failed");
      });
  });
})(window.jQuery);
