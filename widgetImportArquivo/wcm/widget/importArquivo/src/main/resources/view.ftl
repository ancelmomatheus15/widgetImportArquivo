<div id="HelloWorld_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide"
     data-params="HelloWorld.instance({message: 'Hello world'})">
    
    
    <h1>Importador de Arquivo</h1>
    	
    <div class="alert alert-info">
    	<p><b>Instruções</b> </br>
    	1- Selecionar o arquivo que contenha os centros de custo e seus respectivos aprovadores; </br>
    	2- Clicar em importar para dar início ao processo </br>
    	3- Aguardar a mensagem de confirmação que indica o fim do processo</p> </br>
    	
    	O arquivo a ser importado deve seguir o <a href="/importArquivo/resources/images/modelo.png" target="_blank" style="font-weight:bold">padrão de formatação</a>
    </div>
    </br>
    <div>
    	<div>
    		<label for="openFile"><b>Selecionar Arquivo: </b></label></br>
    		<input type="file" name="openFile" id="openFile" class="form-control" accept=".xlsx, .xlsm, .xls, .csv" />
    	</div></br>
    	
    	<div>
    		<button type="button" class="btn btn-default" data-start-import>Extrair</button>
    	</div>

    </div>

</div>
