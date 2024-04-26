import { createApp } from 'vue'
import './style.css'

import App from './App.vue'
import Home from './components/Home.vue'
import AccountList from './components/AccountList.vue'
import Profile from './components/Profile.vue'
import Account from './components/Account.vue'
import Auth from './components/Auth.vue'

import { createWebHistory, createRouter } from 'vue-router'


const routes = [
  { name: 'home', path: '/', component: Home },
  { name: 'users', path: '/users', component: AccountList },
  { name: 'user', path: '/users/:userId', component: Account },
  { name: 'profile', path: '/profile', component: Profile },
  { name: 'register', path: '/register', component: Auth },
]

const router = createRouter({ history: createWebHistory(), routes })

createApp(App).use(router).mount('#app')
