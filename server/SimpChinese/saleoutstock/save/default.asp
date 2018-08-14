<!-- #include file="../Common.asp" -->
<%
(function(){
	ebx.saveBD.init(TableName, ModType, IGID);
	ebx.saveBD.save(function(rsBD, rsBDList){
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