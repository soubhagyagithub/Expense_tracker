const dateInput = document.getElementById("date");
const dateShowBtn = document.getElementById("dateShowBtn");
const tbodyDaily = document.getElementById("tbodyDailyId");
const tfootDaily = document.getElementById("tfootDailyId");

const weekInput = document.getElementById("week");
const weekShowBtn = document.getElementById("weekShowBtn");
const tbodyWeekly = document.getElementById("tbodyWeeklyId");
const tfootWeekly = document.getElementById("tfootWeeklyId");

const monthInput = document.getElementById("month");
const monthShowBtn = document.getElementById("monthShowBtn");
const tbodyMonthly = document.getElementById("tbodyMonthlyId");
const tfootMonthly = document.getElementById("tfootMonthlyId");

const logoutBtn = document.getElementById("logoutBtn");

const BACKEND_ADDRESS = "https://trackmoney.xyz";

// Function to format and display the username
function formatAndDisplayUsername(fullName) {
  const firstName = fullName.split(" ")[0];
  const displayName = `${firstName} ....`;
  const profileDropdown = document.getElementById("profileDropdown");
  if (profileDropdown) {
    profileDropdown.querySelector("span").textContent = displayName;
  }
}

async function getDailyReport(e) {
  try {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const date = new Date(dateInput.value);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

    console.log("Formatted Date for Request: ", formattedDate);

    let totalAmount = 0;
    const res = await axios.post(
      `${BACKEND_ADDRESS}/reports/dailyReports`,
      { date: formattedDate },
      { headers: { Authorization: token } }
    );

    console.log("Response Data: ", res.data); // Check response

    tbodyDaily.innerHTML = "";
    tfootDaily.innerHTML = "";

    res.data.forEach((expense) => {
      totalAmount += expense.amount;

      const tr = document.createElement("tr");
      tr.setAttribute("class", "trStyle");
      tbodyDaily.appendChild(tr);

      const th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.style.color = "white"; // Set serial number color to white
      const expenseDate = new Date(expense.createdAt);
      th.appendChild(
        document.createTextNode(
          `${expenseDate.getDate().toString().padStart(2, "0")}-${(
            expenseDate.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${expenseDate.getFullYear()}`
        )
      );

      const td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(expense.category));

      const td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(expense.description));

      const td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(expense.amount));

      tr.appendChild(th);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
    });

    const tr = document.createElement("tr");
    tr.setAttribute("class", "trStyle");
    tfootDaily.appendChild(tr);

    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");

    td3.setAttribute("id", "dailyTotal");
    td4.setAttribute("id", "dailyTotalAmount");
    td3.style.color = "pink"; // Set total label color to pink
    td4.style.color = "pink"; // Set total amount color to pink
    td3.appendChild(document.createTextNode("Total"));
    td4.appendChild(document.createTextNode(totalAmount));

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
  } catch (error) {
    console.log("Error: ", error);
  }
}

async function getWeeklyReport(e) {
  try {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const week = weekInput.value;

    if (!week) {
      return alert("Please select a valid week!");
    }

    // Split the week input into year and week number
    const [year, weekNumber] = week.split("-W");
    if (!year || !weekNumber) {
      return alert("Invalid week format. Please select a valid week.");
    }

    // Get the first date of the year
    const firstDayOfYear = new Date(year, 0, 1); // January 1st of the year
    const daysOffset = (weekNumber - 1) * 7; // Offset weeks (week starts on Monday)
    const startDate = new Date(
      firstDayOfYear.setDate(firstDayOfYear.getDate() + daysOffset)
    );

    // Calculate the last date of the week (7 days from the start, full day)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // Add 6 days for the week range
    endDate.setHours(23, 59, 59, 999); // Ensure the entire last day is included

    // Format the dates as YYYY-MM-DD
    const formattedStartDate = `${startDate.getFullYear()}-${(
      startDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${startDate.getDate().toString().padStart(2, "0")}`;
    const formattedEndDate = `${endDate.getFullYear()}-${(
      endDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${endDate.getDate().toString().padStart(2, "0")}`;

    console.log("Week Range: ", formattedStartDate, "to", formattedEndDate);

    let totalAmount = 0;
    const res = await axios.post(
      `${BACKEND_ADDRESS}/reports/weeklyReports`,
      { startDate: formattedStartDate, endDate: formattedEndDate },
      { headers: { Authorization: token } }
    );

    console.log("Response Data: ", res.data);

    tbodyWeekly.innerHTML = "";
    tfootWeekly.innerHTML = "";

    res.data.forEach((expense) => {
      totalAmount += expense.amount;

      const tr = document.createElement("tr");
      tr.setAttribute("class", "trStyle");
      tbodyWeekly.appendChild(tr);

      const th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.style.color = "white";
      const expenseDate = new Date(expense.createdAt);
      th.appendChild(
        document.createTextNode(
          `${expenseDate.getDate().toString().padStart(2, "0")}-${(
            expenseDate.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${expenseDate.getFullYear()}`
        )
      );

      const td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(expense.category));

      const td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(expense.description));

      const td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(expense.amount));

      tr.appendChild(th);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
    });

    const tr = document.createElement("tr");
    tr.setAttribute("class", "trStyle");
    tfootWeekly.appendChild(tr);

    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");

    td3.setAttribute("id", "weeklyTotal");
    td4.setAttribute("id", "weeklyTotalAmount");
    td3.style.color = "pink";
    td4.style.color = "pink";
    td3.appendChild(document.createTextNode("Total"));
    td4.appendChild(document.createTextNode(totalAmount));

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
  } catch (error) {
    console.error("Error: ", error);
  }
}

weekShowBtn.addEventListener("click", getWeeklyReport);

async function getMonthlyReport(e) {
  try {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const month = new Date(monthInput.value);
    const formattedMonth = `${month.getFullYear()}-${(month.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

    console.log("Formatted Month for Request: ", formattedMonth);

    let totalAmount = 0;
    const res = await axios.post(
      `${BACKEND_ADDRESS}/reports/monthlyReports`,
      { month: formattedMonth },
      { headers: { Authorization: token } }
    );

    console.log("Response Data: ", res.data); // Check response

    tbodyMonthly.innerHTML = "";
    tfootMonthly.innerHTML = "";

    res.data.forEach((expense) => {
      totalAmount += expense.amount;

      const tr = document.createElement("tr");
      tr.setAttribute("class", "trStyle");
      tbodyMonthly.appendChild(tr);

      const th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.style.color = "white"; // Set serial number color to white
      const expenseDate = new Date(expense.createdAt);
      th.appendChild(
        document.createTextNode(
          `${expenseDate.getDate().toString().padStart(2, "0")}-${(
            expenseDate.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${expenseDate.getFullYear()}`
        )
      );

      const td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(expense.category));

      const td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(expense.description));

      const td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(expense.amount));

      tr.appendChild(th);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
    });

    const tr = document.createElement("tr");
    tr.setAttribute("class", "trStyle");
    tfootMonthly.appendChild(tr);

    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");

    td3.setAttribute("id", "monthlyTotal");
    td4.setAttribute("id", "monthlyTotalAmount");
    td3.style.color = "pink"; // Set total label color to pink
    td4.style.color = "pink"; // Set total amount color to pink
    td3.appendChild(document.createTextNode("Total"));
    td4.appendChild(document.createTextNode(totalAmount));

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
  } catch (error) {
    console.log("Error: ", error);
  }
}

async function logout() {
  try {
    localStorage.clear();
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }
}

async function updatePremiumUI() {
  const isPremium = localStorage.getItem("isPremium") === "true";
  const premiumNavItem = document.getElementById("premiumNavItem");

  if (!isPremium) {
    premiumNavItem.style.display = "none";
  } else {
    premiumNavItem.style.display = "block";
    unlockReportsAfterPremiumMember();
  }
}

const token = localStorage.getItem("token");
const decodedToken = JSON.parse(atob(token.split(".")[1]));
const fullName = decodedToken.name;

const userName = formatAndDisplayUsername(fullName);
window.addEventListener("DOMContentLoaded", userName);
window.addEventListener("DOMContentLoaded", updatePremiumUI);

dateShowBtn.addEventListener("click", getDailyReport);
monthShowBtn.addEventListener("click", getMonthlyReport);
logoutBtn.addEventListener("click", logout);
