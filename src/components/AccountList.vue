<script setup>
import { supabase } from '../supabase'
import { onMounted, ref, toRefs, watch } from 'vue'
import Avatar from './Avatar.vue';

const loading = ref(true)
const username = ref('')
const website = ref('')
const avatar_url = ref('')
const users = ref([])
const session = ref()

onMounted(() => {
    console.log("Hehehehe")
    supabase.auth.getSession().then(({ data }) => {
      session.value = data.session
    })
    supabase.auth.onAuthStateChange((_, _session) => {
      session.value = _session
    })
})

watch(session, async(sValue) => {
  if (!!sValue) getProfiles()
  
})

async function getProfile() {
    if (!session.value) return
    try {
        loading.value = true
        const { user } = session.value

        let { data, error, status } = await supabase
            .from('profiles')
            .select(`username, website, avatar_url`)
            .eq('id', user.id)
            .single()

        if (error && status !== 406) throw error

        if (data) {
            username.value = data.username
            website.value = data.website
            avatar_url.value = data.avatar_url
        }
    } catch (error) {
        alert(error.message)
    } finally {
        loading.value = false
    }
}

async function getProfiles(limit = 10) {
    if (!session.value) return
    try {
        loading.value = true
        const { user } = session.value

        let { data, error, status } = await supabase
            .from('profiles')
            .select(`id, username, website, avatar_url`)
            // .neq('id', user.id)
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
      <div v-for="user in users">
          <div>{{ user.username }}</div>
      </div>
  </div>
</template>

