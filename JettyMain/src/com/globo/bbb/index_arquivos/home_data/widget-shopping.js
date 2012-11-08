function gup( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}

var globo_shop_client = gup( 'sc' );
var globo_shop_slot = gup( 'ss' );
var globo_shop_width = gup( 'sw' );
var globo_shop_height = gup( 'sh' );;
var globo_shop_product_slots = gup( 'sps' );
var globo_shop_tab_slots = gup( 'sts' );
var globo_output = gup( 'output' );
var globo_color_text = gup( 'color_text' );
var globo_color_titulo = gup( 'color_titulo' );

if (globo_shop_slot=="") globo_shop_slot = "home" ;
if (globo_shop_width=="") globo_shop_width = 938;
if (globo_shop_height=="") globo_shop_height=348;
if (globo_shop_product_slots=="") globo_shop_product_slots = 5 ;
if (globo_shop_tab_slots=="") globo_shop_tab_slots = 5;
if (globo_output=="") globo_output = "html";
if (globo_color_text=="") globo_color_text="333333";
if (globo_color_titulo=="") globo_color_titulo="333333";

var widthperc = 99/globo_shop_tab_slots
var widthtab = (globo_shop_width-20-globo_shop_tab_slots)/globo_shop_tab_slots

$(document).ready(function() {	
	
	$("div[class=widget]").each(function() {
		$(this).css("width",globo_shop_width+"px");
	});
	$("div[class=widget-titulo]").each(function() {
		$(this).css("color","#"+globo_color_titulo);
	});
	$("p[class=preco]").each(function() {
		$(this).css("color","#"+globo_color_text);
	});
	$("p[class=complementopreco]").each(function() {
		$(this).css("color","#"+globo_color_text);
	});	
	$("div[class=widget widget-color]").each(function() {
		$(this).css("border-top","2px solid #"+globo_color_text);
	});

	$("li").each(function() {
		$(this).css("width",widthperc+"%");
	});

	$("div[id^=tab_]").each(function() {
		$(this).css("width",widthtab+"px");
	});


});

function analytics_tracking_tab(evento,v) {
    var visible = (window.location.href.indexOf('#visible')>0?"#visible":"");
    var action = 'tab_'+evento + '#' + $(v).attr("id") + visible; 
    var label = $(v).text();
    _gaq.push(['_trackEvent', globo_shop_slot , action, label]);
}

function ativa_aba(aba) {
	$("div[id^=tab_]").each(function() {
		$(this).removeClass("ativo");
	});
	aba.addClass("ativo");
	var idseg = aba.attr("id").split("_")[1];
	var thisClass = '#seg_' + idseg;
	$("div[id^=seg_]").each(function() {
		$(this).css("display","none");
	});
	$(thisClass).css("display","block");
}

$(document).ready(function() {	
    
    var v=$("div[id^=tab_1]");
    ativa_aba(v);
    //analytics_tracking_tab('pageview',v);
    
    var tempoemmilisegundos = 10000;
    // globo_shop_width variavel passada pelo template show_shop
    if (globo_shop_width<940) tempoemmilisegundos = 6000;
    var x=setInterval(update, tempoemmilisegundos);
    
    
	$("div[id^=tab_]").each(function() {
		$(this).click(function(){
			ativa_aba($(this));
            //analytics_tracking_tab('pageview',$(this));
            analytics_tracking_tab('click',$(this));
		});
	});
    
	$("div[id^=seg_]").each(function() {
		$(this).hover(
			function() {
				clearInterval(x);
			},
			function(){
                x = setInterval(update, tempoemmilisegundos);
			}
		);
	});
	
	$("div[id^=tab_]").each(function() {
		$(this).hover(
			function() {
				clearInterval(x);
			},
			function(){
                x = setInterval(update, tempoemmilisegundos);
			}
		);
	});	

	var c=1;
	var t=$("div[id^=tab_]").length;
	function update() {
	  	var v=$("div[id^=tab_]");
	  	// dispara um evento a cada troca automatica de aba
        tab = $(v[c])
        ativa_aba(tab);
        //analytics_tracking_tab('pageview',tab);
		c=c+1;
		if (c>=t) c=0;
	}

});
