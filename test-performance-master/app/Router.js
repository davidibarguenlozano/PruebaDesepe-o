import { routes } from './helpers/routes';



export function  CheckTokenPrivateRoute (token,params,route){
  const value = getItemWithExpiry(token);
  if (value === null) {
      console.log('El ítem ha expirado o no existe.');
      navigateTo('/login')
  } else {
      console.log('El ítem es:', value);
      route.component(params);
  }
}

export function  CheckTokenPublicRoute (token,params,route){
  const value = getItemWithExpiry(token);
  if (value === null) {
      console.log('Se mantiene en ruta publica a falta de token');
      route.component(params);
      
  } else {
      console.log('El ítem es:', value);
      navigateTo('/home')
  }

}

export function setItemWithExpiry(key, value, ttl) {
  const now = new Date();

  // Crear un objeto que contenga el valor y el tiempo de expiración
  const item = {
      value: value,
      expiry: now.getTime() + ttl,
  };

  // Guardar el objeto en el localStorage como una cadena JSON
  localStorage.setItem(key, JSON.stringify(item));
}



export function getItemWithExpiry(key) {
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


// Navegar a una nueva ruta
export function navigateTo(path) {
  window.history.pushState({}, '', window.location.origin + path);
  Router();
}


// Definir y manejar el router
export async function Router() {
  const path = window.location.pathname; // /login
  const params = new URLSearchParams(window.location.search);

  // Comprobar rutas públicas y privadas
  const publicRoute = routes.public.find((r) => r.path === path);
  const privateRoute = routes.private.find((r) => r.path === path);

  if (publicRoute) {
    CheckTokenPublicRoute("Token" , params ,publicRoute);
  } else if (privateRoute) {
    CheckTokenPrivateRoute("Token",params,privateRoute);
  } else {
    console.warn('Ruta no encontrada:', path);
    navigateTo('/404');
  }
}

// Manejar el evento de retroceso/avance en el navegador
window.onpopstate = Router;
