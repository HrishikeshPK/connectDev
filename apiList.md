# DevTinder APIs

## authRouter
    POST /signup
    POST /login
    POST /logout

## profileRouter
    GET /profile/view
    PATCH /profile/edit
    PATCH /profile/password

## connectionRequestRouter
    POST /request/send/intersted/:userId
    POST /request/send/ignored/:userId
    POST /request/review/accepted/:userId
    POST /request/review/rejected/:userId

## userRouter
    GET /user/connections
    GET /user/requests
    GET /user/feed   -gets you the profiles of other users on the platform

Status: ignore, interested, accepted, rejected    