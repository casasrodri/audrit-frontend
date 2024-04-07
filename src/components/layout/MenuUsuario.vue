<script setup>
import { ref, onMounted } from 'vue'
import { useMenuStore } from '@/stores/menuLateral.js'
import { removeToken } from '@/utils/sesion.js'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const menuStore = useMenuStore()
const toast = useToast()

const toggleMenuUser = () => {
    const menuUsuarioFlotante = document.getElementById('menuUsuarioFlotante')
    menuUsuarioFlotante.classList.toggle('hidden')
}

const user = ref({
    nombre: '',
    siglas: '',
    cargo: '',
})


// TODO Cambiar por los datos del usuario logueado
onMounted(() => {
    user.value.nombre = 'Rodrigo Casas'
    user.value.siglas = 'RC'
    user.value.cargo = 'Auditor Analista'
})

function cerrarSesion() {
    menuStore.cerrar()
    removeToken()
    router.push('/login')

    toast.add({
        severity: 'success',
        summary: 'Sesión finalizada',
        detail: 'Hasta luego!',
        life: 3000
    });
}

</script>

<template>
    <div id="user-section" @click="toggleMenuUser">
        <div
            class="group/itemnav flex flex-row rounded-md border-[1px] max-w-48 my-1 border-transparent   hover:font-medium p-1 text-gray-600 dark:text-gray-400">
            <span class="dark:text-white text-black">
                <div id="menuUser" class="grid w-7 h-7 bg-primary-400 rounded-full p-1 text-center text-sm">
                    {{ user.siglas }}
                </div>
            </span>
            <span v-if="menuStore.abierto" class="justify-center content-center ml-2">
                {{ user.nombre }}
            </span>
        </div>
    </div>

    <div id="menuUsuarioFlotante" class="hidden">
        <div class="fixed top-0 left-0 w-screen h-screen backdrop-blur-[1px]" @click="toggleMenuUser">
        </div>
        <div
            class="absolute border-[1px] border-gray-300 bg-white/90 dark:bg-gray-900/90 dark:border-gray-700 bottom-8 left-48 min-w-40 w-max px-3 py-2 rounded-md">
            <div class="border-b-[1px] pb-2 mb-1 border-gray-300 dark:border-gray-700">
                <div class="font-semibold">
                    {{ user.nombre }}
                </div>
                <div class="text-sm text-gray-400">
                    {{ user.cargo }}
                </div>

            </div>
            <div class="text-red-500 cursor-pointer" @click="cerrarSesion">
                <i class="pi pi-sign-out" style="font-size: 0.8rem"></i>
                Cerrar sesión
            </div>
        </div>
    </div>
</template>
