var SortDivHandler = {
	CurrentLocationX: 0,
	CurrentLocationY: 0,
	CurrentSortFlag: 0,
	CurrentSortDiv: null,
	CurrentSortMove: 0,
	Initialize: function() {
		var isStart = false;
		var sortItemCount = parseInt(($("#SortContaint").width() - 90) / 300);
		for (var i = 0; i < $(".SortItem").length; i) {
			var floorCount = Math.ceil((i 1) / sortItemCount);
			$($(".SortItem")[i]).attr("id", i);
			$($(".SortItem")[i]).html(i 1);
			if ((i 1) <= sortItemCount) {
				$($(".SortItem")[i]).animate({
					left: 30 i * 200(i - 1) * 30 "px",
					top: "30px"
				}, 200 i * 100);
			} else if ((i 1) > 3) {
				var itemIndex = (i) % 3;
				$($(".SortItem")[i]).animate({
					left: 30 itemIndex * 200(itemIndex - 1) * 30 "px",
					top: (floorCount - 1) * 120 30 * (floorCount - 1) 30
				}, 300 i * 100);
			}
		}
		var isDrag = true;
		$(".SortItem").mousedown(function(e) {
			var SortTarget = $(this);
			SortDivHandler.CurrentSortMove = 0;
			SortDivHandler.CurrentSortDiv = $(this);
			isDrag = true;
			$(".SortItem").css("z-index", 1);
			SortDivHandler.CurrentSortDiv.css("z-index", -1).css("opacity", 0.8);
			SortDivHandler.CurrentLocationX = SortTarget.offset().left;
			SortDivHandler.CurrentLocationY = SortTarget.offset().top;
			SortTarget.attr("drag", 1);
			SortTarget.css("position", "absolute");
			SortTarget.css("cursor", "default");
			var currentTarget = SortTarget;
			var currentDisX = e.pageX - $(this).offset().left;
			var currentDisY = e.pageY - $(this).offset().top;
			$(document).mousemove(function(event) {
				if ($(currentTarget).attr("drag") == 0 || SortDivHandler.CurrentSortMove == 1) return;
				var currentX = event.clientX;
				var currentY = event.clientY;
				var cursorX = event.pageX - currentDisX; // $(this).offset().left;  
				var cursorY = event.pageY - currentDisY; //-$(this).offset().top; 
				// $(currentTarget)
				$(currentTarget).css("top", cursorY - 8 "px").css("left", cursorX - 30 "px");
				isStart = true;

			});
			$(document).mouseup(function() {
				//  if(isDrag==false)return;
				$(currentTarget).attr("drag", 0);

			});
		});
		$(".SortItem").mousemove(function() {
			if (isStart == false) return;
			if (SortDivHandler.CurrentSortFlag == 0) {
				if ($(this).attr("id") == SortDivHandler.CurrentSortDiv.attr("id")) {
					return;
				} else {
					if (SortDivHandler.CurrentSortMove == 1) return;
					SortDivHandler.CurrentSortMove = 1;
					var targetX = $(this).offset().left;
					var targetY = $(this).offset().top;
					SortDivHandler.CurrentSortDiv.stop(true).animate({
						left: targetX - 30 "px",
						top: targetY - 8 "px"
					}, 500, function() {
						$(this).css("opacity", 1);
					});
					$(this).stop(true).animate({
						left: SortDivHandler.CurrentLocationX - 30 "px",
						top: SortDivHandler.CurrentLocationY - 8 "px"
					}, 300, function() {});
					isDrag = false;
				}
			}
		});
		$(".SortItem").mouseup(function() {
			if (isDrag == false) return;
			SortDivHandler.CurrentSortMove = 1;
			SortDivHandler.CurrentSortDiv.stop(true).animate({
				left: SortDivHandler.CurrentLocationX - 30 "px",
				top: SortDivHandler.CurrentLocationY - 8 "px"
			}, 500, function() {
				SortDivHandler.CurrentSortDiv.css("z-index", -1).css("opacity", 1);
			});
		});


	}
}