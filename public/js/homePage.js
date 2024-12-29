
window.addEventListener('DOMContentLoaded', async (event) => {
  try {
        const token = localStorage.getItem("token");
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const fullName = decodedToken.name;

        // Format and display the username after login
        formatAndDisplayUsername(fullName);
    
        // Check premium status and update the UI accordingly
        await checkPremiumStatus();
        updatePremiumUI();

        // Fetch expenses
        const res = await axios.get('/expense/getExpense/', {
            headers: { Authorization: token },
        });
        pagination(res.data.totalExpenses, 10);
        const arrayOfLists = res.data.expenses;
        arrayOfLists.forEach(list => {
            addExpenseToList(list);
        });

  } catch (err) {
        console.log(err);
  }
});

function  updatePremiumUI() {
    const isPremium = localStorage.getItem('isPremium') === 'true';

    const buyPremiumBtn = document.getElementById('buyPremiumBtn');
    const premiumNavItem = document.getElementById('premiumNavItem');

  if (!isPremium) {
        buyPremiumBtn.style.display = 'block';
        premiumNavItem.style.display = 'none';
  } else {
        buyPremiumBtn.style.display = 'none';
        premiumNavItem.style.display = 'block';
        showLeaderboard()
        unlockReportsAfterPremiumMember()
  }
}

// Function to format and display the username
function formatAndDisplayUsername(fullName) {
    const firstName = fullName.split(' ')[0];
    const displayName = `${firstName} ....`;
    const profileDropdown = document.getElementById('profileDropdown');
    if (profileDropdown) {
        profileDropdown.querySelector('span').textContent = displayName;
    }
}

async function getExpenses(noOfRows){
  try {
        const token = localStorage.getItem("token");
        return await axios.get(`/expense/getExpense/?page=1&size=${noOfRows}`,{
            headers: { Authorization: token }, 
        })
        .then(res => {
            return (res.data);
        })
        .catch(err => console.log(err));
  }
  catch(err){
        console.log(err);   
  }
}

async function checkPremiumStatus(){
  try{ 
        const token = localStorage.getItem("token");
        const response = await axios.get('/user/checkPremium',{
            headers: { Authorization: token },
        })
        const isPremium = response.data.isPremiumUser; 
        
    
        // Store the premium status in localStorage
        localStorage.setItem('isPremium', isPremium);
  }
  catch(err){
        console.log(err);
        localStorage.setItem('isPremium', false);
  }
}

async function updatePagination(){
  try{
        const noOfRows = parseInt(sizeOfPage.options[sizeOfPage.selectedIndex].value);
        const expensesList = await getExpenses(noOfRows);
        const expensesArray = expensesList.expenses;
        document.querySelector('.expenseTableBody').innerHTML = '';
        expensesArray.forEach(list => {
            addExpenseToList(list);
        })
        pagination(expensesList.totalExpenses, noOfRows);
  }  
  catch(err){
      console.log(err);
  }
}

const sizeOfPage = document.getElementById("sizeOfPage");
sizeOfPage.addEventListener("change", async () => {
  try{
      updatePagination();
  }
  catch(err){
      console.log(err);
  }
});

async function pagination(totalExpenses, noOfRows){
  try{
        const container = document.querySelector('.pagination');
        container.innerHTML = '';
        let noOfPages = Math.floor(totalExpenses/noOfRows);
        if(totalExpenses%noOfRows){
            noOfPages += 1;
        }
        for(let i=1; i <= noOfPages; i++){
            const li = document.createElement('li');
            li.setAttribute('class', 'page-item');

            const a = document.createElement('a');
            a.setAttribute('class', 'page-link');
            a.setAttribute("style", "color: #E9E8E8; background-color: #913175; border-color: #CD5888;")
            a.innerHTML = i;

            a.addEventListener('click', async () => {
                const sizeOfPage = document.getElementById('sizeOfPage').value;
                const token = localStorage.getItem("token");
                await axios.get(`/expense/getExpense/?page=${a.innerHTML}&size=${sizeOfPage}`, {
                    headers: { Authorization: token },
                })
                .then(res => {
                    arrayOfLists = res.data.expenses;
                    document.querySelector('.expenseTableBody').innerHTML = '';
                    arrayOfLists.forEach(list => {
                        addExpenseToList(list);
                    })
                })
                .catch(err => {
                    console.log(err);
                })
            })
            li.appendChild(a);
            container.appendChild(li);
        }
    }
  catch(err){
      console.log(err);
  }
}


document.getElementById('buyPremiumBtn').addEventListener('click', buypremium);

async function buypremium(){
  try{      
        const token = localStorage.getItem("token");
        const response = await axios.get('/purchase/premiumMembership', {
            headers: { Authorization: token }
        });
        console.log(response);
        const options = {
            "key" : response.data.key_id,
            "order_id" : response.data.order.id,
            "handler" : async function (response){
                await axios.post('/purchase/updateTransactionStatus', {
                order_id : options.order_id,
                payment_id : response.razorpay_payment_id,
                status : 'SUCCESSFUL'
                }, {
                    headers: { Authorization: token },
            })
                alert(
                "Welcome to our Premium Membership, You have now access to Reports and LeaderBoard"
                );
                window.location.reload()
                
            }
        };
        const razorpay = new Razorpay(options)
        razorpay.open();
        razorpay.on(`payment.failed`, async (response) => {
            await axios.post('/purchase/updateTransactionStatus', {
                order_id : options.order_id,
                payment_id : response.razorpay_payment_id,
                status : 'FAILED'
            }, {
                headers: { Authorization: token },
            })
        alert('Payment Failed');
        });   
  }
  catch(err){
      console.log(err);
  }
}

function unlockReportsAfterPremiumMember() {
    const reportsLink = document.getElementById("reportsLink");
    reportsLink.removeAttribute("onclick")
    reportsLink.setAttribute("href", "/reports/getReportsPage");
}

async function showLeaderboard(){
  try {
        const token = localStorage.getItem("token");
        const rankers = await axios.get('/leaderboard/getRankers',{
            headers: { Authorization: token },
        });
        const container = document.querySelector('.leaderboardColumn');
        container.innerHTML = '';
        const table = document.createElement('table');
        table.setAttribute('class', 'table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        container.appendChild(table);
        table.appendChild(thead);
        table.appendChild(tbody);
        thead.innerHTML = `<tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Expense</th>
                        </tr>`;
        let leaderBoardCounter = 1;
        rankers.data.forEach( ranker => {
            if(leaderBoardCounter <= 5){
                const tr = document.createElement('tr');
                const th = document.createElement('th');
                const tdName = document.createElement('td');
                const tdExpense = document.createElement('td');
                th.setAttribute('scope', 'row');

                if(leaderBoardCounter === 1){
                    th.innerHTML = '🥇';
                    leaderBoardCounter++;
                }
                else if(leaderBoardCounter === 2){
                    th.innerHTML = '🥈';
                    leaderBoardCounter++;
                }
                else if(leaderBoardCounter === 3){
                    th.innerHTML = '🥉';
                    leaderBoardCounter++;
                }
                else{
                    th.innerHTML = leaderBoardCounter++;
                }
                th.style.color = 'white'
                tdName.innerHTML = ranker.name;
                tdExpense.innerHTML = ranker.totalExpenses;

                tbody.appendChild(tr);
                tr.appendChild(th);
                tr.appendChild(tdName);
                tr.appendChild(tdExpense);
            }
        })
    }
  catch(err){
        console.log(err);
  }
}

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    try{
        e.preventDefault();
        addExpense();
    }
    catch(err){
        console.log(err);
    }
})

async function addExpense() {
  try {
        const token = localStorage.getItem("token");
        const expenseAmount = document.getElementById('amount').value;
        const expenseDescription = document.getElementById('description').value;
        const expenseCategory = document.getElementById('category').value;

        const result = await axios.post('/expense/addExpense', {
            amount: expenseAmount,
            description: expenseDescription,
            category: expenseCategory
        }, {
            headers: { Authorization: token },
        });

        document.querySelector('.newExpense').innerHTML = 'Added Successfully';
        setTimeout(() => {
            document.querySelector('.newExpense').innerHTML = '';
        }, 2000);


        addExpenseToList(result.data.expense);
        await updatePagination();

        const isPremium = localStorage.getItem("isPremium") === "true";
        console.log(isPremium);
        
        if (isPremium) {
            showLeaderboard()
        }
        // Clear the form fields
        document.querySelector('form').reset();
    } catch (err) {
        console.log(err);
  }
}



async function deleteExpense(id){
  try{
        const token = localStorage.getItem("token");
        await axios.delete(`/expense/deleteExpense/${id}`,{
            headers: { Authorization: token },
        })
            .then(result => {
                updatePagination();
                const isPremium = localStorage.getItem("isPremium") === "true";
                if (isPremium) {
                showLeaderboard();
            }
            })
            .catch(err => {
                console.log(err)
            });
    }
  catch(err){
      console.log(err);
  }
 
}

function editExpense(expense) {
  try {
        // Populate form with existing data
        document.getElementById('amount').value = expense.amount;
        document.getElementById('description').value = expense.description;
        document.getElementById('category').value = expense.category;
        document.getElementById('expenseId').value = expense.id; // Store expense ID

        // Change the button to "Update" and set the correct form submission function
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.value = "Update Expense";
        submitBtn.setAttribute("onclick", "updateExpense(event)");

        // Scroll to the form for better user experience
        document.getElementById('form1').scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Add focus to the input field
        setTimeout(() => {
            document.getElementById('amount').focus();
        }, 0);
  } catch (err) {
      console.log(err);
  }
}

async function updateExpense(e) {
  try {
        e.preventDefault(); // Prevent form submission

        const token = localStorage.getItem("token");
        const expenseId = document.getElementById('expenseId').value;
        const expenseAmount = document.getElementById('amount').value;
        const expenseDescription = document.getElementById('description').value;
        const expenseCategory = document.getElementById('category').value;

        await axios.put(`/expense/editExpense/${expenseId}`, {
            amount: expenseAmount,
            description: expenseDescription,
            category: expenseCategory
        }, {
            headers: { Authorization: token }
        })
        .then(result => {
            document.querySelector('.newExpense').innerHTML = 'Updated Successfully';
            setTimeout(() => {
                document.querySelector('.newExpense').innerHTML = '';
            }, 2000);
            updatePagination();
            const isPremium = localStorage.getItem("isPremium") === "true";
            if (isPremium) {
                showLeaderboard();
            }

            // Reset the form to default state
            document.getElementById('form1').reset();
            document.getElementById('submitBtn').value = "Add Expense";
            document.getElementById('submitBtn').setAttribute("onclick", "addExpense(event)");

        })
        .catch(err => console.log(err));
  } catch (err) {
      console.log(err);
  }
}



function addExpenseToList(expense){
  try{
        const tableBody = document.querySelector('.expenseTableBody');
        const tableRow = document.createElement('tr');
        const rowDate = document.createElement('td');
        const rowAmount = document.createElement('td');
        const rowDescription = document.createElement('td');
        const rowCategory = document.createElement('td');
        const rowEdit = document.createElement('td');
        const rowDelete = document.createElement('td');
        rowAmount.setAttribute('scope', 'row');

        rowDate.innerHTML = expense.createdAt.split('T')[0];
        rowAmount.innerHTML = expense.amount;
        rowDescription.innerHTML = expense.description;
        rowCategory.innerHTML = expense.category;

        const editButton = document.createElement('button');
        editButton.innerHTML = "Edit";
        editButton.setAttribute("class", "btn btn-success btn-sm  edit")
        editButton.setAttribute("data-toggle", "modal")
        editButton.setAttribute("data-target", "#exampleModalCenter")
        rowEdit.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = "Delete";
        deleteButton.setAttribute("class", "btn btn-danger btn-sm  delete");
        rowDelete.appendChild(deleteButton);

        tableBody.appendChild(tableRow);
        tableRow.appendChild(rowDate);
        tableRow.appendChild(rowAmount);
        tableRow.appendChild(rowDescription);
        tableRow.appendChild(rowCategory);
        tableRow.appendChild(rowEdit);
        tableRow.appendChild(rowDelete);

        deleteButton.addEventListener('click', (e) => {
            e.preventDefault();
            deleteExpense(expense.id);
            tableBody.removeChild(tableRow);
        })

        editButton.addEventListener('click', () => {
            editExpense(expense);
        });
        
    }
  catch(err){
      console.log(err);
  }

}

//Reports

document.getElementById('dailyReport').addEventListener('click', async () => {
  try{
        const report = await axios.get('/expense/dailyExpense');
        if(report.data == ''){
            document.querySelector('#subscribeMessage').innerHTML = 'Buy Premium Subscription to access thdi feature!'
            setTimeout(() => {
                document.querySelector('#subscribeMessage').innerHTML = '';
            }, 5000);
        }else{
            var a = document.createElement("a");
            a.href = report.data;
            a.download = 'myexpense.csv';
            a.click();
        }
   }
    catch(err){
        console.log(err);
    }
})

document.getElementById('monthlyReport').addEventListener('click', async () => {
  try{
        const report = await axios.get('/expense/monthlyExpense');
        if(report.data == ''){
            document.querySelector('#subscribeMessage').innerHTML = 'Buy Premium Subscription to access thdi feature!'
            setTimeout(() => {
                document.querySelector('#subscribeMessage').innerHTML = '';
            }, 5000);
        }else{
            var a = document.createElement("a");
            a.href = report.data;
            a.download = 'myexpense.csv';
            a.click();
        }
  }
  catch(err){
      console.log(err);
  }
})

document.getElementById('yearlyReport').addEventListener('click', async () => {
  try{
        const report = await axios.get('/expense/yearlyExpense');
        if(report.data == ''){
            document.querySelector('#subscribeMessage').innerHTML = 'Buy Premium Subscription to access thdi feature!'
            setTimeout(() => {
                document.querySelector('#subscribeMessage').innerHTML = '';
            }, 5000);
        }else{
            var a = document.createElement("a");
            a.href = report.data;
            a.download = 'myexpense.csv';
            a.click();
        }
  }
  catch(err){
        console.log(err);
  }
})



const logoutBtn = document.getElementById("logoutBtn");
async function logout() {
    try {
        localStorage.clear();
        window.location.href = "/";
    } catch (error) {
        console.log(error);
    }
}

logoutBtn.addEventListener("click", logout);