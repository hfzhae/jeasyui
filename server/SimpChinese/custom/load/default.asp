<!-- #include file="../Common.asp" -->
<%
(function(){
	var id = ebx.validInt(ebx.stdin["id"]),
		sql = "select a.code,a.title,a.MemoInfo,a.isdeleted,a.int1,a.updatedate,a.createdate,a.areaid,u.title as owner,bia.title as areatitle,a.nvarchar4,a.nvarchar1,a.nvarchar8,a.nvarchar6,a.nvarchar7,a.mobile,a.currency1,a.int1,a.[type] as saletype,a.discount,a.nvarchar3,a.nvarchar9,a.nvarchar2,a.nvarchar5,a.nvarchar11,a.nvarchar10  from " + TableName + " a,biuser u,biarea bia where a.areaid=bia.id and a.owner=u.id and a.id=" + id,
		rs,
		data = [],
		code = "", title = "",areaid=0,areatitle="", MemoInfo = "", isdeleted = 0, int1 = 0, updatedate = new Date(), createdate = new Date(), owner = "",nvarchar4="",nvarchar1="",nvarchar8="",nvarchar6="",nvarchar7="",mobile="",currency1=0,int1=0,saletype=6,saletypetext="���ۼ�",discount=1,nvarchar3="",nvarchar9="",nvarchar2="",nvarchar5="",nvarchar11="",nvarchar10="" ;
		
	if(id > 0){
		rs = ebx.dbx.open(sql, 1, 1)
		if(!rs.eof){
			code = rs("code").value;
			title = rs("title").value;
			MemoInfo = rs("MemoInfo").value;
			isdeleted = rs("isdeleted").value;
			int1 = rs("int1").value;
			updatedate = rs("updatedate").value;
			createdate = rs("createdate").value;
			owner = rs("owner").value;
			areaid=rs("areaid").value;
			areatitle=rs("areatitle").value;
			nvarchar4=rs("nvarchar4").value;
			nvarchar1=rs("nvarchar1").value;
			nvarchar8=rs("nvarchar8").value;
			nvarchar6=rs("nvarchar6").value;
			nvarchar7=rs("nvarchar7").value;
			mobile=rs("mobile").value;
			currency1=rs("currency1").value;
			saletype=rs("saletype").value;
			discount=rs("discount").value;
			nvarchar3=rs("nvarchar3").value;
			nvarchar9=rs("nvarchar9").value;
			nvarchar2=rs("nvarchar2").value;
			nvarchar5=rs("nvarchar5").value;
			nvarchar11=rs("nvarchar11").value;
			nvarchar10=rs("nvarchar10").value; 
			switch(saletype)
            {
                case 1:
                  saletypetext="�����"
                  break;
                case 2:
                  saletypetext="������1"
                  break;
                case 3:
                  saletypetext="������2"
                  break;
                case 4:
                  saletypetext="vip��"
                  break;
                case 5:
                  saletypetext="�Żݼ�"
                  break;
                case 6:
                  saletypetext="���ۼ�"
                  break;
            };
		}
	}
	

	data = {"total":25,"rows":[
		{"name":"ɾ��","value":isdeleted,"group":"ϵͳ����","field":"_isdeleted","render":"boolRender","rowstyle":"color:#999;","fieldstyle":"color:#f00;","func":""},
		{"name":"����ʱ��","value": new Date(createdate).Format("yyyy-MM-dd hh:mm:ss"),"group":"ϵͳ����","field":"_createdate","rowstyle":"color:#999;"},
		{"name":"����ʱ��","value": new Date(updatedate).Format("yyyy-MM-dd hh:mm:ss"),"group":"ϵͳ����","field":"_updatedate","rowstyle":"color:#999;"},
		{"name":"����Ա","value":owner,"group":"ϵͳ����","field":"_owner","rowstyle":"color:#999;"},
		{"name":"���","value":code,"group":"������Ϣ","editor":{"type":"validatebox", "options":{"required":true,"validType":"String"}},"field":"code","func":"cbRSNotNullAndNotRepeatCheck"},
		{"name":"����","value":title,"group":"������Ϣ","editor":{"type":"validatebox", "options":{"required":true,"validType":"String"}},"field":"title","func":"cbRSDirectPy"},
		{"name":"����","value":areatitle,"group":"������Ϣ","editor":{"type":"droplist","options":{"style":"biOpen2","validType":"combogridValue","hasDownArrow":false,"required":true,"idField":"id","idField":"title","rownumbers":true,"panelWidth":250,"template":258}},"field":"areatitle","func":""},
		{"name":"areaid","value":areaid,"group":"ϵͳ����","field":"areaid","hidden":true,"func":""},
		{"name":"����","value":nvarchar4,"group":"��������","editor":"text","field":"nvarchar4"},
		{"name":"��ϵ��ַ","value":nvarchar1,"group":"��������","editor":"text","field":"nvarchar1"},
		{"name":"����","value":nvarchar8,"group":"��������","editor":{"type":"textbox","options":{"validType":"Email"}},"field":"nvarchar8"},
		{"name":"�绰","value":nvarchar6,"group":"��������","editor":"text","field":"nvarchar6"},
		{"name":"����","value":nvarchar7,"group":"��������","editor":"text","field":"nvarchar7"},
		{"name":"�ֻ�","value":mobile,"group":"��������","editor":{"type":"textbox","options":{"validType":"Mobile"}},"field":"mobile"},
		{"name":"�������","value":currency1,"group":"��������","editor":{"type":"textbox","options":{"validType":"Integer"}},"field":"currency1"},
		{"name":"����(��)","value":int1,"group":"��������","editor":{"type":"textbox","options":{"validType":"Integer"}},"field":"int1"},
		{"name":"����۸�","value":saletypetext,"group":"��������","editor":{"type":"combobox","options":{"validType":"comboboxValue","valueField":"value","textField":"value","required":true,"data":[{"id":"6","value":"���ۼ�"},{"id":"1","value":"�����"},{"id":"2","value":"������1"},{"id":"3","value":"������2"},{"id":"4","value":"VIP��"},{"id":"5","value":"�Żݼ�"}]}},"field":"saletypetext","func":""},
		{"name":"saletype","value":saletype,"group":"ϵͳ����","field":"type","hidden":true,"func":""},
		{"name":"�ۿ�","value":discount,"group":"��������","editor":{"type":"textbox","options":{"validType":"Integer"}},"field":"discount"},
		{"name":"�˺�","value":nvarchar3,"group":"�˺ź�����","editor":"text","field":"nvarchar3"},
		{"name":"˰��","value":nvarchar9,"group":"�˺ź�����","editor":"text","field":"nvarchar9"},
		{"name":"������","value":nvarchar2,"group":"�˺ź�����","editor":"text","field":"nvarchar2"},
		{"name":"�ջ���","value":nvarchar5,"group":"�˺ź�����","editor":"text","field":"nvarchar5"},
		{"name":"�ջ��ַ","value":nvarchar11,"group":"�˺ź�����","editor":"text","field":"nvarchar11"},
		{"name":"�ʱ�","value":nvarchar10,"group":"�˺ź�����","editor":{"type":"textbox","options":{"validType":"ZipCode"}},"field":"nvarchar10"},
		{"name":"��ע","value":MemoInfo,"group":"����","editor":"text","field":"MemoInfo"},
	]};

	ebx.stdout = data;
})();
%>