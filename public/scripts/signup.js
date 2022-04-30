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

    for (let i = 0; i < username.length; i++) {
      let code = username.charCodeAt(i);
      if (
        !(code > 47 && code < 58) &&
        !(code > 64 && code < 91) &&
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
    pswConfirm = $(".psw-confirm"),
    usrError = $(".username-err"),
    pswError = $(".psw-err");

  usrError.hide();
  usrError.empty();
  pswError.hide();
  pswError.empty();

  signupForm.submit(function (event) {
    event.preventDefault();
    usrError.hide();
    usrError.empty();
    pswError.hide();
    pswError.empty();
    var username = usernameInput.val();
    try {
      username = checkUsername(username);
    } catch (e) {
      //alert(e);
      usernameInput.empty();
      usrError.text(e);
      usrError.show();
      return;
    }

    var password = pswInput.val();
    try {
      password = checkPassword(password);
    } catch (e) {
      //alert(e);
      pswInput.empty();
      pswConfirm.empty();
      pswError.text(e);
      pswError.show();
      return;
    }

    var confirmPsw = pswConfirm.val();
    try {
      confirmPsw = checkPassword(confirmPsw);
      if (confirmPsw !== pswInput)
        throw "Error: password and confirm password do not match";
    } catch (e) {
      //alert(e);
      pswInput.empty();
      pswConfirm.empty();
      pswError.text(e);
      pswError.show();
      return;
    }
    event.currentTarget.submit();
  });
})(window.jQuery);
