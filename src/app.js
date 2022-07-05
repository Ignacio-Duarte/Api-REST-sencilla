const express = require("express")
const fs = require("fs").promises
const path = require("path")
const uuid = require("uuid").v4


const morgan = require("morgan")
const app = express()
const PORT = 3000;
const pathDb = path.resolve("src", "db", "db.json")


app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))



app.get("/clientes/:id", async function(req,res){
    const stringDb = await fs.readFile(pathDb)
    const parsedDb = JSON.parse(stringDb)

    const paramId = req.params.id

    for(let i = 0; i < parsedDb.length; i++){
        if(parsedDb[i].id === paramId){
            return res.status(200).json(parsedDb[i])
        }
        if(paramId === "infoClient"){
            return res.status(200).json(parsedDb)
        }
    }
    return res.status(200).json("No se encontro el cliente")
})



app.post("/clientes", async function(req,res){
    console.log(req.body)

    const stringDb = await fs.readFile(pathDb)
    const parsedDb = JSON.parse(stringDb)

    parsedDb.push({
        cliente: req.body.cliente,
        id: uuid()
    })
    
    const newParsedDb = JSON.stringify(parsedDb, null, 4)
    fs.writeFile(pathDb, newParsedDb)


    return res.status(200).json({message: "Cliente creado."})
})





app.listen(PORT, (req, res)=>{
    console.log("Escuchando en el puerto:",PORT)
})