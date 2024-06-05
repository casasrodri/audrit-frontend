import { ref, onMounted } from 'vue'
import api from '@/services/api.js';

export function usePermisos() {
    const permisos = ref({
        auditoriasLeer: false,
        auditoriasEditar: false,
        observacionesLeer: false,
        observacionesEditar: false,
        requerimientosLeer: false,
        requerimientosEditar: false,
    })

    async function obtenerPermisos() {
        const { data } = await api.get('/sesiones/me/menu')
        data.split('|').forEach(menu => {
            const array = menu.split(':')
            const menuAccion = array[0].toLowerCase()
            const permisosOtorgados = array[1]

            let accion
            for (const letra of permisosOtorgados) {
                if (letra === 'W') accion = 'Editar'
                if (letra === 'R') accion = 'Leer'
                const permiso = `${menuAccion}${accion}`
                permisos.value[permiso] = true
            }
        });
    }

    onMounted(obtenerPermisos)

    return permisos
}
