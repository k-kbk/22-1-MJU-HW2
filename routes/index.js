const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const {
  loggedIn,
  notLoggedIn
} = require('./auth');
const router = express.Router();

// 사용자 데이터
router.use(async (req, res, next) => {
  req.users = JSON.parse(
    await fs.readFile(path.join(__dirname, '../users.json'))
  );
  next();
});

// 메인 페이지
router.get('/', loggedIn, (req, res) => {
  const data = req.users[req.session.user];
  return res.render('main', {
    data
  });
});

// 로그인 페이지
router.get('/login', notLoggedIn, (req, res) => {
  res.render('login');
});

// 회원가입 페이지
router.get('/signup', notLoggedIn, (req, res) => {
  res.render('signup');
});

// 정보 수정 페이지
router.get('/edit', loggedIn, (req, res) => {
  const data = req.users[req.session.user];
  return res.render('edit', {
    data
  });
});

module.exports = router;