<!-- #include file="../Common.asp" -->
<!-- #include virtual="/server/print.asp" -->
<%
(function(){
	ebx.print.printing({
		rsBDTemplate: 10002,//表头查询模板
		rsBDListTemplate: 10003,//明细查询模板
		rsBDHeadStyle: 'SaleOutStockPrinthead',//表头显示式样
		rsBDFootStyle: 'SaleOutStockPrintfoot',//表尾显示式样
		rsBDListStyle: 'SaleOutStockPrintList'//明细显示式样
	});
})();
%>