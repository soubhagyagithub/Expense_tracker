const signUp = document.getElementById("signUp");
const signIn = document.getElementById("signIn");
const container = document.getElementById("container");
const loginBtn = document.getElementById("loginBtn");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const registerBtn = document.getElementById("registerBtn");
const closeBtn = document.getElementById("closeBtn");

signUp.addEventListener("click", () => {
  container.classList.add("active");
  history.pushState(null, null, '/user/signUp');
});

signIn.addEventListener("click", () => {
  container.classList.remove("active");
  history.pushState(null, null, '/user/login');
});

registerBtn.addEventListener("click", () => {
  container.style.display = "block";
  registerBtn.style.display = "none";
  history.pushState(null, null, '/user/login');
});

closeBtn.addEventListener("click", () => {
  container.style.display = "none";
  registerBtn.style.display = "block";
  history.pushState(null, null, '/');
});



window.onload = function() {
  const url = window.location.pathname;

  if (url.endsWith("/signUp")) {
    container.style.display = "block";
    registerBtn.style.display = "none";
  } else if (url.endsWith("/login")) {
    container.style.display = "block";
    registerBtn.style.display = "none";
  }
};
// SignUp functionality
async function createUser(event) {
  event.preventDefault();

  const password = event.target.password.value;
  const confirmPassword = event.target.confirmPassword.value;
  
  if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return
  }
  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  const signUpDetails = {
    name: event.target.name.value,
    email: event.target.email.value,
    password: password,
  };

  await axios
    .post("http://localhost:3000/user/signUp", signUpDetails)
    .then((res) => {
      alert(res.data.message);
      window.location.href = "/user/login";
    })
    .catch((error) => {
      if (error.response) {
        const errorMessage = error.response.data.message;
        alert(errorMessage);
      } else {
        alert("An error occurred. Please try again later.");
      }
    });
}

// SignIn functionality

async function login() {
  if (!loginEmail.value || !loginPassword.value) {
    alert("Please fill in both fields.");
    return;
  }

  const loginDetails = {
    email: loginEmail.value,
    password: loginPassword.value,
  };

  await axios
    .post("http://localhost:3000/user/login", loginDetails)
    .then((result) => {
      alert(result.data.message);
      localStorage.setItem("token", result.data.token);
      window.location.href = "/homePage";
    })
    .catch((error) => {
      console.log(error);
      if (error.response) {
        const errorMessage = error.response.data.message;
        alert(errorMessage);
      } else {
        alert("An error occurred. Please try again later.");
      }
    });
}

loginBtn.addEventListener("click", login);
document.getElementById('forgotPasswordLink').addEventListener('click', function () {
  window.location.href = '/password/forgotPasswordPage';
});
