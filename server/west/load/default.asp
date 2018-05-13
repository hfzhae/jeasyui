<!--# include virtual="server/public.asp" -->
<%
(function(){
	ebx.stdout = [
		{"id":16,"text":"基本资料","children":[
			{"id":1700,"text":"区域","mode":"area","style":"area","template":241,"href":"client/SimpChinese/bi/"},
			{"id":1701,"text":"产品类型","mode":"productclass","style":"productclass","template":84,"href":"client/SimpChinese/bi/"},
			{"id":1702,"text":"产品目录","mode":"product","style":"product","edit":"product","template":80,"href":"client/SimpChinese/bi/"},
			{"id":1703,"text":"仓库","mode":"stock","style":"stock","template":86,"href":"client/SimpChinese/bi/"},
			{"id":1704,"text":"客户","mode":"custom","style":"custom","template":90,"href":"client/SimpChinese/bi/"},
			{"id":1705,"text":"供应商_","mode":"vender","style":"vender","template":89,"href":"client/SimpChinese/bi/"}
		]},
		{"text":"用户和权限_","state":"closed","children":[
			{"id":1804,"text":"用户设置","mode":"User","style":"User","edit":"User","template":83,"href":"client/SimpChinese/bi/","eastwidth":-1},
			{"id":1805,"text":"操作授权","href":"public.html"},
			{"id":1806,"text":"仓库授权","href":"public.html"},
			{"id":1807,"text":"区域授权","href":"public.html"},
			{"id":1809,"text":"部门授权","href":"public.html"},
			{"id":1810,"text":"角色授权","href":"public.html"}
		]},
		{"id":18,"text":"系统设置","children":[
			{"text":"配置工具","children":[
				{"id":1811,"text":"菜单","mode":"StyleMenu","style":"StyleMenu","edit":"StyleMenu","template":182,"href":"client/SimpChinese/bi/","eastwidth":-1},
				{"id":1812,"text":"菜单组_","mode":"StyleMenuGroup","style":"StyleMenuGroup","edit":"StyleMenuGroup","template":183,"href":"client/SimpChinese/bi/","eastwidth":-1},
				{"id":1813,"text":"显示式样","mode":"style","style":"style","edit":"style","template":181,"href":"client/SimpChinese/bi/","eastwidth":-1},
				{"id":1814,"text":"查询设计","mode":"QueryWizard","style":"QueryWizard","edit":"QueryWizard","template":93,"href":"client/SimpChinese/bi/","eastwidth":-1},
				{"id":1815,"text":"查询模板","mode":"QueryTemplate","style":"QueryTemplate","edit":"QueryTemplate","template":94,"href":"client/SimpChinese/bi/","eastwidth":-1},
				{"id":1816,"text":"权限设置","mode":"Privilege","style":"Privilege","edit":"Privilege","template":255,"href":"client/SimpChinese/bi/","eastwidth":-1},
				{"id":1817,"text":"权限组设置_","mode":"Group","style":"Group","edit":"Group","template":134,"href":"client/SimpChinese/bi/","eastwidth":-1},
				{"id":1818,"text":"权限组分配权限_","href":"public.html"}
			]},
			{"text":"系统属性_","children":[
				{"id":1819,"text":"日志分析","href":"public.html"},
				{"id":1820,"text":"账套信息","href":"public.html"},
				{"id":1821,"text":"系统信息","href":"public.html"}
			]}
		]}
	];
})();
%>
