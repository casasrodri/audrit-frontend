import api from '@/services/api.js'

const COLORES = {
    rojo: {
        200: '#fecdd3',
        300: '#fda4af',
        400: '#fb7185',
        700: '#be123c',
    },
    verde: {
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        700: '#047857',
    },
    amarillo: {
        200: '#fef08a',
        300: '#fde047',
        400: '#facc15',
        700: '#713f12',
    },
    slate: {
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        700: '#334155',
    },
    fucsia: {
        200: '#f5d0fe',
        300: '#f0abfc',
        400: '#e879f9',
        700: '#a21caf',
    }
}

const ICONOS = {
    riesgo: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m0 26a12 12 0 1 1 12-12a12 12 0 0 1-12 12"/><path fill="#d01616" d="M15 8h2v11h-2zm1 14a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 16 22"/></svg>',
    control: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512"><path fill="#0c600b" d="M416 208c0 45.9-14.9 88.3-40 122.7l126.6 126.7c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0s208 93.1 208 208M208 352a144 144 0 1 0 0-288a144 144 0 1 0 0 288"/></svg>',
    normativa: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#121212" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19.5V6.2c0-1.12 0-1.68.218-2.108c.192-.377.497-.682.874-.874C6.52 3 7.08 3 8.2 3h9.2c.56 0 .84 0 1.055.109a1 1 0 0 1 .436.437C19 3.76 19 4.04 19 4.6v11.8c0 .56 0 .84-.11 1.054a.998.998 0 0 1-.435.437C18.24 18 17.96 18 17.402 18H7.25A2.25 2.25 0 0 0 5 20.25c0 .414.336.75.75.75h10.652c.559 0 .84 0 1.053-.109a.998.998 0 0 0 .436-.437C18 20.24 18 19.96 18 19.4V18"/></svg>',
    aplicacion: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#7d7e10" d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64z"/></svg>',
    organigrama: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#861377" d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.4 3.4 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.4 3.4 0 0 0 15 11a3.5 3.5 0 0 0 0-7"/></svg>',
    external: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#861377" fill-rule="evenodd" d="M9.707 15.707L17.5 7.914l1.793 1.793A1 1 0 0 0 21 9V4l-.001-.048A.996.996 0 0 0 20 3h-5a1 1 0 0 0-.707 1.707L16.086 6.5l-7.793 7.793a1 1 0 1 0 1.414 1.414M4 3a1 1 0 0 0-1 1v14a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-5a1 1 0 1 0-2 0v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5h6a1 1 0 1 0 0-2z" clip-rule="evenodd"/></svg>',
}

function goToRoute(path) {
    const event = new CustomEvent("goToRoute", { detail: path });
    document.dispatchEvent(event);
}

function openRoute(path) {
    const event = new CustomEvent("openRoute", { detail: path });
    document.dispatchEvent(event);
}

export class AudiReferencias {
    static get toolbox() {
        return {
            title: 'Link relevante',
            icon: '<svg></svg>'
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
        this.endpointBuscar = config.endpointBuscar || ''
        this.endpointInfoId = config.endpointInfoId || ''
        this.urlVista = config.urlVista || ''
        this.urlNuevo = config.urlNuevo || ''
        this.mostrarDescripcion = config.mostrarDescripcion === undefined ? true : config.mostrarDescripcion
    }

    async _buscarListaObjetos(texto) {
        const { data } = await api.get(`${this.endpointBuscar}/${texto}`)
        return data
    }

    async _infoObjeto(id) {
        const { data } = await api.get(`${this.endpointInfoId}/${id}`)
        return data
    }

    _modificarNombre(objeto) {
        return objeto.nombre
    }

    async _setCamposInfoObjLectura(wrapper, idObj, titulo, descripcion, izq, der) {
        const objeto = await this._infoObjeto(this.data.id)
        const nombre = this._modificarNombre(objeto)

        idObj.value = this.data.id;
        // izq.href = `${this.urlVista}/${this.data.id}`
        izq.addEventListener('click', () => goToRoute(`${this.urlVista}/${this.data.id}`))
        titulo.addEventListener('click', () => goToRoute(`${this.urlVista}/${this.data.id}`))

        der.appendChild(titulo)

        if (objeto.descripcion) {

            let nombreMostrar
            let estilos = 'font-semibold cursor-pointer'

            if (this.mostrarDescripcion) {
                nombreMostrar = nombre + ':'
                estilos += ' underline'
                descripcion.innerHTML = objeto.descripcion;
                console.log(objeto.descripcion)
                der.appendChild(descripcion)
            } else {
                nombreMostrar = nombre
                descripcion.classList.add('hidden')
            }

            titulo.innerHTML = nombreMostrar;
            titulo.className = estilos;
        } else {
            titulo.innerHTML = nombre
        }

        wrapper.appendChild(der)
    }

    async _setCamposInfoObjEdicion(idObj, buscadorNombre, descripcion, izq, btnNuevo) {
        const objeto = await this._infoObjeto(this.data.id)
        const nombre = this._modificarNombre(objeto)

        idObj.value = this.data.id;
        // izq.href = `${this.urlVista}/${this.data.id}`
        izq.addEventListener('click', () => openRoute(`${this.urlVista}/${this.data.id}`))

        buscadorNombre.value = nombre
        descripcion.innerHTML = objeto.descripcion
        // btnNuevo.style.display = 'none'
    }

    renderLectura() {

        const wrapper = document.createElement('div');
        wrapper.className = `my-2 rounded-md border flex relative w-full`
        wrapper.style.borderColor = `${this.colores[400]}`
        wrapper.style.backgroundColor = `${this.colores[200]}`
        wrapper.title = this.titulo

        const idObj = document.createElement('input');
        idObj.id = 'idObj';
        idObj.type = 'hidden';
        idObj.value = this.data.id;
        wrapper.appendChild(idObj)

        const izq = document.createElement('a');
        izq.id = 'izq';
        // izq.target = '_blank';
        izq.className = `min-w-12 flex justify-center border-r-[1px] place-items-center rounded-l-md`
        izq.style.borderColor = `${this.colores[400]}`
        izq.style.backgroundColor = `${this.colores[300]}`
        izq.style.color = `${this.colores[700]}`

        izq.innerHTML = ICONOS[this.tipo]
        wrapper.appendChild(izq)

        const der = document.createElement('div');
        der.className = 'p-3'

        const titulo = document.createElement('h3');
        titulo.className = 'font-semibold';

        const descripcion = document.createElement('div');
        descripcion.className = 'mt-2 text-sm';

        if (this.data && this.data.id) this._setCamposInfoObjLectura(wrapper, idObj, titulo, descripcion, izq, der)

        return wrapper;
    }

    renderEdicion() {
        const wrapper = document.createElement('div');
        wrapper.className = `my-2 rounded-md border flex relative w-full`
        wrapper.style.borderColor = `${this.colores[400]}`
        wrapper.style.backgroundColor = `${this.colores[200]}`
        wrapper.title = this.titulo

        const idObj = document.createElement('input');
        idObj.id = 'idObj';
        idObj.type = 'hidden';
        idObj.value = this.data.id;
        wrapper.appendChild(idObj)

        const izq = document.createElement('a');
        izq.id = 'izq';
        // izq.target = '_blank';
        izq.className = `min-w-12 flex justify-center border-r-[1px] place-items-center rounded-l-md`
        izq.style.borderColor = `${this.colores[400]}`
        izq.style.backgroundColor = `${this.colores[300]}`
        izq.style.color = `${this.colores[700]}`

        izq.innerHTML = ICONOS[this.tipo]
        wrapper.appendChild(izq)

        const der = document.createElement('div');
        der.className = 'p-3 w-full'
        wrapper.appendChild(der)

        const titulo = document.createElement('h3');
        titulo.id = 'tituloObj'
        titulo.className = 'font-semibold underline';
        titulo.innerHTML = `${this.titulo}:`;
        der.appendChild(titulo)

        const buscadorNombre = document.createElement('input');
        buscadorNombre.id = 'buscadorNombre';
        buscadorNombre.className = 'w-full p-1 border border-gray-300 rounded-md mt-2 text-sm';
        buscadorNombre.placeholder = 'Buscar...';
        der.appendChild(buscadorNombre);


        const opciones = document.createElement('div');
        der.appendChild(opciones)

        const descripcion = document.createElement('div');
        descripcion.id = 'descripcionObj'
        descripcion.className = 'mt-2 text-sm';
        der.appendChild(descripcion)

        const botonera = document.createElement('div');
        botonera.className = 'flex justify-end mt-2 gap-2';
        der.appendChild(botonera);

        const btnNuevo = document.createElement('a');
        btnNuevo.className = 'bg-green-500 hover:bg-green-700 text-white px-4 py-1 rounded-md font-semibold text-sm';
        btnNuevo.setAttribute('style', 'text-decoration:none !important');
        btnNuevo.target = '_blank';
        btnNuevo.href = this.urlNuevo;
        // btnNuevo.addEventListener('click', () => goToRoute(this.urlNuevo))
        btnNuevo.innerHTML = 'Nuevo';
        botonera.appendChild(btnNuevo);

        buscadorNombre.addEventListener('input', async (event) => {
            if (event.target.value.length < 3) {
                opciones.innerHTML = '';
                descripcion.innerHTML = ''
                return;
            }

            const objetos = await this._buscarListaObjetos(event.target.value);
            opciones.innerHTML = '';
            descripcion.innerHTML = ""

            Object.keys(objetos).forEach((key) => {
                const objeto = objetos[key];
                const div = document.createElement('div');
                div.className = 'p-1 border hover:font-semibold rounded-md mt-1 cursor-pointer text-sm';
                div.innerHTML = objeto.nombre;
                div.addEventListener('click', (event) => {
                    idObj.value = objeto.id;
                    buscadorNombre.value = objeto.nombre;
                    descripcion.innerHTML = objeto.descripcion;
                    opciones.innerHTML = '';
                    // btnNuevo.style.display = 'none'
                });
                opciones.appendChild(div);
            });
        });

        if (this.data && this.data.id) this._setCamposInfoObjEdicion(idObj, buscadorNombre, descripcion, izq, btnNuevo)

        return wrapper

    }

    render() {
        if (this.readOnly) {
            return this.renderLectura()
        } else {
            return this.renderEdicion()
        }
    }

    save(blockContent) {
        const input = blockContent.querySelector('#idObj');
        const titulo = blockContent.querySelector('#buscadorNombre');
        const descripcion = blockContent.querySelector('#descripcionObj');

        return {
            id: input.value,
            nombre: titulo.value,
            descripcion: descripcion.innerHTML
        }
    }

    validate(savedData) {
        if (!savedData.id.trim()) {
            return false;
        }
        return true;
    }
}

export class ControlRelevante extends AudiReferencias {
    static get toolbox() {
        return {
            title: 'Control',
            icon: ICONOS.control
        };
    }

    constructor({ data, api, config, readOnly }) {

        super({ data, api, config, readOnly })

        this.titulo = 'Control relevante'
        this.colores = COLORES.verde;
        this.tipo = 'control'
    }
}

export class RiesgoRelevante extends AudiReferencias {
    static get toolbox() {
        return {
            title: 'Riesgo',
            icon: ICONOS.riesgo
        };
    }

    constructor({ data, api, config, readOnly }) {

        super({ data, api, config, readOnly })

        this.titulo = 'Riesgo relevante'
        this.colores = COLORES.rojo;
        this.tipo = 'riesgo'
    }
}

export class Normativa extends AudiReferencias {
    static get toolbox() {
        return {
            title: 'Normativa',
            icon: ICONOS.normativa
        };
    }

    constructor({ data, api, config, readOnly }) {

        super({ data, api, config, readOnly })

        this.titulo = 'Normativa'
        this.colores = COLORES.slate;
        this.tipo = 'normativa'
    }

    _modificarNombre(objeto) {
        return `${objeto.nombre} (${objeto.nomenclatura})`
    }
}

export class Aplicacion extends AudiReferencias {
    static get toolbox() {
        return {
            title: 'Aplicación',
            icon: ICONOS.aplicacion
        };
    }

    constructor({ data, api, config, readOnly }) {

        super({ data, api, config, readOnly })

        this.titulo = 'Aplicación'
        this.colores = COLORES.amarillo;
        this.tipo = 'aplicacion'
    }
}

export class Organigrama extends AudiReferencias {
    static get toolbox() {
        return {
            title: 'Organigrama',
            icon: ICONOS.organigrama
        };
    }

    constructor({ data, api, config, readOnly }) {

        super({ data, api, config, readOnly })

        this.titulo = 'Organigrama'
        this.colores = COLORES.fucsia;
        this.tipo = 'organigrama'
    }
}
