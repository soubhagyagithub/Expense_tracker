
const publicIp='http://localhost:3000';

async function forget(e){
  try{
      e.preventDefault();
      const email = document.getElementById('email').value;
    
    if(!email.trim()){ return alert('Please enter your correct email')}
    const result = await axios.post(`${publicIp}/password/forgotpassword`, {email})
    document.getElementById('email').value="";
    document.body.innerHTML += `<div style="color:green;">${result.data.message}
    <div>`
    }
    catch(err){
      console.log(err)
      document.body.innerHTML += '<div style="color:red;">${err} <div>'
    }
  }


