function createNewUser(event){
    event.preventDefault();

    const username = event.target.userName.value;
    const useremail = event.target.userEmail.value;
    const userpassword = event.target.userPassword.value;
    const userpasswordrepeat = event.target.userPasswordRepeat.value;

    const userDetails = {
        username: username,
        useremail: useremail,
        userpassword: userpassword,
        userpasswordrepeat: userpasswordrepeat
    };
    console.log(userDetails);

    try {
        axios.post('http://localhost:3000/user/signup', userDetails)
        .then( (result) = () => {
            console.log(result)
        })
    } catch (error) {
        console.log(error)
    }
}

