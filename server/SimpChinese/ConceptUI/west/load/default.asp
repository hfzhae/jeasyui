<!--# include virtual="server/public.asp" -->
<%
(function(){
	var nav = [
			{
				menu:'ConceptUIWindowManage',
				text:'��ҳ',
				img:'/client/images/NavigationICON/home32_1.png',
				children:[]
			},{
				menu:'Guide.Sales',
				text:'����',
				img:'/client/images/NavigationICON/DatabaseQueryNew.png',
				children:[]
			},{
				menu:'Guide.Receive',
				text:'�տ�',
				img:'/client/images/NavigationICON/AccountingFormat.png',
				children:[]
			},{
				menu:'Guide.Purchase',
				text:'�ɹ�',
				img:'/client/images/NavigationICON/CreateReport.png',
				children:[]
			},{
				menu:'Guide.Payment',
				text:'����',
				img:'/client/images/NavigationICON/CalculateNow.png',
				children:[]
			},{
				menu:'Guide.Stock',
				text:'�ִ�',
				img:'/client/images/NavigationICON/CreateClassModule.png',
				children:[]
			},{
				menu:'Guide.Cash',
				text:'����',
				img:'/client/images/NavigationICON/TotalsMenu.png',
				children:[]
			},{
				menu:'Guide.VIP',
				text:'��Ա',
				img:'/client/images/NavigationICON/CreateTableTemplatesGallery.png',
				children:[]
			},{
				menu:'Guide.Setup',
				text:'����',
				img:'/client/images/NavigationICON/ControlLayoutStacked.png',
				children:[]
			},{
				menu:'Guide.Website',
				text:'ϵͳ',
				img:'/client/images/NavigationICON/PageMenu.png',
				children:[]
			}
		],
		strNav = (function(){
			var s = '';
			for(var i in nav){
				s += '\'' + nav[i].menu + '\',';
			}
			s = s.substr(0, s.length-1);
			return s;
		})(),
		sql = 'select bd.MenuModule, mg.MenuGroupTitle,mg.id from bdStyleMenu bd, bdStyleMenulist l,bdStyleMenuGroup mg where l.MenuGroupID=mg.id and bd.id=l.id and bd.MenuModule in (' + strNav + ')',
		rs = ebx.dbx.open(sql, 1, 1);
		
	while(!rs.eof){
		for(var i in nav){
			if(nav[i].menu.toLowerCase() === rs('MenuModule').value.toLowerCase()){
				nav[i].children.push({id:rs('id').value,text:rs('MenuGroupTitle').value,children:[]});
			}
		}
		rs.MoveNext();
	}
	sql = 'select mgl.MenuModule as mode,mgl.Provider,bd.MenuModule, mgl.id,mgl.Serial,mgl.MenuName,mg.MenuGroupTitle from bdStyleMenu bd, bdStyleMenulist l,bdStyleMenuGroup mg,bdStyleMenuGroupList mgl where mg.id=mgl.id and l.MenuGroupID=mg.id and bd.id=l.id and bd.MenuModule in (' + strNav + ')',
	rs = ebx.dbx.open(sql);

	while(!rs.eof){
		for(var i in nav){
			if(nav[i].menu.toLowerCase() === rs('MenuModule').value.toLowerCase()){
				for(var j in nav[i].children){
					if(nav[i].children[j].text === rs('MenuGroupTitle').value){
						var paramet = rs('Provider').value,
							style = '',
							mode = rs('mode').value.toString().toLowerCase(),
							edit = '',
							template = 0;
						if(paramet){
							paramet = paramet.toLowerCase().split(';');
							for(var k in paramet){
								switch(paramet[k].split('=')[0]){
									case 'style':
										style = paramet[k].split('=')[1].toString().toLowerCase();
										break;
									case 'modedit':
										edit = paramet[k].split('=')[1].toString().toLowerCase();
										break;
									case 'template':
										template = paramet[k].split('=')[1].toLowerCase();
										break;
								}
							}
						}
						//Provider=DataProvider;sync=1;Template=384;ManagePrivilegeID=521;modNew=SaleOutstock;modEdit=SaleOutstock;modDelete=SaleOutstock.Delete;modUnDelete=SaleOutstock.Undelete;Style=SaleOutstock;DateStyle;isdeletedStyle;IsAuditStyle;
						nav[i].children[j].children.push({
							id:rs('id').value.toString() + '_' + rs('Serial').value.toString(),
							text:rs('MenuName').value,
							mode:mode,
							edit:edit,
							style:style,
							template:template
						})
					}
				}
			}
		}
		rs.MoveNext();
	}
	
	ebx.stdout = nav;
	return;
	ebx.stdout = [
		{"id":1,"text":"��ҳ","img":"/client/images/NavigationICON/home32_1.png","children":[
			{"text":"���ٴ�","children":[
				{"id":1306,"text":"���۳��ⵥ","mode":"saleoutstock","style":"saleoutstock","edit":"saleoutstock","template":384,"lock":0}
			]},
			{"text":"���ٲ�ѯ","children":[
				{"id":1308,"text":"���ۻ��ܲ�ѯ","href":"public.html"},
				{"id":1309,"text":"�ɹ����ܲ�ѯ","href":"public.html"}
			]}
		]},
		{"id":18,"text":"����","img":"/client/images/NavigationICON/DatabaseQueryNew.png","children":[
			{"text":"�½�","children":[
				{"id":1307,"text":"���۳��ⵥ","href":"public.html"}
			]},
			{"text":"��","children":[
				{"id":1306,"text":"���۳��ⵥ","mode":"saleoutstock","style":"saleoutstock","edit":"saleoutstock","template":384,"lock":0}
			]},
			{"text":"��ѯ","children":[
				{"id":1308,"text":"���۳����ѯ","href":"public.html"},
				{"id":1309,"text":"���ۻ��ܲ�ѯ","href":"public.html"}
			]}
		]},
		{"id":18,"text":"�տ�","img":"/client/images/NavigationICON/AccountingFormat.png","children":[
			
		]},
		{"id":18,"text":"�ɹ�","img":"/client/images/NavigationICON/CreateReport.png","children":[
			
		]},
		{"id":18,"text":"����","img":"/client/images/NavigationICON/CalculateNow.png","children":[
			
		]},
		{"id":18,"text":"�ִ�","img":"/client/images/NavigationICON/CreateClassModule.png","children":[
			
		]},
		{"id":18,"text":"����","img":"/client/images/NavigationICON/TotalsMenu.png","children":[
			
		]},
		{"id":18,"text":"��Ա","img":"/client/images/NavigationICON/CreateTableTemplatesGallery.png","children":[
			
		]},
		{"id":16,"text":"��������","img":"/client/images/NavigationICON/ControlLayoutStacked.png","children":[
			{"id":1700,"text":"����","mode":"area","style":"area","edit":"area","template":241},
			{"id":1701,"text":"��Ʒ����","mode":"productclass","style":"productclass","template":84},
			{"id":1702,"text":"��ƷĿ¼","mode":"product","style":"product","edit":"product","template":80,"lock":0},
			{"id":1703,"text":"�ֿ�","mode":"stock","style":"stock","template":86,"lock":0},
			{"id":1704,"text":"�ͻ�","mode":"custom","style":"custom","template":90,"lock":0},
			{"id":1705,"text":"��Ӧ��","mode":"vender","style":"vender","template":89,"lock":0}
		]},
		{"id":18,"text":"ϵͳ","img":"/client/images/NavigationICON/PageMenu.png","children":[
			{"text":"���ù���","children":[
				{"id":1811,"text":"�˵�","mode":"StyleMenu","style":"StyleMenu","edit":"StyleMenu","template":182,"lock":1},
				{"id":1812,"text":"�˵���","mode":"StyleMenuGroup","style":"StyleMenuGroup","edit":"StyleMenuGroup","template":183,"lock":1},
				{"id":1813,"text":"��ʾʽ��","mode":"style","style":"style","edit":"style","template":181,"lock":1},
				{"id":1814,"text":"��ѯ���","mode":"QueryWizard","style":"QueryWizard","edit":"QueryWizard","template":93,"lock":1},
				{"id":1815,"text":"��ѯģ��","mode":"QueryTemplate","style":"QueryTemplate","edit":"QueryTemplate","template":94,"lock":1},
				{"id":1816,"text":"Ȩ������","mode":"Privilege","style":"Privilege","edit":"Privilege","template":255,"lock":1},
				{"id":1817,"text":"Ȩ��������","mode":"Group","style":"Group","edit":"Group","template":134},
				{"id":1818,"text":"Ȩ�������Ȩ��","href":"public.html"}
			]},
			{"text":"ϵͳ����","children":[
				{"id":1819,"text":"��־����","href":"public.html"},
				{"id":1820,"text":"������Ϣ","href":"public.html"},
				{"id":1821,"text":"ϵͳ��Ϣ","href":"public.html"}
			]}
		]}
	];
})();
%>
