# API

All endpoints in this API, except the **login** path, requires an Authorization header with a Bearer token to be sent with the call. This token is returned after a successull call to the login path.
```
'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmE1ZDU1MTI4ZGE1OTI4Y2QyOTEyNzIiLCJleHAiOjE2MDQ3MDcxNjQsImlhdCI6MTYwNDcwMzU2OTUzNn0.6ko5yh8-SwV1ANDLACDz6rfGh3Wdg3o6B4pcS8MqeuA'
```

Curl example
```bash
curl --location --request GET 'http://localhost:3000/api/auth/me' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmE1ZDUxODEwMzA0NDI4NzRjM2EzNzEiLCJleHAiOjE2MDQ3MDcxMDIsImlhdCI6MTYwNDcwMzUxMjkyMX0.zL0dzstyrR7iqNX6VaQIrz2QIDFA4QNvoCcBwBnHNP8'
```

## Authorization
### login
|path|method|returns|
|-|-|-|
|/api/auth/login|POST|token|

|Status code|Description|
|-|-|
|201|Login succesfully|
|400|Invalid data sent|
|401|Username or password incorrect|
|500|Unhandled error|

Body example
```json
{
	"username": "administrator",
	"password": "secr3t"
}
```
Curl example
```bash 
$ curl --location --request POST 'http://localhost:3000/api/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
	"username": "administrator",
	"password": "secr3t"
}'
```

### logout
|path|method|returns|
|-|-|-|
|/api/auth/logout|POST|Nothing|
Result
|Status code|Description|
|-|-|
|200|Loged out succesfully|
|500|Unhandled error|

Curl example
```bash
$ curl --location --request POST 'http://localhost:3000/api/auth/logout' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmE1ZDU1MTI4ZGE1OTI4Y2QyOTEyNzIiLCJleHAiOjE2MDQ3MDcxNjQsImlhdCI6MTYwNDcwMzU2OTUzNn0.6ko5yh8-SwV1ANDLACDz6rfGh3Wdg3o6B4pcS8MqeuA'
```

### me
Returns data for the user logged in
|path|method|
|-|-|
|/api/auth/me|GET|

Result
|Status code|Description|
|-|-|
|200|Successful|

Curl example
```bash
curl --location --request GET 'http://localhost:3000/api/auth/me' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmE1ZDUxODEwMzA0NDI4NzRjM2EzNzEiLCJleHAiOjE2MDQ3MDcxMDIsImlhdCI6MTYwNDcwMzUxMjkyMX0.zL0dzstyrR7iqNX6VaQIrz2QIDFA4QNvoCcBwBnHNP8'
```

## User
> User path is only accessible to the **admin** role
### Users list
|path|method|
|-|-|
|/api/user/|GET|

Result
|Status code|Description|
|-|-|
|200|Successful|
|403|Forbidden|
|500|Unhandled error|

```bash
curl --location --request GET 'http://localhost:3000/api/user/' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmE2ZGU2ZWVjYzU0YTM3YjdhMDA2Y2QiLCJleHAiOjE2MDQ3NzE0MTg4NjQwMCwiaWF0IjoxNjA0NzcxNDM4MzA5fQ.6QCiKpjDkhjo_JAZHgE-MN3yVHRyXjwzHSkIuFCn7aQ'
```
### Get a single user by it's id
Returns the data for the given `id`
|path|method|
|-|-|
|/api/user/`id`|GET|

Result
|Status code|Description|
|-|-|
|200|Successful|
|403|Forbidden|
|500|Unhandled error|

```bash
curl --location --request GET 'http://localhost:3000/api/user/5fa5c1409db7c309d7242837' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmE2MWRjYTNiNjg5Nzc4MmQzMDk0YWQiLCJleHAiOjE2MDQ3MjU2MzUsImlhdCI6MTYwNDcyMjEyMjA2OX0.3NzGBsLZNHDw1s1taRfWkt4MixMu-RfFose0uUlcTVQ'
```
### Get a single user by it's username
Returns the data for the given `username`
|path|method|
|-|-|
|/api/user/byusername/<username>|GET|

Result
|Status code|Description|
|-|-|
|200|Successful|
|403|Forbidden|
|500|Unhandled error|

```bash
curl --location --request GET 'http://localhost:3000/api/user/byusername/administrator' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmE2MWRjYTNiNjg5Nzc4MmQzMDk0YWQiLCJleHAiOjE2MDQ3MjU2MzUsImlhdCI6MTYwNDcyMjEyMjA2OX0.3NzGBsLZNHDw1s1taRfWkt4MixMu-RfFose0uUlcTVQ'
```

### Create
|path|method|
|-|-|
|/api/user/|POST|

Result
|Status code|Description|
|-|-|
|201|Created|
|400|Data validation failed, or username already exists|
|403|Forbidden|
|500|Unhandled error|

Payload
|Attribute|Required|Validation|
|-|-|-|
|username|Yes|Min 6 chars, max 128 chars|
|password|Yes|Min 6 chars|
|name|Yes|Max 256 chars|
|lastname|No|Max 256 chars|
|age|No|Must be number|
|role|Yes|One of ["admin", "client"]|
Curl example
```bash
curl --location --request POST 'http://localhost:3000/api/user' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmE2MWRjYTNiNjg5Nzc4MmQzMDk0YWQiLCJleHAiOjE2MDQ3MjU2MzUsImlhdCI6MTYwNDcyMjEyMjA2OX0.3NzGBsLZNHDw1s1taRfWkt4MixMu-RfFose0uUlcTVQ' \
--header 'Content-Type: application/json' \
--data-raw '    {
        "username": "patodiaz",
        "password": "digp77",
        "name": "Patricio",
        "lastname": "Diaz",
        "age": 43,
        "role": "client"
    }
```

### Full update
This endpoint replaces all the users's attributes, so all validations from create will be applyied.
|path|method|
|-|-|
|/api/user/`id`|PUT|

Result
|Status code|Description|
|-|-|
|201|Created|
|400|Data validation failed|
|403|Forbidden|
|404|Not found|
|500|Unhandled error|

Payload
|Attribute|Required|Validation|
|-|-|-|
|username|Yes|Min 6 chars, max 128 chars|
|password|Yes|Min 6 chars|
|name|Yes|Max 256 chars|
|lastname|No|Max 256 chars|
|age|No|Must be number|
|role|Yes|One of ["admin", "client"]|

Curl example
```bash
curl --location --request PUT 'http://localhost:3000/api/user/5fa61db93b6897782d3094ac' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmE2MjFjYzJkNjA2MTdlNDNiZTY2ZGYiLCJleHAiOjE2MDQ3MjY3NDAsImlhdCI6MTYwNDcyMzE0ODQ4MX0.sGi3yxkJ5HmQ2Sp37jWqP8OXPp4HqPApAuhExO4GPQc' \
--header 'Content-Type: application/json' \
--data-raw '    {
        "username": "patodiaz",
        "name": "Pato",
        "lastname": "Diaz",
        "age": 43,
        "role": "client",
        "password": "digp77"
    }'
```

### Partial update
This endpoint updates only the provided data
|path|method|
|-|-|
|/api/user/`id`|PATCH|

Result
|Status code|Description|
|-|-|
|201|Created|
|400|Data validation failed|
|403|Forbidden|
|404|Not found|
|500|Unhandled error|

Payload
> At least one attribute must me sent

|Attribute|Validation|
|-|-|
|username|Min 6 chars, max 128 chars|
|password|Min 6 chars|
|name|Max 256 chars|
|lastname|Max 256 chars|
|age|Must be number|
|role|One of ["admin", "client"]|
Curl example
```bash
curl --location --request PATCH 'http://localhost:3000/api/user/5fa61db93b6897782d3094ac' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmE2MjFjYzJkNjA2MTdlNDNiZTY2ZGYiLCJleHAiOjE2MDQ3MjY3NDAsImlhdCI6MTYwNDcyMzE0ODQ4MX0.sGi3yxkJ5HmQ2Sp37jWqP8OXPp4HqPApAuhExO4GPQc' \
--header 'Content-Type: application/json' \
--data-raw '{ "name": "Patricio" }'
```

### Delete
|path|method|
|-|-|
|/api/user/`id`|DELETE|

Result
|Status code|Description|
|-|-|
|200|Deleted|
|403|Forbidden|
|500|Unhandled error|

Curl example
```bash
curl --location --request DELETE 'http://localhost:3000/api/user/5fa61b4aad893275b6846707' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmE2MTNiOWYyOTMzMjZhNjY0YjdhMWMiLCJleHAiOjE2MDQ3MjMxMzIsImlhdCI6MTYwNDcxOTU0NTk4M30.g5C6j7OBeqhpCHY9iQ_kqeKI-nHYCuagEMNC0E_HLnk'
```

## Products

### Products list
> Only the **admin** role can see the **created_by** attribute

|path|method|
|-|-|
|/api/product/|GET|

Result
|Status code|Description|
|-|-|
|200|Successful|
|403|Forbidden|
|500|Unhandled error|

```bash
curl --location --request GET 'http://localhost:3000/api/product' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmE2MmZlYjYxZjkwYTExZDU0ZDZiNjgiLCJleHAiOjE2MDQ3MzAzNDEsImlhdCI6MTYwNDcyNjc2MzMzMH0.9VoREnj_bngPRdym_1X6ISMbnCnwjkHlSaAODndHae8'
```
### Get a single product
> You need an **admin** role to access this path
 
Returns a JSON with the data for the requested `id`
|path|method|
|-|-|
|/api/product/`id`|GET|

Result
|Status code|Description|
|-|-|
|200|Successful|
|403|Forbidden|
|500|Unhandled error|

```bash
curl --location --request GET 'http://localhost:3000/api/product/5fa706887edbbd362be3d96a' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmE3MDY3MjdlZGJiZDM2MmJlM2Q5NjkiLCJleHAiOjE2MDQ3ODE2Njg4NjQwMCwiaWF0IjoxNjA0NzgxNjgyOTI1fQ.6lBklFxk6caqe7MVdJJDiOGZraV4LFixHHW9GUNqouw'
```

### Create
> You need an **admin** role to access this path

|path|method|
|-|-|
|/api/product/|POST|

Result
|Status code|Description|
|-|-|
|201|Created|
|400|Data validation failed|
|403|Forbidden|
|500|Unhandled error|

Payload
|Attribute|Required|Validation|
|-|-|-|
|name|Yes|Max 256 chars|
|description|Yes|Max 2048 chars|
|price|No|Must be number|
Curl example
```bash
curl --location --request POST 'http://localhost:3000/api/product' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmE3MDY3MjdlZGJiZDM2MmJlM2Q5NjkiLCJleHAiOjE2MDQ3ODE2Njg4NjQwMCwiaWF0IjoxNjA0NzgxNjgyOTI1fQ.6lBklFxk6caqe7MVdJJDiOGZraV4LFixHHW9GUNqouw' \
--header 'Content-Type: application/json' \
--data-raw '{
	"name": "product_2",
	"description": "Second product",
	"price": 20
}'
```

### Full update
> You need an **admin** role to access this path

This endpoint replaces all the product's attributes, so all validations from create will be applyied.
|path|method|
|-|-|
|/api/product/`id`|PUT|

Result
|Status code|Description|
|-|-|
|201|Created|
|400|Data validation failed|
|403|Forbidden|
|404|Not found|
|500|Unhandled error|

Payload
|Attribute|Required|Validation|
|-|-|-|
|name|Yes|Max 256 chars|
|description|Yes|Max 2048 chars|
|price|No|Must be number|

Curl example
```bash
curl --location --request PUT 'http://localhost:3000/api/product/5fa62de40197b30fe4f1f246' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmE2MjFjYzJkNjA2MTdlNDNiZTY2ZGYiLCJleHAiOjE2MDQ3MjY3NDAsImlhdCI6MTYwNDcyMzE0ODQ4MX0.sGi3yxkJ5HmQ2Sp37jWqP8OXPp4HqPApAuhExO4GPQc' \
--header 'Content-Type: application/json' \
--data-raw '{
	"name": "product_2",
	"description": "Second product",
	"price": 25
}'
```

### Partial update
> You need an **admin** role to access this path

This endpoint updates only the provided data
|path|method|
|-|-|
|/api/product/`id`|PATCH|

Result
|Status code|Description|
|-|-|
|201|Created|
|400|Data validation failed|
|403|Forbidden|
|404|Not found|
|500|Unhandled error|

Payload
> At least one attribute must me sent

|Attribute|Validation|
|-|-|
|name|Max 256 chars|
|description|Max 2048 chars|
|price|Must be number|
Curl example
```bash
curl --location --request PATCH 'http://localhost:3000/api/product/5fa62de40197b30fe4f1f246' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmE2MjFjYzJkNjA2MTdlNDNiZTY2ZGYiLCJleHAiOjE2MDQ3MjY3NDAsImlhdCI6MTYwNDcyMzE0ODQ4MX0.sGi3yxkJ5HmQ2Sp37jWqP8OXPp4HqPApAuhExO4GPQc' \
--header 'Content-Type: application/json' \
--data-raw '{ "description": "Second product" }'
```

### Delete
> You need an **admin** role to access this path

|path|method|
|-|-|
|/api/product/`id`|DELETE|

Result
|Status code|Description|
|-|-|
|200|Deleted|
|403|Forbidden|
|500|Unhandled error|

Curl example
```bash
curl --location --request DELETE 'http://localhost:3000/api/product/5fa62de40197b30fe4f1f246' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmE2MmZlYjYxZjkwYTExZDU0ZDZiNjgiLCJleHAiOjE2MDQ3MzAzNDEsImlhdCI6MTYwNDcyNjc2MzMzMH0.9VoREnj_bngPRdym_1X6ISMbnCnwjkHlSaAODndHae8' \
--data-raw ''
```