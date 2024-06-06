import { navigateTo } from '../../../../../Router.js';
import {getItemWithExpiry,setItemWithExpiry} from '../../../../../Router.js'
import style from './login-form.css';

export async function LoginFormComponent() {
  const root = document.getElementById('root');

  root.innerHTML = `
      <form id="loginForm" class="${style.form}">
        <h2>Login</h2>
        <label for="email" class="${style.label}">Email:</label>
        <input type="text" id="email" name="email" autocomplete="email" class="${style['input-email']}">
        <label for="password" class="${style.label}">Password:</label>
        <input type="password" id="password" name="password" autocomplete="current-password" class="${style['input-password']}">
        <button type="submit" class="${style['button-send']}">Login</button>
      </form>
    `;
  
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', async (event) => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const Token = getItemWithExpiry("Token")

    login(email,password);
    
    
  });
  
}

async function login(email, password) {
  const user = await getuserbyemail(email)
  try {
    
    if(user.password === password) {
      console.log("Password is correct")
      navigateTo("/home")
      setItemWithExpiry('Token', user.id, 300000);
      setItemWithExpiry('Rol', user.rol, 300000);

    }else {
      console.log("Password is not correct")
    }
  }catch (error){
    console.log("No existe el usuario");
  }
  
}


export async function getuserbyemail(email) {

  try {
      const response = await fetch('http://localhost:3000/user');
      if (!response.ok) {
          throw new Error("Could not fetch users");
      }
      const data = await response.json();
      const listaemails = data.map(user => user.email);
     let vare
     data.forEach(element => {
          if(element.email === email){
              
              vare = element
          }
      });
      return vare;
  } catch (error) {
      console.error(error);
      return error; 
  }

}
