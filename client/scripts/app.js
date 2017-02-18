// YOUR CODE HERE:
var messages = [];
var app;
var rooms = new Set();
const ESC_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};
var escapeString = function(map, str) {
  var result = '';
  for (var i = 0; i < str.length; i++) {
    if (Object.keys(map).includes(str[i])) {
      result += map[str[i]];
    } else {
      result += str[i];
    }
  }
  return result;
};

$(document).ready(function() {
  //console.log('hello there i am readya');
  app = {
    server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    friends: new Set(),
    storage: {},
    username: escapeString(ESC_MAP, window.location.search.slice(window.location.search.indexOf('=') + 1)),
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
          console.log('data', data);
          
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
        data: 'order=-createdAt',
        //data: {order: '-createdAt'},
        contentType: 'application/json',
        success: function (response) {
          app.clearMessages();
          console.log(response.results);
          //app.storage = result
          _.each(response.results, function(message) {
            //console.log(message.text);
            if (message.text) {
              messages.push(message);
              rooms.add(message.roomname);
              app.renderMessage(message);
            }
          });
          $('#roomSelect').empty();
          _.each(Array.from(rooms), app.renderRoom
            );
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
      var person = message.username;
      if (app.friends.has(person)) {
        console.log('enter');
        $('#chats').append(`<div style="font-weight:bold"> <button class="username "> ${person} </button>${escapeString(ESC_MAP, message.text)}</div>`);
      } else {
        $('#chats').append(`<div> <button class="username"> ${person} </button> ${escapeString(ESC_MAP, message.text)} </div>`);
      }
      //$('#main').prepend(`<button class="username"> ${message.username} </button>`);
    },
    addRoom: function(room) {
      console.log(room);
      rooms.add(room);
      //$('.dropdown').append(`<option> ${room} </option>`);
      app.renderRoom(room);
    },
    renderRoom: function(room) {
      console.log(room);
      $('#roomSelect').append(`<option> ${room} </option>`);
    },
    handleUsernameClick: function(value) {
      //add friend to app.friends set
      console.log('friends are', value);
      app.friends.add(value.trim());
    },
    handleSubmit: function(message) {
      app.send(message);
      messages.push(message);
    }
  };
  app.fetch();
  setInterval(function() {
    app.fetch();
  }, 5000);
  $('#roomSelect').on('change', function() {
    var room = $('#roomSelect').val();
    app.clearMessages();
    _.each(messages, function(message) {
      if (message.roomname === room) {
        app.renderMessage(message);
      }
    });
  });
  $('.addRoom').on('click', function() {
    var newRoom = $('.enterNewRoom').val();
    app.addRoom(newRoom);
    //app.renderRoom(newRoom);
  });
  $('body').on('click', '.username', function(event) { 
    //console.log($(this).text());
    app.handleUsernameClick($(this).text()); 
  });
  $('form').submit(function(event) {
    event.preventDefault();
    var msgObj = {
      username: app.username,
      text: escapeString(ESC_MAP, $('#message').val()),
      roomname: $('#roomSelect').val()
    };
    app.handleSubmit(msgObj);
  });
});