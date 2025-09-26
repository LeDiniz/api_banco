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
    database: 'aula2509'
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

app.get('/clientes', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT nome FROM clientes')
        res.json(rows)
    } catch (e) {
        console.log('Erro', e)
        res.status(500).json({ erro: 'Erro no servidor' })
    }
})

app.listen(3003, () => {
    console.log('O servidor tá on')
})
