<!-- #include file="../Common.asp" -->
<%
(function(){
	if(!ebx.stdin['findid']){ 
		ebx.stdout = {result:0};
		return;
	}

	var id = ebx.validInt(ebx.stdin['findid']);
	
	if(id == 0){
		ebx.stdout = {result:0};
		return;
	}
	var	data = {total:0, rows:[]},
		sql = ebx.getTemplateSQL(ebx.validInt(10002)),
		rsBD = ebx.dbx.open(sql, 1, 1),
		sqllist = ebx.getTemplateSQL(ebx.validInt(10003)),
		rsBDlist = ebx.dbx.open(sqllist, 1, 1);
		
	if(rsBD.eof || rsBDlist.eof){
		ebx.stdout = {result:0};
		return;
	}	
	
	ebx.print.init(id)
	
	ebx.stdout['result'] = 1;//成功标记
	ebx.stdout['head'] = ebx.print.bd(rsBD, 'SaleOutStockPrinthead');//获取表头对象，利用显示式样格式化内容
	ebx.stdout['title'] = ebx.print.headerStyle;//获取单据标题，必须在ebx.print.bd后获取
	ebx.stdout['headtext'] = ebx.print.footerStyle;//获取显示式样里的表头（表尾式样），必须在ebx.print.bd后获取
	ebx.stdout['headwidth'] = ebx.validInt(ebx.print.headwidth, 100);//表头宽度，数字会在客户端被转换成百分数，默认100%，必须在ebx.print.bd
	ebx.stdout['headheight'] = ebx.validInt(ebx.print.headheight, 0);//表头距离上边距的距离像素值，默认0，必须在ebx.print.bd
	
	ebx.stdout['foot'] = ebx.print.bd(rsBD, 'SaleOutStockPrintfoot');//获取表尾对象，利用显示式样格式化内容
	ebx.stdout['foottext'] = ebx.print.headerStyle + '<br>' + ebx.print.footerStyle;//获取显示式样里的表尾（表头式样 + 表尾式样）
	ebx.stdout['footwidth'] = ebx.validInt(ebx.print.footwidth, 100);//表尾宽度，数字会在客户端被转换成百分数，默认100%，必须在ebx.print.bd
	
	ebx.stdout['liststyle'] = ebx.print.liststyle('SaleOutStockPrintList');//获取list的显示式样
	ebx.stdout['border'] = ebx.validInt(ebx.print.border, 1);//list边框，必须在ebx.print.liststyle后获取
	ebx.stdout['header'] = ebx.validInt(ebx.print.header, 1);//是否显示list表头，必须在ebx.print.liststyle后获取
	ebx.stdout['footer'] = ebx.validInt(ebx.print.footer, 1);//是否显示合计表尾，必须在ebx.print.liststyle后获取
	ebx.stdout['listwidth'] = ebx.validInt(ebx.print.listwidth, 100);//表格宽度，数字会在客户端被转换成百分数，默认100%，必须在ebx.print.liststyle后获取
	
	ebx.stdout['bdlist'] = rsBDlist;//list对象
	
	ebx.stdout['color'] = ebx.print.getColor();
	ebx.stdout['size'] = ebx.print.getSize();

})();
%>