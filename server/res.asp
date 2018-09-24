<%
/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/9/22
资源审核对象
*****************************************************************/
ebx.res = {
	productstock:{//库存资源审核对象
		stockid: 0,//仓库ID
		billtype: 0,//单据类型
		billid: 0,//单据号
		auditid: 0,//审核ID
		auditdate: '',//审核日期
		billdate: '',//单据日期
		billtitle: '',//单据号（字符串）
		billserial: 0,//单据行序号
		expire: '',//质保期
		batch: '',//批次
		venderid: 0,//供应商ID
		allownegative: 0,//是否允许负库存，0不允许，>0允许，默认0
		costmethod: 0,//成本核算方法 0=移动加权平均;1=先进先出; 2=个别计价, 3后进先出
		decimaldigits: 2,//金额小数位数，默认2位
		init: function(stockid, billtype, billid, auditid, auditdate, billdate, billtitle, billserial, expire, batch, venderid){//初始化函数
			this.stockid = ebx.validInt(stockid);
			this.billtype = ebx.validInt(billtype);
			this.billid = ebx.validInt(billid);
			this.auditid = ebx.validInt(auditid);
			this.auditdate = ebx.sqlStringEncode(auditdate);
			this.billdate = ebx.sqlStringEncode(billdate);
			this.billtitle = ebx.sqlStringEncode(billtitle);
			this.billserial = ebx.validInt(billserial);
			this.expire = ebx.sqlStringEncode(expire);
			this.batch = ebx.sqlStringEncode(batch);
			this.venderid = ebx.validInt(venderid);
			
			if(auditdate.length > 0){
				auditdate = auditdate.replaceAll('-', '/');
				auditdate = new Date(auditdate).Format('yyyy-MM-dd hh:mm:ss');
			}else{
				auditdate = new Date(now()).Format('yyyy-MM-dd hh:mm:ss');
			}
		
			if(billdate.length > 0){
				billdate = billdate.replaceAll('-', '/');
				billdate = new Date(billdate).Format('yyyy-MM-dd hh:mm:ss');
			}else{
				billdate = new Date(now()).Format('yyyy-MM-dd hh:mm:ss');
			}

			if(expire.length > 0){
				expire = expire.replaceAll('-', '/');
				expire = new Date(expire).Format('yyyy-MM-dd hh:mm:ss');
			}else{
				expire = '';
			}
			
			var rs = ebx.dbx.open('Select allownegative, costmethod, decimaldigits from biCorperation where ID=' + ebx.accountid);
			if(rs.eof) throw '账套信息有误！';
			this.allownegative = ebx.validInt(rs('allownegative').value);
			this.costmethod = ebx.validInt(rs('costmethod').value);
			this.decimaldigits = ebx.validInt(rs('decimaldigits').value);
			
			if(this.costmethod < 0 || this.costmethod > 3} this.costmethod = 1;
			if(this.decimaldigits < 0 || this.decimaldigits > 4) this.decimaldigits = 2;

			rs = null;
		},
		add:function(){//入库方法
			
		},
		cut:function(){//出库方法
			
		}
	}
}
%>
