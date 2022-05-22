const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const todoRouter = require('./routes/todo');

// 서버 객체
const app = express();

// 설정
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 미들웨어
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1800000,
    },
    name: 'session',
  })
);

// 라우팅 미들웨어
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/todo', todoRouter);

// 404 미들웨어
app.use((req, res, next) => {
  res.status(404).send(`${req.method} ${req.path}`);
});

// 에러 미들웨어
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('!Internet Server Error!');
});

// 서버 실행
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});