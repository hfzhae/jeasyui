<!--# include virtual="server/public.asp" -->
<%
(function(){
	if(!ebx.stdIn['template']){
		ebx.stdOut = {"total": 0, "rows": []}; 
		return
	};

	var page = {//iStart����ʼ������iLength��ÿҳ������iTotalLength�����������ص��ã�
			iStart: ebx.validInt(ebx.stdIn['page']>1?((ebx.stdIn['page'] - 1) * ebx.stdIn['rows']) + 1: 1), 
			iLength: ebx.validInt(ebx.stdIn['rows']), 
			iTotalLength: 0
		};

	var data = {"total": 0, "rows": []}//new Array();
	if(ebx.validInt(ebx.stdIn['exportdata'], 0) == 0){
		var rs = ebx.dbx.openPage(ebx.getTemplateSQL(ebx.validInt(ebx.stdIn['template'])), page);//��ҳ��ѯ���
		data["total"] = page.iTotalLength;
		data["rows"] = eval('('+ebx.convertRsToJson(rs, 1)+')');//Ϊ�˷�ҳ�ṩ�����������Դ���������ֻ����rows����
		data["footer"] = [{}];
		ebx.stdOut = data;
	}else{
		var rs = ebx.dbx.open(ebx.getTemplateSQL(ebx.validInt(ebx.stdIn['template'])), 1, 1);//ȫ����������䣬����exportdata=1
		ebx.stdOut = rs;
	}
})();
%>