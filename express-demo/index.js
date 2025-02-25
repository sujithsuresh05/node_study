import ollama from 'ollama';
import express from 'express';
import request from 'request';
import Joi from 'joi';
import { callLLamaApi } from './llamaApi.js';
//const ollama = require('ollama');

//const req = require("express/lib/request");
//const request = require('request');
//const express = require("express");
//const Joi = require("joi");
const app = express();
app.use(express.json());
//const callLLamaApi = require("./llamaApi");

//const ollama = new Ollama();

let courses = [
    {id: 1, name: "course1"},
    {id: 2, name: "course2"},
    {id: 3, name: "course3"},
];
app.get("/", (req, res) => {
    res.send("Hello World");
    });

app.get("/api/courses", (req, res) => {
    res.send(courses);
    }
);

app.get("/api/courses/:id", (req, res) => {
    const cource = courses.find( c => parseInt(req.params.id) === c.id);
    if (!cource) res.status(404).send("The course with the given ID was not found");  
    res.status(200).send(cource);
    }
);

app.post("/api/courses/", (req, res) => {
    const result = validateCourse(req.body);
    console.log(result);
    if (result.error) {
        res.status(400).send(result.error);
        return;
    }
    if (!req.body.name || req.body.name.length < 3) {
        res.status(400).send("Name is required and should be minimum 3 characters");
        return;
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name,
    };
    courses.push(course);
    res.send(course);
    }
);

app.put("/api/courses/:id", (req, res) => {
    const course = courses.find( c => parseInt(req.params.id) === c.id);
    if (!course) return res.status(404).send("The course with the given ID was not found");
    const {error} = validateCourse(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    course.name = req.body.name;
    res.send(course);
    }
);

app.delete("/api/courses/:id", (req, res) => {
    const course = courses.find( c => parseInt(req.params.id) === c.id);
    if (!course) res.status(404).send("The course with the given ID was not found");
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);
    }
);

app.post("/api/lama/", (req, res) => {
    //callLLamaApi.callLLamaApi(req, res);
    request({
            uri: "http://localhost:11434/api/chat",
            method: req.method,
            json: req.body
        }, (error, response, body) => {
            if (error) {
                res.status(404).send(error);
            }
            else {
                res.status(response.statusCode).send(body);
            }
    
        }
        )
}
);

app.get("/api/lama/internal",  async(req, res) => {
    await runOllama(res);
    //res.send("good");
    }
);


const port = process.env.PORT || 8082;
app.listen(8082, () => {
    console.log(`Server is running on port ${port}`);
    });

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });
    return schema.validate(course);
}


async function runOllama(res) {
    try {
    const response = await ollama.chat({model: 'llama3.2-vision', messages: [{ role: 'user', content: 'Why is the sky blue?' }], "stream": false});
    console.log(response);
    
    res.send(response);
    }
    catch (error) {
        res.status(500).send({ error: 'Error interacting with the model' });
      }
  }