// request to connect
const socket = io.connect();

/*
    After connectiong, 
    event occured "connection" in server and "connect" in client
*/
// events
socket.on(
    'connect',
    () =>{
        console.log('connected!');
    }
);

$('#form_message').on('submit', () => {
    let message = 'no message';
    if($('#message').val().trim().length > 0){
        message = $('#message').val();
    }
    
    console.log('new message is ' + message);
    
    // create event 'new message'
    socket.emit('new message', message);
    
    $('#message').val('');
    
    return false;
});

$('#form_join').on('submit', () => {
    
    let name = 'no name';
    if($('#input_name').val().trim().length > 0){
        name = $('#input_name').val();
    }
    
    console.log('user nema is ' + name);
    
    socket.emit('join', name);
    
    $('#show_name').text(name);
    $('#message_screen').show();
    $('#login_screen').hide();
    
    return false;
});

$(() => {
    $('#message_screen').hide();
});

// socket functions
socket.on(
    'spread message',
    (objMessage) => {
        console.log('spread message: ', objMessage);
        
        const message = `[${objMessage.user_name}] ${objMessage.date} - ${objMessage.message}`;
        
        const li_elem = $('<li>').addClass('list-group-item').text(message);
        $('#messages').prepend(li_elem);
    }
);