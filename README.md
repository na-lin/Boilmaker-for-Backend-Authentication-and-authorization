# Boilmaker-for-Backend-Authentication-and-authorization

### Set up

1. npm install: install the dependencies
2. npm run seed: seed test data exist in db/data/*
3. npm run dev: start server


### API 

### 1. Sign up

- use to create a new user
- req
    - request:  POST /api/users/signup
    - req.body
        
        ```jsx
        {
            "name": "test",
            "email":"test@example.com",
            "password":"12345",
            "passwordConfirm": "12345"
        }
        ```
        
- response
    
    ```jsx
    {
        "status": "success",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg3N2UyMjdmLTFiZDQtNDZiOS1hMTRhLWYzMDI5MmQ5YTMyMCIsImlhdCI6MTY3MjYxNTg5MSwiZXhwIjoxNjgwMzkxODkxfQ.6Yi-E90KFYgJmFAdnNHu3DohA5_yKFczdPJBfrTkh-0",
        "newUser": {
            "id": "877e227f-1bd4-46b9-a14a-f30292d9a320",
            "role": "user",
            "active": true,
            "name": "test",
            "email": "test@example.com",
            "updatedAt": "2023-01-01T23:31:31.301Z",
            "createdAt": "2023-01-01T23:31:31.301Z"
        }
    }
    ```
    
- operational error
    - Missing field : 400 Bad request
        
        ```json
        {
            "status": "fail",
            "message": "Name, email, password, passwordConfirm  are required."
        }
        ```
        
    - Validation error: Passwords are not the same -  400 Bad request
        
        ```json
        {
            "status": "fail",
            "message": "Passwords are not the same"
        }
        ```
        
    - 401, User already exists if email had been used to create user — 401 Unauthorized
        
        ```jsx
        {
            "status": "fail",
            "message": "User already exists."
        }
        ```
        
    

### 2. Login

1. route: `/api/users/login`
2. req.body
    
    ```jsx
    {
        "email": "john@example.com",
        "password": "123456"
    }
    ```
    
3. response 
    
    ```jsx
    {
        "status": "success",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1ZDM1MDgyLWE2MWQtNGFmNy04NmUxLTg2MWI1ZjdkYTkwZiIsImlhdCI6MTY3MjYyNjI3NCwiZXhwIjoxNjgwNDAyMjc0fQ.zelk40TG1rtvnFBSCqrC_HbrzwuqaTM9G6FzMZVkhJc",
        "data": {
            "user": {
                "id": "85d35082-a61d-4af7-86e1-861b5f7da90f",
                "name": "John",
                "email": "john@example.com",
                "role": "user",
                "active": true,
                "createdAt": "2023-01-01T23:31:14.700Z",
                "updatedAt": "2023-01-01T23:31:14.700Z"
            }
        }
    }
    ```
    

3. potential error 

1. email or password do not exist in req.body → 400 Bad Request
    
    ```jsx
    {
        "status": "fail",
        "message": "Please provide email and password!"
    }
    ```
    
2. 401 unauthorizate: user don’t exists  or password isn’t correct
    
    ```jsx
    {
        "status": "fail",
        "message": "Incorrect email or password"
    }
    ```
    

### 3. Protect middleware

- error type
1. 401 unauthorized, token not exist in req.headers
    
    ```jsx
    {
        "status": "fail",
        "message": "You are not logged in! Please log in to get access."
    }
    ```
    
2. 401 unauthorized : invalid token 
    
    ```jsx
    {
        "status": "fail",
        "message": "Invalid Token, Please try to login in again."
    }
    ```
    
3. 401 unauthorized: user belong to this token not longer exist 
    
    ```jsx
    
    {
        "status": "fail",
        "message": "The user belonging to this token does no longer exist."
    }
    ```
    
4. 401 unauthorized: user change password after token was issued
    
    ```jsx
    {
        "status": "fail",
        "message": "User recently changed password! Please log in again"
    }
    ```
    
5. 403 forbidden: user don’t have permission to access this route
    
    ```jsx
    {
        "status": "fail",
        "message": "You do not have permission to perform this action"
    }
    ```
    

### 4. Authorization

- middleware to check if user belong to roles who can access to this protected route

### 5. Reset password if your forgot password

1. send request to `/api/users/forgotPassword`, req.body include 
    
    ```jsx
    {
        "email": "john@example.com"
    }
    ```
    
2. Get reset password email. in your inbox , click the url, to send the request to /api/users/resetPassword
    
    ```jsx
    {
        "password": "12345abc",
        "passwordConfirm":"12345abc"
    }
    ```
    

## 6. Logged in user update profile

### 1. update password :

send request to `/api/users/updateMypassword`

```jsx
{
    "currentPassword": "123456a",
    "newPassword":"abcd",
    "newPasswordConfirm":"abcd"
}
```

```json
{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1ZDM1MDgyLWE2MWQtNGFmNy04NmUxLTg2MWI1ZjdkYTkwZiIsImlhdCI6MTY3MjYyNzMxOCwiZXhwIjoxNjgwNDAzMzE4fQ.my9IkvJMOCQ4Sa1DWOIYgmf4El0-KEEOpHXb4J2875o",
    "data": {
        "user": {
            "id": "85d35082-a61d-4af7-86e1-861b5f7da90f",
            "name": "John",
            "email": "john@example.com",
            "role": "user",
            "active": true,
            "createdAt": "2023-01-01T23:31:14.700Z",
            "updatedAt": "2023-01-02T02:41:58.685Z"
        }
    }
}
```

### 2. update user profile exclude password

- send request to `/api/users/updateMe`

```
{
    "name":"John Doee"
}
```

```json
{
    "status": "success",
    "data": {
        "user": {
            "id": "85d35082-a61d-4af7-86e1-861b5f7da90f",
            "name": "John Doee",
            "email": "john@example.com",
            "role": "user",
            "active": true,
            "createdAt": "2023-01-01T23:31:14.700Z",
            "updatedAt": "2023-01-02T02:44:54.211Z"
        }
    }
}
```

### 3. Delete user

- send request to `/api/users/deleteMe`
- response is empty
