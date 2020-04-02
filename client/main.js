$(document).ready(function () {

    $("#btnAddMovie").click(function () {
        $("#AddMovie").toggle();
    });

    $("#movieForm").submit(function (e) {
        e.preventDefault();
        let objMovie = {}
        objMovie.title = $("#title").val()
        objMovie.genre = $("#genre").val()
        objMovie.date = $("#date").val()
        objMovie.rating = $("#rating").val()
        objMovie.year = $("#year").val()
        objMovie.quote = 'I Love You'
        objMovie.status = false

        //console.log(JSON.stringify(objMovie))
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
                $('#movieForm')[0].reset();
                $("#AddMovie").toggle();
                getData(localStorage.getItem('accesstoken'))
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
                $("#Logout").css('display', 'inline-block');
                $(".signin2").css('display', 'none');
                $("#btnAddMovie").css('display', 'inline-block');
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
        $("#btnAddMovie").css('display', 'none');
        $("#movieList").css('display', 'none');
    }
})


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
                         <button type="button" id="editData" data-toggle="modal" data-target="#exampleModal" class="btn btn-dark" value="${result.movies[i].id}" onclick="editData(${result.movies[i].id})">Edit</button>
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