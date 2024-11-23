const express = require("express")

const app = express()

app.post("/user", (req,res) => {
    res.send({firstname: "Hrishikesh", lastname: "P K"})
})


app.get("/user", (req,res) => {
    res.send("namaste")
})

app.delete("/user", (req,res) => {
    res.send("data deleted successfully")
})


app.listen((7777), ()=> {
    console.log("Server is successfully running on port 7777")
})

// order of the routes mater a lot