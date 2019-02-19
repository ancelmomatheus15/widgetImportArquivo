function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {

	var dataset = DatasetBuilder.newDataset();
	
	dataset.addColumn("centroCusto");
	dataset.addColumn("nomeAprovador");
	dataset.addColumn("tipoProcesso");
	dataset.addColumn("valorLimite");
	
	return dataset;
	
}function onMobileSync(user) {

}