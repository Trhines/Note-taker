const express = require('express')
const path = require('path')

const fs = require('fs');


const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))


//html paths
app.get('/', (req,res)=>{res.sendFile(path.join(__dirname, './public/index.html'))})
app.get('/notes', (req,res)=>{res.sendFile(path.join(__dirname, '/public/notes.html'))})


//api's
const pushNewFile = (data, newNote) => {
    let newData;
    if(newNote){newData = [...data, newNote]}
    else{newData = data}
    for(let i=0; i<newData.length; i++){
        newData[i].id = (i+1)
    }

    fs.writeFile('db/db.json', JSON.stringify(newData), (err)=>{
        if (err) throw (err)
        console.log("pushed")
    })
}

const updateJson = (newNote)=>{
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        pushNewFile(JSON.parse(data), newNote)
    })
}

const deleteJson = (id)=>{
    fs.readFile('db/db.json', 'utf8', (err, data) =>{
        if(err)throw(err)
        let parsedData = JSON.parse(data)
        for(i=0;i<parsedData.length;i++){
            if(parsedData[i].id == id){
                console.log("\ndeleted")
                parsedData.splice(i,1)
            }
        }
        pushNewFile(parsedData)

    })
}


app.get('/api/notes', (req, res) =>res.sendFile(path.join(__dirname, '/db/db.json')));

app.post('/api/notes', (req,res) =>{
    updateJson(req.body)
    return res.json()
})

app.delete(`/api/notes/:id`, (req, res)=>{
    deleteJson(req.params.id)
    return res.json()
})



app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));


