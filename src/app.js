const express = require("express")

const app = express()

app.use((req,res) => {
    res.send("namaste")
})

app.use("/test", (req,res) => {
    res.send("test from server")
})

app.use("/home", (req,res) => {
    res.send("home from server")
})

app.listen((7777), ()=> {
    console.log("Server is successfully running on port 7777")
})