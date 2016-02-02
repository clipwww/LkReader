$(function(){
	var LkHTML = "";
	var LkMenu = "";
	var LK = "https://www.lightnovel.cn/";

	var LKURL = "https://www.lightnovel.cn/forum-141-1.html";
	$.get(LKURL,getList).done(function(){
		LKURL = "https://www.lightnovel.cn/forum-141-2.html";
		$.get(LKURL,getList).done(function(){
			$("#BOX").append(LkHTML);
			$("#mainMenu ul").append(LkMenu);
			LkHTML="";	
			LkMenu="";						
		})//end get					
	})//end get



	function getList(data){
		$(data.responseText).find("[id*=\"normalthread\"] a.xst").each(function(i){
			var comicLink = $(this).attr("href");
			var title = $(this).text();
			title = title.split("][");

        	LkHTML += "<li>";
        	LkHTML += "<a href='"+ LK + comicLink +"' targer='_blank' name=\""+title[2]+"\">";
        	LkHTML += "<span class=\"comicTitle\">" + title[2] + "</span></a>";
        	LkHTML += "【" + title[3] + "】";
        	LkHTML += "</li>";

        	LkMenu += "<li><a href='"+ LK + comicLink +"' targer='_blank' name=\""+title[2]+"\">";
        	LkMenu += title[2];
        	LkMenu += "</a></li>";  	

		})//end each
		// $("#BOX").append(LkHTML);
		// $("#mainMenu ul").append(LkMenu);
		// LkHTML="";	
		// LkMenu="";
	}// end function			

	function getComic(){
    	var link = $(this).attr("href");
    	$("header p").text( $(this).attr("name") );

		yqlURL = [
	    	"http://query.yahooapis.com/v1/public/yql",
	        "?q=" + encodeURIComponent("select * from html where url='" + link + "'"),
	        "&format=json&callback=?"
	    ].join("");			    					

		$("#BOX").text("");

		$.get(link, function(data){
			var swflink = $(data.responseText).find("param[name=\"movie\"]").attr("value");
			if( swflink ){
				$("#jumpSwf embed").attr("src", swflink);
				$("#jumpSwf").fadeIn(500);
				var tempBtn = "<button id=\"openSwf\"></button>";
				$("#BOX").append(tempBtn);
			}
		});//end get

	    $.getJSON(yqlURL,function(data){
	    	
	    	var imgLink = data.query.results.body.div[6].div[3].div[1].div[0].table.tbody.tr[0].td[1].div[1].div[1].div[0].table.tbody.tr.td;

	    	$.each(imgLink.img, function(i, Comic){
	    		imgSrc = Comic.file;
	    		LkHTML += "<img src='"+ imgSrc +"' alt=\"LK\" />";
	    	});//end each

	    	$("#BOX").append(LkHTML);
	    	LkHTML = " ";
	    	
	    });//end getJSON
	    return false;
	}//end function		


    $("#BOX").on({
    	click:getComic
    },"a")

    $("#mainMenu").on({
    	click:getComic
    },"li a")

    $("#BOX").on({
    	click: function(){
    		var imgSrc = $(this).attr("src");
    		$("#jumpImage img").attr("src", imgSrc);
    		$("#jumpImage").fadeIn(500);
    		$("body").css({"overflow":"hidden"});

    		$("#BOX img").each(function(i, data){	
    			if( imgSrc === $(data).attr("src") ){
					$("#close").text("第 "+ (i+1) + " 頁。點我關閉。");
				}
    		});
    	}
    }, "img");

     $("#BOX").on({
    	click: function(){
    		$("#jumpSwf").fadeIn(500);
    		$("body").css({"overflow":"hidden"});
    	}
    }, "button#openSwf");

    var imgSrc2;
	$("#jumpImage span#next").click(function(){
		imgSrc = $("#jumpImage img").attr("src");
		$("#BOX img").each(function(i, data){

			if( imgSrc === $(data).attr("src") ){
				imgSrc2 = $(this).next().attr("src");
				$("#close").text("第 "+ (i+2) + " 頁。點我關閉。");

				if( imgSrc2 === undefined ){
					$("#jumpImage").fadeOut(500);
					$("body").css({"overflow":""});
				}
			}
		});
	    $("#jumpImage img").attr("src", imgSrc2);
		});
		$("#jumpImage span#prev").click(function(){
			imgSrc = $("#jumpImage img").attr("src");
			$("#BOX img").each(function(i, data){

				if( imgSrc === $(data).attr("src") ){
					imgSrc2 = $(this).prev().attr("src");
					$("#close").text("第 "+ (i) + " 頁。點我關閉。");

					if( imgSrc2 === undefined ){
						$("#jumpImage").fadeOut(500);
						$("body").css({"overflow":""});
					}
				}
			});
		    $("#jumpImage img").attr("src", imgSrc2);
		});

		$("#jumpImage button#close").click(function(){
			$("#jumpImage").fadeOut(500);
			$("body").css({"overflow":""});
		});

		$("#jumpSwf button#closeSwf").click(function(){
			$("#jumpSwf").fadeOut(500);
			$("body").css({"overflow":""});
		});

		$("header span").click(function(){
			var open = "glyphicon glyphicon-menu-hamburger";
			var close = "glyphicon glyphicon-remove";

			if( $(this).attr("class") === open ){
				$(this).attr("class",close);
				$(".test").css({
					"width":"100vw",
					"height":"100vh",
					"background-color":"rgba(0,0,0,0.5)"
				});
				$("header").animate({"left":"260px"}, 600);
				$("body").css({"overflow":"hidden"});
				$("#mainMenu").animate({"left":0}, 600);
			}else{
				$(this).attr("class",open);
				$("header").animate({"left":0}, 600);
				$("body").css({"overflow":""});
				$("#mainMenu").animate({"left":"-260px"}, 600);	   					
			}

		});

});