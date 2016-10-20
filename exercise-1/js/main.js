// Main.js
$(function() {
    // Initialize Firebase using the configuration of your project
    var config = {
    apiKey: "AIzaSyAQDxm4Ne3Pwz4YWnq5afyPjUPRr4_BKFA",
    authDomain: "test-project-ce663.firebaseapp.com",
    databaseURL: "https://test-project-ce663.firebaseio.com",
    storageBucket: "test-project-ce663.appspot.com",
    messagingSenderId: "982602873791"
    };
    firebase.initializeApp(config);

    // Create new database reference 'todos'
    var todos = firebase.database().ref('todos');

    // Set listener: on change, empty the todo list, and iterate through to make a new list
    todos.on('value', function(snapshot) {
        $('#todo-list').empty();

        // Iterate through elements
        var items = snapshot.val();
        if (items !== null) {
            Object.keys(items).forEach(function(key) {
                renderTodo(key, items[key]);
            });
        }

    });

    // Function to make todos
    var renderTodo = function(id, content) {
        // Create new todo <div> with classes 'todo', and the priority of the item
        var newTodo = $('<div>').attr('class', 'todo ' + content.priority);

        // Create an <h5> element, set it's text to the description, and class as the status
        var text = $('<h5>').text(content.description).attr('class', content.status);
        newTodo.append(text);

        // Complete icon with click event
        var completeIcon = $('<i>').attr('class', "fa fa-check fa-2x " + content.status);
        completeIcon.on('click', function() {
            // Flip the status on click
            var status = content.status == 'complete' ? 'incomplete' : 'complete';

            // Set the child values of this item
            todos.child(id).set({
                description: content.description,
                priority: content.priority,
                status: status
            });
        });

        // Delete icon: on click, remove the reference
        var deleteIcon = $('<i>').attr('class', "fa fa-times fa-2x");
        deleteIcon.on('click', function() {
            todos.child(id).remove();
        });

        // Append the icons to the newTodo item
        newTodo.append(completeIcon).append(deleteIcon);

        // Append to page
        $('#todo-list').append(newTodo);
    };

    // Form submission
    $('form').on('submit', function(event) {
        event.preventDefault();

        // Get values
        var priority = $(this).find('input:checked')[0].id;
        var text = $(this).find('input').val();

        // Push new item into todos
        todos.push({
            description: text,
            priority: priority,
            status: 'incomplete'
        });

        // Reset the form
        this.reset();
    });
});