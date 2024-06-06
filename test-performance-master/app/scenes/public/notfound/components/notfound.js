import style from "./notfound.css"


export async function ComponentNotfundpage(){
    const root = document.getElementById("root");

    root.innerHTML = `<h2 class ="${style.title}">PAGE NOT FOUND</h2>`
}