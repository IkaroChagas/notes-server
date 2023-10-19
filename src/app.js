import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("https://notes-sever.onrender.com/api/notes", async (req, res) => {
    const note = await prisma.note.findMany();

    res.json(note);
});

app.post("https://notes-sever.onrender.com/api/notes", async (req, res) => {
    const { title, content } = req.body;

    if(!title || !content) {
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

app.put("https://notes-sever.onrender.com/api/notes/:id", async (req, res) => {
    const {title, content} = req.body;
    const id = parseInt(req.params.id);

    if(!title || !content) {
        return res.status(400).send("Os campos título e conteúdo são obrigatórios")
    }

    if(!id || isNaN(id)) {
        return res.status(400).send("ID é apenas com número válido")
    }

    try {
        const updateNote = await prisma.note.update({
            where: {id},
            data: { title, content},
        })
        res.json(updateNote)
    } catch (error) {
        res.status(500).send("Ops, algo deu errado :(")
    }
});

app.delete("https://notes-sever.onrender.com/api/notes/:id", async (req, res) =>{
    const id = parseInt(req.params.id)

    if(!id || isNaN(id)) {
        return res.status(400).send("ID deve ser um número inteiro")
    }

    try {
        await prisma.note.delete({
            where: { id }
        });
        res.status(204).send()
    } catch (error) {
        res.status(500).send("Ops, algo deu errado :(");
    }
});

app.listen(5000, () => {
    console.log("Servidor rodando na porta 5000")
});