import { ObjectId } from "mongodb";
import usuarios from "./conn.mjs";
import express from "express";
import axios from "axios";
import "dotenv/config";

const app = express.Router();

app.get("/", async (req, res) => {
    try {
        let filtro = {};
        let orden = {};

        const queries = req.query;

        if (queries.name) {
            filtro = { ...filtro, name: queries.name };
        }
        if (queries.email) {
            filtro = { ...filtro, email: queries.email };
        }
        if (queries.sub) {
            filtro = { ...filtro, sub: queries.sub };
        }
        if (queries.token) {
            filtro = { ...filtro, token: queries.token };
        }

        if (queries.orderBy && queries.order) {
            if (queries.order == "asc") {
                orden = { ...orden, [queries.orderBy]: 1 };
            } else if (queries.order == "desc") {
                orden = { ...orden, [queries.orderBy]: -1 };
            }
        }


        let results = await usuarios.find(filtro).sort(orden).toArray();
        res.send(results).status(200);
    } catch (e) {
        console.log(e);
        res.send(e).status(500);
    }
});

app.post("/", async (req, res) => {
    try {
        const usuario = req.body;
        
        const result = await usuarios.insertOne(usuario);
        res.send(result).status(200);
    } catch (e) {
        console.log(e);
        res.send(e).status(500);
    }
});

app.get("/:id", async (req, res) => {
    try {
        const result = await usuarios.findOne({ _id: new ObjectId(req.params.id) });
        res.send(result).status(200);
    } catch (e) {
        res.send(e).status(500);
    }
});

app.delete("/:id", async (req, res) => {
    try {
        const result = await usuarios.deleteOne({
            _id: new ObjectId(req.params.id),
        });
        res.send(result).status(200);
    } catch (e) {
        res.send(e).status(500);
    }
});
//comentariocheck
app.delete("/", async (req, res) => {
    try {
        let result = await usuarios.deleteMany(req.body);
        res.send(result).status(200);
    } catch (e) {
        res.send(e).status(500);
    }
});

app.put("/:id", async (req, res) => {
    try {
        const usuario = req.body;

        const result = await usuarios.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: usuario }
        );
        res.send(result).status(200);
    } catch (e) {
        res.send(e).status(500);
    }
});

export default app;
