// 로그인 O
exports.loggedIn = (req, res, next) => {
  if (req.session.user) { // 로그인 된 상태일 시, 다음 미들웨어로
    next();
  } else {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=UTF-8'
    });
    res.write("<script>alert('로그인이 필요합니다.')</script>");
    res.write("<script>window.location='/login'</script>");
  }
};
// 로그인 X
exports.notLoggedIn = (req, res, next) => {
  if (!req.session.user) { // 로그인 안 된 상태일 시, 다음 미들웨어로
    next();
  } else {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=UTF-8'
    }); 
    res.write("<script>alert('이미 로그인한 상태입니다.')</script>");
    res.write("<script>window.history.back();</script>");
  }
};