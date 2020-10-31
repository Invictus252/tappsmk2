$(document).ready(function() {
  var stack = new Stack();
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
    $("#errorMessagePasswordReset").text("");
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

  function drawTriangleA(ctx) {
    let height = 10 * Math.cos(Math.PI / 6);

    ctx.beginPath();
    ctx.moveTo(5, 5);
    ctx.lineTo(35, 5);
    ctx.lineTo(20, 30 - height);
    ctx.closePath();
    // the fill color
    ctx.fillStyle = "#FFCC00";
    ctx.closePath();
    ctx.fill();
    scanPerimeter(ctx,20,5);
  }

  function drawTriangleB(ctx) {
    let height = 10 * Math.cos(Math.PI / 6);

    ctx.beginPath();
    ctx.moveTo(990, 5);
    ctx.lineTo(960, 5);
    ctx.lineTo(975, 30 - height);
    ctx.closePath();

    // the fill color
    ctx.fillStyle = "#FFCC00";
    ctx.closePath();
    ctx.fill();
    scanPerimeter(ctx,975,5);
  }

  function drawTriangleC(ctx) {
    let height = 10 * Math.cos(Math.PI / 6);

    ctx.beginPath();
    ctx.moveTo(495, 445);
    ctx.lineTo(465, 445);
    ctx.lineTo(480, 425 + height);
    ctx.closePath();

    // the fill color
    ctx.fillStyle = "#FFCC00";
    ctx.fill();
    scanPerimeter(ctx,480,445);
  }

  function scanPerimeter(ctx,a,b) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.arc(a, b, 400, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
  }

  function markDevice(ctx,x,y) {
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, 2 * Math.PI);
    ctx.stroke();
        ctx.fillStyle = "blue";
        ctx.fill();
  }

function clearCircle(context,x,y) {
	context.save();
	context.beginPath();
	context.arc(x, y, 19, 0, 2*Math.PI, true);
	context.clip();
	context.clearRect(x-19,y-19,19*2,19*2);
	context.restore();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

  function loadVisuals(){
        // static canvas
        var static = document.getElementById("static");
        var staticCtx = static.getContext("2d");

        // dynamic canvas
        var dynamic = document.getElementById("dynamic");
        var dynamicCtx = dynamic.getContext("2d");

        // animation status
        var FPS = 30;
        var INTERVAL = 10000 / FPS;

        // our background
        var staticBackground = {
            x: 0,
            y: 0,
            width: static.width,
            height: static.height,
            draw: function () {
                staticCtx.fillStyle = "grey";
                staticCtx.fillRect(0, 0, static.width, static.height);
            }
        };

        // Deployed Pi : Alpha
        var piAlpha = {
            draw: function () {
                drawTriangleA(staticCtx);
            }
        };

        // Deployed Pi : Bravo
        var piBravo = {
            draw: function () {
                drawTriangleB(staticCtx);
            }
        };

        // Deployed Pi : Charlie
        var piCharlie = {
            draw: function () {
                drawTriangleC(staticCtx);
            }
        };

        // our bouncing circle
        var deviceLocation = {
            x: 30,
            y: 30,
            width: 50,
            height: 50,
            gravity: 0.98,
            elasticity: 0.90,
            velX: 10,
            velY: 0,
            bouncingY: false,
            bouncingX: false,
            draw: function (x,y) {   // example of dynamic animation code
                // clear the last draw of this object
                clearCircle(dynamicCtx,this.x - 1, this.y - 1, this.width + 2, this.height + 2);
                // compute gravity
                this.velY += this.gravity;
                // bounce Y
                if (!this.bouncingY && this.y >= dynamic.height - this.height) {
                    this.bouncingY = true;
                    this.y = dynamic.height - this.height;
                    this.velY = -(this.velY * this.elasticity);
                } else {
                    this.bouncingY = false;
                }
                // bounce X
                if (!this.bouncingX && (this.x >= dynamic.width - this.width) || this.x <= 0) {
                    this.bouncingX = true;
                    this.x = (this.x < 0 ? 0 : dynamic.width - this.width);
                    this.velX = -(this.velX * this.elasticity);
                } else {
                    this.bouncingX = false;
                }
                // compute new position
                this.x += this.velX;
                this.y += this.velY;
                // render the object
                markDevice(dynamicCtx,this.x,this.y);
            }
        };

        function drawStatic() {
            staticBackground.draw();
            piAlpha.draw();
            piBravo.draw();
            piCharlie.draw();
            // you can add more static objects and draw here
        }

        function drawDynamic() {
          let x = getRandomInt(1000);
          let y = getRandomInt(450);
          stack.push({x:x,y:y});
          markDevice(dynamicCtx,x,y);
            // you can add more dynamic objects and draw here
        }

        function clearDynamic() {
          let tmp = stack.peek();
          clearCircle(dynamicCtx, tmp.x, tmp.y)
        }

        function animate() {
            setInterval(function () {
                // only need to redraw dynamic objects
                drawDynamic();
                clearDynamic();

            }, INTERVAL);
        }

        drawStatic(); // draw the static objects
        animate(); // entry point for animated (dynamic) objects
  }

  function initializeModel() {
    wipeFilter();
    $("#category").val(0);
    $(".sortNoFilter").show();
    $(".sortFilter").hide();
    loadSecurityQuestions();
    checkUser();
    loadVisuals();
  }

  initializeModel();

});
