<% @debug=on
/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/5/6
*****************************************************************/
var ebx = {
	conn: [], 
	stdin: new Array(),
	stdout: new Array(),
	parseToJson: function (json_data){//Json格式转对象
		eval("var o=" + json_data);
		return o;
	},
	getRequestParamet: function(s){//get参数格式转对象
		var arr = s.split('&'),
			d = new Array();
		if(arr.length <= 0) return d;
		for(var i in arr){
			d[arr[i].split('=')[0]] = arr[i].split('=')[1];
		}
		return d;
	},
	Initialize: function (){
		var ParametStr, FormSize, FormData, Paramet
		if(Request.ServerVariables('Request_Method') == 'POST' ){ //post
			FormSize = Request.TotalBytes;
			FormData = Request.BinaryRead(FormSize);
			ParametStr = ebx.stream_binarytostring(FormData, '');
			if(typeof(ParametStr) == 'string'){
				try{
					var Paramet = ebx.parseToJson(ParametStr);
					ebx.convertObjToDic(ebx.stdin, Paramet);
				}catch(e){
					if(e.name == 'SyntaxError'){
						ebx.stdin = ebx.getRequestParamet(ParametStr);
					}
				}
			}
		}else{ //get
			ParametStr = Request.ServerVariables("QUERY_STRING")(1);
			if(typeof(ParametStr) == 'string'){
				ebx.stdin = ebx.getRequestParamet(ParametStr);
			}
		}
		
		ebx.conn = Server.CreateObject('ADODB.Connection');
		ebx.conn.open(Application('DateBase.ConnectString'));
	},
	stream_binarytostring: function (binary, charset){//用adodb.stream获取requet内容 2018-5-4 zz
		var binarystream = Server.CreateObject('adodb.stream');

		binarystream.type = 1
		binarystream.open
		binarystream.write(binary)
		binarystream.position = 0
		binarystream.type = 2
		
		if(charset.length > 0){
			binarystream.charset = charset
		}else{
			binarystream.charset = 'us-ascii'
		}
		return binarystream.readtext
	},
	convertObjToDic: function(dic, obj){//将Json转换成object的对象转换成可嵌套的字典对象 2018-5-5 zz
		if(typeof(obj) == 'object'){
			for(var i in obj){
				if(typeof(obj[i]) == 'object'){
					var d = new Array();
					ebx.convertObjToDic(d, obj[i]);
					dic[i] = d;
				}else{
					dic[i] = obj[i];
				}
			}
		}
	},
	convertRsToJson: function(rs){//将rs对象转化成json文本 2018-5-4 zz
		var s = '';
		if(!rs.eof){ 
			var fields = rs.Fields;
				
			rs.MoveFirst();
			while(!rs.eof){
				s += '{';
				for(var i = 0; i < fields.Count; i++){
					s += '"' + fields(i).name + '":' + ebx.getType(fields(i)) + ',';
				}
				s = s.substr(0, s.length - 1);
				s += '},';
				rs.MoveNext();
			}
			s = s.substr(0, s.length - 1);
		}
		return '[' + s + ']';
	},
	getType: function(Fields){ //数据类型判断函数，Fields：字段rs.Fields对象，返回针对类型处理后的值
		var v = ebx.escapeEx(Fields.value)
		switch(Fields.type){
			case 202:
				return '"' + v + '"'; //"文本"
				break;
			case 203:
				return  '"' + v + '"'; //"备注"
				break;
			case 3:
				return v; //"长整型"
				break;
			case 2:
				return v; //"整型"
				break;
			case 17:
				return v; //"字节"
				break;
			case 3:
				return v; //"长整型"
				break;
			case 4:
				return v; //"单精浮点"
				break;
			case 5:
				return v; //"双精浮点"
				break;
			case 3:
				return v; //"长整型"
				break;
			case 72:
				return v; //"同步复制ID"
				break;
			case 131:
				return v; //"小数"
				break;
			case 135:
				return '"' + v + '"'; //"日期/时间"
				break;
			case 6:
				return v; //"货币"
				break;
			case 11:
				return '"' + v + '"'; //"是/否"
				break;
			case 205:
				return '[' + ebx.convertRsToJson(ebx.convertBinToRs(v)) + ']'; //"OLE对象" 处理数据库里嵌套的rs对象二级制存储数据
				break;
		}
	},
	escapeEx: function(str){ //判断是否字符，如果是用escapt编码加密 2018-5-4 zz
		if(str == null) return('');
		
		//if(/^[\u3220-\uFA29]+$/.test(str)){//中文正则
		if(typeof(str) == 'string'){
			return escape(str);
		}else{
			return str;
		}
	},
	convertBinToRs: function(sBin){ //二进制流转换成rs对象
		var stm = Server.CreateObject("adodb.stream"),
			rs = Server.CreateObject("adodb.recordset");
		if(sBin != null){
			stm.type = 1;
			stm.Open();
			stm.Write(sBin);
			stm.position = 0;
			rs.open(stm);
		}
		return(rs);
	},
	convertRsToBin: function(rs){ //rs对象转换成二进制流
		if(rs == null) return(null);
		if(typeof(rs) == 'object') return(null);
		if(rs.recordcount = 0) return(null);
		
		var stm = Server.CreateObject("adodb.stream");
		stm.type = 1;
		stm.Open();
		rs.save(stm);
		stm.position = 0
		return stm.read();
	},
	OnPageEnd: function(Response){//页面结束处理函数
		Response.Write(ebx.convertDicToJson(ebx.stdout));
	},
	convertDicToJson: function(d){//将Dic对象转化成json文本对象转化成json文本 2018-5-6 zz
		if(typeof(d) != 'object') return('{}');
		var s = '', arrtype;
		for(var i in d){
			var n = Number(i);//通过是否数字格式判断是否是数组，如果是数字，代表是数组，文本用[]包含，否则代表是字典，文本用{}包含
			if (!isNaN(n)){
				arrtype = 1;//设置json数组类型，1=[],0={}
				if(d[i].RecordCount == undefined){
					s += ebx.convertDicToJson(d[i]) +',';//处理嵌套字典
				}else{
					s += ebx.convertRsToJson(d[i]) +',';//处理嵌套的rs
				}
			}else{
				arrtype = 0;//设置json数组类型，1=[],0={}
				switch(typeof(d[i])){
					case 'string':
						s += '"'+ i +'":"' + d[i] +'",';
						break;
					case 'object':
						if(d[i].RecordCount == undefined){
							s += '"'+ i +'":' + ebx.convertDicToJson(d[i]) +',';//处理嵌套字典
						}else{
							s += '"'+ i +'":' + ebx.convertRsToJson(d[i]) +',';//处理嵌套的rs
						}
						break;
					case 'number':
						s += '"'+ i +'":' + d[i] +',';
						break;
					case 'boolean':
						s += '"'+ i +'":' + d[i] +',';
						break;
					case 'function':
						s += '"'+ i +'":"' + d[i] +'",';
						break;
					case undefined:
						s += ',';
						break;
				}
			}
		}
		s = s.substr(0, s.length - 1);
		if(arrtype){
			return('[' + s + ']');
		}else{
			return('{' + s + '}');
		}
	}
}
%>
