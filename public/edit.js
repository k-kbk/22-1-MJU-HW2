const inputImage = document.getElementById("img_input");
const submitButton = document.getElementById("submit_button");
const checkButton = document.getElementById("check_button");
const previewImage = document.getElementById("preview_img");

// 미리보기 이미지
const readImage = ((input) => {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = ((e) => {
      previewImage.src = e.target.result;
    });
    reader.readAsDataURL(input.files[0]);
  }
});
inputImage.addEventListener("change", (e) => {
  readImage(e.target);
  console.log(inputImage);
});

// 아이디 중복 확인
const checkId = (async (id) => {
  try {
    const check = await axios.get("/user/id", {
      params: {
        id: id
      }
    });
    if (check.data) {
      checkButton.value = "unchecked";
      submitButton.disabled = true;
      alert("이미 사용 중인 아이디입니다.");
    } else {
      checkButton.value = "checked";
      submitButton.disabled = false;
      alert("사용 가능한 아이디입니다.");
    }
  } catch (error) {
    console.log("error");
  }
});
checkButton.addEventListener("click", (e) => {
  const id = document.getElementById("id").value;
  if (id) {
    checkId(id);
  } else {
    alert("아이디를 입력해주세요.")
  }
});

// 내 정보 수정 클릭 시
submitButton.addEventListener("click", (e) => {
  let data = document.getElementById("edit_form");
  data = new FormData(data);
  axios.put("/user", data)
    .then((res) => {
      alert("내 정보가 수정되었습니다.");
      window.location = "/";
    })
    .catch((err) => {
      console.log(error);
    })
});