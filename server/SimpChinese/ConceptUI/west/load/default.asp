<!--# include virtual="server/public.asp" -->
<%
(function(){
	var nav = [
			{
				menu:'ConceptUIWindowManage',
				text:'首页',
				img:'/client/images/NavigationICON/home32_1.png',
				children:[]
			},{
				menu:'Guide.Sales',
				text:'销售',
				img:'/client/images/NavigationICON/DatabaseQueryNew.png',
				children:[]
			},{
				menu:'Guide.Receive',
				text:'收款',
				img:'/client/images/NavigationICON/AccountingFormat.png',
				children:[]
			},{
				menu:'Guide.Purchase',
				text:'采购',
				img:'/client/images/NavigationICON/CreateReport.png',
				children:[]
			},{
				menu:'Guide.Payment',
				text:'付款',
				img:'/client/images/NavigationICON/CalculateNow.png',
				children:[]
			},{
				menu:'Guide.Stock',
				text:'仓储',
				img:'/client/images/NavigationICON/CreateClassModule.png',
				children:[]
			},{
				menu:'Guide.Cash',
				text:'财务',
				img:'/client/images/NavigationICON/TotalsMenu.png',
				children:[]
			},{
				menu:'Guide.VIP',
				text:'会员',
				img:'/client/images/NavigationICON/CreateTableTemplatesGallery.png',
				children:[]
			},{
				menu:'Guide.Setup',
				text:'设置',
				img:'/client/images/NavigationICON/ControlLayoutStacked.png',
				children:[]
			},{
				menu:'Guide.Website',
				text:'系统',
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
		{"id":1,"text":"首页","img":"/client/images/NavigationICON/home32_1.png","children":[
			{"text":"快速打开","children":[
				{"id":1306,"text":"销售出库单","mode":"saleoutstock","style":"saleoutstock","edit":"saleoutstock","template":384,"lock":0}
			]},
			{"text":"快速查询","children":[
				{"id":1308,"text":"销售汇总查询","href":"public.html"},
				{"id":1309,"text":"采购汇总查询","href":"public.html"}
			]}
		]},
		{"id":18,"text":"销售","img":"/client/images/NavigationICON/DatabaseQueryNew.png","children":[
			{"text":"新建","children":[
				{"id":1307,"text":"销售出库单","href":"public.html"}
			]},
			{"text":"打开","children":[
				{"id":1306,"text":"销售出库单","mode":"saleoutstock","style":"saleoutstock","edit":"saleoutstock","template":384,"lock":0}
			]},
			{"text":"查询","children":[
				{"id":1308,"text":"销售出库查询","href":"public.html"},
				{"id":1309,"text":"销售汇总查询","href":"public.html"}
			]}
		]},
		{"id":18,"text":"收款","img":"/client/images/NavigationICON/AccountingFormat.png","children":[
			
		]},
		{"id":18,"text":"采购","img":"/client/images/NavigationICON/CreateReport.png","children":[
			
		]},
		{"id":18,"text":"付款","img":"/client/images/NavigationICON/CalculateNow.png","children":[
			
		]},
		{"id":18,"text":"仓储","img":"/client/images/NavigationICON/CreateClassModule.png","children":[
			
		]},
		{"id":18,"text":"财务","img":"/client/images/NavigationICON/TotalsMenu.png","children":[
			
		]},
		{"id":18,"text":"会员","img":"/client/images/NavigationICON/CreateTableTemplatesGallery.png","children":[
			
		]},
		{"id":16,"text":"基础资料","img":"/client/images/NavigationICON/ControlLayoutStacked.png","children":[
			{"id":1700,"text":"区域","mode":"area","style":"area","edit":"area","template":241},
			{"id":1701,"text":"产品类型","mode":"productclass","style":"productclass","template":84},
			{"id":1702,"text":"产品目录","mode":"product","style":"product","edit":"product","template":80,"lock":0},
			{"id":1703,"text":"仓库","mode":"stock","style":"stock","template":86,"lock":0},
			{"id":1704,"text":"客户","mode":"custom","style":"custom","template":90,"lock":0},
			{"id":1705,"text":"供应商","mode":"vender","style":"vender","template":89,"lock":0}
		]},
		{"id":18,"text":"系统","img":"/client/images/NavigationICON/PageMenu.png","children":[
			{"text":"配置工具","children":[
				{"id":1811,"text":"菜单","mode":"StyleMenu","style":"StyleMenu","edit":"StyleMenu","template":182,"lock":1},
				{"id":1812,"text":"菜单组","mode":"StyleMenuGroup","style":"StyleMenuGroup","edit":"StyleMenuGroup","template":183,"lock":1},
				{"id":1813,"text":"显示式样","mode":"style","style":"style","edit":"style","template":181,"lock":1},
				{"id":1814,"text":"查询设计","mode":"QueryWizard","style":"QueryWizard","edit":"QueryWizard","template":93,"lock":1},
				{"id":1815,"text":"查询模板","mode":"QueryTemplate","style":"QueryTemplate","edit":"QueryTemplate","template":94,"lock":1},
				{"id":1816,"text":"权限设置","mode":"Privilege","style":"Privilege","edit":"Privilege","template":255,"lock":1},
				{"id":1817,"text":"权限组设置","mode":"Group","style":"Group","edit":"Group","template":134},
				{"id":1818,"text":"权限组分配权限","href":"public.html"}
			]},
			{"text":"系统属性","children":[
				{"id":1819,"text":"日志分析","href":"public.html"},
				{"id":1820,"text":"账套信息","href":"public.html"},
				{"id":1821,"text":"系统信息","href":"public.html"}
			]}
		]}
	];
})();
%>
