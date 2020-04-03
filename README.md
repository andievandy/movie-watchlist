# movie-watchlist
Movie Watch List adalah sebuah aplikasi sederhana untuk list film yang akan ditonton oleh user.

Aplikasi ini dibuat dengan menggunakan:
* REST API
* ExpressJS
* Postgres
* Sequelize

Aplikasi ini menggunakan 3rd-party API:
* sendgrid
* tastedive
* omdb

Tampilan client berupa Single Page App yang dibuat dengan menggunakan:
* HTML
* CSS
* JQuery
* Ajax

# REST Endpoints
- [POST /user/register](#post-register)
- [POST /user/login](#post-login)
- [GET /movies](#get-movies)
- [GET /movies/:id](#get-moviesid)
- [POST /movies](#post-movies)
- [PUT /movies/:id](#put-moviesid)
- [DELETE /movies/:id](#delete-moviesid)

## POST /user/register
> Register akun baru

_Request Header_
```
{
	"Content-Type": "application/json"
}
```

_Request Body_
```json
{
	"email": "email@example.com",
	"password": "passwordhere"
}
```

_Response (201 - CREATED)_

```json
{
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@mail.com",
    "password": "test"
}
```

_Response (400 - BAD REQUEST)_

Kesalahan input dari user

```json
{
    "errors": [
        "This E-mail has been registered."
    ]
}
```

```json
{
    "errors": [
        "password is required.",
        "email is required.",
        "email is not valid."
    ]
}
```
## POST /user/login
> login menggunakan akun yang sudah terdaftar

_Request Header_
```
{
	"Content-Type": "application/json"
}
```

_Request Body_
```json
{
	"email": "email@example.com",
	"password": "passwordhere"
}
```

_Response (201 - CREATED)_

```json
{
    "accessToken": "[ACCESS TOKEN HERE]"
}
```

_Response (400 - BAD REQUEST)_

Kesalahan input dari user

```json
{
    "errors": "Invalid Username/Password"
}
```

## GET /movies

> Menampilkan list movie yang diinput oleh user

_Request Header_
```
{
	"accessToken": "ACCESS TOKEN HERE"
}
```
_Response (200 - OK)_

```json
[
    {
        "id": 1,
        "title": "Toy Story",
        "status": "FALSE",
        "date": "2020-04-04",
        "genre":"Animation, Adventure, Comedy, Family, Fantasy",
        "rating": "8.3",
        "year": "1995",
        "sinopsis":"A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
        "userId": "1"
    },
    {
        "id": 2,
        "title": "Toy Story 2",
        "status": "FALSE",
        "date": "2020-04-05",
        "genre":"Animation, Adventure, Comedy, Family, Fantasy",
        "rating": "7.9",
        "year": "1999",
        "sinopsis":"When Woody is stolen by a toy collector, Buzz and his friends set out on a rescue mission to save Woody before he becomes a museum toy property with his roundup gang Jessie, Prospector, and Bullseye.",
        "userId": "1"
    }
]
```

_Response (401 - UNAUTHORIZED)_
Terjadi jika user tidak memiliki "accessToken" pada request header nya
```json
{
    "errors": "Invalid or missing token"
}
```

## GET /movies/:id

> Menampilkan movie sesuai dengan id nya

_Parameters_
| Name |     Description      |
| :--: | :------------------: |
|  id  |    ID of the Movie   |

_Request Header_
```
{
	"accessToken": "ACCESS TOKEN HERE"
}
```

_Response (200 - OK)_

```json
[
    {
        "id": 1,
        "title": "Toy Story",
        "status": "FALSE",
        "date": "2020-04-04",
        "genre":"Animation, Adventure, Comedy, Family, Fantasy",
        "rating": "8.3",
        "year": "1995",
        "sinopsis":"A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
        "userId": "1"
    }
]
```

_Response (401 - UNAUTHORIZED)_

Terjadi jika user tidak memiliki "accessToken" pada request header nya

```json
{
    "errors": "Invalid or missing token"
}
```

_Response (404 - NOT FOUND)_
```
{
    "message": "Movie not found"
}
```

## POST /movies

> Menambahkan movie baru ke dalam watch list

_Request Header_
```
{
	"accessToken": "ACCESS TOKEN HERE"
}
```

_Request Body_
```json
    {
        "id": 1,
        "title": "Toy Story",
        "status": "FALSE",
        "date": "2020-04-04",
        "genre":"Animation, Adventure, Comedy, Family, Fantasy",
        "rating": "8.3",
        "year": "1995",
        "sinopsis":"A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
        "userId": "1"
    }
```

_Response (201 - CREATED)_

```json
[
    {
        "id": 1,
        "title": "Toy Story",
        "status": "FALSE",
        "date": "2020-04-04",
        "genre":"Animation, Adventure, Comedy, Family, Fantasy",
        "rating": "8.3",
        "year": "1995",
        "sinopsis":"A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
        "userId": "1"
    }
]
```

_Response (400 - BAD REQUEST)_

Kesalahan pada validasi input user

```json
{
    "errors": [
        "title is empty",
        "status is empty",
        "due_date is empty",
        "due_date must be in date format: YYYY-MM-DD"
    ]
}
```

_Response (401 - UNAUTHORIZED)_

Terjadi jika user tidak memiliki "accessToken" pada request header nya

```json
{
    "errors": "Invalid or missing token"
}
```

## PUT /movies/:id
> Update movie berdasarkan id

_Parameters_
| Name |     Description      |
| :--: | :------------------: |
|  id  |    ID of the Movie   |

_Request Header_
```
{
	"accessToken": "ACCESS TOKEN HERE"
}
```

_Request Body
```json
    {
        "id": 1,
        "title": "Toy Story",
        "status": "TRUE",
        "date": "2020-04-06",
        "genre":"Animation, Adventure, Comedy, Family, Fantasy",
        "rating": "8.3",
        "year": "1995",
        "sinopsis":"A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
        "userId": "1"
    }
```

_Response (201 - CREATED)_
```json
    {
        "id": 1,
        "title": "Toy Story",
        "status": "TRUE",
        "date": "2020-04-06",
        "genre":"Animation, Adventure, Comedy, Family, Fantasy",
        "rating": "8.3",
        "year": "1995",
        "sinopsis":"A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
        "userId": "1"
    }
```

_Response (400 - BAD REQUEST)_

Kesalahan pada validasi input user

```json
{
    "errors": [
        "title is empty",
        "status is empty",
        "due_date is empty",
        "due_date must be in date format: YYYY-MM-DD"
    ]
}
```

_Response (401 - UNAUTHORIZED)_

Terjadi jika user tidak memiliki "accessToken" pada request header nya

```json
{
    "errors": "Invalid or missing token"
}
```

### DELETE /movies/:id
> Hapus movie berdasarkan id

_Parameters_
| Name |     Description      |
| :--: | :------------------: |
|  id  |    ID of the Movie   |

_Request Header_
```
{
	"accessToken": "ACCESS TOKEN HERE"
}
```

_Response (200 - OK)_
```json
    {
        "id": 1,
        "title": "Toy Story",
        "status": "TRUE",
        "date": "2020-04-06",
        "genre":"Animation, Adventure, Comedy, Family, Fantasy",
        "rating": "8.3",
        "year": "1995",
        "sinopsis":"A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
        "userId": "1"
    }
```

_Response (404 - NOT FOUND)_
```
{
    "message": "Movie not found"
}
```












