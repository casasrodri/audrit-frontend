export default class ControlRelevante {
    static get toolbox() {
        return {
            title: 'Control relevante',
            icon: '<svg width="15" height="15" viewBox="0 0 512 512" style="color:#24a0d6" xmlns="http://www.w3.org/2000/svg" class="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" stroke-width="0" stroke-opacity="100%" paint-order="stroke"></rect><svg width="219px" height="219px" viewBox="0 0 24 24" fill="#24a0d6" x="146.5" y="146.5" role="img" style="display:inline-block;vertical-align:middle" xmlns="http://www.w3.org/2000/svg"><g fill="#24a0d6"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 15l6 6m-11-4a7 7 0 1 1 0-14a7 7 0 0 1 0 14Z"/></g></svg></svg>'
        };
    }

    static get isReadOnlySupported() {
        return true;
    }

    constructor({ data, api, config, readOnly }) {
        this.data = {
            id: data.id || '',
        };
        this.api = api;
        this.config = config;
        this.readOnly = readOnly;
    }

    async _buscarControl(texto) {
        const res = await fetch(`http://localhost:8000/listaControles/${texto}`)
        const controles = await res.json();
        return controles
    }
    async _infoControl(id) {
        const res = await fetch(`http://localhost:8000/control/${id}`)
        const control = await res.json();
        return control
    }
    async setInfoControl(idControl, nombreControl, descripcionControl) {
        const control = await this._infoControl(idControl.value);
        nombreControl.value = control.nombre;
        nombreControl.innerHTML = control.nombre;
        descripcionControl.innerHTML = control.descripcion;
    }

    render() {
        const wrapper = document.createElement('div');
        const idControl = document.createElement('input');
        const titulo = document.createElement('h3');
        const buscadorNombreControl = document.createElement('input');
        const descripcionControl = document.createElement('div');
        const opciones = document.createElement('div');
        const botonera = document.createElement('div');
        const btnNuevo = document.createElement('a');

        wrapper.className = 'p-4 bg-emerald-100 rounded-md border border-emerald-300 my-2';

        // Campo oculto para el id
        idControl.type = 'hidden';
        idControl.id = 'idControl';
        idControl.value = this.data && this.data.id ? this.data.id : '';
        wrapper.appendChild(idControl);

        // Título del bloque
        titulo.innerHTML = 'Control relevante:';
        titulo.className = 'font-semibold underline';
        wrapper.appendChild(titulo);

        // Buscador/Nombre del control
        buscadorNombreControl.id = 'nombreControl'
        buscadorNombreControl.className = 'w-full p-1 border border-gray-300 rounded-md mt-2 text-sm';
        buscadorNombreControl.placeholder = 'Buscar control...';
        buscadorNombreControl.value = '';
        wrapper.appendChild(buscadorNombreControl);

        // Descripción resumida del control
        descripcionControl.id = 'descripcionControl';
        descripcionControl.className = 'text-sm mt-2 px-2';
        descripcionControl.innerHTML = '';
        wrapper.appendChild(descripcionControl);

        // Lugar donde se muestran los resultados de búsqueda
        wrapper.appendChild(opciones)

        // Botonera
        botonera.className = 'flex justify-end mt-2 gap-2';
        wrapper.appendChild(botonera);

        btnNuevo.className = 'bg-green-500 hover:bg-green-700 text-white px-4 py-1 rounded-md font-semibold text-sm';
        btnNuevo.setAttribute('style', 'text-decoration:none !important');
        btnNuevo.target = '_blank';

        if (this.readOnly) {
            btnNuevo.href = `/controles/${this.data.id}`;
            btnNuevo.innerHTML = 'Ver';
        } else {
            btnNuevo.href = '/controles/nuevo';
            btnNuevo.innerHTML = 'Nuevo';
        }

        botonera.appendChild(btnNuevo);

        buscadorNombreControl.addEventListener('input', async (event) => {
            if (event.target.value.length < 3) {
                opciones.innerHTML = '';
                descripcionControl.innerHTML = ''
                return;
            }

            const controles = await this._buscarControl(event.target.value);
            opciones.innerHTML = '';
            descripcionControl.innerHTML = ""

            Object.keys(controles).forEach((key) => {
                const control = controles[key];
                console.log(control)
                const div = document.createElement('div');
                div.className = 'p-1 border border-emerald-300 hover:border-sky-300 hover:font-semibold hover:bg-sky-100/70 rounded-md mt-1 cursor-pointer text-sm';
                div.innerHTML = control.nombre;
                div.addEventListener('click', (event) => {
                    idControl.value = control.id;
                    buscadorNombreControl.value = control.nombre;
                    descripcionControl.innerHTML = control.descripcion;
                    opciones.innerHTML = '';
                });
                opciones.appendChild(div);
            });
        });


        let ubicacionTitulo

        if (this.readOnly) {
            console.log('Se renderiza en modo de lectura')
            ubicacionTitulo = titulo;
            buscadorNombreControl.hidden = true
        } else {
            ubicacionTitulo = buscadorNombreControl;
        }

        if (this.data && this.data.id) this.setInfoControl(idControl, ubicacionTitulo, descripcionControl);

        return wrapper;
    }

    save(blockContent) {
        console.log(blockContent)
        const input = blockContent.querySelector('#idControl');
        return {
            id: input.value
        }
    }

    validate(savedData) {
        if (!savedData.id.trim()) {
            return false;
        }
        return true;
    }
}





