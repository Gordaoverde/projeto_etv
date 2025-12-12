const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Rota para enviar email
app.post("/enviar", async (req, res) => {
    const { nome, telefone, mensagem, emailDestino } = req.body;

    if (!nome || !telefone || !mensagem) {
        return res.status(400).json({ error: "Campos faltando" });
    }

    try {
        const transporte = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.SENHA
            }
        });

        await transporte.sendMail({
            from: process.env.EMAIL,
            to: emailDestino,
            subject: "Novo formulário recebido",
            text: `
Nome: ${nome}
Telefone: ${telefone}
Mensagem: ${mensagem}
`
        });

        res.json({ status: "OK" });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: "Erro ao enviar email" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("API rodando na porta " + PORT);
});
