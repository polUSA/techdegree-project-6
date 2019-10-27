const express = require('express')
const pug = require('pug')
const path = require('path')
const data = require('./data.json')

//initialize express app
const app = express()

app.set('view engine', 'pug')

const staticPath = path.join(__dirname, 'public')
app.use('/static', express.static(staticPath))

app.get('/',(req, res, next)=>{
  res.render('index', { projects: data.projects })
})

app.get('/about',(req, res, next)=>{
  res.render('about')
})

//used a regular expression for the route /project/id so it must be at at least a digit (doesn't accept other parameters)
app.get(/^\/project\/(\d+)$/, (req, res, next) => {
  res.send(`you requested the project ${req.params[0]}`)
})

//Error handler miiddlware

//404 error handler
app.use((req, res, next)=>{
  console.log('404 Not Found error triggered')
  const error = new Error('404 Page Not Found')
  error.status = 404
  next(error)
})

app.use((err, req, res, next)=>{
  console.error(err)
  debugger
  res.status(err.status).send(`${err.status}`)
})












//initialize express web server
app.listen(3000, console.log('Express Web server listening on port 3000'))