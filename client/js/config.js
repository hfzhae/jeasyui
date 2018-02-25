define(function($){
    require.config({
        baseUrl: 'client/',
		//urlArgs:'v='+(new Date()).getTime(),//清除缓存
        paths: {
			//jquery: 'lib/jquery.min',
			//easyui: 'lib/jquery.easyui.min',
			//bootstrap: 'js/bootstrap'
        },
		waitSeconds: 15,//设置超时
    });
});