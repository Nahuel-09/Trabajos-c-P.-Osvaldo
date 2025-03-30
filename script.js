//Reto: Usa class list para resaltar campos invalidos!
 
// (!!) Array que almacenará las especies registradas
let especies = [];

/*
 * (!) Función que renderiza la tabla de especies.
 */
const RenderTabla = () => {
    // Seleccionamos el <tbody> de la tabla donde se mostrarán los datos
    const tbdy = document.querySelector("#tabla-registro tbody");
    
    // Limpiamos el contenido anterior de la tabla
    tbdy.innerHTML = "";

    // Si no hay especies registradas, mostramos un mensaje en la tabla
    if (especies.length === 0) {
        tbdy.innerHTML = "<tr><td colspan='4'>No hay especies registradas.</td></tr>";
        return; // Terminamos la ejecución de la función
    }

    // Recorremos el array "especies" y agregamos cada elemento a la tabla
    especies.forEach((especie) => {
        // Creamos un nuevo elemento <tr> para cada especie
        const fila = document.createElement("tr");

        // Insertamos los datos en la fila y agregamos botones de editar/eliminar
        fila.innerHTML = `
            <td>${especie.nombre}</td>
            <td>${especie.ciencia}</td>
            <td>${especie.habitad}</td>
            <td>
                <button onclick="editarEspecies(${especie.id})"> Editar</button>
                <button onclick="eliminarEspecies(${especie.id})"> Eliminar</button>
            </td>
        `;

        // Agregamos la fila creada al cuerpo de la tabla
        tbdy.appendChild(fila);
    });
};

/*
 * Función que guarda los datos del array "especies" en el LocalStorage.
 */
const guardarStorage = () => {
    // Convertimos el array en un string JSON y lo guardamos en el almacenamiento local
    localStorage.setItem("especies", JSON.stringify(especies));
};

/*
 * (!) Función que carga los datos almacenados en LocalStorage al array "especies".
 */
const cargarStorage = () => {
    // Obtenemos los datos almacenados bajo la clave "especies"
    const data = localStorage.getItem("especies");

    // Si hay datos en LocalStorage, los convertimos de JSON a un array de objetos
    if (data) {
        especies = JSON.parse(data);
    }
};

// Cuando la página cargue, se ejecutan estas funciones
document.addEventListener("DOMContentLoaded", () => {
    cargarStorage(); // Cargamos los datos desde LocalStorage
    RenderTabla(); // Mostramos los datos en la tabla
});

// Evento del botón "Agregar Registro"
document.querySelector("#btn-agregar").addEventListener("click", () => {
    // Obtenemos los valores del formulario
    const id = document.querySelector("#refer-name").dataset.id || 0;
    const nombre = document.querySelector("#refer-name").value.trim();
    const ciencia = document.querySelector("#refer-namesc").value.trim();
    const habitad = document.querySelector("#refer-habitat").value.trim();
    const infoExt = document.querySelector("#refer-info").value.trim();

    // Validación: Si algún campo está vacío, mostramos una alerta y salimos de la función
    if (!nombre || !ciencia || !habitad) {
        alert("¡Completa todos los campos!");
        return;
    }

    if (id == 0) {
        // Si id es 0, significa que estamos agregando una nueva especie
        const nuevaEspecie = {
            id: Date.now(), // Generamos un ID único basado en la fecha actual
            nombre,
            ciencia,
            habitad,
            infoExt
        };

        // Agregamos la nueva especie al array
        especies.push(nuevaEspecie);
    } else {
        // Si el ID no es 0, significa que estamos editando una especie existente
        const index = especies.findIndex((e) => e.id == id); // Buscamos la especie en el array
        if (index !== -1) {
            // Actualizamos la especie con los nuevos datos
            especies[index] = {
                id: parseInt(id),
                nombre,
                ciencia,
                habitad,
                infoExt
            };

            // Restablecemos el dataset.id del formulario a 0 para futuras inserciones
            document.querySelector("#refer-name").dataset.id = 0;
        }
    }

    // Guardamos los datos actualizados en LocalStorage
    guardarStorage();

    // Volvemos a renderizar la tabla con los datos actualizados
    RenderTabla();

    // Limpiamos los campos del formulario
    document.querySelector("#registro-form").reset();
});

/*
 * (!) Función que carga los datos de una especie en el formulario para su edición.
 */
const editarEspecies = (id) => {
    // Buscamos la especie con el ID correspondiente
    const especie = especies.find((e) => e.id == id);

    if (especie) {
        // Cargamos los valores en los campos del formulario
        document.querySelector("#refer-name").value = especie.nombre;
        document.querySelector("#refer-name").dataset.id = id;
        document.querySelector("#refer-namesc").value = especie.ciencia;
        document.querySelector("#refer-habitat").value = especie.habitad;
        document.querySelector("#refer-info").value = especie.infoExt;
    }
};

/*
 * (!) Función que elimina una especie con confirmación previa.
 */

const eliminarEspecies = (id) => {
    // Mostramos una ventana de confirmación antes de eliminar
    if (confirm("¿Seguro que deseas eliminar esta especie?")) {
        // Filtramos el array para eliminar la especie con el ID seleccionado
        especies = especies.filter((e) => e.id != id);

        // Guardamos los cambios en LocalStorage
        guardarStorage();
      
        // Renderizamos la tabla actualizada
        RenderTabla();
    }
};

// Evento para eliminar todas las especies registradas
document.querySelector("#btn-enviar").addEventListener("click", () => {
    // Confirmamos antes de borrar todos los datos
    if (confirm("¿Quieres eliminar todas las especies registradas?")) {
        especies = []; // Vaciamos el array

        guardarStorage(); // Guardamos los cambios en LocalStorage
        RenderTabla(); // Actualizamos la tabla vacía
    }
});
