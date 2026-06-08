const express = require('express');
const routes = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ─── GET ALL USUÁRIOS ─────────────────────────────────────────────────────────
routes.get('/', (req, res) => {
  db.query(
    'SELECT id, nome, email, role, ultimo_login, total_logins FROM usuarios ORDER BY ultimo_login DESC',
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Erro ao buscar usuários' });
      res.json(results);
    }
  );
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
routes.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

  try {
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Erro ao fazer login' });
      if (results.length === 0) return res.status(401).json({ error: 'Credenciais inválidas' });

      const user = results[0];
      const senhaValida = await bcrypt.compare(senha, user.senha);
      if (!senhaValida) return res.status(401).json({ error: 'Credenciais inválidas' });

      db.query(
        'UPDATE usuarios SET ultimo_login = NOW(), total_logins = total_logins + 1 WHERE id = ?',
        [user.id]
      );

      // Busca o corredor vinculado ao usuário
      db.query('SELECT id FROM corredores WHERE usuario_id = ?', [user.id], (err2, corrResults) => {
        const corredorId = corrResults && corrResults.length > 0 ? corrResults[0].id : null;

        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '8h' }
        );

        delete user.senha;
        res.status(200).json({
          message: 'Login realizado com sucesso',
          token,
          user: { ...user, corredores_id: corredorId }
        });
      });
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ─── CRIAR USUÁRIO ─────────────────────────────────────────────────────────────
// Ao criar o usuário, cria automaticamente um corredor vinculado na tabela corredores
routes.post('/create', async (req, res) => {
  const { nome, email, senha, turma } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    db.query(
      'INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, "user")',
      [nome, email, senhaHash],
      (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao criar usuário' });

        const usuarioId = results.insertId;

        // Cria automaticamente o corredor vinculado
        db.query(
          'INSERT INTO corredores (nome, turma, usuario_id) VALUES (?, ?, ?)',
          [nome, turma || null, usuarioId],
          (err2, corrResult) => {
            if (err2) {
              console.error('Erro ao criar corredor vinculado:', err2);
              // Ainda retorna sucesso para o usuário, mas loga o erro
            }
            res.status(201).json({
              id: usuarioId,
              nome,
              email,
              corredores_id: corrResult ? corrResult.insertId : null
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ─── EDITAR USUÁRIO ───────────────────────────────────────────────────────────
routes.put('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha } = req.body;

  try {
    let senhaHash = senha;
    if (senha && senha.length > 0) {
      senhaHash = await bcrypt.hash(senha, 10);
    }

    db.query(
      'UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?',
      [nome, email, senhaHash, id],
      (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar usuário' });

        // Atualiza nome no corredor vinculado também
        db.query('UPDATE corredores SET nome = ? WHERE usuario_id = ?', [nome, id]);
        res.status(200).json({ id, nome, email });
      }
    );
  } catch (error) {
    console.error('Erro ao editar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ─── DELETAR USUÁRIO ──────────────────────────────────────────────────────────
routes.delete('/delete/:id', (req, res) => {
  const { id } = req.params;

  // Remove também o corredor vinculado
  db.query('DELETE FROM corredores WHERE usuario_id = ?', [id], () => {
    db.query('DELETE FROM usuarios WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ error: 'Erro ao deletar usuário' });
      res.status(200).json({ message: 'Usuário e corredor deletados com sucesso' });
    });
  });
});

// ─── BUSCAR USUÁRIO POR ID ────────────────────────────────────────────────────
routes.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query(
    'SELECT id, nome, email, role, ultimo_login, total_logins FROM usuarios WHERE id = ?',
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Erro ao buscar usuário' });
      if (results.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.status(200).json(results[0]);
    }
  );
});

module.exports = routes;