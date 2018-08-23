<!-- #include file="../Common.asp" -->
<%
(function(){
	if(!ebx.stdin['id'] || !ebx.stdin['invoicetype']){
		ebx.stdout = {result:0, msg: '参数不足'};
		return;
	}
	var id = ebx.validInt(ebx.stdin['id']),
		invoicetype = ebx.validInt(ebx.stdin['invoicetype']),
		invoicememo = ebx.sqlStringEncode(ebx.stdin['invoicememo']),
		invoicenum = ebx.sqlStringEncode(ebx.stdin['invoicenum']);
	
	if(id == 0){
		ebx.stdout = {result:0, msg: '参数不足'};
		return;
	}
	
	ebx.conn.begintrans
	try{
		set();
		ebx.conn.commitTrans;
		ebx.stdout['result'] = 1;
		ebx.stdout['id'] = this.ID;
	}catch(e){
		ebx.conn.RollbackTrans;
		ebx.stdout['result'] = 0;
		ebx.stdout['msg'] = e;
	}
	
	function set(){
		var sql = 'select InvoiceType,InvoiceNum,InvoiceMemo from bdOutStock where id=' + id,
			rs = ebx.dbx.open(sql);
		if(!rs.eof){
			rs('InvoiceType') = invoicetype;
			rs('InvoiceNum') = invoicenum;
			rs('InvoiceMemo') = invoicememo;
			rs.update();
		}else{
			throw '单据不存在'
		}
	}
})();
%>