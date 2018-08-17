/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/8/17
单据打印对象，依赖于jquery.print.js

*****************************************************************/

ebx.bd.print = {
	bd:[],
	columns:[],
	bdlist:[],
	tab: [],
	title: '',
	printbody : $('<div>'),
	init:function(bd, columns, bdlist, tab){
		this.bd = bd;
		this.columns = columns;
		this.bdlist = bdlist;
		this.tab = tab;
	},
	print: function(){
		var bdstr = $('<div>'),
			columnsstr = '',
			bdliststr = '';
			
		bdstr.append('<table><tbody></tbody></table>');
		
		for(var i in this.bd){
			if(!this.bd[i].hidden){
				bdstr.find('tbody').append('<tr><td>' + this.bd[i].name + '</td><td>' + this.bd[i].value + '</td></tr>');
			}
		}

		this.printbody.html('<table align="center"><tbody><tr><td>' + this.title + '</td></tr></tbody></table><br>' + bdstr.html()).print({iframe:true});		
	}
}