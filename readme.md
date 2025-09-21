# ntablaf.js

# Versiones
## version 1.1
	Se agrega la posibilidad de arrastrar con eventos touch compatible con celular
## version 1.3
	Se agrega zIndex al fondo gris
## version 1.4
	Se añade la opcion de que el body pueda ser un elemento del DOM y no lo elimina al cerrar. Le asigna style.display block/none.
	Corrige la propiedad title de la configuracion.
## version 1.5
	Al configurar top, el dialogo aparece en una posicion to relativa al scroll de la ventana.
## version 1.6
	Al metodo open se le puede pasar ademas del body, si el background es closeable -true/false-.
	Si no se espesifica mantiene el de la configuracion.
## version 1.7
	Corrige cerrar el fondo gris si el body es un elemnto html
	Ahora el metodo open() devuleve una promesa, close() hace que devuelva false y accept() true. Tanto el metodo close() como el metodo accept() cierran el dialogo.

```javascript
const miDialogo = new nDialogo();

const mi_funcion = async ()=>{
    const res = await miDialogo.open(`<div> Acepta el mensaje? </div>
    <div>
        <button onclick="miDialogo.accept()">Aceptar</button>
        <button onclick="miDialogo.close()">Cancelar</button>
    </div>`);
    if (res == true){
        console.log("aceptado");
    } else {
        console.log("cancelado");
    }
}
```
## version 1.8
	Se quita el metodo cerrar(). En su lugar se usa close().
    Se añade el metodo enviar(). Al ser llamada, la función crea un envento "enviar" con valores de elementos input, select y textarea dentro cuadro de dialogo y construye un objeto de respuesta basado en los valores de los elementos. Este método no cierra el cuadro de dialogo.
```javascript
const miDialogo = new nDialogo();

const mi_funcion = async ()=>{
    miDialogo.open(`<div>
        <input type="text" name="input1" value="valor 1" />
    </div>
    <div>
        <input type="text" name="input2" value="valor 2" />
    </div>
    <div>
        <input type="text" name="input3" value="valor 3" />
    </div>
    <div>
        <button onclick="miDialogo.enviar()">Aceptar</button>
        <button onclick="miDialogo.close()">Cancelar</button>
    </div>`);
    miDialogo.e.addEventListener('enviar',async e=>{
        const enviar = e.detail;
        console.log(enviar);
    });
}
