var $ = window.$ = window.jQuery = require('jquery');
var _ = require('underscore');
var Handlebars = require('handlebars');
require('bootstrap-sass');
var moment = require('moment');
var personalInfoUrl = "https://api.github.com/users/lycanthrope444";
var repoInfoUrl = "https://api.github.com/users/lycanthrope444/repos";
var orgUrl = "https://api.github.com/users/lycanthrope444/orgs";
var starsUrl = "https://api.github.com/users/lycanthrope444/starred";
var githubtoken ;//= require('./gitapikey.js');

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
  $.ajax(starsUrl).done(function(starsData){
    console.log(data);
    console.log(starsUrl);
    var source = $('#user-links').html();
    var template = Handlebars.compile(source);
    var userInfo = {
      userOverview: data.html_url,
      repoNum: data.public_repos,
      starNum: starsData.length,
      followerNum: data.followers,
      followingNum: data.following
    };
    $('.staticbar').append(template(userInfo));
  });

  //section for user profile - called here since
  var source = $('#sidebar-info').html();
  var template = Handlebars.compile(source);
  var sidebarInfo = {
    profilePic: data.avatar_url,
    location: data.location,
    email: data.email,
    bio: data.bio,
    name: data.name,
    userName: data.login
  };
  $('.user-sidebar').append(template(sidebarInfo));

  source = $('#tinypic').html();
  template = Handlebars.compile(source);
  $('.tinypic').append(template(sidebarInfo));
});

// Used to populate Repository Info
$.ajax(repoInfoUrl).done(function(data){
  // console.log(data);
  var repoSource = $('#repo-template').html();
  var repoTemplate = Handlebars.compile(repoSource);
  var sortedRepos = _.sortBy(data, "updated_at").reverse();
  _.last(sortedRepos, sortedRepos.length);

  _.each(sortedRepos, function(info){
    var repoInfo = {
      name: info.name,
      url: info.url,
      language: info.language,
      updated: moment(info.updated_at).fromNow()
    };
    // console.log(repoInfo);
    $(".repo-list").append(repoTemplate(repoInfo));
  });
});

// Organization Info
$.ajax(orgUrl).done(function(data){
  var orgSource = $('#orgs-info').html();
  var orgTemplate = Handlebars.compile(orgSource);
  _.each(data, function(info){
    var orgsInfo = {
      orgUrl: info.url,
      orgPic: info.avatar_url
    };

    $(".org-row").append(orgTemplate(orgsInfo));
  });
});

// Nav-bar sticky
// http://stackoverflow.com/questions/1216114/how-can-i-make-a-div-stick-to-the-top-of-the-screen-once-its-been-scrolled-to?rq=1
// I did modify the above code to work much smoother for this project.
function moveScroller() {
    var $anchor = $("#scroller-anchor");
    // console.log($anchor);
    var $scroller = $('#scroller');
    // console.log($scroller);
    // var $stickysidebar = $('#stickysidebar');
    // console.log($stickysidebar);
    var move = function() {
        var st = $(window).scrollTop();
        var ot = $anchor.offset().top;
        // var sa = $sideanchor.offset().top;
        // console.log(st, ot);
        //Nav bar Sticky
        if(st > ot) {
            $scroller.css({
                position: "fixed",
                top: "0px",
                padding: "24px"
            });
            $anchor.css({
              height: "68px"
            });
        } else {
          if(st <= ot) {
              $scroller.css({
                  position: "relative",
                  top: ""
              });
              $anchor.css({
                height: "0px"
              });
          }
        }
        // Side Bar Sticky
        // if(st > 285){
        //   $stickysidebar.css({
        //       display: "block",
        //       height: "62px"
        //       // position:
        //   });
        // } else {
        //   if(st <= 285) {
        //       $stickysidebar.css({
        //           display: "none"
        //       });
        //   }
        // }
    };
    $(window).scroll(move);
    move();
}

$(function() {
  moveScroller();
});
