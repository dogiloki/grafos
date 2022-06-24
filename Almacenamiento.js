class Almacenamiento{

	static guardar(grafo){
		localStorage.setItem("datos",JSON.stringify(grafo));
	}

	static obtener(){
		return JSON.parse(localStorage.getItem("datos"));
	}

	static eliminar(){
		localStorage.setItem("datos",null);	
	}

}