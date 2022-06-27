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

	enlazar(nodo1,nodo2,peso,bidireccional=false){
		let a=new Arista();
		a.fila=nodo1;
		a.columna=nodo2;
		a.peso=peso;
		a.bidireccional=bidireccional;
		this.aristas.push(a);
	}

	eliminarNodo(nodo){
		this.conta--;
		// Eliminar nodos adyacentes
		if(this.adyacentes(nodo).length>0){
			alert("Elimine los nodos adyacentes");
			return;
		}
		this.nodos=this.nodos.filter((nodo_filter,indice)=>{
			return nodo_filter.valor!=nodo.valor;
		});
	}

	eliminarArista(fila,columna=null,peso=null){
		this.aristas=this.aristas.filter((arista,indice)=>{
			if(columna==null){
				return arista.fila.valor!=fila.valor;
			}else{
				return arista.fila.valor!=fila.valor && arista.columna.valor!=columna.valor && arista.peso!=peso;
			}
		});
	}

	cambiarPeso(arista,peso){
		for(let a=0; a<this.aristas.length; a++){
			if((this.aristas[a].fila==arista.fila && this.aristas[a].columna==arista.columna) || (this.aristas[a].fila==arista.columna && this.aristas[a].columna==arista.fila)){
				this.aristas[a].peso=peso;
				return;
			}
		}
	}

	adyacentes(nodo,nodos_excepciones=null,invertir=true){
		let nodos=[];
		(this.aristas).forEach((arista)=>{
			if(arista.fila.valor==nodo.valor || (arista.columna.valor==nodo.valor && arista.bidireccional)){
				let fila;
				let columna;
				if(invertir){
					fila=(arista.columna.valor==nodo.valor && arista.bidireccional)?arista.columna:arista.fila;
					columna=(arista.columna.valor==nodo.valor && arista.bidireccional)?arista.fila:arista.columna;
				}else{
					fila=arista.fila;
					columna=arista.columna;
				}
				if(nodos_excepciones==null){
					let a=new Arista();
					a.fila=fila;
					a.columna=columna;
					a.peso=arista.peso;
					a.bidireccional=arista.bidireccional;
					nodos.push(a);
				}else{
					let igual=false;
					for(let a=0; a<nodos_excepciones.length; a++){
						if(nodos_excepciones[a].valor==columna.valor){
							igual=true;
							a=nodos_excepciones.length;
						}
					}
					if(!igual){
						let a=new Arista();
						a.fila=fila;
						a.columna=columna;
						a.peso=arista.peso;
						a.bidireccional=arista.bidireccional;
						nodos.push(a);
					}
				}
			}
		});
		return nodos;
	}

	/*adyacentes(nodo,excepcion=null){
		if(excepcion==null){
			excepcion=[];
		}
		let ady=this.aristas.filter((arista)=>{
			return (arista.fila==nodo.valor) || (arista.columna==nodo.valor && arista.bidireccional==true);
		});
		if(excepcion.length<=0){
			return ady;
		}else{
			ady.filter((arista)=>{
				for(let a=0; a<excepcion.length; a++){
					return arista.fila!=excepcion[a].valor && arista.columna!=excepcion[a].valor;
				}
			});
		}
	}*/

	generarTabla(nodo_inicial=null, nodos_excepciones=null, tabla=null){
		if(nodo_inicial==null){
			nodo_inicial=this.nodos[0];
		}
		if(nodos_excepciones==null){
			nodos_excepciones=[];
		}
		if(tabla==null){
			tabla=[];
			(this.nodos).forEach((nodo)=>{
				nodo.peso=0;
				if(nodo.valor!=nodo_inicial.valor){
					let t=new Tabla();
					t.vertice=nodo;
					t.peso_final=(nodo.valor==nodo_inicial.valor)?0:-1;
					t.peso_temporal=(nodo.valor==nodo_inicial.valor)?0:-1;
					tabla.push(t);
				}
			});
			let t=new Tabla();
			t.vertice=nodo_inicial;
			t.peso_final=0;
			t.peso_temporal=0;
			tabla.unshift(t);
		}
		if(termino()){
			return tabla;
		}
		let nodos_ady=this.adyacentes(nodo_inicial,nodos_excepciones)??null;
		if(nodos_ady!=null){
			nodos_ady.forEach((ady)=>{
				tabla.forEach((t,indice)=>{
					if(ady.columna.valor==t.vertice.valor){
						if(t.peso_temporal==-1 || nodo_inicial.peso+ady.peso<tabla.peso_temporal){
							tabla[indice].peso_temporal=Number(nodo_inicial.peso)+Number(ady.peso);
						}
					}
				});
			});
		}
		nodos_excepciones.push(nodo_inicial);
		let indice_sig=pesoMenorTemp(nodos_excepciones);
		tabla[indice_sig].peso_final=tabla[indice_sig].peso_temporal;
		tabla[indice_sig].vertice.peso+=Number(tabla[indice_sig].peso_final);
		nodo_inicial=tabla[indice_sig].vertice;
		return this.generarTabla(nodo_inicial,nodos_excepciones,tabla);
		function pesoMenorTemp(diferir=null){
			let menor=tabla[0];
			tabla.forEach((t)=>{
				if(diferir==null){
					if((t.peso_temporal<menor.peso_temporal || menor.peso_temporal<=0) && t.peso_temporal>0 && nodo_inicial.valor!=t.vertice.valor){
						menor=t;
					}
				}else{
					let igual=false;
					for(let a=0; a<diferir.length; a++){
						if(diferir[a].valor==t.vertice.valor){
							igual=true;
							a=diferir.length;
						}
					}
					if(!igual){
						if((t.peso_temporal<menor.peso_temporal || menor.peso_temporal<=0) && t.peso_temporal>0 && nodo_inicial.valor!=t.vertice.valor){
							menor=t;
						}
					}
				}
			});
			for(let a=0; a<tabla.length; a++){
				if(tabla[a].vertice.valor==menor.vertice.valor){
					return a;
				}
			}
		}
		function termino(){
			for(let a=0; a<tabla.length; a++){
				if(tabla[a].peso_final<0){
					return false;
				}
			}
			return true;
		}
	}

	caminoCorto(nodo_inicio,nodo_fin,grafo){
		let tabla=this.generarTabla(nodo_fin);
		let camino=[];
		let peso_total=0;
		generar();
		function generar(){
			tabla.forEach((t)=>{
				let ady=grafo.adyacentes(nodo_inicio)??[];
				ady.forEach((arista)=>{
					if(t.vertice.valor==arista.columna.valor){
						if(getPeso(nodo_inicio)-arista.peso==t.vertice.peso){
							camino.push(nodo_inicio);
							peso_total+=Number(arista.peso);
							nodo_inicio=t.vertice;
							if(nodo_inicio.valor!=nodo_fin.valor){
								generar();
							}else{
								camino.push(nodo_inicio);
							}
						}
					}
				});
			});
			function getPeso(nodo){
				for(let a=0; a<tabla.length; a++){
					if(tabla[a].vertice.valor==nodo.valor){
						return tabla[a].vertice.peso;
					}
				}
				return 0;
			}
		}
		return {
			camino:camino,
			peso_total:peso_total
		};
	}

}