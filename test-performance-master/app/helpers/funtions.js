export function formValidator(fields,numcap) {
    const campos = fields.every((field) => field.trim()); // Devuelve true si todos los campos tienen contenido

    if(campos ==numcap){
        return true;
    }else{
        return false;
    }

    
}