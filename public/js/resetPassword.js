const resetPasswordBtn = document.getElementById("resetPasswordBtn");

const serverUrl = process.env.SERVER_URL;
async function updatePassword() {
  try {
    const newPassword = document.getElementById("newPassword").value;
    const res = await axios.post(`${serverUrl}/password/resetPassword`, {
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
