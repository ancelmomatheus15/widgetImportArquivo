var HelloWorld = SuperWidget.extend({
    message: null,

    init: function () {
    	WCMAPI.loadJS("/webdesk/vcXMLRPC.js"); 
    },

    bindings: {
        local: {
    		'start-import': ['click_openFile']
        }
    },

    openFile: () => {

        const input = document.querySelector('#openFile')	//Carrega o arquivo CSV com os dados
        const reader = new FileReader()
        var csv = null

        reader.onload = () => {

            csv = reader.result
            
            .split('\n')            
            .filter(row => row) //Remove linhas vazias
            .slice(1) //Remove linha com os nomes das colunas
            .map(row => row.split(';'))
            
            validaInfo(csv); //Valida o arquivo recedo

        }

        reader.readAsText(input.files[0]);
    }
    
});

/*
 * Recebe o arquivo e valida seu conteudo
 * 1- Valida os centros de custo
 * 2- Valida os usuários
 * 3- Realiza a inserção no Dataset
 */
function validaInfo(csv){
	
	var contador = 0;
	
	var validaCC = validaCentroCusto(csv);		//Validação de Centro de Custo
	var validaUser = validaAprovador(csv);		//Validação de Usuários
	
	console.log("validaUser: " + validaUser);
	console.log("validaCC: " + validaCC);
	
	if(validaCC == true && validaUser == true){
	
	for(var i = 0; i < csv.length; i++){
		
		if(validaAmarracoes(csv[i]) == false){	//Caso o registro seja repetido, segue para o próximo
			
		
			var dados = [						//Registra os dados a serem gravados
		
			    {	
					"name": "centroCusto",
					"value": csv[i][0]	
				},	
				{	
			    	"name": "nomeAprovador",
		        	"value": csv[i][1]	
		        },	
				{	
					"name": "tipoProcesso",
					"value": csv[i][2]	
				},			
				{
					"name": "valorLimite",
					"value": csv[i][3]
				}
		
		        ];
				
				create("Registro", 248, 1000, true, dados);			//Cria registro (Descrição do registro, Codigo do form padrão, versão do form padrão, true, variavel com os dados)
				contador++;
		
		}else{
			alert("O registro " + csv[i] + "Já está cadastrado");
		}
	}
		
	}else if(validaCC == false){				//Aborta a operação caso sejam informados Centros de Custo repetidos
		alert("ERRO: Um ou mais centros de custo não foram encontrados");
		
	}else{										//Aborta a operação caso sejam informados Usuários repetidos
		alert("ERRO: Um ou mais aprovadores não foram encontrados");
		
	}
	
	alert("Fim da operação. " + contador + " registros incluídos");
	
}

function validaCentroCusto(csv){
		
	var ds_centroCusto = DatasetFactory.getDataset("ds_centroDeCusto", null, null, null);	//Busca o dataset de centro de custo
	var centros = null;
	var auxCentros = null;
	
	var contador = csv.length;
	
	var trues = 0;
	
	centros = ds_centroCusto.values;
	
	for(var i = 0; i < csv.length; i++){ //contagem na leitura CSV
		
		var auxTrues = trues;
		
		for(var j = 0; j < centros.length; j++){ //contagem no dataset centros de custo	
			
			auxCentros = ds_centroCusto.values[j];
			
			if(auxCentros.CCCod == csv[i][0]){
			
				trues++;	
			}
		}
		
		if(auxTrues == trues){
			console.log("Centro de Custo não encontrado: " + csv[i][0]);
		}
	}
	
	falses = contador - trues;
	
	console.log("Foram encontrados " + trues + " centros de custo correspondentes");
	console.log(falses + " centros de custo não foram localizados");
	
	if(trues == contador){
		
		console.log("Centros de Custo validados");
		return true;
		
	}else{
		
		console.log("Centros de Custo rejeitados");
		return false;
		
	}
	
}


function validaAprovador(csv){
	
	var colleague = DatasetFactory.getDataset("colleague", null, null, null); //Busca o dataset de usuários
	var aprovadores = null;
	var auxAprovadores = null;
	
	var contador = csv.length;
	
	var trues = 0;
	
	aprovadores = colleague.values;
	
	
	for(var i = 0; i < csv.length; i++){ //Contagem na leitura CSV
		
		var auxTrues = trues;
		
		for(var j = 0; j < aprovadores.length; j++){ //Contagem no dataset colleagues
			
			auxAprovadores = colleague.values[j];
			
			if(auxAprovadores["colleaguePK.colleagueId"] == csv[i][1]){
				
				trues++;	
				
			}
		}
		
		if(auxTrues == trues){
			console.log("Usuário não encontrado: " + csv[i][1]);
		}
			
	}
	
	falses = contador - trues;
	
	console.log("Foram encontrados " + trues + " usuarios correspondentes");
	console.log(falses + " usuarios não foram localizados");
	
	if(trues == contador){
		
		console.log("Aprovadores validados");
		
		return true;
		
	}else{
		
		console.log("Aprovadores rejeitados");
		return false;
		
	}
	
}

function validaAmarracoes(csv){
	
	var constr = new Array();
	
	var c1 = DatasetFactory.createConstraint("centroCusto", csv[0], csv[0], ConstraintType.MUST);
	var c2 = DatasetFactory.createConstraint("nomeAprovador", csv[1], csv[1], ConstraintType.MUST);
	var c3 = DatasetFactory.createConstraint("tipoProcesso", csv[2], csv[2], ConstraintType.MUST);
	var c4 = DatasetFactory.createConstraint("valorLimite", csv[3], csv[3], ConstraintType.MUST);
	
	constr.push(c1);
	constr.push(c2);
	constr.push(c3);
	constr.push(c4);
	
	var aprovXCC = DatasetFactory.getDataset("ds_aprovXCC", null, constr, null); //Busca o dataset de relação entre aprovador x Centro de Custo
	
	var amarracoes = aprovXCC.values;
	
	if(amarracoes.length == 0){
		
		return false;
	}else{
		
		console.log("Valor informado já existe no registro");
		return true;
	}
	
}


function create (documentDescription, parentDocumentId, version, inheritSecurity, formData){  //Faz um POST com a API para gravar o registro no dataset

	var that = this;

	var statusOk = false;

	var data = {

				"documentDescription": documentDescription,

				"parentDocumentId": parentDocumentId,

				"version": version,

				"inheritSecurity": inheritSecurity,

				"formData": formData

			   };
	
	console.log("Data: " + data);

		

	$.ajax({

		type: 'POST',

		async: false,

		dataType: 'json',

		contentType : 'application/json',

		data : JSON.stringify(data),

		url: '/api/public/2.0/cards/create',

		success: function (data, status, xhr) {

			console.log("Registro "+documentDescription+" criado com sucesso!");

			statusOk = true;

		},

		error: function(xhr, status, error) {

			console.log("Erro ao criar o registro "+documentDescription+"!");

		}

	});

	return statusOk;


}





























