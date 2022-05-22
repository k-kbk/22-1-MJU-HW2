const inputImage = document.getElementById("img_input");
const submitButton = document.getElementById("submit_button");
const checkButton = document.getElementById("check_button");
const idInput = document.getElementById("id");

// 미리보기 이미지
const readImage = ((input) => {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = ((e) => {
      const previewImage = document.getElementById("preview_img")
      previewImage.src = e.target.result;
    });
    reader.readAsDataURL(input.files[0]);
  }
});
inputImage.addEventListener("change", (e) => {
  readImage(e.target);
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
  const id = idInput.value;
  if (id) {
    checkId(id);
  } else {
    alert("아이디를 입력해주세요.")
  }
});
idInput.addEventListener("change", (e) => {
  checkButton.value = "unchecked";
  submitButton.disabled = true;
});