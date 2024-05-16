<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api.js'
import { setToken, verificarSesion } from '@/utils/sesion.js'
import { useRouter, useRoute } from 'vue-router'
import LogoApp from '@/components/layout/LogoApp.vue'
// import Swal from 'sweetalert2'

const router = useRouter()
const route = useRoute()

// useHead({ title: 'Iniciar sesión' })

import { useToast } from 'primevue/usetoast';
const toast = useToast();


onMounted(() => {
    verificarSesion(router, route)
})


const user = ref({
    email: 'rodri@casas.com',
    password: 'rodri'
})


async function login() {
    try {
        const response = await api.post('/jwt', user.value)

        if (response.data.status === 'ok') {
            // TODO: Acá habría que pedir los menus del usuario
            setToken(response.data.jwt)
            router.push('/')

        } else {
            toast.add({
                severity: 'error',
                summary: 'Error de acceso',
                detail: response.data.message,
                life: 3000
            });
        }
    } catch (error) {
        console.error(error.response)
        console.error(error)

        toast.add({
            severity: 'error',
            summary: 'Error de acceso',
            detail: error.response.data.detail,
            life: 3000
        });
    }
}

</script>

<template>
    <div id="fondo" class="w-screen h-screen">
        <div class="w-full h-full flex items-center justify-center backdrop-blur-[1px]">
            <form
                class="bg-white/85 min-w-96 max-w-96 min-h-96 rounded-xl border-[1px] border-cyan-500 py-5 px-10 hover:shadow-lg hover:shadow-cyan-300/70">
                <div class="flex flex-col mx-auto items-center mb-5 mt-5">
                    <LogoApp class="h-24 mb-2" />
                    <span id="nombre" class="items-center font-extralight text-4xl text-cyan-700"
                        style="font-family: 'Rubik';">
                        Audrit
                    </span>
                </div>


                <div class="flex flex-col">
                    <label for="email" class="font-semibold text-black">Email:</label>
                    <input id="email" v-model="user.email" type="email"
                        class="border-cyan-300 rounded-md text-cyan-800">
                </div>

                <div class="flex flex-col mt-4">
                    <label for="password" class="font-semibold text-black">Contraseña:</label>
                    <input id="password" v-model="user.password" type="password"
                        class="border-cyan-300 rounded-md text-cyan-800">
                </div>

                <div class="flex justify-center mx-auto my-5">
                    <button type="submit" class="rounded-xl bg-[#0768a0] text-white p-2 px-7" @click.prevent="login">
                        Ingresar
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
#fondo {
    background-color: #F6FFFC;
    /* filter: blur(0.5px); */
    /* -webkit-filter: blur(2px); */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='303' height='303' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%233FF4D7' stroke-width='1.9'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%230768A0'%3E%3Ccircle cx='769' cy='229' r='6'/%3E%3Ccircle cx='539' cy='269' r='6'/%3E%3Ccircle cx='603' cy='493' r='6'/%3E%3Ccircle cx='731' cy='737' r='6'/%3E%3Ccircle cx='520' cy='660' r='6'/%3E%3Ccircle cx='309' cy='538' r='6'/%3E%3Ccircle cx='295' cy='764' r='6'/%3E%3Ccircle cx='40' cy='599' r='6'/%3E%3Ccircle cx='102' cy='382' r='6'/%3E%3Ccircle cx='127' cy='80' r='6'/%3E%3Ccircle cx='370' cy='105' r='6'/%3E%3Ccircle cx='578' cy='42' r='6'/%3E%3Ccircle cx='237' cy='261' r='6'/%3E%3Ccircle cx='390' cy='382' r='6'/%3E%3C/g%3E%3C/svg%3E");
}
</style>
