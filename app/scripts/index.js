var $ = window.$ = window.jQuery = require('jquery');
var _ = require('underscore');
var Handlebars = require('handlebars');
require('bootstrap-sass');
var personalInfoUrl = "https://api.github.com/users/lycanthrope444";
var repoInfoUrl = "https://api.github.com/users/lycanthrope444/repos";
var githubtoken = require('./gitapikey.js');

// Send auth token to github if token is provided
if(githubtoken !== undefined){
  $.ajaxSetup({
    headers: {
      'Authorization': 'token ' + githubtoken.token
    }
  });
}

//Used to populate Personal Info
$.ajax(personalInfoUrl).done(function(data){
  console.log(data);
  var source = $('#user-links').html();
  var template = Handlebars.compile(source);
  var userInfo = {
    userOverview: data.html_url,
    repoNum: data.public_repos,
    // starNum: data.
    followerNum: data.followers,
    followingNum: data.following
  };
  $('.staticbar').append(template(userInfo));

  //section for user profile - called here since
  source = $('#sidebar-info').html();
  template = Handlebars.compile(source);
  var sidebarInfo = {
    profilePic: data.avatar_url,
    email: data.email,
    name: data.name,
    userName: data.login
  };
  $('.user-sidebar').append(template(sidebarInfo));
});

// Used to populate Repository Info
$.ajax(repoInfoUrl).done(function(data){
  console.log(data);
  var repoSource = $('#repo-template').html();
  var repoTemplate = Handlebars.compile(repoSource);
  _.each(data, function(info){
    var repoInfo = {
      name: info.name,
      url: info.url,
      language: info.language
    };
    // console.log(repoInfo);
    $(".repo-list").append(repoTemplate(repoInfo));
  });
});
