const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const {
  loggedIn
} = require('./auth');
const router = express.Router();

// 할 일 데이터
router.use(loggedIn, async (req, res, next) => {
  req.todos = JSON.parse(
    await fs.readFile(path.join(__dirname, '../todos.json'))
  );
  next();
});

// 할 일 조회 & 생성
router.route('/')
  // session과 todos의 user가 일치하는 데이터들을 찾아 전송
  .get(loggedIn, (req, res) => {
    const data = [];
    Object.keys(req.todos).map((key) => {
      if (req.session.user == req.todos[key].user) {
        data.push({
          id: key,
          value: req.todos[key]
        });
      }
    });
    res.send(data);
  })
  // 사용자로부터 전달받은 할 일을 todos.json에 작성
  .post(loggedIn, async (req, res) => {
    const {
      todo
    } = req.body;
    const index = Date.now();
    const user = req.session.user;
    req.todos[index] = {
      user,
      todo,
    };
    await fs.writeFile(
      'todos.json',
      JSON.stringify(req.todos)
    );
    res.redirect('/');
  });

// 할 일 삭제 후 todos.json에 작성
router.delete('/:id', loggedIn, async (req, res) => {
  delete req.todos[req.params.id];
  await fs.writeFile(
    'todos.json',
    JSON.stringify(req.todos)
  );
  res.end();
});

module.exports = router;