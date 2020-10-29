$(document).ready(function() {
  var resetPasswordEmail = "";
  var snippetModel = {};
  var userModel = {};
  var questionModel = {};
  var currentFilter = "";
  var filterOn = "";
  var filter = "";
  var sortOn = "";
  var order = "";
  var idFromRow,creatorFromRow,languageFromRow,description,snippetFromRow,emailFromRow;

  $("#dbModal").modal({backdrop: "static", keyboard: false, show:false}).on("show.bs.modal", function() {
    idFromRow = $(event.target).closest("tr").data("id");
    emailFromRow = $(event.target).closest("tr").data("email");
    creatorFromRow = $(event.target).closest("tr").data("creator");
    languageFromRow = $(event.target).closest("tr").data("language");
    descriptionFromRow = $(event.target).closest("tr").data("description");
    snippetFromRow = $(event.target).closest("tr").data("snippet");
    buildModalFromTable(this);

    function buildModalFromTable(table_this){
      $(table_this).find(".modal-title ").html(" Viewing Snippet ID " + idFromRow );
      $(table_this).find(".modal-body").html($("<p class='text-secondary'> Creator: " + creatorFromRow + "</p><p class='text-secondary'> Creator: <a class='text-primary' href='mailto:" + emailFromRow + "'>"+ emailFromRow + "</a></p><p class='text-secondary'> Language: " + languageFromRow + "</p><p class='text-secondary'> Description: " + descriptionFromRow + "</p><h3 class='text-primary'>  Snippet: </h3><code>" + snippetFromRow + "</code>"));
    }
  });

  $("#ddCreatorAscFilterOrder").click(function() {
    sortOn = "UserName";
    order = "ASC";
    buildAndMakeSnippetRequest();
  });

  $("#ddCreatorDescFilterOrder").click(function() {
    sortOn = "UserName";
    order = "DESC";
    buildAndMakeSnippetRequest();
  });

  $("#ddDescriptionAscFilterOrder").click(function() {
    sortOn = "Description";
    order = "ASC";
    buildAndMakeSnippetRequest();
  });

  $("#ddDescriptionDescFilterOrder").click(function() {
    sortOn = "Description";
    order = "DESC";
    buildAndMakeSnippetRequest();
  });

  $("#ddLanguageAscFilterOrder").click(function() {
    sortOn = "Language";
    order = "ASC";
    buildAndMakeSnippetRequest();
  });

  $("#ddLanguageDescFilterOrder").click(function() {
    sortOn = "Language";
    order = "DESC";
    buildAndMakeSnippetRequest();
  });

  $("#ddCreatorAsc").click(function() {
    sortOn = "UserName";
    order = "ASC";
    buildAndMakeSnippetRequest();
  });

  $("#ddCreatorDesc").click(function() {
    sortOn = "UserName";
    order = "DESC";
    buildAndMakeSnippetRequest();
  });

  $("#ddCreatorAscFilter").click(function() {
    sortOn = "UserName";
    order = "ASC";
    buildAndMakeSnippetRequest();
  });

  $("#ddCreatorDescFilter").click(function() {
    sortOn = "UserName";
    order = "DESC";
    buildAndMakeSnippetRequest();
  });

  $("#ddLanguageAsc").click(function() {
    sortOn = "Language";
    order = "ASC";
    buildAndMakeSnippetRequest();
  });

  $("#ddLanguageDesc").click(function() {
    sortOn = "Language";
    order = "DESC";
    buildAndMakeSnippetRequest();
  });

  $("#ddDescriptionAsc").click(function() {
    sortOn = "Description";
    order = "ASC";
    buildAndMakeSnippetRequest();
  });

  $("#ddDescriptionDesc").click(function() {
    sortOn = "Description";
    order = "DESC";
    buildAndMakeSnippetRequest();
  });

  $("#clear-search").click(function() {
    wipeFilter();
    initializeModel();
  });

  $("#register-btn").click(function() {
    $("#successMessage").text("");
    $("#errorMessage").text("");
    $("#email").val("");
    $("#password").val("");
    $("#confirm-login-btn").hide();
    $("#forgotPassword-btn").hide();
    $("#QuestionBank").show();
    $("#userName").show();
    $("#confirm-register-btn").show();
    $("#login-modal-title").text("Register New User");
    $("#login-modal").modal("show");
    $("#SecurityQuestion1").val("");
    $("#SecurityQuestion2").val("");
    $("#SecurityQuestion3").val("");
    $("#SecurityAnswer1").val("");
    $("#SecurityAnswer2").val("");
    $("#SecurityAnswer3").val("");
  });

  $("#login-btn").click(function() {
    $("#errorMessage").text("");
    $("#successMessage").text("");
    $("#email").val("");
    $("#password").val("");
    $("#confirm-register-btn").hide();
    $("#userName").hide();
    $("#forgotPassword-btn").show();
    $("#QuestionBank").hide();
    $("#confirm-login-btn").show();
    $("#login-modal-title").text("Login");
    $("#login-modal").modal("show");
  });

  $("#logout-btn").click(function() {
    $.getJSON("/logout",function(data) {
      userModel = data.user;
      wipeFilter();
      $("#user-Name").text("Welcome User");
      $("#login-btn").show();
      $("#logout-btn").hide();
      $("#register-btn").show();
    });
    initializeModel();
  });

  $("#confirm-register-btn").click(function() {
    makeUserRequest("register");
  });

  $("#confirm-login-btn").click(function() {
    makeUserRequest("login");
  });

  $("#search-buttons").click(function() {
    if ($("#criteria").val() == "" || $("#criteria").val() == null || $("#category").val() == 0 || $("#category").val() == null) {
      ClearSearch();
      alert("Search is incomplete. Please check your Filter or Criteria");
    } else {
      submitForm();
    }
  });

  $("#sidebarCollapse").click(function () {
    $("#sidebar, #content").toggleClass("active");
    $(".collapse.in").toggleClass("in");
    $("a[aria-expanded=true]").attr("aria-expanded", "false");
  });

  $("#search").submit(function() {
    if ($("#criteria").val() == "" || $("#criteria").val() == null || $("#category").val() == 0 || $("#category").val() == null) {
      ClearSearch();
    } else {
      submitForm();
    }
    return false;
  });

  $('#login-modal').on('shown.bs.modal', function () {
      $('#email').focus();
  })

  $("#sidebar").mCustomScrollbar({
    theme: "minimal"
  });

  $("#forgotPassword-btn").click(function() {
    $("#login-modal").modal("hide");
    $("#errorMessage").text("");
    $("#successMessage").text("");
    $("#passwordResetEmail").val("");
    $("#userSecurityQuestion1").hide();
    $("#userSecurityQuestion2").hide();
    $("#userSecurityAnswer1").hide();
    $("#userSecurityAnswer2").hide();
    $("#userNewPassword").hide();
    $("#passwordRules").hide();
    $("#changePassword-btn").hide();
    $("#passwordResetEmail").show();
    $("#forgotPassword-modal").modal("show");
  });

  $("#passwordRetrieveEmail-btn").click(function() {
    retrieveUserSecurityQuestions();
  });

  $("#changePassword-btn").click(function() {
    let answer1 = $("#userSecurityAnswer1").val();
    let answer2 = $("#userSecurityAnswer2").val();
    let newPassword = $("#userNewPassword").val();
    let url = "/resetPassword?email=" + resetPasswordEmail +"&securityAnswer1=" + answer1 + "&securityAnswer2=" + answer2 + "&password=" + newPassword
    let request = $.getJSON(url,function(data) {
      if(data.error != undefined) {
        $("#forgotPassword-modal").modal("show");
        $("#errorMessagePasswordReset").text(data.error);
      } else {
        alert("Password Succesfully Changed!");
        $("#forgotPassword-modal").modal("hide");
        userModel = data.user;
        $("#user-Name").text("Welcome " + userModel.UserName);
        $("#login-btn").hide();
        $("#logout-btn").show();
        $("#register-btn").hide();
        $("#passwordResetEmail").show();
        $("#passwordRetrieveEmail-btn").show();
        $("#errorMessagePasswordReset").text("");
        $("#userSecurityAnswer1").val("");
        $("#userSecurityAnswer2").val("");
        $("#userNewPassword").val("");
      }
    });
  });

  $("#passwordChangeCancel-btn").click(function() {
    $("#passwordResetEmail").show();
    $("#passwordRetrieveEmail-btn").show();
    $("#errorMessagePasswordReset").text("");
  });

  function retrieveUserSecurityQuestions() {
    resetPasswordEmail = $("#passwordResetEmail").val();
    let url = "/retrieveUserSecurityQuestions?email=" + resetPasswordEmail;
    $.getJSON(url, function(data) {
      if(data.error != undefined) {
        $("#forgotPassword-modal").modal("show");
        $("#errorMessagePasswordReset").text(data.error);
      } else {
        let securityQuestions = data.result;
        $("#errorMessage").text("")
        $("#successMessage").text("");
        $("#passwordResetEmail").hide();
        $("#userSecurityQuestion1").text(securityQuestions[0].Question);
        $("#userSecurityQuestion1").show();
        $("#userSecurityQuestion2").text(securityQuestions[1].Question);
        $("#userSecurityQuestion2").show();
        $("#userSecurityAnswer1").show();
        $("#userSecurityAnswer2").show();
        $("#userNewPassword").show();
        $("#passwordRules").show();
        $("#changePassword-btn").show();
        $("#passwordRetrieveEmail-btn").hide();
        $("#changePassword-btn").show();
      }
    });
  }

  function submitForm() {
    $(".sortNoFilter").hide();
    $(".sortFilter").show();
    if(filterOn == "UserId") {
      $("#sort-creator-dropdown-filter").hide();
    } else if (filterOn == "Language") {
      $("#sort-language-dropdown-filter").hide();
    } else if (filterOn == "description") {
      $("#sort-description-dropdown-filter").hide();
    }
    buildAndMakeSnippetRequest();
  }

  function buildTable(data) {
    $("#my-table tbody").empty();
    for (let i = 0; i < snippetModel.length; i++) {
      let tr = $("<tr data-toggle='modal' data-id='" + snippetModel[i].Id +"' data-target='#dbModal' data-backdrop='static' data-keyboard='false' data-creator='" + snippetModel[i].Creator + "' data-language='" + snippetModel[i].Language + "' data-email='" + snippetModel[i].Email  + "' data-description='" + snippetModel[i].Description + "' data-snippet='" + snippetModel[i].Snippet.replace(/'/g,"&quot;") + "'>");
      $(tr).append("<td scope='row'>" + snippetModel[i].Id + "</td>");
      $(tr).append("<td>" + snippetModel[i].Email + "</td>");
      $(tr).append("<td>" + snippetModel[i].Creator + "</td>");
      $(tr).append("<td>" + snippetModel[i].Language + "</td>");
      $(tr).append("<td>" + snippetModel[i].Description + "</td>");
      $(tr).append("<td><code>" + snippetModel[i].Snippet.replace(/'/g,"&quot;") + "</code></td>");
      $(tr).append("</tr>");
      $("#my-table tbody").append(tr);
    }
  }

  function buildQuestions(data) {
    for(let i = 1; i <= 2; i++ ) {
      $("#SecurityQuestion" + i).empty();
      for (let j = 0; j < questionModel.length; j++ ) {
        let option = $("<option value='" + questionModel[j].Id +"'>" + questionModel[j].Question + "</option>");
        $("#SecurityQuestion" + i).append(option);
      }
    }
  }

  function wipeFilter() {
    $("#criteria").val("");
    $("#category").val(0);
    sortOn = "";
    currentFilter = "";
    filterOn = "";
    filter = "";
    order = "";
    $("#currentFilter").text("");
    $(".sortNoFilter").show();
  }

  function buildAndMakeSnippetRequest() {
    let queryString = "/findSnippets?";
    if($("#category").val() != "") {
      filterOn = $("#category").val();
      filter = encodeURIComponent($("#criteria").val());
      queryString += "filterOn=" + filterOn + "&filter=" + filter;
    }
    if(sortOn != undefined && $("#category").val() != "" )
      queryString += "&sortOn=" + sortOn + "&order=" + order;
    else
      queryString += "sortOn=" + sortOn + "&order=" + order;
    sendQuery(queryString);
  }

  function sendQuery(this_query) {
    $.getJSON(this_query, function(data) {
      snippetModel = data.result;
      buildTable();
    });
  }

  function makeUserRequest(path) {
    let email = $("#email").val();
    let password = $("#password").val();
    let userName = $("#userName").val();
    let securityQuestion1 = $("#SecurityQuestion1").val();
    let securityQuestion2 = $("#SecurityQuestion2").val();
    let securityAnswer1 =$("#SecurityAnswer1").val();
    let securityAnswer2 =$("#SecurityAnswer2").val();
    if(path == "register") {
      var url = path + "?email=" + email + "&password=" + password + "&userName=" + userName + "&securityQuestion1=" + securityQuestion1 + "&securityQuestion2=" + securityQuestion2 + "&securityAnswer1=" + securityAnswer1 + "&securityAnswer2=" + securityAnswer2;
      $("#successMessage").text("");
      $("#email").val("");
      $("#password").val("");
      $("#userName").val("");
      $("#SecurityQuestion1").val("");
      $("#SecurityQuestion2").val("");
      $("#SecurityAnswer1").val("");
      $("#SecurityAnswer2").val("");
      authRequest(url);
    }
    if(path == "login") {
      var url = path + "?email=" + email + "&password=" + password;
      $("#email").val("");
      $("#password").val("");
      authRequest(url);
    }
  }

  function authRequest(url) {
    let request = $.getJSON(url,function(data){
      if(data.error != undefined) {
        $("#login-modal").modal("show");
        $("#errorMessage").text(data.error);
      } else {
        $("#login-modal").modal("hide");
        userModel = data.user;
        $("#user-Name").text("Welcome " + userModel.UserName);
        $("#login-btn").hide();
        $("#logout-btn").show();
        $("#register-btn").hide();
      }
    });
  }

  function loadSnippets() {
    $.getJSON("/findSnippets", function(data) {
      snippetModel = data.result;
      buildTable();
    });
  }

  function loadSecurityQuestions() {
    $.getJSON("/getSecurityQuestions", function(data) {
      questionModel = data.result;
      buildQuestions();
    });
  }

  function checkUser() {
    $.getJSON("/whoIsLoggedIn", function(data) {
      userModel = data.user;
      if(userModel != undefined) {
        $("#user-Name").text("Welcome " + userModel.UserName);
        $("#login-btn").hide();
        $("#register-btn").hide();
      } else {
        $("#logout-btn").hide();
      }
    });
  }

  function initializeModel() {
    wipeFilter();
    $("#category").val(0);
    $(".sortNoFilter").show();
    $(".sortFilter").hide();
    loadSnippets();
    loadSecurityQuestions();
    checkUser();
  }

  initializeModel();

});
