<!-- #include file="../Common.asp" -->
<!-- #include virtual="/server/savebd.asp" -->
<%
(function(){
	ebx.savebd.init(TableName, ModType, IGID);
	ebx.savebd.save(function(rsBD, rsBDList){
		if(ebx.validInt(rsBD('auditid').value) > 0){
			throw 'µ¥¾ÝÒÑÉóºË£¡'
		}
	},function(rsBD, rsBDList){
		var amount = 0
		rsBDList.MoveFirst();
		while(!rsBDList.eof){
			amount += ebx.validFloat(rsBDList('amount').value);
			rsBDList.MoveNext();
		}
		rsBD('amount') = amount;
		rsBD('billtitle') = rsBD('id').value;
	});
})();
%>