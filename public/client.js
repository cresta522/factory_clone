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

$('#btn_send').on('click', () => {
    let message = 'no message';
    if($('#message').val().trim().length > 0){
        message = $('#message').val();
    }
    
    console.log($('#message').val());
    
    console.log('new message is ' + message);
    
    // create event 'new message'
    socket.emit('new message', message);
    
    $('#message').val('');
    
    return false;
});

socket.on(
    'spread message',
    (objMessage) => {
        console.log('spread message: ', objMessage);
        
        const message = `${objMessage.date} - ${objMessage.message}`;
        
        const li_elem = $('<li>').addClass('list-group-item').text(message);
        $('#messages').prepend(li_elem);
    }
);