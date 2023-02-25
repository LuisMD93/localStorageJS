$(document).ready(function(){
           
    loadData();
    loadDataToSell();
    Vendidos();
    $("#btn-sale").hide();
    $("#btn-modificar").hide();
    

      /**#####################################*/
   
     /**######################################## */
   

    $("#bnt-Almacenar").click(function(e){
        e.preventDefault();

        var nom_producto = $("#nomp").val();
        var describe = $("#desc").val();
        var precio_p = $("#precio").val();
        var cant_disponible = $("#cant").val();

        var obtener_codigo = new Date();
        var cod = obtener_codigo.getFullYear()+obtener_codigo.getMonth()+obtener_codigo.getDate()+obtener_codigo.getMinutes()+obtener_codigo.getSeconds();

        let producto = {

            'Nombre_producto':nom_producto,
            'Descripcion_producto':describe,
            'Precio_producto':precio_p,
            'Cantidad_producto':cant_disponible,
            'Codigo':cod

        }       

     if(nom_producto!=""  || describe!=" " || precio_p!=" " || cant_disponible!=" "){ 
     
      if(validar(nom_producto)==3  || validar(nom_producto)==0){

        let productos=[];
      
      if(localStorage.getItem('productos')){  

        productos =JSON.parse(localStorage.getItem('productos'));//para no sobre escribir los datos se valida que tenga algo
                                                               // y  pasa a un array y vuele y se agregan  
      }
        productos.push(producto);
        localStorage.setItem('productos',JSON.stringify(productos));
        loadDataToSell();
        loadData();
        $("#formulario")[0].reset();
       

      }else{
        alertify.error("Ya existe en la bd :´)");
      }   
    
    }else{
      alertify.alert("Por favor llenar todos los cmapos");
     }
 
      
    });

   
    $("#btn-sale").click(function(e){
        e.preventDefault();
        $("#btn-sale").hide();
        
        var nombrp = $("#nombrep").val();
        var valor = $("#precio").val();
        var _rps=$("#descontar").val();

        let vender=0;
        let posicion=0;
        let productos=[];
        let descuento=0;

        let Ventas = {

            'Nombre_producto':nombrp,
            'Precio_producto':valor
        }  

        let to_sell=[];
        
        if(localStorage.getItem('Ventas')){  

          to_sell =JSON.parse(localStorage.getItem('Ventas'));
        }
          
        /******************************************************* */
        to_sell.push(Ventas);
        localStorage.setItem('Ventas',JSON.stringify(to_sell)); 
        

        if(localStorage.getItem('productos')!=null){ 
    
         productos =JSON.parse(localStorage.getItem('productos'));     

           productos.forEach(producto => {     
           
              if( producto.Nombre_producto==nombrp &&  producto.Cantidad_producto>0 ){   

                  vender = producto.Cantidad_producto
                  producto.Cantidad_producto=0
                  producto.Cantidad_producto=vender-1 
                 
              }

           posicion++;      
            
          });
              localStorage.setItem('productos',JSON.stringify(productos));

             if(_rps=="si"){
              
                descuento = ((10)/100)*valor ;
                document.getElementById("descuento").innerHTML ="Con descuento total a pagar: "+descuento;  //MOSTRAR DESCUENTO EN ALGUNA ETIQUETA

              }else{
                document.getElementById("descuento").innerHTML ="";
              }

             
              loadDataToSell();
              Vendidos();

          }
      }); 
     
      $("#btn-modificar").click(function(e){
        e.preventDefault();
    
        let dni = $("#dni").val();
        
        productos =JSON.parse(localStorage.getItem('productos'));
        productos[dni]["Nombre_producto"]= $("#nomp").val();
        productos[dni]["Descripcion_producto"]=$("#desc").val();
        productos[dni]["Precio_producto"]=$("#precio").val();
        productos[dni]["Cantidad_producto"]=$("#cant").val();

            
        localStorage.setItem('productos',JSON.stringify(productos));
        $("#formulario")[0].reset();
       loadData();
    });

   
   /*****/      
    });
   /*****/      

    /**############################################################ */
    $(document).on('click','.btn-Borrar',function(){

    
       alertify.confirm('Eliminar datos', '¿Seguro que deseas eliminar?', function(){ 
         
        let codigo = $(this).attr('id');
        var dato;
        productos =JSON.parse(localStorage.getItem('productos'));
        dato= productos.splice(codigo,1);
        localStorage.setItem('productos',JSON.stringify(productos));
        loadData();
        console.log(dato);
        alertify.success('Ok') 
      }
        , function(){
         
         	alertify.error('Cancel')
       
       });
       
    

    });


    $(document).on('click','.btn-elegido',function(){

          var buscarcodigo = $(this).attr('id');  
          let posicion=0; 
          var dato;

       $("#bnt-Almacenar").hide();
       $("#btn-modificar").show();

      productos =JSON.parse(localStorage.getItem('productos'));
   
        $("#nomp").val(productos[buscarcodigo].Nombre_producto)
        $("#desc").val(productos[buscarcodigo].Descripcion_producto)
        $("#precio").val(productos[buscarcodigo].Precio_producto)
        $("#cant").val(productos[buscarcodigo].Cantidad_producto)
        $("#dni").val(buscarcodigo)

 
          
     });

    
    $(document).on('click','.btn-escoger',function(){

       let codigo = $(this).attr('id');
       productos =JSON.parse(localStorage.getItem('productos'));
       $("#nombrep").val(productos[codigo].Nombre_producto);
       $("#precio").val(productos[codigo].Precio_producto);
       $("#btn-sale").show();

    });
    /**############################################################ */ 

      function loadData(){

         $("#_producto").empty();
         let productos=[];
         let posicion=0;  
         var dni=0;
     
              if(localStorage.getItem('productos')){  
              productos =JSON.parse(localStorage.getItem('productos'));
  
              productos.forEach(producto => {

                if(producto.Cantidad_producto!=0){
        
                       dni=producto.Codigo
                  $("#_producto").append(`
           
                <li>
                    <div class="presentacion">               
                       <b>${producto.Nombre_producto}</b>
                       <b>${producto.Descripcion_producto}</b>
                       <b>${producto.Precio_producto}</b>
                       <b>${producto.Cantidad_producto}</b>
                       <b>${producto.Codigo}</b>
                       
                      <button class="btn-Borrar" id="${posicion}">Delete</button> 
                      <button class="btn-elegido" id="${posicion}">Seleccionar</button> 
                    </div>
                </li>`);

                }
                posicion++;
     }); 


    }
      }

      function loadDataToSell(){

       $("#select_producto").empty();
         let productos=[];
         let posicion=0;  

       if(localStorage.getItem('productos')){  
       productos =JSON.parse(localStorage.getItem('productos'));

       productos.forEach(producto => {

         if(producto.Cantidad_producto!=0){
 
           $("#select_producto").append(`
    
         <li>
             <div class="presentacion">               
                <p>Nombre: ${producto.Nombre_producto}</p>
                <p>Descripcion: ${producto.Descripcion_producto}</p>
                <p>Valor: ${producto.Precio_producto}</p>
                <p>Cantida: ${producto.Cantidad_producto}</p>
               <button class="btn-escoger" id="${posicion}">Seleccionar</button>     
             </div>
         </li>`);

            }
             posicion++;


        });      

            }
       }/***/

      function validar(nombre){

        var confirmar= 0;
        let posicion=0;

        if(localStorage.getItem('productos')!=null){ 

        productos =JSON.parse(localStorage.getItem('productos'));
        productos.forEach(producto => {     
           
          if( producto.Nombre_producto.toLowerCase() ==nombre.toLowerCase() ){   

              
             confirmar= 2;
          }

           posicion++;      
       
        });

      }else{

        confirmar= 3;
      }

        
        
    
        return confirmar;
      }/***/
    
      function Vendidos(){
 
        $("#_vendidos").empty();
        let to_sell=[];
        let posicion=0;  

      if(localStorage.getItem('Ventas')){  

        to_sell =JSON.parse(localStorage.getItem('Ventas'));

         to_sell.forEach(Ventas => {


          $("#_vendidos").append(`
   
        <li>
               <div class="present">               
                  <p>Nombre: ${Ventas.Nombre_producto}</p>
                   <p>Precio: ${Ventas.Precio_producto}</p>             
               </div>
        </li>`);
            

        posicion++;
       });      

           }             
      }/***/

     