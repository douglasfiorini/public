(function($){$.fn.menuHorizontal=function(){return this.each(function(){var $this=$(this);var $ul=$this.find('ul.menu-itens');var $lis=$ul.find('> li');$lis.each(function(){var $this=$(this);var $menuSubitens=$this.find('.menu-subitens').hide();if($menuSubitens.length){$menuSubitens.css('width',$menuSubitens.find('> .conteudo-subitens > ul').size()*160);$this.mouseenter(function(){$menuSubitens.show();}).mouseleave(function(){$menuSubitens.hide();});}});});};$('#glb-menu').menuHorizontal();})(jQuery);