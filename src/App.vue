<script setup>
import { onMounted, ref } from 'vue'
import { supabase } from './supabase'

const session = ref()

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
})

async function signOut() {
    try {
        loading.value = true
        let { error } = await supabase.auth.signOut()
        if (error) throw error
    } catch (error) {
        alert(error.message)
    } finally {
        loading.value = false
    }
}
</script>

<template>
  <div class="container" style="padding: 50px 0 100px 0">
    <div class="headers">
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/users">User List</router-link></li>
        <li v-if="session"><router-link to="/profile">Profile</router-link></li>
        <li v-if="session"><a @click="signOut" href="#">Signout</a></li>
        <li v-else><router-link to="/register">Register/Login</router-link></li>
      </ul>
    </div>
    <router-view v-slot="{ Component }" :key="$route.path">
      <component :is="Component" :session="session" />
    </router-view>
  </div>
</template>
