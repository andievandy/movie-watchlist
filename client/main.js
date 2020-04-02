$(document).ready(function () {

    $("#addMovie").click(function (e) {
        e.preventDefault()
        let objMovie = {}
        objMovie.title = 'The Chronicles Of Narnia: The Lion, The Witch And The Wardrobe'

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
                getData(localStorage.getItem('accesstoken'))
            })
            .fail(function (err) {
                console.log(err)
            })
    });

    $("#btnSearchMovie").click(function () {
        $("#searchMovie").toggle();
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
                                     </td> <td>
                                     <button type="button" id="addData" class="btn btn-dark" value="${result.data.Similar.Results[i].Name}" onclick="addDataMv(${result.data.Similar.Results[i].Name})">Add</button>
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
                $("#Logout").css('display', 'inline-block');
                $(".signin2").css('display', 'none');
                $("#btnSearchMovie").css('display', 'inline-block');
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
    }
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
