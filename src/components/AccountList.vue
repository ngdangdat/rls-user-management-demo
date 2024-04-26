<script setup>
import { supabase } from '../supabase'
import { ref, toRefs, watch, onMounted } from 'vue'
import Avatar from './Avatar.vue';

const loading = ref(true)
const users = ref([])

onMounted(() => {
  getProfiles()
})

async function getProfiles(limit = 10) {
    try {
        loading.value = true
        let { data, error, status } = await supabase
            .from('profiles')
            .select(`id, email, username, website, avatar_url, role`)
            .limit(limit)

        if (error && status !== 406) throw error
        users.value.splice(0, users.value.length)
        if (!!data?.length) {
          data?.forEach(d => users.value.push(d))
        }

    } catch (error) {
        alert(error.message)
    } finally {
        loading.value = false
    }
}
</script>

<template>
  <div class="users">
      <li v-for="user in users">
        <span>User: </span><router-link :to="`/users/${user.id}`">{{ user.id }} | {{ user.email }}</router-link>
      </li>
  </div>
</template>

