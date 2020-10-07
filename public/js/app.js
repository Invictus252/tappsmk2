$(document).ready(function() {

  var snippetModel = {};
  var userModel = {};
  var currentFilter = "";
  var filterOn ="";
  var filter ="";
  var sortOn = "";
  var order = "";
  var searchType;
  var idFromRow,creatorFromRow,languageFromRow,description,snippetFromRow;

  $("#dbModal").modal({backdrop: "static", keyboard: false, show:false}).on("show.bs.modal", function(){
    idFromRow = $(event.target).closest("tr").data("id");
    creatorFromRow = $(event.target).closest("tr").data("creator");
    languageFromRow = $(event.target).closest("tr").data("language");
    descriptionFromRow = $(event.target).closest("tr").data("description");
    snippetFromRow = $(event.target).closest("tr").data("snippet");
    buildModalFromTable(this);

    function buildModalFromTable(table_this){
      $(table_this).find(".modal-title ").html(" Viewing ID # " + idFromRow );
      $(table_this).find(".modal-body").html($("<p class='text-secondary'> Creator: " + creatorFromRow + "</p><p class='text-secondary'> Language: " + languageFromRow + "</p><p class='text-secondary'> Description: " + descriptionFromRow + "</p><h3 class='text-primary'>  Snippet: </h3><code>" + snippetFromRow + "</code>"));
    }
  });

  $("#ddCreatorAscFilterOrder").click(function() {
    sortOn = "Creator";
    order = "ASC";
    buildAndMakeRequest();
  });

  $("#ddCreatorDescFilterOrder").click(function() {
    sortOn = "Creator";
    order = "DESC";
    buildAndMakeRequest();
  });

  $("#dddescriptionAscFilterOrder").click(function() {
    sortOn = "description";
    order = "ASC";
    buildAndMakeRequest();
  });

  $("#dddescriptionDescFilterOrder").click(function() {
    sortOn = "description";
    order = "DESC";
    buildAndMakeRequest();
  });

  $("#ddLanguageAscFilterOrder").click(function() {
    sortOn = "Language";
    order = "ASC";
    buildAndMakeRequest();
  });

  $("#ddLanguageDescFilterOrder").click(function() {
    sortOn = "Language";
    order = "DESC";
    buildAndMakeRequest();
  });

  $("#ddCreatorAsc").click(function() {
    sortOn = "Creator";
    order = "ASC";
    buildAndMakeRequest();
  });

  $("#ddCreatorDesc").click(function() {
    sortOn = "Creator";
    order = "DESC";
    buildAndMakeRequest();
  });

  $("#ddCreatorAscFilter").click(function() {
    sortOn = "Creator";
    order = "ASC";
    buildAndMakeRequest();
  });

  $("#ddCreatorDescFilter").click(function() {
    sortOn = "Creator";
    order = "DESC";
    buildAndMakeRequest();
  });

  $("#ddLanguageAsc").click(function() {
    sortOn = "Language";
    order = "ASC";
    buildAndMakeRequest();
  });

  $("#ddLanguageDesc").click(function() {
    sortOn = "Language";
    order = "DESC";
    buildAndMakeRequest();
  });

  $("#ddDescriptionAsc").click(function() {
    sortOn = "Description";
    order = "ASC";
    buildAndMakeRequest();
  });

  $("#ddDescriptionDesc").click(function() {
    sortOn = "Description";
    order = "DESC";
    buildAndMakeRequest();
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
    $("#userName").show();
    $("#confirm-register-btn").show();
    $("#login-modal-title").text("Register New User");
    $("#login-modal").modal("show");
  });

  $("#login-btn").click(function() {
    $("#errorMessage").text("");
    $("#successMessage").text("");
    $("#email").val("");
    $("#password").val("");
    $("#confirm-register-btn").hide();
    $("#userName").hide();
    $("#confirm-login-btn").show();
    $("#login-modal-title").text("Login");
    $("#login-modal").modal("show");
  });

  $("#confirm-register-btn").click(function() {
    makeAuthenticationRequest("register");
  });

  $("#confirm-login-btn").click(function() {
    makeAuthenticationRequest("login");
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

  $("#sidebar").mCustomScrollbar({
    theme: "minimal"
  });

  function submitForm() {
    $(".sortNoFilter").hide();
    $(".sortFilter").show();
    if(filterOn == "Creator"){
      $("#sort-creator-dropdown-filter").hide();
    } else if (filterOn == "Language") {
      $("#sort-language-dropdown-filter").hide();
    } else if (filterOn == "description") {
      $("#sort-description-dropdown-filter").hide();
    }
    buildAndMakeRequest();
  }

  function buildTable(data) {
    $("#my-table tbody").empty();
    for (let i = 0; i < snippetModel.length; i++) {
      let tr = $("<tr data-toggle='modal' data-id='" + snippetModel[i].Id +"' data-target='#dbModal' data-backdrop='static' data-keyboard='false' data-creator='" + snippetModel[i].Creator + "' data-language='" + snippetModel[i].Language + "' data-description='" + snippetModel[i].Description + "' data-snippet='" + snippetModel[i].Snippet.replace(/'/g,"&quot;") + "'>");
      $(tr).append("<td scope='row'>" + snippetModel[i].Id + "</td>");
      $(tr).append("<td>" + snippetModel[i].Creator + "</td>");
      $(tr).append("<td>" + snippetModel[i].Language + "</td>");
      $(tr).append("<td>" + snippetModel[i].Description + "</td>");
      $(tr).append("<td><code>" + snippetModel[i].Snippet.replace(/'/g,"&quot;") + "</code></td>");
      $(tr).append("</tr>");
      $("#my-table tbody").append(tr);
    }
  };

  function wipeFilter(){
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

  function buildAndMakeRequest() {
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

  function makeAuthenticationRequest(path) {
    let email = $("#email").val();
    let password = $("#password").val();
    let userName = $("#userName").val();
    if(path == "register"){
      var url = path + "?email=" + email + "&password=" + password + "&userName=" + userName;
      registerUser(url);
    }
    if(path == "login"){
      var url = path + "?email=" + email + "&password=" + password;
      loginUser(url);
    }
  }

  function registerUser(url) {
    $("#successMessage").text("");
    $("#email").val("");
    $("#password").val("");
    $("#userName").val("");
    let request = $.getJSON(url,function(data){
      if(data.error != undefined){
        $("#login-modal").modal("show");
        $("#errorMessage").text(data.error);
      }else{
        $("#successMessage").text("User successfully created!");
      }
    });
  }

  function loginUser(url) {
    $("#email").val("");
    $("#password").val("");
    let request = $.getJSON(url,function(data){
      if(data.error != undefined){
        $("#login-modal").modal("show");
        $("#errorMessage").text(data.error);
      }
      else{
        $("#login-modal").modal("hide");
        userModel = data.user;
        $("#user-Name").text("Welcome " + userModel.UserName);
        $("#login-btn").hide();
      }
    });
  }

  function initializeModel() {
    wipeFilter();
    $("#category").val(0);
    $(".sortNoFilter").show();
    $(".sortFilter").hide();
    $.getJSON("/findSnippets", function(data) {
      snippetModel = data.result;
      buildTable();
    });
    $("#logout-btn").hide();
  };

  initializeModel();
});
