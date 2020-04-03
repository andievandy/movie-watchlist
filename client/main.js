$(document).ready(function () {

});

function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token;

    $.ajax({
        url: "http://localhost:3000/google/login",
        type: "POST",
        data: {
            token: id_token
        },
        statusCode: {
            201: function (response) {
                localStorage.setItem('accesstoken', response.accessToken)
                localStorage.setItem('loginWith', 'googleForm')
                $("#Logout").css('display', 'inline-block');
                $(".signin2").css('display', 'none');
            }
        }
    })
}

$("#Logout").click(function () {
    if (localStorage.getItem('loginWith') == 'googleForm') {
        let auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });
        localStorage.clear();
        $("#Logout").css('display', 'none');
        $(".signin2").css('display', 'inline-block');
    }
})

///login///
$('#login').submit(function(e){
    e.preventDefault();

    let email = $('#emailLogin').val()
    let password = $('#passwordLogin').val()

    const user = {
        email,
        password
    }

    ///AJAX POST Login
    $.ajax({
        url:'http://localhost:3000/user/login',
        type: 'POST',
        data: user
    })
    .done(function(data){
        localStorage.setItem("token",data)
        $("#Logout").css('display', 'inline-block');
        $('#loginRegister').hide()
    })
    .fail(function(err){
        console.log(err)
        // swal("Error!", err.responseJSON.message, "error");
    })
})

///register new user
$('#register').submit(function(e){
    e.preventDefault();
    
    let name = $('#nameRegister').val()
    let email = $('#emailRegister').val()
    let password = $('#passwordRegister').val()

    const user = {
        name,
        email,
        password
    }

    ///AJAX POST Register
    $.ajax({
        url:'http://localhost:3000/user/register',
        type: 'POST',
        data: user
    })
    .done(function(data){
        $('#modalRegister').modal('hide')
        console.log(data)
    })
    .fail(function(err){
        console.log(err)
        // swal("Error!", err.responseJSON.message, "error");
    })
})