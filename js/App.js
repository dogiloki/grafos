var content_modal=document.getElementById('content-modal');
var content_area=document.getElementById('content-area');
var content_datos=document.getElementById('content-datos');
var content_camino=document.getElementById('content-camino');
var btn_agregar=document.getElementById('btn-agregar');
var btn_camino=document.getElementById('btn-camino');
var btn_enlazar=document.getElementById('btn-enlazar');
var valor=document.getElementById('caja-valor');
var peso=document.getElementById('caja-peso');
var bidireccional=document.getElementById('caja-bidireccional');
var caja_check=document.getElementById('caja-check');
var caja_asociacion=document.getElementById('asociacion');
var btn_descargar=document.getElementById('btn-descargar');
var btn_cargar=document.getElementById('btn-cargar');
var btn_aceptar=document.getElementById('btn-aceptar');
var btn_eliminar=document.getElementById('btn-eliminar');
var btn_eliminar_nodo=document.getElementById('btn-eliminar-nodo');
var caja_file=document.getElementById('file');
var texto_file="";
var opcion;
var grafo=new Grafo();
var nodos_sele=[null,null];
var nodo_sele=null;
var matriz=null;
var tam_matriz=0;

/*document.addEventListener("click",()=>{
	if(this.nodos_sele[0]!=null){
		this.nodos_sele[0].setAttribute("class","grafo");
	}
	if(this.nodos_sele[1]!=null){
		this.nodos_sele[1].setAttribute("class","grafo");
	}
	this.nodos_sele[0]=null;
	this.nodos_sele[1]=null;
});*/
document.addEventListener("DOMContentLoaded",()=>{
	this.eliminar();
	this.texto_file=Almacenamiento.obtener();
	if(this.texto_file!=null){
		this.cargar();
	}
	this.deseleccionar();
});
btn_descargar.addEventListener("click",()=>{
	let elemento=document.createElement("a");
	elemento.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(JSON.stringify(this.grafo)));
	elemento.setAttribute("download","Grafo.txt");
	document.body.appendChild(elemento);
	elemento.click();
});
btn_cargar.addEventListener("click",()=>{
	this.cargar();
});
caja_file.addEventListener("change",(evt)=>{
	const reader=new FileReader();
	reader.addEventListener("load",(evt2)=>{
		this.texto_file=JSON.parse(evt2.target.result);
	});
	reader.readAsText(evt.target.files[0]);
});
btn_eliminar.addEventListener("click",()=>{
	Almacenamiento.eliminar();
	this.eliminar();
});
btn_eliminar_nodo.addEventListener("click",()=>{
	this.grafo.eliminarNodo(this.nodo_sele);
	Almacenamiento.guardar(this.grafo);
	window.location.reload();
});
caja_asociacion.addEventListener("change",(evt)=>{
	if(this.nodo_sele!=null){
		this.nodo_sele.obj.setAttribute("title",this.caja_asociacion.value);
		this.nodo_sele.asociacion=this.caja_asociacion.value;
		Almacenamiento.guardar(this.grafo);
	}
});
btn_agregar.addEventListener("click",()=>{
	this.deseleccionar();
	this.opcion=0;
	this.pedirDato();
});
btn_camino.addEventListener(("click"),()=>{
	if(this.nodos_sele[0]!=null && this.nodos_sele[1]!=null){
		let texto="<p>Camino: ";
		let datos=this.grafo.caminoCorto(this.nodos_sele[0],this.nodos_sele[1],grafo);
		datos.camino.forEach((nodo)=>{
			texto+=" [ "+nodo.valor+" {"+nodo.asociacion+"} ] ";
		})
		texto=texto.substring(0,texto.length-3);
		texto+="</p><p>Peso total: "+datos.peso_total+"</p>";
		this.content_camino.innerHTML=texto;
	}
});
btn_enlazar.addEventListener("click",()=>{
	this.opcion=1;
	this.pedirDato(true);
});
btn_aceptar.addEventListener("click",()=>{
	if(this.valor.value.replaceAll(" ","")!=""){
		if(this.opcion==0){
			this.agregar(this.valor.value);
		}
	}else
	if(this.peso.value.replaceAll(" ","")!=""){
		if(this.opcion==1){
			this.agregar(null,this.peso.value,this.bidireccional.checked);
		}
	}
});
valor.addEventListener("keydown",(evt)=>{
	if(evt.keyCode==13){
		if(this.opcion==0){
			this.agregar(this.valor.value);
		}else{
			this.agregar(this.valor.value,this.peso.value,this.bidireccional.checked);
		}
	}
});

function modal(op,muestra=-1){ // -1=lo contrario; false=ocultar; true=mostrar
	let show=op.style.display;
	let value=(muestra==false)?"none":
				(muestra==true)?"":(show=="none")?"":"none";
	op.style.display=value;
	return value;
}

function cargar(){
	this.eliminar();
	this.opcion=0;
	this.texto_file.nodos.forEach((nodo,indice)=>{
		this.agregar(nodo.valor);
		this.grafo.nodos[indice].asociacion=nodo.asociacion;
		this.grafo.nodos[indice].obj.setAttribute("title",nodo.asociacion);
	});
	this.opcion=1;
	this.texto_file.aristas.forEach((arista,indice)=>{
		this.nodos_sele[0]=arista.fila;
		this.nodos_sele[1]=arista.columna;
		this.agregar(null,arista.peso,arista.bidireccional);
	});
	this.nodos_sele=[null,null];
}

function eliminar(){
	this.deseleccionar();
	this.content_area.innerHTML="";
	this.content_camino.innerHTML="";
	this.valor.value="";
	this.peso.value="";
	this.bidireccional.checked=false;
	this.caja_asociacion.value="";
	this.grafo=new Grafo();
	this.nodos_sele=[null,null];
	this.nodo_sele=null;
	this.matriz=null;
	this.tam_matriz=0;
	document.getElementById('tabla').innerHTML="";
	this.opcion=0;
	let btn=document.createElement("legend");
	btn.innerHTML="Deseleccionar";
	btn.addEventListener(("click"),()=>{
		this.deseleccionar();
	});
	this.content_area.appendChild(btn);
}

function deseleccionar(){
	if(this.nodos_sele[0]!=null){
		this.nodos_sele[0].obj.setAttribute("class","grafo");
	}
	if(this.nodos_sele[1]!=null){
		this.nodos_sele[1].obj.setAttribute("class","grafo");
	}
	this.nodos_sele[0]=null;
	this.nodos_sele[1]=null;
	this.nodo_sele=null;
	this.asociacion.value="";
	this.btn_eliminar_nodo.innerHTML="";
	this.modal(btn_eliminar_nodo,false);
	this.content_datos.innerHTML="";
}

function seleNodo(nodo){
	if(this.nodos_sele[0]!=null && this.nodos_sele[1]!=null){
		this.nodos_sele[1].obj.setAttribute("class","grafo");
		this.nodos_sele[1]=null;
	}
	if(this.nodos_sele[0]==null || this.nodos_sele[0].obj.getAttribute("class")=="grafo"){
		this.nodos_sele[0]=nodo;
		this.nodos_sele[0].obj.setAttribute("class","grafo_sele");
	}else{
		this.nodos_sele[1]=nodo;
		this.nodos_sele[1].obj.setAttribute("class","grafo_sele");
	}
	this.nodo_sele=nodo;
	this.btn_eliminar_nodo.innerHTML="Eliminar ( "+this.nodo_sele.valor+" )";
	this.modal(btn_eliminar_nodo,true);
}

function pedirDato(enlazar=false){
	this.modal(valor,!enlazar);
	this.modal(peso,enlazar);
	this.modal(bidireccional,enlazar);
	this.modal(caja_check,enlazar);
	this.modal(content_modal);
	this.valor.focus();
	if(enlazar){	
		this.peso.value=0;
		this.bidireccional.checked=false;
		if(this.nodos_sele[0]==null || this.nodos_sele[1]==null){
			this.deseleccionar();
			this.modal(content_modal);
		}
	}else{
		this.valor.value="";
		this.deseleccionar();
	}
}

function agregar(valores,peso=0,bidirecional=null){
	if(this.opcion==0){
		this.btn_agregar.focus();
		((valores).split(",")).forEach((valor=>{
			let nodo=document.createElement("div");
			nodo.setAttribute("class","grafo");
			nodo.setAttribute("id",this.grafo.conta);
			nodo.innerText=valor;
			this.content_area.appendChild(nodo);
			let nodo_agregado=this.grafo.agregar(valor)
			nodo_agregado.obj=nodo;
			nodo.addEventListener("click",()=>{
				this.seleNodo(nodo_agregado);
				this.obtenerAsociacion(nodo_agregado);
				this.obtenerDatos(nodo_agregado);
			});
			this.crearMatriz();
		}));
		this.mostrar();
	}else{
		let fila=this.nodos_sele[0];
		let columna=this.nodos_sele[1];
		this.grafo.enlazar(fila,columna,peso,bidirecional);
		let matriz_fila=0;
		let matriz_columna=0;
		for(let a=0; a<this.tam_matriz; a++){
			for(let b=0; b<this.tam_matriz; b++){
				if(a==0){
					if(b>0){
						if(this.matriz[a][b].valor==columna.valor){
							matriz_columna=b;
						}
					}
				}else{
					if(b==0){
						if(this.matriz[a][b].valor==fila.valor){
							matriz_fila=a;
						}
					}
				}
				if(matriz_fila!=0 && matriz_columna!=0){
					a=this.matriz.length;
					b=this.matriz.length;
				}
			}
		}
		this.matriz[matriz_fila][matriz_columna]="1";
		document.getElementById(matriz_fila+','+matriz_columna).innerHTML=this.matriz[matriz_fila][matriz_columna];
		if(this.bidireccional.checked){
			this.matriz[matriz_columna][matriz_fila]="1";
			document.getElementById(matriz_columna+','+matriz_fila).innerHTML=this.matriz[matriz_columna][matriz_fila];
		}
	}
	this.modal(content_modal,false);
	Almacenamiento.guardar(this.grafo);
	//this.deseleccionar();
}

function crearMatriz(){
	if(this.matriz==null){
		this.matriz=new Array(this.grafo.nodos.length+1);
		this.tam_matriz=this.matriz.length;
	}else{
		this.tam_matriz++;
	}
	for(let a=0; a<((this.matriz==null)?this.grafo.nodos.length:this.tam_matriz); a++){
		if(this.matriz[a]==null){
			this.matriz[a]=new Array(this.grafo.nodos.length+1);
		}
		for(let b=0; b<((this.matriz==null)?this.grafo.nodos.length:this.tam_matriz); b++){
			if(a==0){
				if(b>0){
					this.matriz[a][b]=this.grafo.nodos[b-1];
				}else{
					this.matriz[a][b]="";
				}
			}else{
				if(b==0){
					if(a>0){
						this.matriz[a][b]=this.grafo.nodos[a-1];
					}
				}else{
					this.matriz[a][b]=(this.matriz[a][b]=="1")?"1":"0";
				}
			}
		}
	}
}

function mostrar(){
	let contenido="<tr>";
	for(let a=0; a<this.tam_matriz; a++){
		contenido+="<tr>";
		for(let b=0; b<this.tam_matriz; b++){
			contenido+=`<td id='${a},${b}'>${this.matriz[a][b].valor??this.matriz[a][b]}</td>`;
		}
		contenido+="</tr>";
	}
	contenido+="</tr>";
	document.getElementById('tabla').innerHTML=contenido;
}

function obtenerAsociacion(nodo){
	caja_asociacion.value=nodo.asociacion;
}

function obtenerDatos(nodo){
	this.content_datos.innerHTML="";
	//console.log(this.grafo.adyacentes(nodo));
	(this.grafo.adyacentes(nodo)??[]).forEach((arista)=>{
		let lista=document.createElement("li");
		let eliminar=document.createElement("button");
		let peso=document.createElement("input");
		peso.setAttribute("type","number");
		peso.setAttribute("class","caja");
		peso.value=arista.peso;
		peso.addEventListener("change",()=>{
			this.grafo.cambiarPeso(arista,peso.value);
			Almacenamiento.guardar(this.grafo);
		});
		eliminar.setAttribute("class","btn");
		eliminar.innerHTML="Eliminar";
		eliminar.addEventListener(("click"),()=>{
			this.grafo.eliminarArista(arista.fila,arista.columna,arista.peso);
			Almacenamiento.guardar(this.grafo);
			window.location.reload();
		});
		lista.innerHTML="[ "+arista.fila.valor+" {"+(arista.fila.asociacion??'')+"} ] [ "+arista.columna.valor+" {"+(arista.columna.asociacion??'')+"} ] Peso: ";
		lista.appendChild(peso);
		lista.append(eliminar);
		this.content_datos.appendChild(lista);
	});
}