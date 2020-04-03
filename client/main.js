$(document).ready(function () {

    $("#addMovieForm").submit(function (e) {
        e.preventDefault()
        let objMovie = {}
        objMovie.title = $('#titleMovie').val()
        objMovie.date = $('#date').val()

        $.ajax({
            url: "http://localhost:3000/movies",
            type: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem('accesstoken')
            },
            data: JSON.stringify(objMovie)
        })
            .done(function (result) {
                $('#addMovieForm')[0].reset();
                $("#addMovieForm").toggle();
                $("#addmovieList").css('display', 'none');
                getData(localStorage.getItem('accesstoken'))
            })
            .fail(function (err) {
                console.log(err)
            })
    });

    $("#btnSearchMovie").click(function () {
        $("#searchMovie").toggle();
    });

    $("#addMovie").click(function () {
        $("#addDataMovie").toggle();
    });

    $("#movieForm").submit(function (e) {
        e.preventDefault();
        let objMovie = {}
        objMovie.title = $("#title").val()
        // objMovie.genre = $("#genre").val()
        // objMovie.date = $("#date").val()
        // objMovie.rating = $("#rating").val()
        // objMovie.year = $("#year").val()
        // objMovie.quote = 'I Love You'
        // objMovie.status = false

        //console.log(JSON.stringify(objMovie))
        $.ajax({
            url: "http://localhost:3000/movies/similiar",
            type: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem('accesstoken')
            },
            data: JSON.stringify(objMovie)
        })
            .done(function (result) {
                $('#movieForm')[0].reset();
                $("#searchMovie").toggle();
                console.log(result.data.Similar.Results)
                $("#movieList").css('display', 'none');
                $("#adddataBody").html("")
                let trHTML = '';
                $.each(result, function (i, data) {
                    let a = 2
                    for (i = 0; i < result.data.Similar.Results.length; i++) {
                        trHTML +=
                            `<tr><td>
                                     ${result.data.Similar.Results[i].Name}
                                     
                                </td></tr>`
                    }
                });
                $("#addmovieList").css('display', 'block');
                $('#adddataBody').append(trHTML);
                //getData(localStorage.getItem('accesstoken'))
            })
            .fail(function (err) {
                console.log(err)
            })
    });
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
                getData(localStorage.getItem('accesstoken'))
                $('#loginRegister').hide()
                $("#Logout").css('display', 'inline-block');
                $(".signin2").css('display', 'none');
                $("#btnSearchMovie").css('display', 'inline-block');
                $("#addMovie").css('display', 'inline-block');
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
        $("#btnSearchMovie").css('display', 'none');
        $("#movieList").css('display', 'none');
        $("#addmovieList").css('display', 'none');
        $("#addMovie").css('display', 'none');
        $('#loginRegister').show()
    }
})

///login///
$('#login').submit(function (e) {
    e.preventDefault();

    let email = $('#emailLogin').val()
    let password = $('#passwordLogin').val()

    const user = {
        email,
        password
    }

    ///AJAX POST Login
    $.ajax({
        url: 'http://localhost:3000/user/login',
        type: 'POST',
        data: user
    })
        .done(function (data) {
            localStorage.setItem("token", data)
            $("#Logout").css('display', 'inline-block');
            $('#loginRegister').hide()
        })
        .fail(function (err) {
            console.log(err)
            // swal("Error!", err.responseJSON.message, "error");
        })
})

///register new user
$('#register').submit(function (e) {
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
        url: 'http://localhost:3000/user/register',
        type: 'POST',
        data: user
    })
        .done(function (data) {
            $('#modalRegister').modal('hide')
            console.log(data)
        })
        .fail(function (err) {
            console.log(err)
            // swal("Error!", err.responseJSON.message, "error");
        })
})

// function addDataMovie(result) {
//     $("#addmovieList").css('display', 'block');
//     $("#adddataBody").html("")
//     let trHTML = '';
//     $.each(result, function (i, data) {
//         let a = 2
//         for (i = 0; i < result.data.Similar.Results.length; i++) {
//             trHTML +=
//                 `<tr><td>
//                          ${result.data.Similar.Results[i].Name}
//                          </td> <td>
//                          <button type="button" id="deleteData1" class="btn btn-dark" value="${a}" onclick="deleteData1()">Delete</button>
//                     </td></tr>`
//         }
//     });
//     $('#adddataBody').append(trHTML);
// }

function getData(token) {
    $("#movieList").css('display', 'block');
    $.ajax({
        url: "http://localhost:3000/movies",
        type: "GET",
        headers: {
            "token": token
        },
    })
        .done(function (result) {
            $("#dataBody").html("")
            let trHTML = '';
            $.each(result, function (i, data) {
                for (i = 0; i < result.movies.length; i++) {
                    trHTML +=
                        `<tr><td>
                         ${result.movies[i].title}
                         </td><td>
                         ${result.movies[i].genre}
                         </td><td>
                         ${result.movies[i].rating}
                         </td> <td>
                         
                         <button type="button" id="deleteData" class="btn btn-dark" value="${result.movies[i].id}" onclick="deleteData(${result.movies[i].id})">Delete</button>
                    </td></tr>`
                }
            });
            $('#dataBody').append(trHTML);
        })
        .fail(function (err) {
            console.log(err)
        })
        .always(function () {
            //console.log('a')
        })
}

function deleteData(id) {
    $.ajax({
        url: "http://localhost:3000/movies/" + id,
        type: "DELETE",
        headers: {
            "token": localStorage.getItem('accesstoken')
        },
    })
        .done(function (result) {
            getData(localStorage.getItem('accesstoken'))
        })
        .fail(function (err) {
            console.log(err)
        })
}
