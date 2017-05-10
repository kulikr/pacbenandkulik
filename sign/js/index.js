//#region form_script

$('.form').find('input, textarea').on('keyup blur focus', function (e) {

  var $this = $(this),
    label = $this.prev('label');

  if (e.type == 'keyup') {
    if ($this.val() == '') {
      label.removeClass('active highlight');
    } else {
      label.addClass('active highlight');
    }
  } else if (e.type == 'blur') {
    if ($this.val() == '') {
      label.removeClass('active highlight');
    } else {
      label.removeClass('highlight');
    }
  } else if (e.type == 'focus') {

    if ($this.val() == '') {
      label.removeClass('highlight');
    }
    else if ($this.val() !== '') {
      label.addClass('highlight');
    }
  }

});


$('.tab a').on('click', function (e) {

  e.preventDefault();

  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');

  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();

  $(target).fadeIn(600);

});

var numDays = {
  '1': 31, '2': 28, '3': 31, '4': 30, '5': 31, '6': 30,
  '7': 31, '8': 31, '9': 30, '10': 31, '11': 30, '12': 31
};

function setDays(oMonthSel, oDaysSel, oYearSel) {
  var $this = $(this),
    label = $this.prev('label');
  label.removeClass('highlight');

  var nDays, oDaysSelLgth, opt, i = 1;
  nDays = numDays[oMonthSel[oMonthSel.selectedIndex].value];
  if (nDays == 28 && oYearSel[oYearSel.selectedIndex].value % 4 == 0)
    ++nDays;
  oDaysSelLgth = oDaysSel.length;
  if (nDays != oDaysSelLgth) {
    if (nDays < oDaysSelLgth)
      oDaysSel.length = nDays;
    else for (i; i < nDays - oDaysSelLgth + 1; i++) {
      opt = new Option(oDaysSelLgth + i, oDaysSelLgth + i);
      oDaysSel.options[oDaysSel.length] = opt;
    }
  }
}

//#endregion

// array of users
var users = [];

class User {
  constructor(firstName, LastName, userName, email, password, birthDate) {
    this.firstName = firstName;
    this.LastName = LastName;
    this.userName = userName;
    this.email = email;
    this.password = password;
    this.birthDate = birthDate;
  }
}

/* validation *************************************************************************************************/

$.validator.addMethod("LettersAndDigits", function (user, element, regexpr) {
  var letterNumber = /^[0-9a-zA-Z]+$/;
  if (element.value.match(letterNumber)) {
    return true;
  }
  else {
    return false;
  }
}, "english letters and numbers only");

$.validator.addMethod("OneLetterAndDigit", function (user, element, regexpr) {
  var letterNumber = /[a-z].*[0-9]|[0-9].*[a-z]|[A-Z].*[0-9]|[0-9].*[A-Z]/i;
  if (element.value.match(letterNumber)) {
    return true;
  }
  else {
    return false;
  }
}, "contain at least one number and one letter");

$.validator.addMethod("onlyLetters", function (user, element, regexpr) {
  var letters = /^[a-zA-Z\s]*$/;
  if (element.value.match(letters)) {
    return true;
  }
  else {
    return false;
  }
}, "only english letters");

$.validator.addMethod("userNameFree", function (value, element) {
  var userName = value;
  for (var i = 0; i < users.length; i++) {
    var c = users[i].userName.localeCompare(userName);
    if (c == 0) {
      return false;
    }
  }
  return true;
}, "user name is taken");


$(function () {
  $("form[name='signup']").validate({
    // Specify validation rules
    rules: {
      firstName: {
        required: true,
        onlyLetters: true
      },
      lastName: {
        required: true,
        onlyLetters: true
      },
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        LettersAndDigits: true,
        OneLetterAndDigit: true,
        minlength: 8,
      },
      userName: {
        required: true,
        userNameFree: true
      }
    },
    // Specify validation error messages
    messages: {
      firstName: {
        required: "Please enter your first name.",
        onlyLetters: "First name should contain only english letters."

      },
      lastName: {
        required: "Please enter your last name.",
        onlyLetters: "Last name should contain only english letters."
      },
      userName: {
        required: "Pleas enter your user name.",
        userNameFree: "User name is taken, choose another."
      },
      password: {
        required: "Please enter your password.",
        minlength: "Password must be at least 8 characters long.",
        OneLetterAndDigit: "Password must contain at least one number and one letter.",
        LettersAndDigits: "Password must be english letters and numbers only."
      },
      email: {
        email: "Please enter a valid email address.",
        required: "Pleas enter your email."
      }
    },

    errorPlacement: function (error, element) {
      error.addClass('invalid');
      error.appendTo(element.parent());
    },

    submitHandler: function (form) {
      // adding the new user
      var firstName = $(form).find('input[name="firstName"]').val();
      var lastName = $(form).find('input[name="lastName"]').val();
      var userName = $(form).find('input[name="userName"]').val();
      var password = $(form).find('input[name="password"]').val();
      var email = $(form).find('input[name="email"]').val();
      var birthDate = $("#month option:selected").val() + "." + $("#day option:selected").val() + "." + $("#year option:selected").val();
      userToAdd = new User(firstName, lastName, userName, email, password, birthDate);
      users[users.length] = userToAdd;
      form.submit();
    }
  });
});