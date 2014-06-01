/**
 * util.js
 * 諸処理を行う
 */
var Utility = Utility || {};
(function() {
	'use strict';
	
	/**
	 * 艦これゲーム画面表示
	 */
	Utility.openCastWindow = function(){
		chrome.windows.create({
			url: Const.CstWin.KANCOLLE + Const.CstWin.SUFFIX,
			width:  Const.CstWin.WIDTH,
			height: Const.CstWin.HEIGHT,
			left: Const.CstWin.LEFT,
			top: Const.CstWin.TOP,
			type: Const.CstWin.TYPE
		},function(window){});
	};

})();
