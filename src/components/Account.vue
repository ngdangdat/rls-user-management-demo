<script setup>
import { supabase } from '../supabase'
import { onMounted, ref, toRefs, watch } from 'vue'
import Avatar from './Avatar.vue';
import { useRoute } from 'vue-router';
import * as utils from '../utils.js';

const route = useRoute()

const loading = ref(true)
const username = ref('')
const website = ref('')
const avatar_url = ref('')
const session = ref()
const readOnlyFields = ref({
  email: null,
  role: null,
})
const userId = route.params.userId

onMounted(() => {
    supabase.auth.getSession().then(({ data }) => {
        session.value = data.session
    }).then(() => getProfile())

    supabase.auth.onAuthStateChange((_, _session) => {
        session.value = _session
    })
})


async function getProfile() {
    try {
        loading.value = true

        let { data, error, status } = await supabase
            .from('profiles')
            .select(`id, username, email, website, avatar_url, role`)
            .eq('id', userId)
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
        const updates = {
            id: userId,
            username: username.value,
            email: readOnlyFields.value.email,
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
    <form v-if="session" class="form-widget" @submit.prevent="updateProfile">
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
