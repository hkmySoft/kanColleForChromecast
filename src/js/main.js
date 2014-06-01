/**
 * main.js
 * メイン処理を行う
 */
var targetFlashes = [
	'#externalswf',
	'#maintenanceswf',
	'#entranceswf'
];

$(function(){
	'use strict';

	/**
	 * SVGエリア生成
	 */
	function createSvgArea(polCursor)
	{
		var localsvg = document.createElementNS(Const.Cursor.SVG, "svg");
		localsvg.setAttribute('width', document.documentElement.clientWidth + Const.Cursor.ADJUST);
		localsvg.setAttribute('height', document.documentElement.clientHeight + Const.Cursor.ADJUST);
		// SVGエリアにカーソル描画
		localsvg.appendChild(polCursor);
		return localsvg;
	}
	/**
	 * SVG用キャンバスエリア生成
	 */
	function createFieldArea(svg)
	{
		var localfield = document.createElement("div");
		localfield.id = Const.Cursor.FIELD_ID;
		localfield.style.position = "fixed";
		localfield.style.left = "0px";
		localfield.style.top = "0px";
		localfield.style.display = 'block';
		localfield.style.zIndex = '1000000';
		localfield.style.width = document.documentElement.clientWidth + Const.Cursor.ADJUST + 'px';
		localfield.style.height = document.documentElement.clientHeight + Const.Cursor.ADJUST +'px';
		localfield.style.background = 'transparent';
		localfield.style.border = 'none';
		// キャンパス領域にSVGエリア追加
		localfield.appendChild(svg);
		/**
		 * マウスクリックのイベント監視追加
		 * キャンパス領域が上に乗っているとゲーム画面クリック出来ないため
		 * 一旦キャンパス領域を削除し、時間でまた復活させる。
		 *
		 * TODO:この処理うまくやれる方法誰か教えて..
		 */ 
		localfield.addEventListener('click', function (_e) {
			if (localfield.parentNode) {
				// ゲーム画面本体ノード取得
				var parNode = localfield.parentNode;
				// ゲーム画面本体ノードからキャンパス領域削除
				localfield.parentNode.removeChild(localfield);
				setTimeout(function(){
					// キャンパス領域復活
					parNode.appendChild(localfield);
				}.bind(this),500);
			}
		}, false);		
		
		return localfield;
	}
	/**
	 * カーソルアイコン位置生成処理
	 */
	function createCursorPos(pX, pY)
	{
		var crHfSize = Const.Cursor.SIZE / 2;
		var crSize = Const.Cursor.SIZE;
		var x1 = pX;
		var y1 = pY;
		var x2 = pX + crHfSize;
		var y2 = pY + crSize;
		var x3 = pX + crHfSize;
		var y3 = pY + crHfSize;
		var x4 = pX + crSize;
		var y4 = pY + crHfSize;
		var strPnt = x1 + "," + y1 + " " + x2 + "," + y2 + " " + x3 + "," + y3 + " " + x4 + "," + y4 + " " + x1 + "," + y1;
		return strPnt
	}
	/**
	 * カーソルアイコン生成処理
	 */
	function createCursorObj()
	{
		var polyline = document.createElementNS(Const.Cursor.SVG, 'polyline');
		polyline.setAttribute('stroke', 'black');
		polyline.setAttribute('stroke-width', '2');
		polyline.setAttribute('fill', 'white');
		
		// カーソル初期位置生成
		var initPoints = createCursorPos(0,0);
		
		polyline.setAttribute('points', initPoints);
		return polyline;
	}
	
	// カーソルアイコン生成
	var polCursor = createCursorObj();
	
	// SVG描画のためのキャンパス生成
	var svg = createSvgArea(polCursor);

	// SVGのキャンパス領域をブラウザ上に確保する
	var field = createFieldArea(svg);


	/**
	 * embed要素取得
	 */
	var getFlash = (function() {
		var count = 0;
		return function() {
			var $embedElement = null;

			try {
				// 必要なembed要素が来たら次の処理へ
				targetFlashes.forEach(function(elem) {
					$embedElement = $(elem);
					if($embedElement.length > 0) {
						throw true;
					}
				});
			} catch (e) {
				if(e === true) {
					// 初期化処理へ移動
					setupCastWindow($embedElement);
					return;
				}
				// 存在するまで繰り返し
				throw e;
			}
			// 最後まで到達
			// 限界数超えて実行
			count = count + 1;
			if(count >= Const.Han.MAX_REPEAT) {
				alert('エラー。再実行して見てください。');
				window.close();
				return;
			}
			// 繰り返し
			window.setTimeout(getFlash, 1000);
		};
	})();
	
	/**
	 * 初期化処理
	 */
	var setupCastWindow = function($embedElement) {
		// divタグ置き換え
		$('#flashWrap').replaceWith($embedElement);

		// divを削除
		$('div').remove();

		// 背景:黒
		$('body').css('background-color', 'black');

		// リサイズ
		$embedElement.css('position', 'absolute');
		$embedElement.css('top', '50%');
		$embedElement.css('left', '50%');

		/**
		 * リサイズ時処理
		 */
		var onResize = function() {
			// アスペクト比算出
			var width = window.innerWidth;
			var height = window.innerHeight;
			var aspect = height / width;
			if( aspect > 0.6 ){
				height = width * 0.6;
			} else if( aspect < 0.6 ){
				width = height / 0.6;
			}
			// Flash要素への適用
			$embedElement.attr('height', height);
			$embedElement.attr('width', width);
			$embedElement.css('margin-top', -height/2);
			$embedElement.css('margin-left', -width/2);
			
			$('#' + Const.Cursor.FIELD_ID).css('width', window.innerWidth);
			$('#' + Const.Cursor.FIELD_ID).css('height', window.innerHeight);
			svg.setAttribute('width', window.innerWidth);
			svg.setAttribute('height', window.innerHeight);
		};
		(document.body || document.documentElement).appendChild(field);
		// 初回実行
		onResize();
		// リサイズ時への登録
		$(window).resize(onResize);
	};


	// embed要素取得処理初回起動
	setTimeout(getFlash, 1000);

	// マウス移動イベント監視
	document.onmousemove = 	function (e){
		var mousePositionX = (e ? e.pageX : document.body.scrollLeft + event.x);
		var mousePositionY = (e ? e.pageY : document.body.scrollTop + event.y);
		// カーソル位置生成
		var strPoints = createCursorPos(mousePositionX,mousePositionY);
		polCursor.setAttribute('points', strPoints);
	};
	
	
});
