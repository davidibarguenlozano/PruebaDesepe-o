import style from "./register.css"

export async function RegisterPageCoponets() {
    const root = document.getElementById("root");

    root.innerHTML = `
    <div class ="${style.containerform}"> 
        <form id="RegisterForm" class="${style.form}">
            <h2>Login</h2>
            <label for="name" class="${style.label}">Name:</label>
            <input type="text" id="name" name="name" autocomplete="name" class="${style['input-email']}">
            <label for="email" class="${style.label}">Email:</label>
            <input type="email" id="email" name="email" autocomplete="email" class="${style['input-email']}">
            <label for="password" class="${style.label}">Password:</label>
            <input type="password" id="password" name="password" autocomplete="current-password" class="${style['input-password']}">
            <label for="password" class="${style.label}">Repeat Password:</label>
            <input type="password" id="passwordrepeat" name="password" autocomplete="current-password" class="${style['input-password']}">

            <button type="submit" class="${style['button-send']}">Login</button>
        </form>
    
    </div>`
    const form = document.getElementById('RegisterForm');
    form.addEventListener('submit', async (event) => {
      event.preventDefault(); // previene el comportamiento por default que es, recargar la pagina
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      register(name,email,password);
    });
    


   
   
}

export async function verificationUser(email) {

    try {
        const response = await fetch('http://localhost:3000/user');
        if (!response.ok) {
            throw new Error("Could not fetch users");
        }
        const data = await response.json();
        const listaemails = data.map(user => user.email);
        
        return listaemails.includes(email);
    } catch (error) {
        console.error(error);
        return error; 
    }

}




async function register(name, email, password) {
    const validator = await verificationUser(email)
    if(validator === false){
        try {
            const response = await fetch('http://localhost:3000/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name, email, password }),
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Error ${response.status}: ${errorMessage}`);
            }
    
            const data = await response.json();
            return data.token;
        } catch (error) {
            console.error('Login failed:', error);
            return null;
        }
    }
    else{
        console.log("Usuario ya registrado")
    }
  
}
