<!--# include virtual="server/public.asp" -->
<%
(function(){
	if(!ebx.stdin['id'] || !ebx.stdin['bd']){
		ebx.stdout['result'] = 0;
		ebx.stdout['msg'] = '�ύ����Ϣ��������'; 
		return
	};
	var id = ebx.validInt(ebx.stdin['id']),
		bd = ebx.convertJsonToRs(eval('(' + ebx.stdin['bd'] + ')')),
		amount = 0,
		sql = 'select amount from bdoutstock where id=' + id,
		rs = ebx.dbx.open(sql, 1, 1);

	if(eval('(' + ebx.stdin['bd'] + ')').total == 0){
		ebx.stdout['result'] = 0;
		ebx.stdout['msg'] = 'û���տʽ���ݡ�'; 
		return
	}
	if(rs.eof || bd.eof){
		ebx.stdout['result'] = 0;
		ebx.stdout['msg'] = '�ύ����Ϣ�������򵥾ݲ����ڡ�'; 
		return
	}
	
	bd.MoveFirst();
	while(!bd.eof){
		amount += ebx.validFloat(bd('amount').value);
		bd.MoveNext();
	}
	if(amount != rs('amount').value){
		ebx.stdout['result'] = 0;
		ebx.stdout['msg'] = '�ύ���տʽ�ܽ���뵥�ݽ�����<br>�ύ�ܽ�' + amount + '�����ݽ�' + rs('amount').value; 
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
	
	ebx.stdout['result'] = 1;
})();
%>