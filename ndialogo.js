/**
 * Crea un dialogo con un fondo gris y un elemento html que se
 * encuentra en el centro de la pantalla.
 * @param {Object} c - Configuracion del dialogo
 * @param {boolean} [c.background=true] - Mostrar fondo gris
 * @param {boolean} [c.backgroundCloseable=true] - Si el fondo gris es clickeable
 * @param {number} [c.zIndex='auto'] - Z-index del dialogo
 * @param {string|HTMLElement} [c.body=''] - Contenido del dialogo
 * @param {string} [c.title=null] - Titulo del dialogo
 * @returns {Object} - Un objeto con los metodos open, close, isOpen, setBody y setTitle
 */
function Ndialogo(c={}) {
    document.body.style.position = 'relative';
    const conf = {};
    
    conf.background = true;
    conf.backgroundCloseable = true;
    conf.body = '';
    conf.zIndex = 'auto';
    conf.title = null;
    conf.top = null;
    conf.left = null;

    if (c.background === false) {
        conf.background = false;
    }

    if (c.backgroundCloseable === false) {
        conf.backgroundCloseable = false;
    }

    if (c.zIndex == 'auto'  || c.zIndex == 'inherit' || Number.isInteger(c.zIndex)) {
        conf.zIndex = c.zIndex;
    }
    
    if (typeof c.title === 'string'){
        c.title = c.title.trim();
        if (c.title !== '') {
            conf.title = c.title;
        } else {
            conf.title = null;
        }
    }
        
    if ((c.body) instanceof HTMLElement || typeof c.body === 'string'){
        conf.body = c.body;
    }

    if (c.top) {
        conf.top = c.top;
    }

    if (c.left) {
        conf.left = c.left;
    }

    let fondoGris = null;
    let titleActual = null;
    let bodyActual = null;
    let dialogo = null;
    let isOpen = false;
    let resolveOpenPromise = null;
    let eventualy_closeable;
    

    const setFondoGris = ()=>{
        fondoGris = document.createElement('div');
        fondoGris.style.position = 'fixed';
        fondoGris.style.top = '0px';
        fondoGris.style.left = '0px';
        fondoGris.style.width = '100%';
        fondoGris.style.height = window.innerHeight + 'px';
        fondoGris.style.backgroundColor = 'rgba(0,0,0,0.5)';
        fondoGris.style.zIndex = conf.zIndex;
        if ((conf.backgroundCloseable && typeof eventualy_closeable === 'undefined') || eventualy_closeable) {
            fondoGris.addEventListener('click', e => {
                if (e.target === fondoGris) {
                    this.close();
                }
            });
        }
        document.body.appendChild(fondoGris);
    }

    this.open = (b, closeable)=>{
        // if closeable no se envia como parametro se toma de la configuracion
        eventualy_closeable = undefined;
        if (typeof closeable !== 'undefined'){
            eventualy_closeable = closeable;
        }

        if ((b) instanceof HTMLElement || typeof b === 'string'){ // si viene un body nuevo como parametro
            if(isOpen){
                if ((conf.body) instanceof HTMLElement) { // si el elemento anterior es html lo mueve
                    conf.body.style.display = 'none';
                    document.body.appendChild(conf.body);
                }
            }
            conf.body = b;
        }
        
        if ((conf.background || eventualy_closeable) && !isOpen) {
            setFondoGris();
        }

        dialogo = document.createElement('div');
        dialogo.classList.add('Ndialogo');
        titleActual = document.createElement('div');
        titleActual.classList.add('NdialogoTitle');
        titleActual.innerHTML = conf.title;
        if (typeof(conf.body) === 'string') {
            bodyActual = document.createElement('div');
            bodyActual.innerHTML = conf.body;
        } else if ((conf.body) instanceof HTMLElement) {
            bodyActual = conf.body;
            bodyActual.style.display = 'block';
        }
        bodyActual.classList.add('NdialogoBody');

        dialogo.appendChild(titleActual);
        dialogo.appendChild(bodyActual);

        if (conf.title === null) {
            titleActual.style.display = 'none';
        } else {
            titleActual.style.display = 'block';    
        }
        titleActual.addEventListener('mousedown', arrastrar);
        titleActual.addEventListener('touchstart', arrastrar);


        if(fondoGris){
            fondoGris.appendChild(dialogo);
        } else {
            document.body.appendChild(dialogo);
        }
        dialogo.style.position = 'fixed';
        // const ancho = dialogo.offsetWidth;
        // const alto = dialogo.offsetHeight;
        // const posx = window.innerWidth / 2 - ancho / 2;
        // const posy = window.innerHeight / 2 - alto / 2;
        // dialogo.style.top = posy + 'px';
        // dialogo.style.left = posx + 'px';

        requestAnimationFrame(() => {
            const rect = dialogo.getBoundingClientRect();
            if(conf.top !== null) {
                if((dialogo.offsetHeight+conf.top) > window.innerHeight) {
                    dialogo.style.top = `${conf.top - dialogo.offsetHeight}px`;
                } else {
                    dialogo.style.top = `${conf.top}px`;
                }
            } else {
                dialogo.style.top = `${(window.innerHeight - rect.height) / 2}px`;
            }

            if(conf.left !== null) {
                if((dialogo.offsetWidth+conf.left) > window.innerWidth) {
                    dialogo.style.left = `${conf.left - dialogo.offsetWidth}px`;
                } else {
                    dialogo.style.left = `${conf.left}px`;    
                }
            } else {
                dialogo.style.left = `${(window.innerWidth - rect.width) / 2}px`;
            }
        });
        
        dialogo.style.zIndex = conf.zIndex;
        isOpen = true;

        return new Promise(resolve => {
            resolveOpenPromise = resolve;
        });
    }

    const arrastrar = e => {

        const getCoords = e => {
            return e.touches ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };
        }

        const arrastre = e => {
            const ancho = dialogo.offsetWidth;
            // dialogo.style.top = e.clientY - posy + 'px';
            // dialogo.style.left = e.clientX - posx + 'px';
            const pos = getCoords(e);
            dialogo.style.left = (pos.x - posx) + 'px';
            dialogo.style.top = (pos.y - posy) + 'px';

            if(dialogo.offsetLeft < 0 - ancho + 50) {
                dialogo.style.left = -ancho + 50 + 'px';
            }
            if(dialogo.offsetLeft > window.innerWidth - 50) {
                dialogo.style.left = window.innerWidth - 50 + 'px';
            }
            if(dialogo.offsetTop < 0  + 50) {
                dialogo.style.top =  50 + 'px';
            }
            if(dialogo.offsetTop > window.innerHeight - 50) {
                dialogo.style.top = window.innerHeight - 50 + 'px';
            }
        }
        const soltar = () => {
            document.removeEventListener('mousemove', arrastre);
            document.removeEventListener('mouseup', soltar);
            document.removeEventListener('touchmove', arrastre);
            document.removeEventListener('touchend', soltar);
        }

        const pos = getCoords(e);
        const posx = pos.x - dialogo.offsetLeft;
        const posy = pos.y - dialogo.offsetTop;
        // const posx = e.clientX - dialogo.offsetLeft;
        // const posy = e.clientY - dialogo.offsetTop;
        document.addEventListener('mousemove', arrastre);
        document.addEventListener('mouseup', soltar);
        document.addEventListener('touchmove', arrastre);
        document.addEventListener('touchend', soltar);
    }
    this.close = ()=>{
        if(typeof conf.body === 'string'){
            if(dialogo){
                dialogo.remove();
            }
            
        } else if ((conf.body) instanceof HTMLElement) {
            conf.body.style.display = 'none';
            document.body.appendChild(conf.body);
            dialogo.remove();
        }
        if(fondoGris){
            fondoGris.remove();
        }
        isOpen = false;
        if (resolveOpenPromise) {
            resolveOpenPromise(false);
        }
    }

    this.isOpen = ()=>{
        return isOpen;
    }

    this.setBody = (b) => {
        if ((b) instanceof HTMLElement || typeof b === 'string'){
            if(isOpen){
                this.open(b);
            } else {
                conf.body = b;
            }
        } else {
            console.error('El cuerpo debe ser un string o un HTMLElement');
            return false;
        }
    }

    this.setTitle = (t) => {
        if (typeof t === 'string'){
            t = t.trim();
            if (t !== '') {
                conf.title = t;
            } else {
                conf.title = null;
            }
        }

        if (isOpen){
            if(typeof conf.title === 'string'){
                titleActual.innerHTML = conf.title;
                titleActual.style.display = 'block';
            } else {
                titleActual.innerHTML = '';
                titleActual.style.display = 'none';
            }
        }
    }

    this.setPosition = (l,t) => {
        if (typeof t === 'number' && typeof l === 'number'){
            conf.top = t;
            conf.left = l;
        }
    }

    this.accept = () => {
        if (resolveOpenPromise) {
            resolveOpenPromise(true);
            this.close();
        }
    }

    this.dialogo = () => {
        return dialogo;
    }
}
