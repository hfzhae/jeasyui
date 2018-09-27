<!-- #include file="../Common.asp" -->
<%
(function(){
	if(!ebx.stdIn['id'] || !ebx.stdIn['invoicetype']){
		ebx.stdOut = {result:0, msg: '参数不足'};
		return;
	}
	var id = ebx.validInt(ebx.stdIn['id']),
		invoicetype = ebx.validInt(ebx.stdIn['invoicetype']),
		invoicememo = ebx.sqlStringEncode(ebx.stdIn['invoicememo']),
		invoicenum = ebx.sqlStringEncode(ebx.stdIn['invoicenum']);
	
	if(id == 0){
		ebx.stdOut = {result:0, msg: '参数不足'};
		return;
	}
	
	ebx.conn.begintrans
	try{
		set();
		ebx.conn.commitTrans;
		ebx.stdOut['result'] = 1;
		ebx.stdOut['id'] = this.ID;
	}catch(e){
		ebx.conn.RollbackTrans;
		ebx.stdOut['result'] = 0;
		ebx.stdOut['msg'] = e;
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