<!-- #include file="../Common.asp" -->
<%
(function(){
//debugger;
	var id = ebx.validInt(ebx.stdin["id"]),
		sql = "select a.code,a.title,a.isdeleted,a.updatedate,a.createdate,u.title as owner,a.relation,a.baseid from " + TableName + " a,biuser u where a.owner=u.id and a.id=" + id,
		rs,
		data = [],
		code = "", title = "", isdeleted = 0, updatedate = new Date(), createdate = new Date(), owner = "",relation=0,baseid=0;
	
	
	if(id > 0){
		rs = ebx.dbx.open(sql, 1, 1);
		if(!rs.eof){
			code = rs("code").value;
			title = rs("title").value;
			isdeleted = rs("isdeleted").value;
			updatedate = rs("updatedate").value;
			createdate = rs("createdate").value;
			owner = rs("owner").value;
			relation=rs("relation").value;
			baseid=rs("baseid").value;
		}
	}

	data = {"total":9,"rows":[
		{"name":"ɾ��","value":isdeleted,"group":"ϵͳ����","field":"_isdeleted","render":"boolRender","rowstyle":"color:#999;","fieldstyle":"color:#f00;","func":""},
		{"name":"����ʱ��","value": new Date(createdate).Format("yyyy-MM-dd hh:mm:ss"),"group":"ϵͳ����","rowstyle":"color:#999;"},
		{"name":"����ʱ��","value": new Date(updatedate).Format("yyyy-MM-dd hh:mm:ss"),"group":"ϵͳ����","rowstyle":"color:#999;"},
		{"name":"����Ա","value":owner,"group":"ϵͳ����","rowstyle":"color:#999;"},
		{"name":"���","value":code,"group":"������Ϣ","editor":{"type":"validatebox", "options":{"required":true,"validType":"String"}},"field":"code","func":"cbRSNotNullAndNotRepeatCheck"},//validateboxУ��¼��ֵ�Ϸ��Ե�֧�ַ���
		{"name":"����","value":title,"group":"������Ϣ","editor":{"type":"validatebox", "options":{"required":true,"validType":"String"}},"field":"title","func":""},//validateboxУ��¼��ֵ�Ϸ��Ե�֧�ַ���
		{"name":"�����ϵ","value":relation,"group":"�����ϵ(���=�����ϵ������)","editor":{"type":"validatebox", "options":{"required":true,"validType":"money"}},"field":"relation","func":""},
		{"name":"����","value":"Ԫ","group":"�����ϵ(���=�����ϵ������)","func":""},
		{"name":"baseid","value":baseid,"group":"ϵͳ����","field":"baseid","hidden":true,"func":""}
	]};
	ebx.stdout = data;
})();
%>