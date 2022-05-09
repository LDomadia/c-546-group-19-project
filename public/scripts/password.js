
(function ($) {

  function checkPassword(password) {
    if (!password) throw "must provide password"
    if (typeof password !== "string")
      throw "Error: password should be a string";
    if (password.indexOf(" ") >= 0)
      throw "Error: password should not have any spaces";
    password = password.trim();
    if (password.length < 8)
      throw "Error: password must have at least eight characters";
    return password;
  }


  //two forms 

  var passForm = $("#cpassword"),
    password1 = $("#current_password"),
    error = $("#error"),
    passForm2 = $("#password_form"),
    p1 = $("#password1"),
    p2 = $("#password2");
  server = $("#server-e");
  server2 = $("#server-e2");
  error.hide();
  error.empty();


  passForm.submit(function (event) {
    event.preventDefault();
    error.hide();
    error.empty();

    var p = password1.val();
    try {
      p = checkPassword(p);
    } catch (e) {
      //alert(e);
      password1.empty();
      error.text(e);
      error.show();

      server.hide();
      return;
    }

    server.show();
    event.currentTarget.submit();
  });


  passForm2.submit(function (event) {
    event.preventDefault();
    error.hide();
    error.empty();

    var pass = p1.val();
    var pass2 = p2.val();
    try {
      pass = checkPassword(pass);
      pass2 = checkPassword(pass2);
      if (pass !== pass2) {
        throw "passwords do not match"
      }
    } catch (e) {
      //alert(e);
      p1.empty();
      p2.empty();
      error.text(e);
      error.show();
      server2.hide();
      return;
    }

    server2.show();
    event.currentTarget.submit();
  });


})(window.jQuery);