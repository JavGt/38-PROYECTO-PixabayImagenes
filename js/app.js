const resultado = document.querySelector("#resultado"),
	formulario = document.querySelector("#formulario"),
	paginacionDiv = document.querySelector("#paginacion");

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
	formulario.addEventListener("submit", validarFormulario);
};

function validarFormulario(e) {
	e.preventDefault();
	const terminoBusqueda = document.querySelector("#termino").value;

	if (terminoBusqueda === "") {
		mostrarAlerta("Agrega un término de búsqueda");
		return;
	}
	paginaActual = 1;

	buscarImagenes();
}

function buscarImagenes() {
	const termino = document.querySelector("#termino").value;

	const key = "24824812-3a8a8d9f2ad3e6fbfd117a382";
	const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

	fetch(url)
		.then((respuesta) => respuesta.json())
		.then((respuestaJson) => {
			totalPaginas = calcularPaginas(respuestaJson.totalHits);
			mostrarImagenes(respuestaJson.hits);
		})
		.catch((error) => console.log(error));
}

// Generador que va a registrar la cantidad de elementos de acuerdo a las paginas
function* crearPaginador(total) {
	for (let i = 1; i <= total; i++) {
		yield i;
	}
}

const calcularPaginas = (total) =>
	parseInt(Math.ceil(total / registrosPorPagina));

function mostrarImagenes(imagenes) {
	while (resultado.firstChild) {
		resultado.removeChild(resultado.firstChild);
	}

	// Iterar sobre el arreglo de imagenes
	imagenes.forEach((imagen) => {
		const { previewURL, likes, views, largeImageURL } = imagen;

		resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img src="${previewURL}" alt="" class="w-full">
                    <div class="p-4">
                        <p class="font-bold">${likes} <span class="font-light">Me gusta</span></p>
                        <p class="font-bold">${views} <span class="font-light">Veces vista</span></p>

                        <a class=" block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                        href="${largeImageURL}" target=”_blank”>Ver Imagen</a>
                    </div>
                </div>
            </div>
        `;
	});
	// Limpiar el paginador previo
	while (paginacionDiv.firstChild) {
		paginacionDiv.removeChild(paginacionDiv.firstChild);
	}

	// Generamos el nuevo html
	imprimirPaginador();
}

function imprimirPaginador() {
	iterador = crearPaginador(totalPaginas);

	while (true) {
		const { value, done } = iterador.next();
		if (done) return;

		// genera un boton por cada iterador
		const boton = document.createElement("a");
		boton.href = "#";
		boton.dataset.pagina = value;
		boton.textContent = value;
		boton.classList.add(
			"siguiente",
			"bg-yellow-400",
			"px-4",
			"py-1",
			"mr-2",
			"font-bold",
			"mb-5",
			"rounded"
		);
		paginacionDiv.appendChild(boton);

		boton.onclick = () => {
			paginaActual = value;
			buscarImagenes();
		};
	}
}

function mostrarAlerta(mensaje) {
	const alertaExiste = document.querySelector(".alerta");

	if (alertaExiste) return;

	const alerta = document.createElement("P");
	alerta.classList.add(
		"alerta",
		"bg-red-100",
		"border-red-400",
		"text-red-700",
		"px-4",
		"py-3",
		"rounded",
		"max-w-lg",
		"mx-auto",
		"mt-6",
		"text-center"
	);

	alerta.innerHTML = `
        <strong class="font-bold">¡Error!</strong>
        <span class="block sm:inline">${mensaje}</span>
    `;

	formulario.appendChild(alerta);

	setTimeout(() => {
		alerta.remove();
	}, 3000);
}
