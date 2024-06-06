import style from './dashboard.css'

export async function ComponentDasboarPage() {

    const root = document.getElementById('root')

    root.innerHTML =
        `
        <h2>Dasboard</h2>
        <span id="rol"></span>
        
        
        <ul id="travellist" class ="${style.containerlist}"> </ul>

        <div id="containeradd" class ="${style.containerForm}">
        <button class="${style.buttonclosed} id ="btnclosed">Closed</button>
        <form id="TravelForm" class="${style.form}">
            
            <h2>Agregar Viaje</h2>
            <label for="origin" class="${style.label}">Origen:</label>
            <input type="text" id="origin" name="origin"  class="${style.input}">
            <label for="destiniti" class="${style.label}">Destino:</label>
            <input type="text" id="destiniti" name="destiniti"  class="${style.input}">
            <label for="seatings" class="${style.label}">Asientos:</label>
            <input type="number" id="seatings" name="seatings"   class="${style.input}">

            <input type="date" id="date" name="seatings"   class="${style.input}">

            <button type="submit" class="${style.buttonsend}">Login</button>
        </form>
        </div>
        <div id="containeredit" class ="${style.containerForm}">
        <button class="${style.buttonclosed} id ="btnclosed">Closed</button>
        <form id="TravelEForm" class="${style.form}">
            
            <h2>Agregar Viaje</h2>
            <label for="origin" class="${style.label}">Origen:</label>
            <input type="text" id="origine" name="origin"  class="${style.input}">
            <label for="destiniti" class="${style.label}">Destino:</label>
            <input type="text" id="destinitie" name="destiniti"  class="${style.input}">
            <label for="seatings" class="${style.label}">Asientos:</label>
            <input type="number" id="seatingse" name="seatings"   class="${style.input}">

            <input type="date" id="datee" name="seatings"   class="${style.input}">

            <button type="submit" class="${style.buttonsend}">Login</button>
        </form>
        </div>         
    `
    const TravelFrom = document.getElementById("TravelForm");

    TravelFrom.addEventListener("submit", (e) => {
        const origin = document.getElementById('origin').value;
        const destiniti = document.getElementById('destiniti').value;
        const seatings = document.getElementById('seatings').value;
        const date = document.getElementById('date').value;

        register(origin, destiniti, seatings, date)
    })

    const span = document.getElementById('rol');
    const value = getItemWithExpiry('Rol');
    if (value === null) {
        console.log('El ítem ha expirado o no existe.');
    } else {
        console.log('El ítem es:', value);

        if (value === "2") {
            span.textContent = "USER COMÚN Y CORRIENTE";
        } else {
            span.textContent = "Manito Usted tiene poderes"

            const buttonaddtravel = document.createElement("button");
            buttonaddtravel.classList = style.btnaddtravel

            root.appendChild(buttonaddtravel);


            buttonaddtravel.addEventListener("click", () => {
                containeradd.style.display = "flex";

            })

        }

    }
    fetchAndRenderTravels();

}


function fetchAndRenderTravels() {
    fetch('http://localhost:3000/travels')
        .then(response => response.json())
        .then(data => {
            const postList = document.getElementById('travellist');

            // Asegúrate de que la lista esté vacía antes de agregar nuevos elementos
            postList.innerHTML = '';

            // Itera sobre los datos y crea elementos de lista
            data.forEach(travel => {
                const listItem = document.createElement('li');
                listItem.className = "litravel";
                listItem.textContent = `${travel.origin} to ${travel.destination} 
                asientos : ${travel.seatings}  fecha : ${travel.date}`;
                postList.appendChild(listItem);
                const value = getItemWithExpiry('Rol');
                if(value ==="1"){
                const btnDelete = document.createElement('button');
                btnDelete.textContent = 'Eliminar';
                btnDelete.classList = style.buttonsend
                listItem.appendChild(btnDelete)

                btnDelete.onclick = () => {
                    fetch(`http://localhost:3000/travels/${travel.id}`, {
                        method: 'DELETE'
                    })
                        .then(() => {console.log('Post eliminado')
                        location.reload();
                        })
                        .catch(error => console.error('Error:', error));

                }

                const btnEdit = document.createElement('button');
                btnEdit.textContent = 'Editar';
                btnEdit.classList = style.buttonsend
                listItem.appendChild(btnEdit)
                
                
                btnEdit.onclick = () => {
                   
                    containeredit.style.display = "flex";

                    const TravelEForm = document.getElementById("TravelEForm")
                    TravelEForm.addEventListener("submit" ,(e) =>{
                        
                        const origin = document.getElementById('origine').value;
                        const destiniti = document.getElementById('destinitie').value;
                        const seatings = document.getElementById('seatingse').value;
                        const date = document.getElementById('datee').value;

                        edit(origin,destiniti,seatings,date,travel.id);
                    })
                }

                
            }else {
                const btnaddTravel = document.createElement('button');
                btnaddTravel.textContent = 'Agregar a asiento'
                btnaddTravel.className = style.buttonsend;
                listItem.appendChild(btnaddTravel)
                
                
                
                btnaddTravel.onclick = () => {
                   
                    

                    const TravelEForm = document.getElementById("TravelEForm")
                    const seatings =  travel.seatings - 1
                       

                    addTravel(seatings,travel.id);
                }
                
            }
            });
        })
        .catch(error => console.error('Error:', error));
}


function getItemWithExpiry(key) {
    // Obtener el ítem del localStorage
    const itemStr = localStorage.getItem(key);

    // Si el ítem no existe, devolver null
    if (!itemStr) {
        return null;
    }

    // Parsear el ítem de JSON a un objeto
    const item = JSON.parse(itemStr);
    const now = new Date();

    // Verificar si el ítem ha expirado
    if (now.getTime() > item.expiry) {
        // Si ha expirado, remover el ítem del localStorage y devolver null
        localStorage.removeItem(key);
        return null;
    }

    // Si no ha expirado, devolver el valor
    return item.value;
}



async function register(origin, destination, seatings, date ) {

    try {
        const response = await fetch(`http://localhost:3000/travels`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ origin, destination, seatings, date }),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error ${response.status}: ${errorMessage}`);
        }

        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}


async function edit(origin, destination, seatings, date ,id) {

    try {
        const response = await fetch(`http://localhost:3000/travels/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ origin, destination, seatings, date }),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error ${response.status}: ${errorMessage}`);
        }

        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}



async function addTravel(seatings,id){
    try {
        const response = await fetch(`http://localhost:3000/travels/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ seatings }),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error ${response.status}: ${errorMessage}`);
        }

        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}