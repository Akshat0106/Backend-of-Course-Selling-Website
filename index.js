const express=require('express')

const app=express()

app.post('/users/signup',function(req,res){
    res.json({
        message:"You just signed up"
    })
})

app.post('/users/signin',function(req,res){
    res.json({
        message:"You just signed up"
    })
})

app.get('/users/purchases',function(req,res){
    res.json({
        message:"You just signed up"
    })
})

app.get('/course/purchase',function(req,res){
    res.json({
        message:"You just signed up"
    })
})

app.get('/courses',function(req,res){
    res.json({
        message:"You just signed up"
    })
})