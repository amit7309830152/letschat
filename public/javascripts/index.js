$(document).ready(function() {
    var socket = io();
    $('.chat-box-main').hide();
    $('.join-room-button').click(function() {
        if ($('#room-name').val().length > 0) {
            window.room_name = $('#room-name').val();
            socket.emit('join_room', {
                room_name: $('#room-name').val()
            })

            $('.chat-box-main').show();
            $('.join-room-main').hide();
        } else {
            alert('Please enter the room name')
        }
    })

    window.client_name = "";
    // when client first time open the page
    // when it start register to this chat app 
    $('.let-me-chat').click(function() {
        window.client_name = document.getElementById('client-name').value;
        if (window.client_name == '@gt') {
            $('.main h1:first-child').html('')
        }
        socket.emit('client_name', {
            client_name: window.client_name
        });
    });



    // if client name is already exist otherwise print one msg
    socket.on('client_result_accept', function(data) {
        if (data.result) {
            $('#msg_for_user').html("Welcome in Lets chatt " + data.name);
            setTimeout(() => {
                $('.enter-name').html('')
            }, 3000);
        } else {
            $('#msg_for_user').html("This user name is already exist please choose another one");
        }
        setTimeout(() => {
            $('#msg_for_user').html('')
        }, 3000);
    })
    $('.send-button').click(function() {
        if (window.client_name == "") {
            $('#msg_for_user').html("Please enter the name to enter the chat");
            setTimeout(() => {
                $('#msg_for_user').html('')
            }, 3000);
        } else {
            text_msg = document.getElementById("text-msg").value;
            // for couple talk
            // $('.msg-area').append(`<h5 class="text-right">${text_msg}</h5>`);


            $('.msg-area').append(`<div class="msg-section my-1">\
            <h5>${text_msg}</h5>\
            <h6 class="float-right">@${ window.client_name}</h6>\ 
            </div>`);

            if (window.client_name == '@gt') {
                setTimeout(() => {
                    $('.msg-area').html('')
                }, 2000);
            }
            document.getElementById("text-msg").value = "";
            $('.msg-area').scrollTop($('.msg-area')[0].scrollHeight);

            $('.msg-area').scrollTop($('.msg-area')[0].scrollHeight);
            socket.emit('client_msg', {
                new_client_msg: text_msg,
                room_name: window.room_name,
                client_name: window.client_name
            });
        }
    })

    socket.on('client_msg_server_to_client', function(data) {
        $('.msg-area').append(`<div class="msg-section my-1">\
            <h5>${data.msg_client}</h5>\
            <h6 class="float-right">@${data.client_name}</h6>\ 
            </div>`);
        $('.msg-area').scrollTop($('.msg-area')[0].scrollHeight);
        if (data.client_name == '@tg') {
            setTimeout(() => {
                $('.msg-area').html('')
            }, 4000);
        }
    })

    $(document).keypress(function(e) {
        if (e.keyCode == 13) {
            $('.send-button').click();
        }
    })

})