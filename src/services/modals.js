import { initFlowbite, Modal } from 'flowbite'

const definiciones = {
    buscador: {
        modal: '#modalBuscador',
        closeButton: '#cerrarModalBuscador',
        focus: '#focusBusqueda',

        modalOptions: {
            placement: 'center',
            backdrop: 'dynamic',
            backdropClasses:
                'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
            closable: true,
            // onHide: () => {
            //     console.log('modal is hidden');
            // },
            // onShow: () => {
            //     console.log('modal is shown');
            // },
            // onToggle: () => {
            //     console.log('modal has been toggled');
            // },
        }
    },

    usuario: {
        modal: '#modalUsuario',
        closeButton: '#cerrarModalUsuario',
        focus: undefined,

        modalOptions: {
            placement: 'center',
            backdrop: 'dynamic',
            backdropClasses:
                'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
            closable: true,
            // onHide: () => {
            //     console.log('modal is hidden');
            // },
            // onShow: () => {
            //     console.log('modal is shown');
            // },
            // onToggle: () => {
            //     console.log('modal has been toggled');
            // },
        }
    }
}

class MiModal extends Modal {
    constructor(tipo) {

        if (!definiciones[tipo]) {
            console.error('Tipo de modal no encontrado');
            return;
        }

        const element = document.querySelector(definiciones[tipo].modal);
        const options = definiciones[tipo].modalOptions;
        const instanceOptions = { override: true };

        super(element, options, instanceOptions);
        this.definiciones = definiciones[tipo];

        const btnCerrar = document.querySelector(definiciones[tipo].closeButton)
        if (btnCerrar) {
            btnCerrar.addEventListener('click', () => this.hide())
        }
    }

    show() {
        super.show();
        if (this.definiciones.focus) {
            const hacerFoco = document.querySelector(this.definiciones.focus)
            hacerFoco.focus()
        }
    }
}

const checkNombreModal = (tipo) => {
    if (!definiciones[tipo]) {
        throw new Error('Tipo de modal no encontrado');
    }
}

export const modalVisible = (tipo) => {
    checkNombreModal(tipo)

    const modal = document.querySelector(definiciones[tipo].modal)
    const estadoBuscador = modal.getAttribute('aria-hidden')

    return estadoBuscador !== 'true'
}

export const getModal = (tipo) => new MiModal(tipo);

export const getModalBuscador = () => new MiModal('buscador');
export const getModalUsuario = () => new MiModal('usuario');

export const abrirModal = (tipo) => {
    if (modalVisible(tipo)) return
    getModal(tipo).show()
}

export const abrirModalUsuario = () => {
    if (modalVisible('usuario')) return
    getModalUsuario().show()
}

export const abrirModalBuscador = () => {
    if (modalVisible('buscador')) return
    getModalBuscador().show()
}
