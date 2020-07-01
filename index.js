const express = require('express');
const fs = require('fs');
const path = require('path')
const bodyParser = require('body-parser');
const { preview , download } = require('./Middlewares/index.js');

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));

const port = process.env.PORT || 5000

app.get('/', (req, res) => res.send('Hello World!'))
app.post('/preview',async (req,res)=>{
    const response = await preview(req.body.link)
    res.send(response)
})
app.post('/download',async (req,res)=>{
    const response = await preview(req.body.link)
    await fs.promises.writeFile('txt.html',download(response),(err)=>console.log(err))
    res.sendFile(path.join(__dirname, '/txt.html'))
    res.on('finish',()=>{fs.unlinkSync('txt.html')})
})


app.listen(port, () => console.log(` App is listening at ${port}`))