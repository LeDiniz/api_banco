const express = require('express') // Importa o módulo 'express', que facilita a criação de servidores HTTP.
const cors = require('cors') // Importa o 'cors', que permite que outras aplicações acessem a API.
const mysql = require('mysql2/promise') // Importa o mysql2 com suporte a async/await.

const app = express()

app.use(cors()) // Usa o Cors (cópia segura)
app.use(express.json()) //Usa o express.json - Dados serem formatos em JSON (cópia segura)

// Configuração do banco
const dbConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'teste'
}

// variável que usa somente na conexão com o banco
let pool;

(async () => {
    try {
        pool = await mysql.createPool(dbConfig)
        console.log('Conectado ao banco de dados com sucesso.')
    } catch (err) {
        console.error('Erro ao conectar no banco:', err)
    }
})()

app.get('/rota', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, nome FROM teste');
        res.json(rows);
    } catch (e) {
        console.error('Erro', e);
        res.status(500).json({ erro: 'Erro no servidor' });
    }
});

app.get('/rotaUnica', async (req, res) => {
    try {
        const { id } = req.body;
        const [rows] = await pool.query('SELECT nome FROM teste WHERE id = (?)', [id]);
        res.json(rows);
    } catch (e) {
        console.log("Erro", e);
        res.status(500).json({ erro: 'Erro ao buscar registro' });
    }
});

app.post('/rotaAdd', async (req, res) => {
    try {
        const { nome } = req.body;
        await pool.query('INSERT INTO teste (nome) VALUES (?)', [nome]);
        res.json({ mensagem: 'Registro inserido com sucesso!' });
    } catch (e) {
        console.log("Erro", e);
        res.status(500).json({ erro: 'Erro ao inserir registro' });
    }
})

app.delete('/rotaDelete', async (req, res) => {
    try {
        const { id } = req.body;
        await pool.query('DELETE FROM teste WHERE id= (?)', [id]);
        res.json({ mensagem: 'Registro deletado com sucesso!' });
    } catch (e) {
        console.log("Erro", e);
        res.status(500).json({ erro: 'Erro ao deletar registro' });
    }
})

app.put('/rotaPut', async (req, res) => {
    try {
        const { id } = req.body;
        const { nome } = req.body;
        await pool.query('UPDATE teste SET nome = (?) WHERE id= (?)', [nome,id]);
        res.json({ mensagem: 'Registro atualizado com sucesso!' });
    } catch (e) {
        console.log("Erro", e);
        res.status(500).json({ erro: 'Erro ao atualizar registro' });
    }
})

app.listen(3003, () => {
    console.log('O servidor tá on')
})
