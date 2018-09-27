<!-- #include file="../Common.asp" -->
<%
(function(){
    var id = ebx.validInt(ebx.stdIn["id"]),
		sql = "select a.code,a.title,a.isDeleted,a.updatedate,a.createdate,u.title owner,a.bigint1 productclassid,bipc.title productclass,a.[Nvarchar2],a.[Nvarchar1],a.[Nvarchar3],a.[Nvarchar4],a.[Currency1],a.[Currency2],a.[Currency3],a.[Currency4],a.[Currency5],a.[Currency6],a.[Currency7],a.[Currency8],a.[Currency9],a.[Currency10],a.[TaxRate],a.[ProductType],a.[IsGroup],a.[ColorSizeGroup],a.[MemoInfo],a.[MadeIn],a.[OriginMade],a.[VenderCode],a.[Material],a.[Price],a.[WebFlag],a.[pProfile],a.[WebID],a.[bAttaches],a.[FromFlag],a.[AssessCost],a.[code1],a.[code2],a.[code3],a.[code4],a.[code5],a.[code6],a.[code7],a.[LengthSerial],a.[Batch],a.[VIPPoints],a.[VIPDateFrom],a.[VIPDateTo],a.[VIPCoefficient],a.[VIPCash],isnull(bdcs.title,'') ColorSizeGroupText from " + TableName + " a left join  bdcolorSize bdcs on a.ColorSizeGroup =bdcs.id,biuser u,biproductclass bipc where  a.bigint1=bipc.id and a.owner=u.id and a.id=" + id,
		rs,
		data = [],
		code = "", title = "", isDeleted = 0, updatedate = new Date(), createdate = new Date(),owner="",bigint1=0,productclass="",Nvarchar2="",Material="",Nvarchar3="",Nvarchar4="",Currency10=0,Nvarchar1="",Madein="",OriginMade="",VenderCode="",Currency7=0,Currency6=0,Currency5=0,Currency1=0,Currency4=0,Currency2=0,Currency3=0,AssessCost=0,TaxRate=0.16,LengthSerial=0,pProfile="",MemoInfo="",WebFlag=0,ProductType=0,IsGroup=0,VIPDateFrom=new Date(),VIPDateTo=new Date(),VIPCoefficient=1,VIPPoints=0,VIPCash=0,Batch=0,ColorSizeGroup=0,ColorSizeGroupText="";	
	
	if(id > 0){
		rs = ebx.dbx.open(sql, 1, 1);
		if(!rs.eof){
			code = rs("code").value;
			title = rs("title").value;
			isDeleted = rs("isDeleted").value;
			updatedate = rs("updatedate").value;
			createdate = rs("createdate").value;
			owner = rs("owner").value;
			bigint1=rs("productclassid").value;
			productclass=rs("productclass").value;
			Nvarchar2=rs("Nvarchar2").value;
			Material=rs("Material").value;
			Nvarchar3=rs("Nvarchar3").value;
			Nvarchar4=rs("Nvarchar4").value;
			Currency10=rs("Currency10").value;
			Nvarchar1=rs("Nvarchar1").value;
			Madein=rs("Madein").value;
			OriginMade=rs("OriginMade").value;
			VenderCode=rs("VenderCode").value;
			Currency7=rs("Currency7").value;
			Currency6=rs("Currency6").value;
			Currency5=rs("Currency5").value;
			Currency1=rs("Currency1").value;
			Currency4=rs("Currency4").value;
			Currency2=rs("Currency2").value;
			Currency3=rs("Currency3").value;
			AssessCost=rs("AssessCost").value;
			ColorSizeGroup=rs("ColorSizeGroup").value;
			ColorSizeGroupText=rs("ColorSizeGroupText").value;
			TaxRate=rs("TaxRate").value;
			LengthSerial=rs("LengthSerial").value;
			pProfile=rs("pProfile").value;
			MemoInfo=rs("MemoInfo").value;
			WebFlag=rs("WebFlag").value;
			Batch=rs("Batch").value;
			VIPCoefficient=rs("VIPCoefficient").value;
			VIPPoints=rs("VIPPoints").value;
			VIPDateFrom=rs("VipDateFrom").value;
			VIPDateTo=rs("VIpDateTo").value;
			VIPCash=rs("VIPCash").value;
			IsGroup=rs("IsGroup").value;
			ProductType=rs("ProductType").value;
		}
	}
	
	data = {"total":40,"rows":[
		{"name":"ɾ��","value":isDeleted,"group":"ϵͳ����","field":"_isDeleted","render":"boolRender","rowstyle":"color:#999;","fieldstyle":"color:#f00;","func":""},
		{"name":"����ʱ��","value": new Date(createdate).Format("yyyy-MM-dd hh:mm:ss"),"group":"ϵͳ����","field":"_createdate","rowstyle":"color:#999;"},
		{"name":"����ʱ��","value": new Date(updatedate).Format("yyyy-MM-dd hh:mm:ss"),"group":"ϵͳ����","field":"_updatedate","rowstyle":"color:#999;"},
		{"name":"����Ա","value":owner,"group":"ϵͳ����","field":"_owner","rowstyle":"color:#999;"},
		{"name":"���","value":code,"group":"������Ϣ","editor":{"type":"validatebox", "options":{"required":true,"validType":"String"}},"field":"code","func":"cbRSNotNullAndNotRepeatCheck"},
		{"name":"����","value":title,"group":"������Ϣ","editor":{"type":"validatebox", "options":{"required":true,"validType":"String"}},"field":"title"},
		{"name":"��Ʒ����","value":productclass,"group":"������Ϣ","editor":{"type":"droplist","options":{"style":"biOpen2","validType":"combogridValue","required":true,"idField":"id","idField":"title","rownumbers":true,"panelWidth":250,"template":117}},"field":"productclass"},
		{"name":"bigint1","value":bigint1,"group":"ϵͳ����","field":"bigint1","hidden":true,"func":""},
		{"name":"���","value":Nvarchar2,"group":"������Ϣ","editor":"text","field":"Nvarchar2"},
		{"name":"����","value":Material,"group":"������Ϣ","editor":"text","field":"Material"},
		{"name":"����","value":Nvarchar3,"group":"������Ϣ","editor":"text","field":"Nvarchar3"},
		{"name":"������λ","value":Nvarchar4,"group":"��λ��ϵ(������λ=�����ϵ����λ)","editor":{"type":"validatebox", "options":{"required":false,"validType":"String"}},"field":"Nvarchar4","func":""},
		{"name":"�����ϵ","value":Currency10,"group":"��λ��ϵ(������λ=�����ϵ����λ)","editor":{"type":"validatebox", "options":{"required":false,"validType":"Integer"}},"field":"Currency10","func":""},
		{"name":"��λ","value":Nvarchar1,"group":"��λ��ϵ(������λ=�����ϵ����λ)","editor":"text","field":"Nvarchar1"},		
		{"name":"����","value":Madein,"group":"������Ϣ","editor":"text","field":"Madein"},
		{"name":"ԭ����","value":OriginMade,"group":"������Ϣ","editor":"text","field":"OriginMade"},
		{"name":"�������","value":VenderCode,"group":"������Ϣ","editor":"text","field":"VenderCode"},
		{"name":"�ο�����","value":Currency7,"group":"�۸�","editor":{"type":"validatebox", "options":{"required":false,"validType":"Money"}},"field":"Currency7","func":""},
		{"name":"���ۼ�","value":Currency6,"group":"�۸�","editor":{"type":"validatebox", "options":{"required":false,"validType":"Money"}},"field":"Currency6","func":""},
		{"name":"�Żݼ�","value":Currency5,"group":"�۸�","editor":{"type":"validatebox", "options":{"required":false,"validType":"Money"}},"field":"Currency5","func":""},
		{"name":"�����","value":Currency1,"group":"�۸�","editor":{"type":"validatebox", "options":{"required":false,"validType":"Money"}},"field":"Currency1","func":""},
		{"name":"VIP��","value":Currency4,"group":"�۸�","editor":{"type":"validatebox", "options":{"required":false,"validType":"Money"}},"field":"Currency4","func":""},
		{"name":"������һ","value":Currency2,"group":"�۸�","editor":{"type":"validatebox", "options":{"required":false,"validType":"Money"}},"field":"Currency2","func":""},
		{"name":"�����۶�","value":Currency3,"group":"�۸�","editor":{"type":"validatebox", "options":{"required":false,"validType":"Money"}},"field":"Currency3","func":""},
		{"name":"���˼�","value":AssessCost,"group":"�۸�","editor":{"type":"validatebox", "options":{"required":false,"validType":"Money"}},"field":"AssessCost","func":""},
		{"name":"˰��","value":TaxRate,"group":"�۸�","editor":{"type":"validatebox", "options":{"required":false,"validType":"TaxRate"}},"field":"TaxRate","func":"","render":"percentRender"},
		{"name":"���ų���","value":LengthSerial,"group":"����","editor":{"type":"validatebox", "options":{"required":false,"validType":"Integer"}},"field":"LengthSerial","func":""},
		{"name":"��ɫ����","value":ColorSizeGroupText,"group":"��ɫ����","editor":{"type":"droplist","options":{"style":"biOpen2","validType":"combogridValue","required":false,"idField":"id","idField":"title","rownumbers":true,"panelWidth":250,"template":230}},"field":"ColorSizeGroupText","func":"cbClearCS"},
		{"name":"ColorSizeGroup","value":ColorSizeGroup,"group":"ϵͳ����","field":"ColorSizeGroup","hidden":true,"func":""},
		{"name":"��Ʒ����","value":pProfile,"group":"��Ʒ����","editor":{"type":"textbox","options":{"multiline":true,"height":"80px"}},"field":"pProfile"},
		{"name":"��ϸ˵��","value":MemoInfo,"group":"��Ʒ����","editor":{"type":"textbox","options":{"multiline":true,"height":"80px"}},"field":"MemoInfo"},
		{"name":"���Ϸ���","value":WebFlag,"group":"����","editor":{"type":"checkbox", "options":{"on":"1","off":"0"}},"field":"WebFlag","render":"boolRender"},
		{"name":"������Ʒ","value":ProductType,"group":"����","editor":{"type":"checkbox","options":{"on":"1","off":"0"}},"field":"ProductType","render":"boolRender"},
		{"name":"��װ��Ʒ","value":IsGroup,"group":"����","editor":{"type":"checkbox","options":{"on":"1","off":"0"}},"field":"IsGroup","render":"boolRender"},
		{"name":"��������","value":Batch,"group":"����","editor":{"type":"checkbox","options":{"on":"1","off":"0"}},"field":"Batch","render":"boolRender"},
		{"name":"������ʼʱ��","value":new Date(VIPDateFrom).Format("yyyy-MM-dd hh:mm:ss"),"group":"��Ա���ֹ���","editor":{"type":"datetimebox","options":{"required":true,"validType":"Datetime","hasDownArrow":false}},"field":"VIPDateFrom"},
		{"name":"���ֽ���ʱ��","value":new Date(VIPDateTo).Format("yyyy-MM-dd hh:mm:ss"),"group":"��Ա���ֹ���","editor":{"type":"datetimebox","options":{"required":true,"validType":"Datetime","hasDownArrow":false}},"field":"VIPDateTo"},
		{"name":"���ֱ���","value":VIPCoefficient,"group":"��Ա���ֹ���","editor":{"type":"validatebox", "options":{"required":false,"validType":"Money"}},"field":"VIPCoefficient","func":""},
		{"name":"��������","value":VIPPoints,"group":"��Ա���ֹ���","editor":{"type":"validatebox", "options":{"required":false,"validType":"Money"}},"field":"VIPPoints","func":""},
		{"name":"�һ�����","value":VIPCash,"group":"��Ա�һ�����","editor":{"type":"validatebox", "options":{"required":false,"validType":"Money"}},"field":"VIPCash","func":""}
	]};
	
	ebx.stdOut = data;
	
})();

%>