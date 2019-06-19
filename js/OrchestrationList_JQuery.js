///<reference path="../typings/globals/jquery/index.d.ts" />
let tags;
let def;
let data1;

const app = $("div#root");
$(app).append("<div class='container'></div>");
const container = $("div.container");

$(window).ready(function(){
    $("input#user").attr('value','demo');
    $("input#password").attr('value','demo');
    $("input#server").attr('value','http://demo.steltix.com');



});

$(document).on('click', '.LinkAbrirModal', function(){

    CarregarModal(this.id);
    
 });

$("div#logo_site").append("<img src='images/logo_transparent.png'>");

function authenticateUser(user, password)
{
    var token = user + ":" + password;
    // Should i be encoding this value????? does it matter???
    // Base64 Encoding -> btoa
    var hash = btoa(token); 
    return "Basic " + hash;
}

function GetOrchDescription(Objeto, OrchName){
    var tag = (Objeto.tags);
    var desc;
     for (i=0; i < tag.length; i++){
        if (tag[i].name == OrchName){
            desc = tag[i].description;
            break;
        }

    };
    return desc;

}

function CarregarModal(OrchObj){
    var detalheOrch;
    var parametros;
    var orchName;


    //Pega as informações de uma orchestração

    detalheOrch = def[OrchObj];
    orchName = detalheOrch.xml.name;
    var desc = GetOrchDescription(data1, orchName);

    //Titulo Modal
    $('#ModalScrollableTitle').html(OrchObj + ': ' + orchName);

    //Mostrar detalhes da Orquestração em um textarea
   $("#modal-desc").html(desc);

   //Limpar o form
    $('.form-group-modal').empty();

    //Acessa as propriedades da orquestração e as lista
    parametros = (Object.keys(detalheOrch.properties));
    for (var j in parametros) {
        if (parametros.hasOwnProperty(j)) {

            //Criar os parâmetros
            $('.form-group-modal').append('<label for="' + parametros[j] + '">' + parametros[j] + '</label>');
            $('.form-group-modal').append('<input type="text" class="form-control" id="' + parametros[j] + '" aria-describedby="Informar Parâmetro" placeholder="' + parametros[j] + '"></input>');
        }
    }

}

function CallDiscover() {
    // New XMLHTTPRequest
    var request = new XMLHttpRequest();
    request.open("GET", $("input#server").val() + "/jderest/v2/open-api-catalog", true);
    request.setRequestHeader("Authorization", authenticateUser($("input#user").val(), $("input#password").val()));  
    request.onload = function() {

        if (request.status === 200) {
            $("#alerta").attr("class","alert alert-success").html("OK").fadeOut(2000);
            
            //response.innerHTML = request.responseText;
            data1 = JSON.parse(request.response);
            var dataValues = Object.values(data1);
            def = dataValues[7];
            var defKeys = (Object.keys(def));
            var name1;
            var orchName = [];

            for (var i=0; i<defKeys.length; i++){
                //Verificar se é são os parâmetros de saída
                var temp = defKeys[i].substring((defKeys[i].length - 6),defKeys[i].length);
                var temp2 = defKeys[i].substring(0,3);
                if (temp != 'Output' & temp2 == 'ORC'){
                    //Pega as informações de uma orchestração
                    name1 = def[defKeys[i]];
                    orchName[i] = name1.xml.name;
                    var desc = GetOrchDescription(data1, orchName[i]);
                    
                    $(container).append('<div class="card LinkAbrirModal ponteiro" data-toggle="modal" data-target="#ModalScrollable" id="' + defKeys[i] +'"></div>');
                    $("div#"+defKeys[i]).append('<h1>'+defKeys[i] +'</h1>');
                    $("div#"+defKeys[i]).append('<h7>'+orchName[i] +'</h7>');
                    $("div#"+defKeys[i]).append('<p>'+desc+'</p>');

                }    
            }
            
                   
        } else {
            //$("#resultado").html("Erro na consulta :(");
            $("#alerta").attr("class","alert alert-danger").html("Erro na consulta :(").fadeIn(1000).fadeOut(6000);
            //apagar o conteúdo que existia
            $(container).empty();
        }
    };

    $("#alerta").attr("class","alert alert-secondary").html("Acessando JDE").fadeIn(500);
    request.send();

    

}



$(document).on('click', '#CallOrchestration', function(){
    // Criar o objeto de acordo com os campos do modal
    CriarObjeto();
    // Chamar a orquestração.
    //CallOrchestration();
    
 });

function CriarObjeto(){
    var orchestration = new Object();
    //Percorrer os inputs dentro da div: .form-group-modal

    $('.form-group-modal input').each(function(){
        var param = $(this).attr("id");
        var valor = $(this).val();
        var obj = {[param]:valor};
        
        Object.defineProperty(orchestration,'key',obj);

        
    });
    

}

function CallOrchestration(objeto, orchName){
    // New XMLHTTPRequest
    var request = new XMLHttpRequest();
    request.open("POST", $("input#server").val() + "/jderest/v2/orchestrator/" + orchName, true);
    request.setRequestHeader("Authorization", authenticateUser($("input#user").val(), $("input#password").val()));  
    request.onload = function() {
        if (request.status === 200) {
            $("#alerta-orch").attr("class","alert alert-success").html("OK").fadeOut(2000);
            resultOrch = JSON.parse(request.response);
            
        }else {
            //$("#resultado").html("Erro na consulta :(");
            $("#alerta-orch").attr("class","alert alert-danger").html("Erro na consulta :(").fadeIn(1000).fadeOut(6000);
            //apagar o conteúdo que existia
            $(resultado-orch).empty();
        }
    };
    
    $("#alerta-orch").attr("class","alert alert-secondary").html("Executando...").fadeIn(500);
    request.send(objeto);

}


    




