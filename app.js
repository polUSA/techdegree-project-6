const express = require('express')
const pug = require('pug')
const path = require('path')
const data = require('./data.json')

//initialize express app
const app = express()

//setup of the view engine 
app.set('view engine', 'pug')

const staticPath = path.join(__dirname, 'public')
app.use('/static', express.static(staticPath))

//static file server to serve the images
const staticPath2 = path.join(__dirname, 'images')
app.use('/images', express.static(staticPath2))

app.get('/',(req, res, next)=>{
  res.render('index', { projects: data.projects })
})

app.get('/about',(req, res, next)=>{
  res.render('about')
})

//used a regular expression for the route /project/id so it must be at at least a digit (doesn't accept other parameters)
app.get(/^\/project\/(\d+)$/, (req, res, next) => {
  //I removed 1 from the paramter so it matches the projects array index
  const id = req.params[0] - 1
  res.render('project', { project: data.projects[id] }, (err, html)=>{
    //error handling if the project id is not found
    if(err){
      const error = new Error("The project requested does not exist")
      error.status = 404
      next(error) 
    } else {
      res.send(html)
    }
  })

})

//Error handler miiddlware

//404
app.use((req, res, next)=>{
  const error = new Error('404 Page Not Found')
  error.status = 404
  next(error)
})

//error handling middleware
app.use((err, req, res, next)=>{
  const message = err.message
  const errCode = err.status
  console.error(`An error occured and it's been handled. \n${message}, \nError code: ${errCode}`)
  next(err)
})

//the error object is passed from the the midlleware that called the error handling with next(someErrorObject)
app.use((err, req, res, next)=>{
  res.status(err.status).render('error', { err })
})












//initialize express web server
app.listen(3000, console.log('Express Web server listening on port 3000'))