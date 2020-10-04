$(document).ready(function() {
  /// Model
  var snippetModel = {};
  var userModel = {};
  var currentFilter = '';
  var filterOn ='';
  var filter ='';
  var sortOn = '';
  var order = '';
  var searchType;
  var IdFromRow,CreatorFromRow,LanguageFromRow,Description,SnippetFromRow;

  function initializeModel(){
    WipeFilter();
    $('#category').val(0);
    $('.sortNoFilter').show();
    $('.sortFilter').hide();
    $.getJSON("/findSnippets", function(data) {
      snippetModel = data.result;
      BuildTable();
    });
  };

  /// Views
  $('#dbModal').modal({backdrop: "static", keyboard: false, show:false}).on('show.bs.modal', function(){
    IdFromRow = $(event.target).closest('tr').data('id');
    CreatorFromRow = $(event.target).closest('tr').data('creator');
    LanguageFromRow = $(event.target).closest('tr').data('language');
    DescriptionFromRow = $(event.target).closest('tr').data('description');
    SnippetFromRow = $(event.target).closest('tr').data('snippet');
    BuildModalFromTable(this);

    function BuildModalFromTable(table_this){
      $(table_this).find('.modal-title ').html(' Viewing ID # ' + IdFromRow );
      $(table_this).find('.modal-body').html($('<p class="text-secondary"> Creator: ' + CreatorFromRow + '</p><p class="text-secondary"> Language: ' + LanguageFromRow + '</p><p class="text-secondary"> Description: ' + DescriptionFromRow + '</p><h3 class="text-primary">  Snippet: </h3><code>' + SnippetFromRow + '</code>'));
    }
  });

  $(document).on('click', '#ddCreatorAscFilterOrder', function(){
    sortOn = 'Creator';
    order = 'ASC';
    BuildAndMakeRequest();
  });

  $(document).on('click', '#ddCreatorDescFilterOrder', function(){
    sortOn = 'Creator';
    order = 'DESC';
    BuildAndMakeRequest();
  });

  $(document).on('click', '#ddDescriptionAscFilterOrder', function(){
    sortOn = 'Description';
    order = 'ASC';
    BuildAndMakeRequest();
  });

  $(document).on('click', '#ddDescriptionDescFilterOrder', function(){
    sortOn = 'Description';
    order = 'DESC';
    BuildAndMakeRequest();
  });

  $(document).on('click', '#ddLanguageAscFilterOrder', function(){
    sortOn = 'Language';
    order = 'ASC';
    BuildAndMakeRequest();
  });

  $(document).on('click', '#ddLanguageDescFilterOrder', function(){
    sortOn = 'Language';
    order = 'DESC';
    BuildAndMakeRequest();
  });

  $(document).on('click', '#ddCreatorAsc', function(){
    sortOn = 'Creator';
    order = 'ASC';
    BuildAndMakeRequest();
  });

  $(document).on('click', '#ddCreatorDesc', function(){
    sortOn = 'Creator';
    order = 'DESC';
    BuildAndMakeRequest();
  });

  $(document).on('click', '#ddCreatorAscFilter', function(){
    sortOn = 'Creator';
    order = 'ASC';
    BuildAndMakeRequest();
  });

  $(document).on('click', '#ddCreatorDescFilter', function(){
    sortOn = 'Creator';
    order = 'DESC';
    BuildAndMakeRequest();
  });

  $(document).on('click', '#ddLanguageAsc', function(){
    sortOn = 'Language';
    order = 'ASC';
    BuildAndMakeRequest();
  });

  $(document).on('click', '#ddLanguageDesc', function(){
    sortOn = 'Language';
    order = 'DESC';
    BuildAndMakeRequest();
  });

  $(document).on('click', '#ddDescriptionAsc', function(){
    sortOn = 'Description';
    order = 'ASC';
    BuildAndMakeRequest();
  });

  $(document).on('click', '#ddDescriptionDesc', function(){
    sortOn = 'Description';
    order = 'DESC';
    BuildAndMakeRequest();
  });

  /// Search & Clear Search
  $("#search-buttons").click(function() {
    if ($('#criteria').val() == "" || $('#criteria').val() == null || $('#category').val() == 0 || $('#category').val() == null) {
      ClearSearch();
      alert("Search is incomplete. Please check your Filter or Criteria");
    } else {
      SubmitForm();
    }
  });

  function SubmitForm() {
    $('.sortNoFilter').hide();
    $('.sortFilter').show();
    if(filterOn == 'Creator'){
      $('#sort-creator-dropdown-filter').hide();
    }else if (filterOn == 'Language'){
      $('#sort-language-dropdown-filter').hide();
    }else if (filterOn == 'Description'){
      $('#sort-description-dropdown-filter').hide();
    }
    BuildAndMakeRequest();
  }

  $(document).on('submit', '#search', function() {
    if ($('#criteria').val() == "" || $('#criteria').val() == null || $('#category').val() == 0 || $('#category').val() == null) {
      ClearSearch();
    } else {
      SubmitForm();
    }
    return false;
  });

  $("#clear-search").click(function() {
    WipeFilter();
    initializeModel();
  });
  /// Helper Functions
  function BuildTable(data){
    $('#my-table tbody').empty();
    for (let i = 0; i < snippetModel.length; i++) {
      let tr = $('<tr data-toggle="modal" data-id="' + snippetModel[i].Id +'" data-target="#dbModal" data-backdrop="static" data-keyboard="false" data-creator="' + snippetModel[i].Creator + '" data-language="' + snippetModel[i].Language + '" data-description="' + snippetModel[i].Description + '" data-snippet="' + snippetModel[i].Snippet + '">');
      $(tr).append("<td scope='row'>" + snippetModel[i].Id + "</td>");
      $(tr).append("<td>" + snippetModel[i].Creator + "</td>");
      $(tr).append("<td>" + snippetModel[i].Language + "</td>");
      $(tr).append("<td>" + snippetModel[i].Description + "</td>");
      $(tr).append("<td><code>" + snippetModel[i].Snippet + "</code></td>");
      $(tr).append("</tr>");
      $('#my-table tbody').append(tr);
  }};

  function WipeFilter(){
    $('#criteria').val("");
    $('#category').val(0);
    sortOn = '';
    currentFilter = '';
    filterOn = '';
    filter = '';
    order = '';
    $("#currentFilter").text('');
    $('.sortNoFilter').show();
  }

  function BuildAndMakeRequest(){
    let queryString = '/findSnippets?';
    if($("#category").val() != ''){
      filterOn = $("#category").val();
      filter = encodeURIComponent($("#criteria").val());
      queryString += "filterOn=" + filterOn + "&filter=" + filter;
    }
    if(sortOn != undefined && $("#category").val() != '' )
      queryString += "&sortOn=" +sortOn+ "&order=" + order;
    else
      queryString += "sortOn=" +sortOn+ "&order=" + order;
    SendQuery(queryString);
  }

  function SendQuery(this_query){
    $.getJSON(this_query, function(data) {
      snippetModel = data.result;
      BuildTable();
    });
  }

  function makeAuthenticationRequest(path) {
    let email = $("#email").val();
    let password = $("#password").val();
    let firstName = $("#firstName").val();
    let lastName = $("#lastName").val();

    let url = path + "?email=" + email + "&password=" + password + "&firstName=" + firstName + "&lastName=" + lastName;

    let request = $.getJSON(url,function(data){
      userModel = data.result;
      $("#userName").text("Welcome " + userModel.FirstName);
    });

    $("#email").val("");
    $("#password").val("");
    $("#firstName").val("");
    $("#lastName").val("");

    $("#login-modal").modal("hide");
  }

  $("#register-btn").click(function() {
    $("#email").val("");
    $("#password").val("");

    $("#confirm-login-btn").hide();
    $("#confirm-register-btn").show();

    $("#login-modal-title").text("Register New User");

    $("#login-modal").modal("show");
  });

  $("#confirm-register-btn").click(function() {
    makeAuthenticationRequest("register");
  });

  $(document).ready(function () {
      $("#sidebar").mCustomScrollbar({
          theme: "minimal"
      });

      $('#sidebarCollapse').on('click', function () {
          $('#sidebar, #content').toggleClass('active');
          $('.collapse.in').toggleClass('in');
          $('a[aria-expanded=true]').attr('aria-expanded', 'false');
      });
  });

  initializeModel();
});
