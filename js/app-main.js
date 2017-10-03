$(document).ready(function() {
  // =================================
  // Helper functions
  // =================================
  function addMessage(message, author, time, edited) {
    if (message) {
      let postInfo = `${author} | ${time}`;
      if (edited) {
        edited = moment(+edited).format("MMM D");
        postInfo += ` | Last edited: ${edited}`;
      }
      let messageDiv = $("<div/>")
        .addClass("messageDiv")
        .text(message);
      let authorTimeDiv = $("<div/>")
        .addClass("authorTimeDiv")
        .text(postInfo);

      messageDiv.linkify({
        target: "_blank"
      });

      $("<div/>")
        .addClass("message")
        .append(messageDiv)
        .append(authorTimeDiv)
        .appendTo(".chat");
    }
  }

  function setUsername() {
    let newName = prompt("Please enter your name");
    if (username && newName === null) {
      return;
    }
    !newName ? setUsername() : (username = newName);
  }

  function sendMessage(...args) {
    socket.emit("user message", args);
  }

  function alertUser(msg) {
    $(".user-alert")
      .text(msg)
      .fadeIn(2000)
      .fadeOut(1000);
  }

  // =================================
  // Initialization
  // =================================
  const socket = io();
  let username;
  setUsername();

  // Stub AJAX call that demos getting the fixture data
  $.getJSON("/fixtures/fakedata.json", function(data) {
    console.log("Successfully retrieved messages");
    console.log(data);

    // If messages arn't sorted on the backend sort and use messages
    // const messages = data.messages.sort((a, b) => a.timestamp - b.timestamp);

    for (let i = 0; i < data.messages.length; i++) {
      let message = data.messages[i].content;
      let author = data.messages[i].author;
      let momentTime = moment(data.messages[i].timestamp).format("MMM D");
      let lastEdited = data.messages[i].last_edited;
      addMessage(message, author, momentTime, lastEdited);
    }
  })
    .done(function() {
      console.log("Successfully initialized chat");
      $(".chat").animate({ scrollTop: $(".chat")[0].scrollHeight }, 1000);
    })
    .fail(function(err) {
      console.error(`Error retrieving messages! ${err}`);
    })
    .always(function() {
      console.info("Initialization complete");
    });

  // =================================
  // Event handlers
  // =================================

  $(".chat-form").on("submit", e => {
    e.preventDefault();
    let content = $(".chat-form input").val();
    let timestamp = Date.now();
    let momentTime = moment(timestamp).format("MMM D");
    let messageObj = {
      author: username,
      content,
      timestamp
    };

    // Send messageObj to backend
    // If successful, post message to frontend
    addMessage(content, username, momentTime);
    sendMessage(content, username, momentTime);
    $(".chat").animate({ scrollTop: $(".chat")[0].scrollHeight }, 1000);
    // Else, inform user that there is an error

    $(".chat-form input").val("");
  });

  $(".user-icon").on("click", setUsername);

  socket.on("user connect", alertUser);

  socket.on("user disconnect", alertUser);

  socket.on("chat message", msg => {
    addMessage(...msg);
    $(".chat").animate({ scrollTop: $(".chat")[0].scrollHeight }, 1000);
  });
});
