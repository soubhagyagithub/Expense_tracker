const resetPasswordBtn = document.getElementById("resetPasswordBtn");

const BACKEND_ADDRESS = "http://trackmoney.xyz";
async function updatePassword() {
  try {
    const newPassword = document.getElementById("newPassword").value;
    const res = await axios.post(`${BACKEND_ADDRESS}/password/resetPassword`, {
      password: newPassword,
    });
    alert(res.data.message);
    window.location.href = "/";
  } catch (error) {
    console.log(error);
    alert(error.response.data.message);
    window.location.reload();
  }
}

resetPasswordBtn.addEventListener("click", updatePassword);
