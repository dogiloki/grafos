class Grafo{

	constructor(){
		this.nodos=[];
		this.aristas=[];
		this.conta=0;
	}

	agregar(valor){
		let nodo=new Nodo();
		nodo.obj=null;
		nodo.valor=valor;
		nodo.asociacion="";
		this.nodos.push(nodo);
		this.conta++;
		return nodo;
	}

	enlazar(nodo1,nodo2,peso,bidirecional=false){
		this.aristas.push({
			peso:peso,
			fila:nodo1,
			columna:nodo2
		});
		if(bidirecional){
			this.aristas.push({
				peso:peso,
				fila:nodo2,
				columna:nodo1
			});
		}
	}

	eliminarNodo(valor){
		this.conta--;
		this.eliminarArista(valor);
		this.nodos=this.nodos.filter((nodo,indice)=>{
			return nodo.valor!=valor;
		});
	}

	eliminarArista(fila,columna=null,peso=null){
		this.aristas=this.aristas.filter((arista,indice)=>{
			if(columna==null){
				return arista.fila!=fila;
			}else{
				return arista.fila!=fila && arista.columna!=columna && arista.peso!=peso;
			}
		});
	}

	// onkeydown
	// 65,83,d=68,f=70: e.keyCode;

}