const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs').promises;
const {
  loggedIn,
  notLoggedIn
} = require('./auth');
const router = express.Router();

// multer 설정
const storage = multer.diskStorage({
  destination(req, file, done) {
    done(null, 'uploads/');
  },
  filename(req, file, done) { // 파일 이름: 원본 파일 이름 + 시간 + 확장자
    const ext = path.extname(file.originalname);
    done(null, path.basename(file.originalname, ext) + Date.now() + ext);
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
});

// 사용자 데이터
router.use(async (req, res, next) => {
  req.users = JSON.parse(
    await fs.readFile(path.join(__dirname, '../users.json'))
  );
  next();
});

// 회원가입 & 회원정보 수정 & 회원탈퇴
router.route('/')
  // 회원가입: 사용자로부터 전달받은 정보를 users.json에 작성
  .post(notLoggedIn, upload.single('image'), async (req, res) => {
    const {
      id, // 아이디
      pw, // 비밀번호
      name, // 이름
    } = req.body;
    const img = (req.file ? req.file.filename : ""); // 프로필 이미지
    const index = Date.now();
    req.users[index] = {
      id,
      pw,
      name,
      img,
    };
    await fs.writeFile(
      'users.json',
      JSON.stringify(req.users)
    );
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=UTF-8'
    });
    res.write("<script>alert('회원가입이 완료되었습니다.')</script>");
    res.write("<script>window.location='/login'</script>");
  })
  // 회원정보 수정: 사용자로부터 전달받은 정보로 수정 후 users.json에 작성
  .put(loggedIn, upload.single('image'), async (req, res) => {
    const {
      id,
      pw,
      name,
    } = req.body;
    const img = (req.file ? req.file.filename : "");
    req.users[req.session.user] = {
      id,
      pw,
      name,
      img,
    };
    await fs.writeFile(
      'users.json',
      JSON.stringify(req.users)
    );
    res.end();
  })
  // 회원탈퇴: session과 users의 user가 일치하는 데이터 삭제
  .delete(loggedIn, async (req, res) => {
    if (req.users[req.session.user].img != "") { // 탈퇴할 회원의 프로필 이미지 삭제
      fs.rm(path.join(__dirname, '../uploads/' + req.users[req.session.user].img))
    }
    delete req.users[req.session.user];
    await fs.writeFile(
      'users.json',
      JSON.stringify(req.users)
    );
    const todos = JSON.parse(
      await fs.readFile(path.join(__dirname, '../users.json'))
    );
    Object.keys(todos).map((key) => { // 탈퇴한 회원의 할 일 데이터 삭제
      if (req.session.user == todos[key].user) {
        delete todos[key]
      }
    });
    await fs.writeFile(
      'users.json',
      JSON.stringify(todos)
    );
    req.session.destroy(); // 세션 삭제
    res.clearCookie('mode'); // 쿠키 삭제
    res.end();
  })

// 아이디 중복 확인
router.get('/id?:id', async (req, res) => {
  const id = req.query.id;
  let result = false;
  Object.keys(req.users).map((key) => {
    const user = req.users[key];
    if (user.id == id) {
      result = true;
    }
  });
  res.send(result);
});

// 로그인
router.post('/login', notLoggedIn, async (req, res) => {
  const {
    id,
    pw,
  } = req.body;
  Object.keys(req.users).map((key) => {
    const user = req.users[key];
    if (user.id == id && user.pw == pw) {
      req.session.user = key;
    }
  })
  if (req.session.user) { // 로그인 성공
    res.cookie('mode', 'light'); // 화면모드: light
    res.redirect('/');
  } else {
    res.writeHead(200, { // 로그인 실패
      'Content-Type': 'text/html; charset=UTF-8'
    });
    res.write("<script>alert('사용자 정보가 존재하지 않습니다.')</script>");
    res.write("<script>window.location='/login'</script>");
  }
});

// 로그아웃
router.get('/logout', loggedIn, (req, res) => {
  req.session.destroy(); // 세션 삭제
  res.clearCookie('mode'); // 쿠키 삭제
  res.redirect('/login')
});

module.exports = router;