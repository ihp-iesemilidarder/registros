window.onload=function(){
    //mobile responsive
    if (window.matchMedia("(max-width:600px)").matches) {
        document.getElementById("sublist").classList.remove("mr-3");
    }

    //variables globales
    var players=[];
    var values=[];

    function check_DNI(code){
        /*
            fuente:https://asepyme.com/diferencias-entre-cif-nif-dni/#Formato_del_NIF
            DNI: 8 números + letra
            NIF L: L+7 numeros+ letra (mayores de 14 años)
            NIF M: M+7 numeros+ letra (extranjeros sin NIE)
            NIE X: X+7 numeros+ letra (extranjeros residentes en España)
            NIE Y: Y+7 numeros+ letra (extranjeros residentes en España)
            NIE Z: Z+7 numeros+ letra (extranjeros identificados por la Policia)
        */
        if (code.match(/^[0-9]{8}[A-Za-z]{1}$/)!=null || code.match(/^(\l|\L|\m|\M|\x|\X|\y|\Y|\z|\Z){1}[0-9]{7}[A-Za-z]{1}$/)!=null) {
            return true;
        }
        return false;
    }

    function check_date(date){
        if (date.match(/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/)!=null || date.match(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/)!=null) {
            return true;
        }
        return false;
    }

    function check_email(email){
        if (email.match(/^([A-Za-z]+)\@([A-Za-z]+)\.([A-Za-z]+)$/)==null) {
            return false;
        }
        return true;
    }

    function check_tel(tlf){
        if (tlf.match(/^[0-9]+$/)!=null || tlf.match(/^\+[0-9]+$/)!=null) {
            return true;
        }
        return false;
    }
    function check_compte(compte){
        if (compte.match(/^[0-9]{4}(\-| )[0-9]{4}(\-| )[0-9]{4}(\-| )[0-9]{4}$/)==null) {
            return false;
        }
        return true;
    }
    function check_empty(label){
        if(label=="" || label=="no-selected"){
            return false;
        }
        return true;
    }
    function add_check(cls,id){
        let boolean;
        if(cls=="is-valid"){
            id.classList.remove("is-invalid");
            boolean=true;
        }else{
            id.classList.remove("is-valid");
            boolean=false;
        }
        id.classList.add(cls);
        id.setAttribute("data-check",boolean);
    }
    function show_alert(type,text,ev){
        if(type=="alert-danger"){
            document.getElementById("alert").classList.remove("alert-success");
        }else{
            document.getElementById("alert").classList.remove("alert-danger");
        }
        document.getElementById("alert").classList.add(type);
        document.getElementById("alert").innerHTML=text;
        document.getElementById("alert").style.display=ev;
    }
    function add_player(list_values,id, select){
        document.getElementById(id).innerHTML+=`
        <div class="row my-3">
            <div class="container card-player">
                <i class="fas fa-times-circle close-player" onclick="this.parentNode.parentNode.remove();"></i>
                <div class="col-sm px-1 ml-2">
                    <p>${list_values[1]+" "+list_values[2]}</p>
                    <p>${list_values[5]}</p>
                    <p>${list_values[7]}</p>
                </div>
            </div>
        </div>
        `;
        players.push(values);
    }

    /*¿Porque si no especificas el tipo de variables var/let no 
    funciona?*/
    const ids=[
        ["DNI","keyup","check_DNI"],
        ["naixement","change","check_date"],
        ["email","keyup","check_email"],
        ["telefono","keyup","check_tel"],
        ["compte","keyup","check_compte"],
        ["Nom","keyup","check_empty"],
        ["llinatges","keyup","check_empty"],
        ["Tjugador","change","check_empty"]
    ];

    //cada cada campo abrá un listener que hara la funcion especifica
    for(x=0; x<=ids.length-1;x++){
        let id=ids[x];
        document.getElementById(id[0]).addEventListener(id[1],function(){
            if (eval(id[2])(this.value)==true) {
                add_check("is-valid",this);
            }else{
                add_check("is-invalid",this);
            }
        });
    }
    /*Cuando se de click en "Afegir jugador"*/
    document.getElementById("add_player").addEventListener("click",function(){
        edad=parseInt(new Date().getFullYear())-parseInt(document.getElementById("naixement").value.split("-")[0]);
        console.log(edad);

        /*Si los campos tienen valores vacios, entonces se le añade la clase "is-invalid" con el atributo data-check
        con valor 'false'*/
        list_input=document.getElementsByClassName("form-control");
        for(y=0;y<=list_input.length-1;y++){
            if(list_input[y].value=="" || list_input[y].value=="no-selected"){
                add_check("is-invalid",document.getElementById(list_input[y].id));
            }
        }

        //Dependiendo de la edad, se seleccionará un option u otro
        if(edad>=16 && edad<18){
            document.getElementById("Tjugador").value="BEG";
            add_check("is-valid",document.getElementById("Tjugador"));
        }else if(edad>=18){
            document.getElementById("Tjugador").value="PRO";
            add_check("is-valid",document.getElementById("Tjugador"));
        }else{
            document.getElementById("Tjugador").value="no-selected";
            add_check("is-invalid",document.getElementById("Tjugador"));
        }
    
        inputs=document.getElementsByClassName("form-control");
        let check=true;
        for(i=0;i<=inputs.length-1;i++){
            if(inputs[i].getAttribute("data-check")=="false"){
                check=false;
            }
        }
        if(check==false){
            show_alert("alert-danger","Debes de rellenar todos los campos","block");
            return false;
        }else{
            show_alert("alert-success","Formulario enviado correctamente","block");
        }
        let inputs_checked=document.getElementsByClassName("form-control");
        let select;
        for(y=0;y<=inputs_checked.length-1;y++){
            if(inputs_checked[y].id=="Tjugador"){
                select=inputs_checked[y].value;
            }
            values.push(inputs_checked[y].value);
        }
        let duplicado;
        /*bucle para comprobar si el array values existe en array players*/
        for(z=0;z<=players.length-1;z++){
            //para cada subarray....
            for(subarray=0;subarray<=players[z].length-1;subarray++){
                if(values[subarray]==players[z][subarray]){
                    duplicado=true;
                    console.log(players[z][subarray],values[subarray]);
                }else{
                    duplicado=false;
                    break; 
                }
                console.log("--------------------------------------------------------------");
            }
        }
        //console.log("players: "+players+"\n values"+values+"\n duplicado: "+duplicado);
        add_player(values,"add_player_"+select, select);
        players.push(values);
    });
}