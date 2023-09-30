const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json());

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})

const { Model, UserAdmin } = require("../dataBase/dataBaseConfig")
const { loadStreamers, checkAuthentication, generateToken, AddLinksLive } = require("../utils/utils")

const io = require('socket.io')(server);
const path = require('path');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html', 'login.html'));
});

app.get('/painel', checkAuthentication, (req, res) => {
  return res.sendFile(path.join(__dirname, '../public/html', 'painel.html'));
});

app.post("/login", async (req, res) => {
  try {
    const { user, password } = req.body
    const token_validate = generateToken()

    const verificClientDataBase = await UserAdmin.findOne({ user, password })
    if (!verificClientDataBase) throw new Error("Usuário e senha, não encontrados.")

    await UserAdmin.updateOne(
      { user: user },
      { $set: { access_painel: token_validate } }
    )

    return res.status(201).json({ url: `/painel?validate=${token_validate}` })
  } catch (error) {
    return res.status(401).json({ message: error })
  }
})

app.get("/joaovictorvx.api.lives", async (req, res) => {
  try {
    loadStreamers().then(result => {
      return res.status(200).json(result)
    })
  } catch (error) {
    res.status(401).json({ error: "Erro ao tentar receber os links." })
  }
})

app.delete("/joaovictorvx.api.delete.lives", async (req, res) => {
  try {
    const { name } = req.query
    const verificLinkLive = await Model.findOne({ name });

    if (!verificLinkLive) {
      throw new Error("Live não existe.");
    }

    await Model.deleteOne({ name });

    res.status(204).end();
    io.emit("updateStreamers", "Update");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
})

io.on('connection', (socket) => {
  socket.on('addStreamer', (streamer) => {

    AddLinksLive(streamer.name, streamer.twitchURL, streamer.instagramURL, streamer.twitterURL).then(() => {
      io.emit("updateStreamers", streamer);
    })
  });
});