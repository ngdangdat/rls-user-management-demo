<script setup>
import { supabase } from '../supabase'
import { onMounted, ref, toRefs } from 'vue'
import * as utils from '../utils.js'
import Avatar from './Avatar.vue';

const props = defineProps(['session'])
const { session } = toRefs(props)

const loading = ref(true)
const username = ref('')
const website = ref('')
const avatar_url = ref('')
const readOnlyFields = ref({
  email: null,
  role: null
})

onMounted(() => {
    getProfile()
})

async function getProfile() {
    try {
        loading.value = true
        const { user } = session.value

        let { data, error, status } = await supabase
            .from('profiles')
            .select(`id, email, username, website, avatar_url, role`)
            .eq('id', user.id)
            .single()

        if (error && status !== 406) throw error

        if (data) {
            username.value = data.username
            website.value = data.website
            avatar_url.value = data.avatar_url
            readOnlyFields.value.email = data.email
            readOnlyFields.value.role = data.role
        }
    } catch (error) {
        alert(error.message)
    } finally {
        loading.value = false
    }
}

async function updateProfile() {
    try {
        loading.value = true
        const { user } = session.value

        const updates = {
            id: user.id,
            email: readOnlyFields.value.email,
            username: username.value,
            website: website.value,
            avatar_url: avatar_url.value,
            updated_at: new Date(),
        }

        let { error } = await supabase.from('profiles').upsert(updates)

        if (error) throw error
    } catch (error) {
        alert(error.message)
    } finally {
        loading.value = false
    }
}

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
    <form class="form-widget" @submit.prevent="updateProfile">
        <Avatar v-model:path="avatar_url" @upload="updateProfile" size="10" />
        <div>
            <label for="email">Email</label>
            <input id="email" type="text" :value="readOnlyFields.email" disabled />
        </div>
        <div>
            <label for="username">Name</label>
            <input id="username" type="text" v-model="username" />
        </div>
        <div>
            <label for="website">Website</label>
            <input id="website" type="url" v-model="website" />
        </div>
        <div>
            <label for="role">Role</label>
            <input id="role" type="text" :value="utils.getRoleLabel(readOnlyFields.role)" disabled />
        </div>
        <div>
            <input type="submit" class="button primary block" :value="loading ? 'Loading ...' : 'Update'"
                :disabled="loading" />
        </div>

        <div>
            <button class="button block" @click="signOut" :disabled="loading">
                Sign Out
            </button>
        </div>
    </form>
</template>
