import { LoginPage } from '../scenes/public/login';
import {Notfoundpage} from "../scenes/public/notfound";
import  {RegisterPage} from "../scenes/public/register";
import {DasboardPage} from '../scenes/private/dashboard'
export const routes = {
    private: [
        { path: '/home', component: DasboardPage },

    ],
    public: [
        { path: '/login', component: LoginPage },
        { path: '/404', component: Notfoundpage},
        { path: '/register', component: RegisterPage}
    ]
};