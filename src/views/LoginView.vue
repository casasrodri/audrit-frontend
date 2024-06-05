<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api.js'
import { setToken, verificarSesion } from '@/utils/sesion.js'
import { useRouter, useRoute } from 'vue-router'
import LogoApp from '@/components/layout/LogoApp.vue'
import { useToast } from 'primevue/usetoast';

const router = useRouter()
const route = useRoute()
const toast = useToast();

onMounted(() => {
    verificarSesion(router, route)
})

// TODO: Para DEBUG luego, eliminar
const user = ref({
    email: 'rodri@casas.com',
    password: 'rodri'
})

async function login() {
    try {
        const { data } = await api.post('/sesiones/jwt', user.value)

        if (data.status === 'ok') {
            // TODO: Acá habría que pedir los menus del usuario
            setToken(data.jwt)
            if (route.query.redirect) {
                router.push(route.query.redirect)
            } else {
                router.push('/')
            }

            toast.add({
                severity: 'success',
                summary: 'Bienvenido!',
                detail: `Bienvenido de nuevo ${data.usuario.nombre}!`,
                life: 3000
            });

        } else {
            toast.add({
                severity: 'error',
                summary: 'Error de acceso',
                detail: data.message,
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

import { useDark } from '@vueuse/core'

const isDark = useDark()

</script>

<template>
    <div id="fondo" :class="{ 'fondoDark': isDark, 'fondoClaro': !isDark }"
        class="w-screen h-screen text-black dark:text-white">
        <div class="w-full h-full flex items-center justify-center backdrop-blur-[1px]">
            <form
                class="bg-white/85 dark:bg-cyan-900 min-w-96 max-w-96 min-h-96 rounded-xl border-[1px] border-cyan-500 dark:border-cyan-700 py-5 px-10 hover:shadow-lg hover:shadow-cyan-300/70 dark:hover:shadow-cyan-700/70">
                <div class="flex flex-col mx-auto items-center mb-5 mt-5">
                    <LogoApp class="h-24 mb-2 dark:brightness-150 origin-bottom hover:-rotate-3" />
                    <span id="nombre" class="items-center font-extralight text-4xl text-cyan-700 dark:text-cyan-300"
                        style="font-family: 'Rubik';">
                        Audrit
                    </span>
                </div>


                <div class="flex flex-col">
                    <label for="email" class="font-semibold ">Email:</label>
                    <input id="email" v-model="user.email" type="email"
                        class="border-cyan-300 rounded-md text-cyan-800 dark:border-cyan-500 dark:text-cyan-200 dark:bg-cyan-800 p-0.5"
                        @keyup.enter="login">
                </div>

                <div class="flex flex-col mt-4">
                    <label for="password" class="font-semibold">Contraseña:</label>
                    <input id="password" v-model="user.password" type="password"
                        class="border-cyan-300 rounded-md text-cyan-800 dark:border-cyan-500 dark:text-cyan-200 dark:bg-cyan-800 p-0.5"
                        @keyup.enter="login">
                </div>

                <div class="flex justify-center mx-auto my-5">
                    <button type="submit" class="rounded-xl bg-[#0768a0] dark:bg-[#32759c] text-white p-2 px-7"
                        @click.prevent="login">
                        Ingresar
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
/* #fondo {
    background-color: #F6FFFC;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='303' height='303' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%233FF4D7' stroke-width='1.9'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%230768A0'%3E%3Ccircle cx='769' cy='229' r='6'/%3E%3Ccircle cx='539' cy='269' r='6'/%3E%3Ccircle cx='603' cy='493' r='6'/%3E%3Ccircle cx='731' cy='737' r='6'/%3E%3Ccircle cx='520' cy='660' r='6'/%3E%3Ccircle cx='309' cy='538' r='6'/%3E%3Ccircle cx='295' cy='764' r='6'/%3E%3Ccircle cx='40' cy='599' r='6'/%3E%3Ccircle cx='102' cy='382' r='6'/%3E%3Ccircle cx='127' cy='80' r='6'/%3E%3Ccircle cx='370' cy='105' r='6'/%3E%3Ccircle cx='578' cy='42' r='6'/%3E%3Ccircle cx='237' cy='261' r='6'/%3E%3Ccircle cx='390' cy='382' r='6'/%3E%3C/g%3E%3C/svg%3E");
} */

.fondoClaro {
    background-color: #F6FFFC;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='303' height='303' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%233FF4D7' stroke-width='1.9'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%230768A0'%3E%3Ccircle cx='769' cy='229' r='6'/%3E%3Ccircle cx='539' cy='269' r='6'/%3E%3Ccircle cx='603' cy='493' r='6'/%3E%3Ccircle cx='731' cy='737' r='6'/%3E%3Ccircle cx='520' cy='660' r='6'/%3E%3Ccircle cx='309' cy='538' r='6'/%3E%3Ccircle cx='295' cy='764' r='6'/%3E%3Ccircle cx='40' cy='599' r='6'/%3E%3Ccircle cx='102' cy='382' r='6'/%3E%3Ccircle cx='127' cy='80' r='6'/%3E%3Ccircle cx='370' cy='105' r='6'/%3E%3Ccircle cx='578' cy='42' r='6'/%3E%3Ccircle cx='237' cy='261' r='6'/%3E%3Ccircle cx='390' cy='382' r='6'/%3E%3C/g%3E%3C/svg%3E");
}

.fondoDark {
    background-color: #013542;
    /* background-color: #022a30; */
    opacity: 1;
    background-image: linear-gradient(135deg, #00373a 25%, transparent 25%), linear-gradient(225deg, #00373a 25%, transparent 25%), linear-gradient(45deg, #00373a 25%, transparent 25%), linear-gradient(315deg, #00373a 25%, #022a30 25%);
    background-position: 10px 0, 10px 0, 0 0, 0 0;
    background-size: 10px 10px;
    background-repeat: repeat;
}
</style>
