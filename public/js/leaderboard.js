const categoryItems = document.querySelectorAll(".dropdown-item");
const categoryInput = document.querySelector("#categoryInput");
const categoryBtn = document.querySelector("#categoryBtn");
const tbody = document.getElementById("tbodyId");
const logoutBtn = document.getElementById("logoutBtn");

categoryItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    const selectedCategory = e.target.getAttribute("data-value");
    categoryBtn.textContent = e.target.textContent;
    categoryInput.value = selectedCategory;
  });
});

async function getLeaderboard() {
  const res = await axios.get("/user/getAllUsers");
  let position = 1;
  res.data.forEach((user) => {
    let name = user.name;
    let amount = user.totalExpenses;

    let tr = document.createElement("tr");
    tr.setAttribute("class", "trStyle");

    tbody.appendChild(tr);

    let th = document.createElement("th");
    th.setAttribute("scope", "row");

    // Add emojis for top 3 positions
    if (position === 1) {
      th.innerHTML = `<span class="emoji">🥇</span> `;
    } else if (position === 2) {
      th.innerHTML = `<span class="emoji">🥈</span> `;
    } else if (position === 3) {
      th.innerHTML = `<span class="emoji">🥉</span> `;
    } else {
      th.textContent = position;
    }

    let td1 = document.createElement("td");
    td1.appendChild(document.createTextNode(name));

    let td2 = document.createElement("td");
    td2.appendChild(document.createTextNode(amount));

    tr.appendChild(th);
    tr.appendChild(td1);
    tr.appendChild(td2);

    position++;
  });
}
async function logout() {
  try {
    localStorage.clear();
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener("DOMContentLoaded", getLeaderboard);
logoutBtn.addEventListener("click", logout);
