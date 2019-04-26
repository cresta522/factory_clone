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
        $('title').text('Factorio Clone');
        //console.log(flash);
    }
);

$('#form_message').on('submit', () => {
    let message = 'no message';
    if($('#message').val().trim().length > 0){
        message = $('#message').val();
    }
    
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
        const message = `[${objMessage.user_name}] ${objMessage.date} - ${objMessage.message}`;
        
        const elem = $('<p>').text(message);
        $('#messages').prepend(elem);
    }
);

socket.on(
    'spread joined',
    (objMessage) => {
        
        const message = `[${objMessage.user_name}] ${objMessage.date} - ${objMessage.message}`;
        
        const p_elem = $('<p>').addClass('text-info').text(message);
        const li_elem = $('<li>').attr('id', objMessage.user_name).addClass('list-group-item').text(objMessage.user_name);
        
        $('#messages').prepend(p_elem);
        
        $('#users').append($(li_elem));
        
    }
);

socket.on(
    'disconnected',
    (user_name) => {
        $('#users #' + user_name).remove();
    }
);