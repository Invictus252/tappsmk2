$(document).ready(function () {
  let resetPasswordEmail, alphaLog, bravoLog, charlieLog = "";
  let userModel,
    questionModel,
    scanModel,
    verifiedClientModel,
    storedScanCount,
    storedMacSize,
    userCount,
    dbSize = {};

  let _r1,_r2,_r3 = 0;

  let currentScanStatus = undefined;
  // MODALS

  $('#login-modal').on('shown.bs.modal', function () {
    $('#email').focus();
  });

  $("#deviceLogModal").modal({ backdrop: "static", keyboard: false, show: false }).on("show.bs.modal", function () { });
  // USER

  $("#login-btn").click(function () {
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

  $("#logout-btn").click(function () {
    $.getJSON("/logout", function (data) {
      userModel = data.user;
    });
    $("#login-btn").show();
    $("#logout-btn").hide();
    $("#register-btn").show();
    $.getJSON("/resetScanStatus");
    $.getJSON("/killAirodump");
    $.getJSON("/killAirmon");
    $("#content-wrapper").css("background-image", "url(../img/thundercat_mcla.png)").css("background-color", "#fcb426");
    initializeModel();
  });

  $("#confirm-login-btn").click(function () {
    makeUserRequest("login");
  });

  $("#forgotPassword-btn").click(function () {
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

  $("#passwordRetrieveEmail-btn").click(function () {
    retrieveUserSecurityQuestions();
  });

  $("#changePassword-btn").click(function () {
    let answer1 = $("#userSecurityAnswer1").val();
    let answer2 = $("#userSecurityAnswer2").val();
    let newPassword = $("#userNewPassword").val();
    let url = "/resetPassword?email=" + resetPasswordEmail + "&securityAnswer1=" + answer1 + "&securityAnswer2=" + answer2 + "&password=" + newPassword
    let request = $.getJSON(url, function (data) {
      if (data.error != undefined) {
        $("#forgotPassword-modal").modal("show");
        $("#errorMessagePasswordReset").text(data.error);
      } else {
        alert("Password Succesfully Changed!");
        $("#forgotPassword-modal").modal("hide");
        userModel = data.user;
        $("#user-Name").text(userModel.UserName);
        $("#login-btn").hide();
        $("#logout-btn").show();
        // $("#register-btn").hide();
        $("#passwordResetEmail").show();
        $("#passwordRetrieveEmail-btn").show();
        $("#errorMessagePasswordReset").text("");
        $("#userSecurityAnswer1").val("");
        $("#userSecurityAnswer2").val("");
        $("#userNewPassword").val("");
      }
    });
  });

  $("#passwordChangeCancel-btn").click(function () {
    $("#passwordResetEmail").show();
    $("#passwordRetrieveEmail-btn").show();
    $("#errorMessagePasswordReset").text("");
  });

  function retrieveUserSecurityQuestions() {
    $("#errorMessagePasswordReset").text("");
    resetPasswordEmail = $("#passwordResetEmail").val();
    let url = "/retrieveUserSecurityQuestions?email=" + resetPasswordEmail;
    $.getJSON(url, function (data) {
      if (data.error != undefined) {
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

  function buildQuestions(data) {
    for (let i = 1; i <= 2; i++) {
      $("#SecurityQuestion" + i).empty();
      for (let j = 0; j < questionModel.length; j++) {
        let option = $("<option value='" + questionModel[j].Id + "'>" + questionModel[j].Question + "</option>");
        $("#SecurityQuestion" + i).append(option);
      }
    }
  }

  function makeUserRequest(path) {
    let email = $("#email").val();
    let password = $("#password").val();
    let userName = $("#userName").val();

    let securityQuestion1 = $("#SecurityQuestion1").val();
    let securityQuestion2 = $("#SecurityQuestion2").val();
    let securityAnswer1 = $("#SecurityAnswer1").val();
    let securityAnswer2 = $("#SecurityAnswer2").val();
    if (path == "register") {
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
    if (path == "login") {
      var url = path + "?email=" + email + "&password=" + password;
      $("#email").val("");
      $("#password").val("");
      authRequest(url);
    }

  }

  function authRequest(url) {
    let request = $.getJSON(url, function (data) {
      if (data.error != undefined) {
        $("#login-modal").modal("show");
        $("#errorMessage").text(data.error);
      } else {
        $("#content-wrapper").css("background-image", "url('')").css("background-color", "rgb(191, 192, 193)");
        $("#login-modal").modal("hide");
        userModel = data.user;
        $(".content-header").show();
        $("#userName").text(userModel.UserName);
        $("#login-btn").hide();
        $("#logout-btn").show();
        // $("#register-btn").hide();
        if (userModel.AuthLevel == 1) {
          getScanCount();
          getUserCount();
          getDBsize();
          $("#scanStatusCard").hide();
          getScanStatus();
          getMacCount();
          $("#timerCard").show();
          $("#visualScanCard").show();
          $("#todoCard").show();
          $("#deviceStatus").show();
          $("#infoBoard").show();
          $("#scanControlCard").show();
          $("#verifiedClientCard").show();
          $("#scanResults").show();
          $("#alphaScan").show();
          $("#bravoScan").show();
          $("#charlieScan").show();
          $(".sidebar").show();
        } else {
          $("#timerCard").hide();
          $("#visualScanCard").hide();
          $("#todoCard").hide();
          $("#deviceStatus").hide();
          $("#infoBoard").hide();
          $("#scanControlCard").hide();
          $("#verifiedClientCard").hide();
          $("#alphaScan").hide();
          $("#bravoScan").hide();
          $("#charlieScan").hide();
          $(".sidebar").hide();
        }
      }
    });
  }

  function loadSecurityQuestions() {
    $.getJSON("/getSecurityQuestions", function (data) {
      questionModel = data.result;
      buildQuestions();
    });
  }

  function checkUser() {
    $.getJSON("/whoIsLoggedIn", function (data) {
      userModel = data.user;
      if (userModel != undefined) {
        $(".content-header").show();
        $("#content-wrapper").css("background-image", "url('')").css("background-color", "rgb(191, 192, 193)");
        $("#user-Name").text(userModel.UserName);
        $("#login-btn").hide();
        // $("#register-btn").hide();
        if (userModel.AuthLevel == 1) {
          getScanCount();
          getDBsize();
          getMacCount();
          getScanStatus();
          $("#timerCard").show();
          $("#todoCard").show();
          $("#deviceStatus").show();
          $("#infoBoard").show();
          $("#scanControlCard").show();
          $("#scanResults").show();
          $("#verifiedClientCard").show();
          $(".sidebar").show();
        } else {
          $("#timerCard").hide();
          $("#scanActive").hide();
          $("#todoCard").hide();
          $("#deviceStatus").hide();
          $("#infoBoard").hide();
          $("#scanControlCard").hide();
          $("#scanStatusCard").hide();
          $("#scanResults").hide();
          $("#verifiedClientCard").hide();
          $(".sidebar").hide();
        }
      } else {
        $("#logout-btn").hide();
      }
    });
  }

  // SCAN

  $("#readyScan-btn").on("click", function () {
    let location = $("#location").val();
    let notes = $("#notes").val();
    let filename = $("#fileName").val();
    let url = "/readyScan?location=" + location + "&notes=" + notes + "&filename=" + filename;
    $("#location").val("");
    $("#notes").val("");
    $("#fileName").val("");
    $.getJSON(url);
    initializeModel();
  });

  $("#readyAdapter-btn").on("click", function () {
    let url = "/initAirmon";
    $.getJSON("http://10.10.10.153:3000" + url);
    $.getJSON("http://10.10.10.158:3000" + url);
    $.getJSON(url, function (data) {
      if (data.success != undefined) {
        $("#scanStatusMessage").text(data.success);
      }
    });
    $("#readyAdapter-btn").removeClass("btn-danger");
    $("#readyAdapter-btn").addClass("btn-success");
  });

  $("#beginScan-btn").on("click", function () {
    let url = "/initAirodump?filename=" + currentScanStatus.FileName;
    $.getJSON("http://10.10.10.153:3000" + url);
    $.getJSON("http://10.10.10.158:3000" + url);
    $.getJSON(url, function (data) {
      if (data.success != undefined) {
        $("#scanStatusMessage").text(data.success);
      }
    });
    $("#beginScan-btn").removeClass("btn-danger");
    $("#beginScan-btn").addClass("btn-success");
  });

  $("#processScan-btn").on("click", function () {
    let url = "/processScan?filename=" + currentScanStatus.FileName + "&scanId=" + currentScanStatus.Id;
    $.getJSON("http://10.10.10.153:3000" + url);
    $.getJSON("http://10.10.10.158:3000" + url);
    $.getJSON(url, function (data) {
      if (data.success != undefined) {
        $("#scanStatusMessage").text(data.success);
      }
    });
    loadVerifiedClients();
    $("#processScan-btn").removeClass("btn-danger");
    $("#processScan-btn").addClass("btn-success");
  });

  $("#cancelScan-btn").on("click", function () {
    currentScanStatus = {};
    $("#scanStatusMessage").text("Scan Cancelled");
    $("#scanStatusId").text("");
    $("#scanStatusLocation").text("");
    $("#scanStatusNotes").text("");
    $("#readyDir-btn").hide();
    $("#readyAdapter-btn").hide();
    $("#beginScan-btn").hide();
    $("#processScan-btn").hide();
    $("#updateImg-btn").hide();
    $("#cancelScan-btn").hide();
    $("#scanStatusCard").hide();
    $("#scanActive").hide();
    $("#readyDir-btn").removeClass("btn-success");
    $("#readyDir-btn").addClass("btn-danger");
    $("#scanControlCard").show();
    $.getJSON("/resetScanStatus");
    $.getJSON("/killAirodump");
    $.getJSON("/killAirmon");
    $.getJSON("http://10.10.10.153:3000/killAirodump");
    $.getJSON("http://10.10.10.153:3000/killAirmon");
    $.getJSON("http://10.10.10.158:3000/killAirodump");
    $.getJSON("http://10.10.10.158:3000/killAirmon");
    initializeModel();
  });

  $("#updateImg-btn").on("click", function () {
    loadVisuals();
    $('#bravoPng').attr('src', '');
    $('#bravoPng').attr('src', 'img/' + currentScanStatus.FileName + '.png');
    $('#alphaPng').attr('src', '');
    $('#alphaPng').attr('src', 'http://10.10.10.153:3000/img/' + currentScanStatus.FileName + '.png');
    $('#charliePng').attr('src', '');
    $('#charliePng').attr('src', 'http://10.10.10.158:3000/img/' + currentScanStatus.FileName + '.png');
  });

  $("#readyDir-btn").on("click", function () {
    let url = "/readyDir?filename=" + currentScanStatus.FileName;
    $.getJSON("http://10.10.10.153:3000" + url);
    $.getJSON("http://10.10.10.158:3000" + url);
    $.getJSON(url, function (data) {
      setTimeout(function () {
        if (data.error != undefined) {
          $("#scanStatusMessage").text(data.error);
        } else if (data.success != undefined) {
          $("#scanStatusMessage").text(data.success);
        }
      });
      $("#readyDir-btn").removeClass("btn-danger");
      $("#readyDir-btn").addClass("btn-success");
    }, 10000);
  });

  function getScanStatus() {
    $.getJSON("/currentScanStatus", function (data) {
      if (data.error != undefined) {
        $("#scanStatusMessage").text(data.error);
      } else if (data.scan != undefined) {
        currentScanStatus = data.scan[0];
        if (currentScanStatus != undefined) {
          $("#scanStatusCard").show();
          $("#scanControlCard").hide();
          $("#scanActive").show();
        } else {
          $("#scanStatusCard").hide();
          $("#scanControlCard").show();
          $("#scanActive").hide();
        }
        $("#scanStatusCard").find("h5").each(function () {
          $(this).removeClass("text-danger");
          $(this).addClass("text-success");
        });
        $("#scanStatusMessage").text("Scan Initialized");
        $("#scanStatusId").text(currentScanStatus.Id);
        $("#scanStatusFileName").text(currentScanStatus.FileName);
        $("#scanStatusLocation").text(currentScanStatus.Location);
        $("#scanStatusNotes").text(currentScanStatus.Notes);
        $("#readyDir-btn").show();
        $("#readyAdapter-btn").show();
        $("#beginScan-btn").show();
        $("#processScan-btn").show();
        $("#updateImg-btn").show();
        $("#cancelScan-btn").show();
      }
    });
  }

  function buildScanResultsTable() {
    $("#scanResultsTable tbody").empty();
    for (let i = 0; i < scanModel.length; i++) {
      let tr = $("<tr>");
      $(tr).append("<td scope='row'>" + scanModel[i].Id + "</td>");
      $(tr).append("<td>" + scanModel[i].DeviceName + "</td>");
      $(tr).append("<td>" + scanModel[i].Mac + "</td>");
      $(tr).append("<td>" + scanModel[i].OUI + "</td>");
      $(tr).append("<td>" + scanModel[i].Power + "</td>");
      $(tr).append("<td>" + scanModel[i].Distance + "</td>");
      $(tr).append("<td>" + scanModel[i].FTS + "</td>");
      $(tr).append("<td>" + scanModel[i].LTS + "</td>");
      $(tr).append("<td>" + scanModel[i].ScanGroup + "</td>");
      $(tr).append("</tr>");
      $("#scanResultsTable tbody").append(tr);
    }
  }

  function buildVerifiedClientTable() {
    $("#verifiedClientTable tbody").empty();
    for (let i = 0; i < verifiedClientModel.length; i++) {
      let tr = $("<tr>");
      $(tr).append("<td scope='row'>" + verifiedClientModel[i].MAC + "</td>");
      $(tr).append("<td>" + verifiedClientModel[i].ClientType + "</td>");
      $(tr).append("<td>" + verifiedClientModel[i].alphaDistance + "</td>");
      $(tr).append("<td>" + verifiedClientModel[i].bravoDistance + "</td>");
      $(tr).append("<td>" + verifiedClientModel[i].charlieDistance + "</td>");
      $(tr).append("<td>" + verifiedClientModel[i].FTS + "</td>");
      $(tr).append("<td>" + verifiedClientModel[i].ScanGroup + "</td>");
      $(tr).append("</tr>");
      $("#verifiedClientTable tbody").append(tr);
    }
    _r1 = verifiedClientModel[1].alphaDistance * 25;
    _r2 = verifiedClientModel[1].bravoDistance * 13.5;
    _r3 = verifiedClientModel[1].charlieDistance * 25; 

  }

  function loadVerifiedClients() {
    $.getJSON("/findReadyClients", function (data) {
      verifiedClientModel = data.result;
      buildVerifiedClientTable();
    });
  }

  function loadScans() {
    $.getJSON("/getScanResults", function (data) {
      scanModel = data.result;
      buildScanResultsTable();
    });
  }

  // HEADER INFO

  function getScanCount() {
    $.getJSON("/getScanCount", function (data) {
      storedScanCount = data.result;
      $('#scanCount').text(storedScanCount)
      // trackDevice(ctx);
    });
  }

  function getMacCount() {
    $.getJSON("/getMacCount", function (data) {
      storedMacSize = data.result;
      $('#macSize').text(storedMacSize)
      // trackDevice(ctx);
    });
  }

  function getUserCount() {
    $.getJSON("/getUserCount", function (data) {
      userCount = data.result;
      $('#userCount').text(userCount)
      // trackDevice(ctx);
    });
  }

  function getDBsize() {
    $.getJSON("/getDBsize", function (data) {
      dbSize = data.result;
      $('#dbSize').text(dbSize)
      // trackDevice(ctx);
    });
  }

  // RENDER VISUALS

  function loadVisuals() {
    console.log("loadVisuals() entered");
    var clientX,clientY;
    var _x1 = 120
    var _y1 = 100
    var _x2 = 320
    var _y2 = 400
    var _x3 = 520
    var _y3 = 100
    var static = document.getElementById("static");
    var ctx = static.getContext("2d");
    function drawTriangleA() {
        ctx.beginPath();
        ctx.arc(_x1, _y1, 5, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = "blue";
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(_x1, _y1, _r1 * 4.2 , 0, 2 * Math.PI);
        ctx.setLineDash([]);
        ctx.strokeStyle = 'green';
        ctx.stroke();
        ctx.closePath(); 
      }
      
    function drawTriangleB() {
        ctx.beginPath();
        ctx.arc(_x2, _y2, 5, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = "blue";
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(_x2, _y2, _r2 * 3.2, 0, 2 * Math.PI);
        ctx.setLineDash([]);
        ctx.strokeStyle = 'red';
        ctx.stroke();
        ctx.closePath(); 
      }  
      
    function drawTriangleC() {
        ctx.beginPath();
        ctx.arc(_x3, _y3, 5, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = "blue";
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(_x3, _y3, _r3 * 4.2 , 0, 2 * Math.PI);
        ctx.setLineDash([]);
        ctx.strokeStyle = 'blue';
        ctx.stroke();
        ctx.closePath(); 
      } 
      
    function drawTracked(x,y) {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = "red";
        ctx.closePath();
        ctx.fill();
      }   
      
    function trackPhone(x1,y1,r1,x2,y2,r2,x3,y3,r3){
        let A = 2*x2 - 2*x1
        let B = 2*y2 - 2*y1
        let C = r1**2 - r2**2 - x1**2 + x2**2 - y1**2 + y2**2
        let D = 2*x3 - 2*x2
        let E = 2*y3 - 2*y2
        let F = r2**2 - r3**2 - x2**2 + x3**2 - y2**2 + y3**2
        let x = (C*E - F*B) / (E*A - B*D)
        let y = (C*D - A*F) / (B*D - A*E)
        clientX = x - 31
        clientY = y + 43
        console.log(clientX,clientY)
    }
    
    drawTriangleC();
    drawTriangleB();
    drawTriangleA();
    trackPhone(_x1,_y1,_r1,_x2,_y2,_r2,_x3,_y3,_r3);
    drawTracked(clientX,clientY);
  }

  function initializeModel() {
    loadSecurityQuestions();
    checkUser();    
    loadScans();
    loadVerifiedClients();
    getScanStatus();
    if (currentScanStatus != undefined) {
      $("#scanStatusCard").show();
      $("#scanControlCard").hide();
    } else {
      $("#scanActive").hide();
    }
    $('#scanControlCard').CardWidget('toggle');
    $('#scanStatusCard').CardWidget('toggle');
    $('#timerCard').CardWidget('toggle');
    $('#visualScanCard').CardWidget('toggle');
    $('#alphaScan').CardWidget('toggle');
    $('#bravoScan').CardWidget('toggle');
    $('#charlieScan').CardWidget('toggle');
    $('#scanResults').CardWidget('toggle');
    $("#verifiedClientCard").CardWidget("toggle");
    $("#scanStatusCard").hide();
    $("#scanControlCard").hide();
    $("#timerCard").hide();
    $("#deviceStatus").hide();
    $("#infoBoard").hide();
    $("#verifiedClientCard").hide();
    $("#scanResults").hide();
    $("#readyDir-btn").hide();
    $("#readyAdapter-btn").hide();
    $("#beginScan-btn").hide();
    $("#processScan-btn").hide();
    $("#cancelScan-btn").hide();
    $("#updateImg-btn").hide();
    $(".content-header").hide();
    $(".sidebar").hide();
    $("#location").val("");
    $("#notes").val("");
    $("#fileName").val("");
  }

  // LOGS

  $("#getAlphaLog").on("click", function () {
    buildLogModal('alpha');
  });

  $("#getBravoLog").on("click", function () {
    buildLogModal('bravo');
  });

  $("#getCharlieLog").on("click", function () {
    buildLogModal('charlie');
  });

  function buildLogModal(device) {
    $('#' + device + 'Indicator').removeClass("text-warning");
    $('#' + device + 'Indicator').addClass("text-success");
    $("#deviceLogModal").hide();
    if (device == 'alpha') {
      $.getJSON("http://10.10.10.153:3000/getAlphaLog",function(data){
        alphaLog = data.result;
        $("#deviceLogModal").find(".modal-body").html(alphaLog.replace(/\u001b\[.*?m/g, ''));
      });
    } else if (device == 'bravo') {
      $.getJSON("/getBravoLog",function(data){
        bravoLog = data.result;
        $("#deviceLogModal").find(".modal-body").html(bravoLog.replace(/\u001b\[.*?m/g, ''));
      });
    } else if (device == 'charlie') {
      $.getJSON("http://10.10.10.158:3000/getCharlieLog",function(data){
        charlieLog = data.result;
        $("#deviceLogModal").find(".modal-body").html(charlieLog.replace(/\u001b\[.*?m/g, ''));
      });
    }
    $("#deviceLogModal").show();
  }

  $('#deviceLogModal').on('hidden.bs.modal', function () {
    $('#alphaIndicator').removeClass("text-success");
    $('#alphaIndicator').addClass("text-warning");
    $('#bravoIndicator').removeClass("text-success");
    $('#bravoIndicator').addClass("text-warning");
    $('#charlieIndicator').removeClass("text-success");
    $('#charlieIndicator').addClass("text-warning");
  });

  // UTILITY

  $(document).on("collapsed.lte.pushmenu", (function () { $("#scanStatusCard").hide() }));
  $(document).on("shown.lte.pushmenu", (function () { $("#scanStatusCard").show() }));

  // BEGIN

  initializeModel();

});


