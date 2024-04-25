<script setup>
import { onMounted, ref } from 'vue'
import { supabase } from './supabase'

const session = ref()

onMounted(() => {
  console.log("hehe")
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
})
</script>

<template>
  <div class="container" style="padding: 50px 0 100px 0">
    <div class="headers">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/users">User List</a></li>
      </ul>
    </div>
    <router-view :key="$route.path"></router-view>
  </div>
</template>
