$(document).ready(function() {
  let clientStack = new Stack();
  let resetPasswordEmail = "";
  let userModel, 
      questionModel,
      scanModel,
      verifiedClientModel, 
      storedScanCount, 
      storedMacSize,
      userCount,
      dbSize,
      currentScanStatus = {};

  // MODALS

  $('#login-modal').on('shown.bs.modal', function () {
    $('#email').focus();
  });

  // USER

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
      checkUser();
      $("#login-btn").show();
      $("#logout-btn").hide();
      $("#register-btn").show();
      $.getJSON("/resetScanStatus");  
      $.getJSON("/killAirodump");
      $.getJSON("/killAirmon"); 
    });
    initializeModel();
  });

  $("#confirm-register-btn").click(function() {
    makeUserRequest("register");
  });

  $("#confirm-login-btn").click(function() {
    makeUserRequest("login");
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
        $("#user-Name").text(userModel.UserName);
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

  function buildQuestions(data) {
    for(let i = 1; i <= 2; i++ ) {
      $("#SecurityQuestion" + i).empty();
      for (let j = 0; j < questionModel.length; j++ ) {
        let option = $("<option value='" + questionModel[j].Id +"'>" + questionModel[j].Question + "</option>");
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
        $("#userName").text(userModel.UserName);
        $("#login-btn").hide();
        $("#logout-btn").show();
        $("#register-btn").hide();
        if(userModel.AuthLevel == 1){
          getScanCount();
          getUserCount();
          getDBsize();
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
          $("#scanStatusCard").hide();
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
    $.getJSON("/getSecurityQuestions", function(data) {
      questionModel = data.result;
      buildQuestions();
    });
  }

  function checkUser() {
    $.getJSON("/whoIsLoggedIn", function(data) {
      userModel = data.user;
      if(userModel != undefined) {
        $("#user-Name").text(userModel.UserName);
        $("#login-btn").hide();
        $("#register-btn").hide();
        if(userModel.AuthLevel == 1){
          getScanCount();
          getUserCount();
          getDBsize();
          getMacCount();
          getScanStatus();
          $("#timerCard").show();
          $("#visualScanCard").show();
          $("#todoCard").show();
          $("#deviceStatus").show();
          $("#infoBoard").show();
          $("#scanControlCard").show();
          $("#scanStatusCard").show();
          $("#scanResults").show();
          $("#alphaScan").show();
          $("#bravoScan").show();
          $("#charlieScan").show();
          $("#verifiedClientCard").show();
          $(".sidebar").show();          
        } else {
          $("#timerCard").hide();
          $("#visualScanCard").hide();
          $("#todoCard").hide();
          $("#deviceStatus").hide();
          $("#infoBoard").hide();
          $("#scanControlCard").hide();
          $("#scanStatusCard").hide();
          $("#scanResults").hide();
          $("#alphaScan").hide();
          $("#bravoScan").hide();
          $("#charlieScan").hide();
          $("#verifiedClientCard").hide();
          $(".sidebar").hide();
        }
      } else {
        $("#logout-btn").hide();
      }
    });
  }

  // SCAN

  $("#readyScan-btn").on("click",function() {
    let location = $("#location").val();
    let notes = $("#notes").val();
    let filename = $("#fileName").val();
    let url = "/readyScan?location="+location+"&notes="+notes+"&filename="+filename;

    $("#scanStatusCard").show();
    console.log(url);
    $.getJSON(url);
    $.getJSON("http://10.10.10.153:3000" + url);
    $.getJSON("http://10.10.10.158:3000" + url);
    $("#location").text("");
    $("#notes").text("");
    $("#fileName").text("");
    getScanStatus();
  });

  $("#readyAdapter-btn").on("click",function() {
    let url = "/initAirmon";
    $.getJSON("http://10.10.10.153:3000" + url);
    $.getJSON("http://10.10.10.158:3000" + url);
    $.getJSON(url, function(data) {
      if(data.success != undefined) {
        $("#scanStatusMessage").text(data.success);
      }
    });
    $("#readyAdapter-btn").removeClass("btn-danger");
    $("#readyAdapter-btn").addClass("btn-success");
  });

  $("#beginScan-btn").on("click",function() {
    let url = "/initAirodump?filename=" + currentScanStatus.FileName;
    $.getJSON("http://10.10.10.153:3000" + url);
    $.getJSON("http://10.10.10.158:3000" + url);
    $.getJSON(url, function(data) {
      if(data.success != undefined) {
        $("#scanStatusMessage").text(data.success);
      }
    });
    $("#beginScan-btn").removeClass("btn-danger");
    $("#beginScan-btn").addClass("btn-success");
  });

  $("#processScan-btn").on("click",function() {    
    let url = "/processScan?filename=" + currentScanStatus.FileName + "&scanId=" + currentScanStatus.Id;
    $.getJSON("http://10.10.10.153:3000" + url);
    $.getJSON("http://10.10.10.158:3000" + url);
    $.getJSON(url, function(data) {
      if(data.success != undefined) {
        $("#scanStatusMessage").text(data.success);
      }
    });
    loadVerifiedClients();
    $("#processScan-btn").removeClass("btn-danger");
    $("#processScan-btn").addClass("btn-success");
  });

  $("#cancelScan-btn").on("click",function() {
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
    $("#readyDir-btn").removeClass("btn-success");
    $("#readyDir-btn").addClass("btn-danger");
    $("#scanControlCard").show();
    $.getJSON("/resetScanStatus");  
    $.getJSON("/killAirodump");
    $.getJSON("/killAirmon"); 
    $.getJSON("http://10.10.10.153:3000/resetScanStatus");
    $.getJSON("http://10.10.10.153:3000/killAirodump");
    $.getJSON("http://10.10.10.153:3000/killAirmon");  
    $.getJSON("http://10.10.10.158:3000/resetScanStatus");
    $.getJSON("http://10.10.10.158:3000/killAirodump");
    $.getJSON("http://10.10.10.158:3000/killAirmon");       
  });

  $("#updateImg-btn").on("click",function() {
    $('#bravoPng').attr('src', '');
    $('#bravoPng').attr('src', 'img/' + currentScanStatus.FileName + '.png');
    $('#alphaPng').attr('src', '');
    $('#alphaPng').attr('src', 'http://10.10.10.153:3000/img/' + currentScanStatus.FileName + '.png');
    $('#charliePng').attr('src', '');
    $('#charliePng').attr('src', 'http://10.10.10.158:3000/img/' + currentScanStatus.FileName + '.png');
  });

  $("#readyDir-btn").on("click",function() {
    let url = "/readyDir?filename=" + currentScanStatus.FileName;
    $.getJSON("http://10.10.10.153:3000" + url);
    $.getJSON("http://10.10.10.158:3000" + url);
    $.getJSON(url, function(data) {
      setTimeout(function () {
        if(data.error != undefined) {
          $("#scanStatusMessage").text(data.error);
        } else if(data.success != undefined) {
          $("#scanStatusMessage").text(data.success);
        }
      });
      $("#readyDir-btn").removeClass("btn-danger");
      $("#readyDir-btn").addClass("btn-success");
      $("#cancelScan-btn").show();
    }, 10000);
      
  });

  function getScanStatus(){
    $.getJSON("/currentScanStatus",function(data){
      if(data.error != undefined) {
        $("#scanStatusMessage").text(data.error);
      } else if(data.scan != undefined){
        currentScanStatus = data.scan[0];
        $("#scanControlCard").hide();
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
      }
    });
  }

  function buildScans(ctx,a,b){
    $.getJSON("/getScanResults", function(data) {
      scanModel = data.result;



      // ctx.lineWidth = 2;
      // for(let i = 0; i < scanModel.length; i++){
      //   ctx.beginPath();
      //   ctx.arc(a, b, Math.abs(scanModel[i].Power * 10), 0, 2 * Math.PI);
      //   ctx.setLineDash([]);
      //   ctx.stroke();
      //   ctx.closePath();
      // }
      // // trackDevice(ctx);
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
  }

  function loadVerifiedClients() {
    $.getJSON("/findReadyClients", function(data) {
      verifiedClientModel = data.result;
      buildVerifiedClientTable();
    });
  }

  function loadScans() {
    $.getJSON("/getScanResults", function(data) {
      scanModel = data.result;
      buildScanResultsTable();
    });
  }

  // HEADER INFO

  function getScanCount(){
    $.getJSON("/getScanCount", function(data) {
      storedScanCount = data.result;
      $('#scanCount').text(storedScanCount)
      // trackDevice(ctx);
    });
  }

  function getMacCount(){
    $.getJSON("/getMacCount", function(data) {
      storedMacSize = data.result;
      $('#macSize').text(storedMacSize)
      // trackDevice(ctx);
    });
  }

  function getUserCount(){
    $.getJSON("/getUserCount", function(data) {
      userCount = data.result;
      $('#userCount').text(userCount)
      // trackDevice(ctx);
    });
  }

  function getDBsize(){
    $.getJSON("/getDBsize", function(data) {
      dbSize = data.result;
      $('#dbSize').text(dbSize)
      // trackDevice(ctx);
    });
  }

  // RENDER VISUALS


  // function trackDevice(ctx){
  //   let r1 = 40
  //   let r2 = 2
  //   let r3 = 80
  //   let A = 2*1555 - 2*20
  //   let B = 2*5 - 2*5
  //   let C = r1**2 - r2**2 - 20**2 + 1555**2 - 5**2 + 5**2
  //   let D = 2*790 - 2*1555
  //   let E = 2*720 - 2*5
  //   let F = r2**2 - r3**2 - 1555**2 + 790**2 - 5**2 + 720**2
  //   let x = Math.abs((C*E - F*B) / (E*A - B*D))
  //   let y = Math.abs((C*D - A*F) / (B*D - A*E))
  //   console.log(x,y );
  //   markDevice(ctx,x,y);
  // }

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
    scanPerimeter(ctx,20,5,'A');
    // buildScans(ctx,20,5);
  }

  function drawTriangleC(ctx) {
    let height = 10 * Math.cos(Math.PI / 6);
    ctx.font = "20px Arial";
    ctx.fillText("Charlie", 1545, 50);
    ctx.fillText("Alpha", 30, 50);
    ctx.fillText("Bravo", 785, 665);
    ctx.beginPath();
    ctx.moveTo(1570, 5);
    ctx.lineTo(1540, 5);
    ctx.lineTo(1555, 30 - height);
    ctx.closePath();
    // the fill color
    ctx.fillStyle = "#FFCC00";
    ctx.closePath();
    ctx.fill();
    scanPerimeter(ctx,1555,5,'C');
    // buildScans(ctx,1555,5);
  }

  function drawTriangleB(ctx) {
    let height = 10 * Math.cos(Math.PI / 6);
    ctx.beginPath();
    ctx.moveTo(805, 720);
    ctx.lineTo(775, 720);
    ctx.lineTo(790, 695 + height);
    ctx.closePath();
    // the fill color
    ctx.fillStyle = "#FFCC00";
    ctx.fill();
    scanPerimeter(ctx,790,720,'B');
    // buildScans(ctx,790,720);
  }

  function scanPerimeter(ctx,a,b,x) {
    ctx.lineWidth = 4;
    if(x == 'A')
      ctx.strokeStyle = 'red';
    if(x == 'B')
      ctx.strokeStyle = 'green';
    if(x == 'C')
      ctx.strokeStyle = 'blue';
    ctx.textBaseline = "top";
    ctx.textAlign = "center";
    ctx.font = "15px Arial";
    ctx.fillCircleText("-50dbm Signal Range", a, b, 500, Math.PI * 1.5);
    ctx.textBaseline = "top";
    ctx.textAlign = "center";
    ctx.font = "15px Arial";
    ctx.fillCircleText("-25dbm Signal Range", a, b, 250, Math.PI * 1.5);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(a, b, 250, 0, 2 * Math.PI);
    ctx.setLineDash([5, 15]);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(a, b, 500, 0, 2 * Math.PI);
    ctx.setLineDash([5, 15]);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(a, b, 750, 0, 2 * Math.PI);
    ctx.setLineDash([5, 15]);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(a, b, 1000, 0, 2 * Math.PI);
    ctx.setLineDash([5, 15]);
    ctx.stroke();
    ctx.closePath();
  }

  function markDevice(ctx,client) {
    ctx.lineWidth = 4;
    // if(x == 'A')
    //   ctx.strokeStyle = 'red';
    // if(x == 'B')
    //   ctx.strokeStyle = 'green';
    // if(x == 'C')
    //   ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.arc(20, 5, client.alphaDistance * 500, 0, 2 * Math.PI);
    ctx.setLineDash([]);
    ctx.strokeStyle = 'red';
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(1555, 5, client.bravoDistance * 500, 0, 2 * Math.PI);
    ctx.setLineDash([]);
    ctx.strokeStyle = 'blue';
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(790, 720, client.charlieDistance * 500, 0, 2 * Math.PI);
    ctx.setLineDash([]);
    ctx.strokeStyle = 'green';
    ctx.stroke();
    ctx.closePath();        
  }

  function clearCircle(context,x,y) {
    context.save();
    context.beginPath();
    context.arc(x, y, 19, 0, 2*Math.PI, true);
    context.clip();
    context.clearRect(x-19,y-19,19*2,19*2);
    context.restore();
  }

  function loadVisuals(){
        // static canvas
        var static = document.getElementById("static");
        var staticCtx = static.getContext("2d");

        // dynamic canvas
        // var dynamic = document.getElementById("dynamic");
        // var dynamicCtx = dynamic.getContext("2d");

        // animation status
        var FPS = 30;
        var INTERVAL = 1000 / FPS;

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
                // markDevice(dynamicCtx,this.x,this.y);
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
          for( var client in verifiedClientModel){
            markDevice(staticCtx,verifiedClientModel[client]);
            // console.log();
          }
          
          
            // you can add more dynamic objects and draw here
        }

        // function clearDynamic() {
        //   let tmp = clientStack.peek();
        //   clearCircle(dynamicCtx, tmp.x, tmp.y)
        // }

        function animate() {
            setInterval(function () {
                // only need to redraw dynamic objects
                drawDynamic();

            }, INTERVAL);
        }

        drawStatic(); // draw the static objects
        animate(); // entry point for animated (dynamic) objects
  }

  function initializeModel() {
    loadSecurityQuestions();
    checkUser();
    loadVisuals();
    loadScans();
    loadVerifiedClients();
    getScanStatus();
    $('#scanControlCard').CardWidget('toggle');
    $('#scanStatusCard').CardWidget('toggle');
    $('#timerCard').CardWidget('toggle');
    $('#visualScanCard').CardWidget('toggle');
    $('#alphaScan').CardWidget('toggle');
    $('#bravoScan').CardWidget('toggle');
    $('#charlieScan').CardWidget('toggle');      
    $('#scanResults').CardWidget('toggle');
    $("#verifiedClientCard").CardWidget("toggle");
    $("#timerCard").hide();
    $("#visualScanCard").hide();
    $("#deviceStatus").hide();
    $("#infoBoard").hide();
    $("#scanControlCard").hide();
    $("#scanStatusCard").hide();
    $("#verifiedClientCard").hide();
    $("#scanResults").hide();
    $("#alphaScan").hide();
    $("#bravoScan").hide();
    $("#charlieScan").hide();
    $("#readyDir-btn").hide();
    $("#readyAdapter-btn").hide();
    $("#beginScan-btn").hide();
    $("#processScan-btn").hide();
    $("#cancelScan-btn").hide();
    $("#updateImg-btn").hide();
    $(".sidebar").hide();
  }

  // UTILITY

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  // BEGIN

  initializeModel();

});


