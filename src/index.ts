import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/api/notes", async (req, res) => {

    const note = await prisma.note.findMany();

    res.json(note);
});

app.post("/api/notes", async (req, res) => {
    const { title, content } = req.body;

    if(!title || content) {
        return res.status(400).send("Título e conteúdo são necessários")
    }

    try {
        const note = await prisma.note.create({
            data: { title, content }
        })
        res.json(note);
    } catch (err) {
        res.status(500).send("Ops, algo deu errado :(")
    }
});

app.listen(5000, () => {
    console.log("Servidor rodando na porta 5000")
});