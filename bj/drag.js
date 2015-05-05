/**
 * 
 * @authors John Nong (overkazaf@gmail.com)
 * @date    2015-04-28 09:07:27
 * @version $Id$
 */

(function ($){
	

	$.fn.draggable = function (options){
		var opts = $.extend({}, $.fn.draggable.defaults, options);
		var dragList = [];
		var context = $(opts.context);
		var container = $(opts.targetContainer);
		var targetElems = $(opts.targetClass);

		this.each(function (i, cont){
			var that = this;
			if ($(that).find('.widget').length){
				that = $(that).find('.widget').get(0);
			}
			var Drag = {
				draggedItem : null,
				init : function (){
					$(that).on('mousedown', Drag.start);
				}, 
				start : function (ev){
					if ($(that).find('.layout-container').length) {
						alert('Please remove the top level object first');
						var layer = 0,
							index = -1;
						$(that).find('.layout-container').each(function (index){
							if ($(this).data('layer') > layer) {
								layer = $(this).data(layer);
								target  = index;
							}
						});

						$(that).find('.layout-container').eq(target).addClass('hightlight');
						return;
					} else {
						$(that).removeClass('hightlight');
					}
					Drag.draggedItem = $('<div>').css({
						position:'absolute',
						width : $(that).width() + 'px',
						height : $(that).height() + 'px',
						left : $(that).offset().left, top : $(that).offset().top,
						'background-color' : '#2b2b2b',
						cursor : 'move',
						opacity : 0.6
					}).appendTo(context);
					var obj = Drag.draggedItem;
					
					var mouseX = ev.pageX;
					var mouseY = ev.pageY;
					var disX = mouseX - Drag.draggedItem.get(0).offsetLeft;
					var disY = mouseY - Drag.draggedItem.get(0).offsetTop;
					

					$(obj).data('disX', disX);
					$(obj).data('disY', disY);

					$(document).on('mousemove',Drag.drag);
					$(document).on('mouseup', Drag.end);

					return false;
				},
				drag : function (ev){
					var obj = Drag.draggedItem;
					var mouseX = ev.pageX;
					var mouseY = ev.pageY;
					var disX = $(obj).data('disX');
					var disY = $(obj).data('disY');
					var nx = mouseX - disX;
					var ny = mouseY - disY;
					$(obj).css({
						left : nx + 'px',
						top : ny + 'px'
					});
					

					// calculate hoved layout
					var pos = Drag.caclPosition(),
						x = mouseX,
					    y = mouseY,
					    p = -1,
					    preLayoutZoneArray = [];

					// Calculate possible layout zones
					for (var i=0,l=pos.length; i<l; i++) {
						var c = pos[i];
						if (x > c.left && x < c.right && y > c.top && y < c.bottom) {
							preLayoutZoneArray.push(i);
							p = i;
						}
					}

					if (p != -1 && preLayoutZoneArray.length) {
						var layer = -1,
							tt = preLayoutZoneArray[0];

						// Calculate the topper layout
						for (var j=0,l=preLayoutZoneArray.length; j<l; j++) {
							var targetZone = $(opts.targetClass).eq(preLayoutZoneArray[j]);
							var targetParent = targetZone.closest('.layout-container');
							var t = targetParent.attr('data-layer');
							if (t > layer) {
								layer = t;
								tt = preLayoutZoneArray[j];
							}
						}
						
						// in the topper layout find all the widgets
						var targetLayout = $(opts.targetClass).eq(tt),
							aWidgets = targetLayout.find('.widget');
						
						if(aWidgets.length) {
							var sortArray = [];
							aWidgets.each(function (){
								var po = {
									left : $(this).offset().left,
									top : $(this).offset().top,
									right : $(this).offset().left + $(this).width(),
									bottom : $(this).offset().top + $(this).height(),
									width : $(this).width(),
									height : $(this).height()
								};
								sortArray.push(po);
							});
							
							var sal = sortArray.length;
							var placeHolder = ($('.widgetPlaceHolder').length && $('.widgetPlaceHolder')) || $(that).clone().addClass('widgetPlaceHolder');
							
							if (sal) {
								if (sal == 1) {
									// fix only one item's bug
									var c = sortArray[0];
									if (x >= c.left + c.width/2) {
										placeHolder.appendTo(targetLayout);
									} else {
										placeHolder.prependTo(targetLayout);
									}
								}else {
									//find a place to insert
									var p = -1,
										fixed = false;

									for (var i=0; i<sal; i++) {
										var c = sortArray[i];
										if (y > c.top && y < c.bottom) {
											var half = c.left + c.width/2;
											if (x >= half && ( (i+1<sal && x<(sortArray[i+1].left + sortArray[i+1].width/2)) || x < c.right)) {
												p = i;break;
											} else if (x < half) {
												p = i;fixed=true;break;
											}
										}
									}

									if (p != -1) {
										if (!fixed){
											placeHolder.insertAfter(aWidgets.eq(p));
										} else {
											placeHolder.insertBefore(aWidgets.eq(p));
										}
									}
								}
							}
						    
						} else {
							$('.widgetPlaceHolder').remove();
							$(that).clone().addClass('widgetPlaceHolder').appendTo(targetLayout);
						}
					} else {
						$('.widgetPlaceHolder').remove();
					}
				},
				end : function (ev){

					var pos = Drag.caclPosition(),
						p = -1,
						preLayoutZoneArray = [],
						x = ev.pageX, 
						y = ev.pageY,
						ol = $(that).offset().left,
						ot = $(that).offset().top,
						so = {//self container
							left : ol,
							top : ot,
							right : ol + $(that).width(),
							bottom : ot + $(that).height()
						};

					if (x > so.left && x < so.right && y > so.top && y < so.bottom) {
						$(document).off('mousemove');
						$(document).off('mouseup');
						Drag.draggedItem.remove();
						$('.widgetPlaceHolder').length && $('.widgetPlaceHolder').remove();
						return;
					}

					for (var i=0,l=pos.length; i<l; i++) {
						var c = pos[i];
						if (x > c.left && x < c.right && y > c.top && y < c.bottom) {
							preLayoutZoneArray.push(i);
							p = i;
						}
					}
					if (p != -1) {
						if (preLayoutZoneArray.length) {
							var layer = -1,
								tt = preLayoutZoneArray[0];
							for (var j=0,l=preLayoutZoneArray.length; j<l; j++) {
								var targetZone = $(opts.targetClass).eq(preLayoutZoneArray[j]),
									targetParent = targetZone.closest('.layout-container'),
									t = targetParent.attr('data-layer');

								if (t > layer) {
									layer = t; tt = preLayoutZoneArray[j];
								}
							}
							
							// Define a layer update function
							var fixLayer = function (layoutElem){
								layoutElem.each(function (){
									var originLayer = 0; 
										originLayer = $(this).parent() && $(this).parent().closest('.layout-container').attr('data-layer');
									$(this).attr('data-layer', +originLayer + 1);
								});
								return layoutElem;
							};


							var target = $(opts.targetClass).eq(tt);
							if (target.closest('.layout-container') == $(that)) {
								return;
							}
							
							var layout = $(that).clone();
							if (target) {
								if (target.find('.widgetPlaceHolder') && target.find('.widgetPlaceHolder').length) {
									target.find('.widgetPlaceHolder').replaceWith(layout.draggable(opts));
									$(that).remove();
								} else {
									// for layout dragging
									log('hshs');
								    target.append(layout.draggable(opts));
								    layout.find('*[operable]').each(function (){
									    $(this).smartMenu(menuData);
								    });
								    fixLayer(layout);
								    // fix dataLayout
								    $(that).remove();
								}
							}
						}
					}
					Drag.draggedItem.remove();
					$(document).off('mousemove').off('mouseup');

					// Update targetElements
					targetElems = $(opts.targetClass);
					var wp = $('.widgetPlaceHolder');
					wp.length && wp.remove();
					
				},
				caclPosition : function (){
					var arr = [];
					(function (){
						$(opts.targetClass).each(function (){
							var os = $(this).offset();
							var w = $(this).width();
							var h = $(this).height();
							var offset = {
								left : os.left,
								top : os.top,
								right : os.left + w,
								bottom : os.top + h,
								height : h
							};
							arr.push(offset);
						});
					})();

					return arr;
				}
			};

			Drag.init();
			dragList.push(Drag);
		});

		return this;
	};

	$.fn.draggable.defaults = {
		context 		: document.body,
		targetContainer : ".containerClass",
			targetClass : ".layoutZoneClass"
	};
})(jQuery);