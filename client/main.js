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