<!--# include virtual="server/public.asp" -->
<%
(function(){
	if(!ebx.stdin['template']) return([]);

	var page = {//iStart����ʼ������iLength��ÿҳ������iTotalLength�����������ص��ã�
			iStart: ebx.validInt(ebx.stdin['page']>1?((ebx.stdin['page'] - 1) * ebx.stdin['rows']) + 1: 1), 
			iLength: ebx.validInt(ebx.stdin['rows']), 
			iTotalLength: 0
		};

	var data = new Array();
	if(ebx.validInt(ebx.stdin['exportdata'], 0) == 0){
		var rs = ebx.dbx.openpage(ebx.getTemplateSQL(ebx.validInt(ebx.stdin['template'])), page);//��ҳ��ѯ���
		data["total"] = page.iTotalLength;
		data["rows"] = eval('('+ebx.convertRsToJson(rs, 1)+')');//Ϊ�˷�ҳ�ṩ�����������Դ���������ֻ����rows����
		data["footer"] = [{}];
		ebx.stdout = data;
	}else{
		var rs = ebx.dbx.open(ebx.getTemplateSQL(ebx.validInt(ebx.stdin['template'])), 1, 1);//ȫ����������䣬����exportdata=1
		ebx.stdout = rs;
	}
})();
%>