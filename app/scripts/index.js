var $ = window.$ = window.jQuery = require('jquery');
var _ = require('underscore');
var Handlebars = require('handlebars');
require('bootstrap-sass');
var personalInfoUrl = "https://api.github.com/users/lycanthrope444";
var repoInfoUrl = "https://api.github.com/users/lycanthrope444/repos";
var githubtoken = require('./gitapikey.js');
var repoSource = $('#repo-template').html();
var repoTemplate = Handlebars.compile(repoSource);

// Send auth token to github if token is provided
if(githubtoken !== undefined){
  $.ajaxSetup({
    headers: {
      'Authorization': 'token ' + githubtoken.token
    }
  });
}

$.ajax(personalInfoUrl).done(function(data){
  console.log(data);
  // var userInfo = {
  //   profilePic:
  // }

});

$.ajax(repoInfoUrl).done(function(data){
  console.log(data);
  _.each(data, function(info){
    var repoInfo = {
      url: info.url,
      language: info.language
    };
  });
});
