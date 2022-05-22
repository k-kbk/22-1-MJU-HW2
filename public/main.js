const quitButton = document.getElementById('quit_button');
const select = document.getElementById('mode');
let todos = [];

// 모드 변경
function getMode() {
  if (document.cookie == 'mode=dark') {
    document.getElementsByTagName('option')[1].selected = true;
    changeMode('dark');
  }
  if (document.cookie == 'mode=light') {
    document.getElementsByTagName('option')[0].selected = true;
    changeMode('light');
  }
};
function changeMode(type) {
  if (type == 'dark') { // 다크모드
    document.getElementsByClassName('body_wrap')[0].style.backgroundColor = '#2c2d30';
    document.getElementsByClassName('nav_wrap')[0].style.backgroundColor = '#303841';
    document.getElementsByClassName('logo')[0].style.color = '#F5F5F5';
    document.getElementsByClassName('input_button')[0].style.color = '#F5F5F5';
    document.getElementsByClassName('input_button')[0].style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
    document.getElementsByClassName('todo_input')[0].style.color = '#F5F5F5';
    document.getElementById('quit_button').style.color = '#F5F5F5';
    document.getElementById('mode').style.color = '#F5F5F5';
    document.getElementsByTagName('a')[0].style.color = '#F5F5F5';
    document.getElementsByTagName('a')[1].style.color = '#F5F5F5';
    document.getElementsByTagName('p')[0].style.color = '#F5F5F5';
    document.getElementsByTagName('p')[1].style.color = '#F5F5F5';
    todos.map((data, index) => {
      document.getElementsByClassName('todo_square')[index].style.color = '#F5F5F5';
      document.getElementsByClassName('todo_text')[index].style.color = '#F5F5F5';
      document.getElementsByClassName('todo_button')[index].style.color = '#F5F5F5';
    });
  }
  if (type == 'light') { // 라이트모드
    document.getElementsByClassName('body_wrap')[0].style.backgroundColor = '#F5F5F5';
    document.getElementsByClassName('nav_wrap')[0].style.backgroundColor = 'rgba(232, 230, 221, 0.5)';
    document.getElementsByClassName('logo')[0].style.color = 'black';
    document.getElementsByClassName('input_button')[0].style.color = 'black';
    document.getElementsByClassName('input_button')[0].style.backgroundColor = 'rgba(232, 230, 221, 1)';
    document.getElementsByClassName('todo_input')[0].style.color = 'black';
    document.getElementById('quit_button').style.color = '#303841';
    document.getElementById('mode').style.color = '#303841';
    document.getElementsByTagName('a')[0].style.color = '#303841';
    document.getElementsByTagName('a')[1].style.color = '#303841';
    document.getElementsByTagName('p')[0].style.color = '#303841';
    document.getElementsByTagName('p')[1].style.color = '#303841';
    todos.map((data, index) => {
      document.getElementsByClassName('todo_square')[index].style.color = 'black';
      document.getElementsByClassName('todo_text')[index].style.color = 'black';
      document.getElementsByClassName('todo_button')[index].style.color = 'black';
    });
  }
};

// 모드 변경 클릭 시
select.addEventListener('change', (e) => {
  if (e.target.value == 'darkmode') {
    document.cookie = 'mode=dark'
    changeMode('dark');
  }
  if (e.target.value == 'lightmode') {
    document.cookie = 'mode=light'
    changeMode('light');
  }
});

// 회원탈퇴 클릭 시
quitButton.addEventListener('click', async () => {
  if (window.confirm('회원탈퇴를 진행하시겠습니까?')) {
    axios.delete('/user')
      .then(() => {
        alert('회원탈퇴가 완료되었습니다.');
        window.location = '/login';
      })
      .catch((err) => {
        console.log('error');
      });
  }
});

// 할 일 목록 가져오기
async function getTodo() {
  try {
    const res = await axios.get('/todo');
    todos = res.data;
    const todoList = document.getElementById('todo_list');
    todoList.innerHTML = '';
    todos.map((data) => {
      const li = document.createElement('li');
      li.className = 'todo_li';
      const div = document.createElement('div');
      div.className = 'todo_div';
      const square = document.createElement('p');
      square.className = 'todo_square';
      square.textContent = '▪︎';
      const p = document.createElement('p');
      p.className = 'todo_text';
      p.textContent = data.value.todo;
      const span = document.createElement('span');
      span.className = 'todo_span'
      const remove = document.createElement('button');
      remove.className = 'todo_button';
      remove.textContent = '삭제';
      remove.addEventListener('click', async () => {
        try {
          await axios.delete('/todo/' + data.id);
          getTodo();
        } catch (err) {
          console.log('error');
        }
      });
      div.appendChild(square);
      div.appendChild(p);
      span.appendChild(remove);
      li.appendChild(div);
      li.appendChild(span);
      todoList.appendChild(li);
    });
    getMode();
  } catch (err) {
    console.error(err);
  }
}

// 화면 로딩 시
window.onload = getTodo;
