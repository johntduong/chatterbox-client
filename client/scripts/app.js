// YOUR CODE HERE:
var messages = [];
var app;
var rooms = new Set();
$(document).ready(function() {
  //console.log('hello there i am readya');
  app = {
    server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    friends: {},
    storage: {},
    username: window.location.search.slice(window.location.search.indexOf('=') + 1),
    init: function() {
    },
    send: function(message) {
      $.ajax({
        // This is the url you should use to communicate with the parse API server.
        url: app.server,
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (data) {
          
          app.renderMessage(message);
          console.log('chatterbox: Message sent');
        },
        error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to send message', data);
        }
      });
    },
    fetch: function() {
      $.ajax({
        // This is the url you should use to communicate with the parse API server.
        url: app.server,
        type: 'GET',
        //data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (response) {
          console.log(response.results);
          //app.storage = result
          _.each(response.results, function(message) {
            messages.push(message);
            rooms.add(message.roomname);
            app.renderMessage(message);
          });
          console.log(rooms);
        },
        error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to get message', data);
        }
      });
    },
    clearMessages: function() {
      $('#chats').empty();
    },
    renderMessage: function(message) {
      console.log(message);
      $('#chats').append(`<div> <button class="username"> ${message.username} </button> ${message.text} </div>`);
      $('#main').append(`<button class="username"> ${message.username} </button>`);
    },
    addRoom: function(room) {
      console.log(room);
      rooms.add(room);
      $('.dropdown').append(`<option> ${room} </option>`);
    },
    renderRoom: function(room) {
      // $('').append(`<div> ${room} </div>`);
    },
    handleUsernameClick: function(value) {
      //add friend to app.friends object
      console.log(value);
    },
    handleSubmit: function(message) {
      app.send(message);
    }
  };
  // app.storage = app.fetch(function(val) {
  //   console.log(val);
  //   return val;
  // });
  app.fetch();
  $('.dropdown').on('change', function() {
    var room = $('.dropdown').val();
    
  });
  $('.addRoom').on('click', function() {
    var newRoom = $('.enterNewRoom').val();
    app.addRoom(newRoom);
    //app.renderRoom(newRoom);
  });
  $('body').on('change', '.dropdown', function() {
    renderMessage();
  });
  $('body').on('click', '.username', function() { app.handleUsernameClick(); });
  $('form').submit(function( event ) {
    var msgObj = {
      username: app.username,
      text: $('#enterMessage').val(),
      roomname: $('.dropdown').val()
    };
    app.handleSubmit(msgObj);
  });
});