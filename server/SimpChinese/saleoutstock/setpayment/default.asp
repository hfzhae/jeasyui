<!--# include virtual="server/public.asp" -->
<%
(function(){
	if(!ebx.stdIn['id'] || !ebx.stdIn['bd']){
		ebx.stdOut['result'] = 0;
		ebx.stdOut['msg'] = '提交的信息不完整。'; 
		return
	};
	var id = ebx.validInt(ebx.stdIn['id']),
		bd = ebx.convertJsonToRs(eval('(' + ebx.stdIn['bd'] + ')')),
		amount = 0,
		sql = 'select amount from bdoutstock where id=' + id,
		rs = ebx.dbx.open(sql, 1, 1);

	if(eval('(' + ebx.stdIn['bd'] + ')').total == 0){
		ebx.stdOut['result'] = 0;
		ebx.stdOut['msg'] = '没有收款方式内容。'; 
		return
	}
	if(rs.eof || bd.eof){
		ebx.stdOut['result'] = 0;
		ebx.stdOut['msg'] = '提交的信息不完整或单据不存在。'; 
		return
	}
	
	bd.MoveFirst();
	while(!bd.eof){
		amount += ebx.validFloat(bd('amount').value);
		bd.MoveNext();
	}
	if(amount != rs('amount').value){
		ebx.stdOut['result'] = 0;
		ebx.stdOut['msg'] = '提交的收款方式总金额与单据金额不符。<br>提交总金额：' + amount + '，单据金额：' + rs('amount').value; 
		return
	}
	bd.MoveFirst();
	
	ebx.conn.execute('delete bdOutStockPayment where id=' + id);
	sql = 'select * from bdOutStockPayment where 1=2';
	rs = ebx.dbx.open(sql);
	
	while(!bd.eof){
		if(ebx.validFloat(bd('amount').value) != 0){
			rs.AddNew();
			rs('id') = id;
			rs('payment') = bd('payment').value;
			rs('amount') = bd('amount').value;
		}
		bd.MoveNext();
	}
	rs.Update();
	
	ebx.stdOut['result'] = 1;
})();
%>