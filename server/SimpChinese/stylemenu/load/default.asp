<!-- #include file="../Common.asp" -->
<%
(function(){
	var id = ebx.validInt(ebx.stdIn["id"]),
		sql = "select a.MenuModule,a.isDeleted,a.updatedate,a.createdate,u.title as owner from bdStyleMenu a left join biuser u on a.owner=u.id where a.id=" + id,
		rs,
		data = [],
		title = "", isDeleted = 0, updatedate = new Date(), createdate = new Date(), owner = "";
	if(id > 0){
		rs = ebx.dbx.open(sql, 1, 1)
		if(!rs.eof){
			title = rs("MenuModule").value;
			isDeleted = rs("isDeleted").value;
			updatedate = rs("updatedate").value;
			createdate = rs("createdate").value;
			owner = rs("owner").value
		}
	}
	data = {total:5,rows:[
		{name:"ɾ��",value:isDeleted,group:"ϵͳ����",field:"",render:"boolRender",func:"",rowstyle:"color:#999;",fieldstyle:"color:#f00;"},
		{name:"����ʱ��",value:new Date(createdate).Format("yyyy-MM-dd hh:mm:ss"),group:"ϵͳ����",rowstyle:"color:#999;"},
		{name:"����ʱ��",value: new Date(updatedate).Format("yyyy-MM-dd hh:mm:ss"),group:"ϵͳ����",rowstyle:"color:#999;"},
		{name:"����Ա",value:owner,group:"ϵͳ����",rowstyle:"color:#999;"},
		{name:"ģ������",value:title,group:"������Ϣ",editor:{type:"validatebox", options:{required:true,validType:"LetterInteger"}},field:"MenuModule"},//validateboxУ��¼��ֵ�Ϸ��Ե�֧�ַ���
	]};
	ebx.stdOut = data;
})();
%>