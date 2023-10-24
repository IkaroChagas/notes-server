import express from 'express';
import cors from 'cors';
import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 5000;
const databaseURL = process.env.DATABASE_URL;

app.use(express.json());
app.use(cors());

prisma.$connect({ datasources: { db: { url: databaseURL } }});

app.get("/api/notes", async (req, res) => {
    try {
        const notes = await prisma.note.findMany();
        res.json(notes);
    } catch (error) {
        res.status(500).send("Ops, algo deu errado :(");
    }
});

app.post("/api/notes", async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).send("Título e conteúdo são necessários");
    }

    try {
        const note = await prisma.note.create({
            data: { title, content }
        });
        res.json(note);
    } catch (err) {
        res.status(500).send("Ops, algo deu errado :(");
    }
});

app.put("/api/notes/:id", async (req, res) => {
    const { title, content } = req.body;
    const id = parseInt(req.params.id);

    if (!title || !content) {
        return res.status(400).send("Os campos título e conteúdo são obrigatórios");
    }

    if (!id || isNaN(id)) {
        return res.status(400).send("ID deve ser um número válido");
    }

    try {
        const updateNote = await prisma.note.update({
            where: { id },
            data: { title, content },
        });
        res.json(updateNote);
    } catch (error) {
        res.status(500).send("Ops, algo deu errado :(");
    }
});

app.delete("/api/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id || isNaN(id)) {
        return res.status(400).send("ID deve ser um número inteiro");
    }

    try {
        await prisma.note.delete({
            where: { id }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).send("Ops, algo deu errado :(");
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
