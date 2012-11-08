
(function($){var _remove=$.fn.remove;$.fn.remove=function(selector,keepData){return this.each(function(){if(!keepData){if(!selector||$.filter(selector,[this]).length){$("*",this).add(this).each(function(){$(this).triggerHandler("remove");});}}
return _remove.call($(this),selector,keepData);});};$.widget=function(name,base,prototype){var namespace=name.split(".")[0],fullName;name=name.split(".")[1];fullName=namespace+"-"+name;if(!prototype){prototype=base;base=$.Widget;}
$.expr[":"][fullName]=function(elem){return!!$.data(elem,name);};$[namespace]=$[namespace]||{};$[namespace][name]=function(options,element){if(arguments.length){this._createWidget(options,element);}};var basePrototype=new base();basePrototype.options=$.extend({},basePrototype.options);$[namespace][name].prototype=$.extend(true,basePrototype,{namespace:namespace,widgetName:name,widgetEventPrefix:$[namespace][name].prototype.widgetEventPrefix||name,widgetBaseClass:fullName},prototype);$.widget.bridge(name,$[namespace][name]);};$.widget.bridge=function(name,object){$.fn[name]=function(options){var isMethodCall=typeof options==="string",args=Array.prototype.slice.call(arguments,1),returnValue=this;options=!isMethodCall&&args.length?$.extend.apply(null,[true,options].concat(args)):options;if(isMethodCall&&options.substring(0,1)==="_"){return returnValue;}
if(isMethodCall){this.each(function(){var instance=$.data(this,name),methodValue=instance&&$.isFunction(instance[options])?instance[options].apply(instance,args):instance;if(methodValue!==instance&&methodValue!==undefined){returnValue=methodValue;return false;}});}else{this.each(function(){var instance=$.data(this,name);if(instance){if(options){instance.option(options);}
instance._init();}else{$.data(this,name,new object(options,this));}});}
return returnValue;};};$.Widget=function(options,element){if(arguments.length){this._createWidget(options,element);}};$.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:false},_createWidget:function(options,element){this.element=$(element).data(this.widgetName,this);this.options=$.extend(true,{},this.options,$.metadata&&$.metadata.get(element)[this.widgetName],options);var self=this;this.element.bind("remove."+this.widgetName,function(){self.destroy();});this._create();this._init();},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName);this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled "+"ui-state-disabled");},widget:function(){return this.element;},option:function(key,value){var options=key,self=this;if(arguments.length===0){return $.extend({},self.options);}
if(typeof key==="string"){if(value===undefined){return this.options[key];}
options={};options[key]=value;}
$.each(options,function(key,value){self._setOption(key,value);});return self;},_setOption:function(key,value){this.options[key]=value;if(key==="disabled"){this.widget()
[value?"addClass":"removeClass"](this.widgetBaseClass+"-disabled"+" "+"ui-state-disabled").attr("aria-disabled",value);}
return this;},enable:function(){return this._setOption("disabled",false);},disable:function(){return this._setOption("disabled",true);},_trigger:function(type,event,data){var callback=this.options[type];event=$.Event(event);event.type=(type===this.widgetEventPrefix?type:this.widgetEventPrefix+type).toLowerCase();data=data||{};if(event.originalEvent){for(var i=$.event.props.length,prop;i;){prop=$.event.props[--i];event[prop]=event.originalEvent[prop];}}
this.element.trigger(event,data);return!($.isFunction(callback)&&callback.call(this.element[0],event,data)===false||event.isDefaultPrevented());}};})(jQuery);;(function($){var ver='2.88';if($.support==undefined){$.support={opacity:!($.browser.msie)};}
function debug(s){if($.fn.cycle.debug)
log(s);}
function log(){if(window.console&&window.console.log)
window.console.log('[cycle] '+Array.prototype.join.call(arguments,' '));};$.fn.cycle=function(options,arg2){var o={s:this.selector,c:this.context};if(this.length===0&&options!='stop'){if(!$.isReady&&o.s){log('DOM not ready, queuing slideshow');$(function(){$(o.s,o.c).cycle(options,arg2);});return this;}
log('terminating; zero elements found by selector'+($.isReady?'':' (DOM not ready)'));return this;}
return this.each(function(){var opts=handleArguments(this,options,arg2);if(opts===false)
return;opts.updateActivePagerLink=opts.updateActivePagerLink||$.fn.cycle.updateActivePagerLink;if(this.cycleTimeout)
clearTimeout(this.cycleTimeout);this.cycleTimeout=this.cyclePause=0;var $cont=$(this);var $slides=opts.slideExpr?$(opts.slideExpr,this):$cont.children();var els=$slides.get();if(els.length<2){log('terminating; too few slides: '+els.length);return;}
var opts2=buildOptions($cont,$slides,els,opts,o);if(opts2===false)
return;var startTime=opts2.continuous?10:getTimeout(els[opts2.currSlide],els[opts2.nextSlide],opts2,!opts2.rev);if(startTime){startTime+=(opts2.delay||0);if(startTime<10)
startTime=10;debug('first timeout: '+startTime);this.cycleTimeout=setTimeout(function(){go(els,opts2,0,(!opts2.rev&&!opts.backwards))},startTime);}});};function handleArguments(cont,options,arg2){if(cont.cycleStop==undefined)
cont.cycleStop=0;if(options===undefined||options===null)
options={};if(options.constructor==String){switch(options){case'destroy':case'stop':var opts=$(cont).data('cycle.opts');if(!opts)
return false;cont.cycleStop++;if(cont.cycleTimeout)
clearTimeout(cont.cycleTimeout);cont.cycleTimeout=0;$(cont).removeData('cycle.opts');if(options=='destroy')
destroy(opts);return false;case'toggle':cont.cyclePause=(cont.cyclePause===1)?0:1;checkInstantResume(cont.cyclePause,arg2,cont);return false;case'pause':cont.cyclePause=1;return false;case'resume':cont.cyclePause=0;checkInstantResume(false,arg2,cont);return false;case'prev':case'next':var opts=$(cont).data('cycle.opts');if(!opts){log('options not found, "prev/next" ignored');return false;}
$.fn.cycle[options](opts);return false;default:options={fx:options};};return options;}
else if(options.constructor==Number){var num=options;options=$(cont).data('cycle.opts');if(!options){log('options not found, can not advance slide');return false;}
if(num<0||num>=options.elements.length){log('invalid slide index: '+num);return false;}
options.nextSlide=num;if(cont.cycleTimeout){clearTimeout(cont.cycleTimeout);cont.cycleTimeout=0;}
if(typeof arg2=='string')
options.oneTimeFx=arg2;go(options.elements,options,1,num>=options.currSlide);return false;}
return options;function checkInstantResume(isPaused,arg2,cont){if(!isPaused&&arg2===true){var options=$(cont).data('cycle.opts');if(!options){log('options not found, can not resume');return false;}
if(cont.cycleTimeout){clearTimeout(cont.cycleTimeout);cont.cycleTimeout=0;}
go(options.elements,options,1,(!opts.rev&&!opts.backwards));}}};function removeFilter(el,opts){if(!$.support.opacity&&opts.cleartype&&el.style.filter){try{el.style.removeAttribute('filter');}
catch(smother){}}};function destroy(opts){if(opts.next)
$(opts.next).unbind(opts.prevNextEvent);if(opts.prev)
$(opts.prev).unbind(opts.prevNextEvent);if(opts.pager||opts.pagerAnchorBuilder)
$.each(opts.pagerAnchors||[],function(){this.unbind().remove();});opts.pagerAnchors=null;if(opts.destroy)
opts.destroy(opts);};function buildOptions($cont,$slides,els,options,o){var opts=$.extend({},$.fn.cycle.defaults,options||{},$.metadata?$cont.metadata():$.meta?$cont.data():{});if(opts.autostop)
opts.countdown=opts.autostopCount||els.length;var cont=$cont[0];$cont.data('cycle.opts',opts);opts.$cont=$cont;opts.stopCount=cont.cycleStop;opts.elements=els;opts.before=opts.before?[opts.before]:[];opts.after=opts.after?[opts.after]:[];opts.after.unshift(function(){opts.busy=0;});if(!$.support.opacity&&opts.cleartype)
opts.after.push(function(){removeFilter(this,opts);});if(opts.continuous)
opts.after.push(function(){go(els,opts,0,(!opts.rev&&!opts.backwards));});saveOriginalOpts(opts);if(!$.support.opacity&&opts.cleartype&&!opts.cleartypeNoBg)
clearTypeFix($slides);if($cont.css('position')=='static')
$cont.css('position','relative');if(opts.width)
$cont.width(opts.width);if(opts.height&&opts.height!='auto')
$cont.height(opts.height);if(opts.startingSlide)
opts.startingSlide=parseInt(opts.startingSlide);else if(opts.backwards)
opts.startingSlide=els.length-1;if(opts.random){opts.randomMap=[];for(var i=0;i<els.length;i++)
opts.randomMap.push(i);opts.randomMap.sort(function(a,b){return Math.random()-0.5;});opts.randomIndex=1;opts.startingSlide=opts.randomMap[1];}
else if(opts.startingSlide>=els.length)
opts.startingSlide=0;opts.currSlide=opts.startingSlide||0;var first=opts.startingSlide;$slides.css({position:'absolute',top:0,left:0}).hide().each(function(i){var z;if(opts.backwards)
z=first?i<=first?els.length+(i-first):first-i:els.length-i;else
z=first?i>=first?els.length-(i-first):first-i:els.length-i;$(this).css('z-index',z)});$(els[first]).css('opacity',1).show();removeFilter(els[first],opts);if(opts.fit&&opts.width)
$slides.width(opts.width);if(opts.fit&&opts.height&&opts.height!='auto')
$slides.height(opts.height);var reshape=opts.containerResize&&!$cont.innerHeight();if(reshape){var maxw=0,maxh=0;for(var j=0;j<els.length;j++){var $e=$(els[j]),e=$e[0],w=$e.outerWidth(),h=$e.outerHeight();if(!w)w=e.offsetWidth||e.width||$e.attr('width')
if(!h)h=e.offsetHeight||e.height||$e.attr('height');maxw=w>maxw?w:maxw;maxh=h>maxh?h:maxh;}
if(maxw>0&&maxh>0)
$cont.css({width:maxw+'px',height:maxh+'px'});}
if(opts.pause)
$cont.hover(function(){this.cyclePause++;},function(){this.cyclePause--;});if(supportMultiTransitions(opts)===false)
return false;var requeue=false;options.requeueAttempts=options.requeueAttempts||0;$slides.each(function(){var $el=$(this);this.cycleH=(opts.fit&&opts.height)?opts.height:($el.height()||this.offsetHeight||this.height||$el.attr('height')||0);this.cycleW=(opts.fit&&opts.width)?opts.width:($el.width()||this.offsetWidth||this.width||$el.attr('width')||0);if($el.is('img')){var loadingIE=($.browser.msie&&this.cycleW==28&&this.cycleH==30&&!this.complete);var loadingFF=($.browser.mozilla&&this.cycleW==34&&this.cycleH==19&&!this.complete);var loadingOp=($.browser.opera&&((this.cycleW==42&&this.cycleH==19)||(this.cycleW==37&&this.cycleH==17))&&!this.complete);var loadingOther=(this.cycleH==0&&this.cycleW==0&&!this.complete);if(loadingIE||loadingFF||loadingOp||loadingOther){if(o.s&&opts.requeueOnImageNotLoaded&&++options.requeueAttempts<100){log(options.requeueAttempts,' - img slide not loaded, requeuing slideshow: ',this.src,this.cycleW,this.cycleH);setTimeout(function(){$(o.s,o.c).cycle(options)},opts.requeueTimeout);requeue=true;return false;}
else{log('could not determine size of image: '+this.src,this.cycleW,this.cycleH);}}}
return true;});if(requeue)
return false;opts.cssBefore=opts.cssBefore||{};opts.animIn=opts.animIn||{};opts.animOut=opts.animOut||{};$slides.not(':eq('+first+')').css(opts.cssBefore);if(opts.cssFirst)
$($slides[first]).css(opts.cssFirst);if(opts.timeout){opts.timeout=parseInt(opts.timeout);if(opts.speed.constructor==String)
opts.speed=$.fx.speeds[opts.speed]||parseInt(opts.speed);if(!opts.sync)
opts.speed=opts.speed/2;var buffer=opts.fx=='shuffle'?500:250;while((opts.timeout-opts.speed)<buffer)
opts.timeout+=opts.speed;}
if(opts.easing)
opts.easeIn=opts.easeOut=opts.easing;if(!opts.speedIn)
opts.speedIn=opts.speed;if(!opts.speedOut)
opts.speedOut=opts.speed;opts.slideCount=els.length;opts.currSlide=opts.lastSlide=first;if(opts.random){if(++opts.randomIndex==els.length)
opts.randomIndex=0;opts.nextSlide=opts.randomMap[opts.randomIndex];}
else if(opts.backwards)
opts.nextSlide=opts.startingSlide==0?(els.length-1):opts.startingSlide-1;else
opts.nextSlide=opts.startingSlide>=(els.length-1)?0:opts.startingSlide+1;if(!opts.multiFx){var init=$.fn.cycle.transitions[opts.fx];if($.isFunction(init))
init($cont,$slides,opts);else if(opts.fx!='custom'&&!opts.multiFx){log('unknown transition: '+opts.fx,'; slideshow terminating');return false;}}
var e0=$slides[first];if(opts.before.length)
opts.before[0].apply(e0,[e0,e0,opts,true]);if(opts.after.length>1)
opts.after[1].apply(e0,[e0,e0,opts,true]);if(opts.next)
$(opts.next).bind(opts.prevNextEvent,function(){return advance(opts,opts.rev?-1:1)});if(opts.prev)
$(opts.prev).bind(opts.prevNextEvent,function(){return advance(opts,opts.rev?1:-1)});if(opts.pager||opts.pagerAnchorBuilder)
buildPager(els,opts);exposeAddSlide(opts,els);return opts;};function saveOriginalOpts(opts){opts.original={before:[],after:[]};opts.original.cssBefore=$.extend({},opts.cssBefore);opts.original.cssAfter=$.extend({},opts.cssAfter);opts.original.animIn=$.extend({},opts.animIn);opts.original.animOut=$.extend({},opts.animOut);$.each(opts.before,function(){opts.original.before.push(this);});$.each(opts.after,function(){opts.original.after.push(this);});};function supportMultiTransitions(opts){var i,tx,txs=$.fn.cycle.transitions;if(opts.fx.indexOf(',')>0){opts.multiFx=true;opts.fxs=opts.fx.replace(/\s*/g,'').split(',');for(i=0;i<opts.fxs.length;i++){var fx=opts.fxs[i];tx=txs[fx];if(!tx||!txs.hasOwnProperty(fx)||!$.isFunction(tx)){log('discarding unknown transition: ',fx);opts.fxs.splice(i,1);i--;}}
if(!opts.fxs.length){log('No valid transitions named; slideshow terminating.');return false;}}
else if(opts.fx=='all'){opts.multiFx=true;opts.fxs=[];for(p in txs){tx=txs[p];if(txs.hasOwnProperty(p)&&$.isFunction(tx))
opts.fxs.push(p);}}
if(opts.multiFx&&opts.randomizeEffects){var r1=Math.floor(Math.random()*20)+30;for(i=0;i<r1;i++){var r2=Math.floor(Math.random()*opts.fxs.length);opts.fxs.push(opts.fxs.splice(r2,1)[0]);}
debug('randomized fx sequence: ',opts.fxs);}
return true;};function exposeAddSlide(opts,els){opts.addSlide=function(newSlide,prepend){var $s=$(newSlide),s=$s[0];if(!opts.autostopCount)
opts.countdown++;els[prepend?'unshift':'push'](s);if(opts.els)
opts.els[prepend?'unshift':'push'](s);opts.slideCount=els.length;$s.css('position','absolute');$s[prepend?'prependTo':'appendTo'](opts.$cont);if(prepend){opts.currSlide++;opts.nextSlide++;}
if(!$.support.opacity&&opts.cleartype&&!opts.cleartypeNoBg)
clearTypeFix($s);if(opts.fit&&opts.width)
$s.width(opts.width);if(opts.fit&&opts.height&&opts.height!='auto')
$slides.height(opts.height);s.cycleH=(opts.fit&&opts.height)?opts.height:$s.height();s.cycleW=(opts.fit&&opts.width)?opts.width:$s.width();$s.css(opts.cssBefore);if(opts.pager||opts.pagerAnchorBuilder)
$.fn.cycle.createPagerAnchor(els.length-1,s,$(opts.pager),els,opts);if($.isFunction(opts.onAddSlide))
opts.onAddSlide($s);else
$s.hide();};}
$.fn.cycle.resetState=function(opts,fx){fx=fx||opts.fx;opts.before=[];opts.after=[];opts.cssBefore=$.extend({},opts.original.cssBefore);opts.cssAfter=$.extend({},opts.original.cssAfter);opts.animIn=$.extend({},opts.original.animIn);opts.animOut=$.extend({},opts.original.animOut);opts.fxFn=null;$.each(opts.original.before,function(){opts.before.push(this);});$.each(opts.original.after,function(){opts.after.push(this);});var init=$.fn.cycle.transitions[fx];if($.isFunction(init))
init(opts.$cont,$(opts.elements),opts);};function go(els,opts,manual,fwd){if(manual&&opts.busy&&opts.manualTrump){debug('manualTrump in go(), stopping active transition');$(els).stop(true,true);opts.busy=false;}
if(opts.busy){debug('transition active, ignoring new tx request');return;}
var p=opts.$cont[0],curr=els[opts.currSlide],next=els[opts.nextSlide];if(p.cycleStop!=opts.stopCount||p.cycleTimeout===0&&!manual)
return;if(!manual&&!p.cyclePause&&!opts.bounce&&((opts.autostop&&(--opts.countdown<=0))||(opts.nowrap&&!opts.random&&opts.nextSlide<opts.currSlide))){if(opts.end)
opts.end(opts);return;}
var changed=false;if((manual||!p.cyclePause)&&(opts.nextSlide!=opts.currSlide)){changed=true;var fx=opts.fx;curr.cycleH=curr.cycleH||$(curr).height();curr.cycleW=curr.cycleW||$(curr).width();next.cycleH=next.cycleH||$(next).height();next.cycleW=next.cycleW||$(next).width();if(opts.multiFx){if(opts.lastFx==undefined||++opts.lastFx>=opts.fxs.length)
opts.lastFx=0;fx=opts.fxs[opts.lastFx];opts.currFx=fx;}
if(opts.oneTimeFx){fx=opts.oneTimeFx;opts.oneTimeFx=null;}
$.fn.cycle.resetState(opts,fx);if(opts.before.length)
$.each(opts.before,function(i,o){if(p.cycleStop!=opts.stopCount)return;o.apply(next,[curr,next,opts,fwd]);});var after=function(){$.each(opts.after,function(i,o){if(p.cycleStop!=opts.stopCount)return;o.apply(next,[curr,next,opts,fwd]);});};debug('tx firing; currSlide: '+opts.currSlide+'; nextSlide: '+opts.nextSlide);opts.busy=1;if(opts.fxFn)
opts.fxFn(curr,next,opts,after,fwd,manual&&opts.fastOnEvent);else if($.isFunction($.fn.cycle[opts.fx]))
$.fn.cycle[opts.fx](curr,next,opts,after,fwd,manual&&opts.fastOnEvent);else
$.fn.cycle.custom(curr,next,opts,after,fwd,manual&&opts.fastOnEvent);}
if(changed||opts.nextSlide==opts.currSlide){opts.lastSlide=opts.currSlide;if(opts.random){opts.currSlide=opts.nextSlide;if(++opts.randomIndex==els.length)
opts.randomIndex=0;opts.nextSlide=opts.randomMap[opts.randomIndex];if(opts.nextSlide==opts.currSlide)
opts.nextSlide=(opts.currSlide==opts.slideCount-1)?0:opts.currSlide+1;}
else if(opts.backwards){var roll=(opts.nextSlide-1)<0;if(roll&&opts.bounce){opts.backwards=!opts.backwards;opts.nextSlide=1;opts.currSlide=0;}
else{opts.nextSlide=roll?(els.length-1):opts.nextSlide-1;opts.currSlide=roll?0:opts.nextSlide+1;}}
else{var roll=(opts.nextSlide+1)==els.length;if(roll&&opts.bounce){opts.backwards=!opts.backwards;opts.nextSlide=els.length-2;opts.currSlide=els.length-1;}
else{opts.nextSlide=roll?0:opts.nextSlide+1;opts.currSlide=roll?els.length-1:opts.nextSlide-1;}}}
if(changed&&opts.pager)
opts.updateActivePagerLink(opts.pager,opts.currSlide,opts.activePagerClass);var ms=0;if(opts.timeout&&!opts.continuous)
ms=getTimeout(els[opts.currSlide],els[opts.nextSlide],opts,fwd);else if(opts.continuous&&p.cyclePause)
ms=10;if(ms>0)
p.cycleTimeout=setTimeout(function(){go(els,opts,0,(!opts.rev&&!opts.backwards))},ms);};$.fn.cycle.updateActivePagerLink=function(pager,currSlide,clsName){$(pager).each(function(){$(this).children().removeClass(clsName).eq(currSlide).addClass(clsName);});};function getTimeout(curr,next,opts,fwd){if(opts.timeoutFn){var t=opts.timeoutFn.call(curr,curr,next,opts,fwd);while((t-opts.speed)<250)
t+=opts.speed;debug('calculated timeout: '+t+'; speed: '+opts.speed);if(t!==false)
return t;}
return opts.timeout;};$.fn.cycle.next=function(opts){advance(opts,opts.rev?-1:1);};$.fn.cycle.prev=function(opts){advance(opts,opts.rev?1:-1);};function advance(opts,val){var els=opts.elements;var p=opts.$cont[0],timeout=p.cycleTimeout;if(timeout){clearTimeout(timeout);p.cycleTimeout=0;}
if(opts.random&&val<0){opts.randomIndex--;if(--opts.randomIndex==-2)
opts.randomIndex=els.length-2;else if(opts.randomIndex==-1)
opts.randomIndex=els.length-1;opts.nextSlide=opts.randomMap[opts.randomIndex];}
else if(opts.random){opts.nextSlide=opts.randomMap[opts.randomIndex];}
else{opts.nextSlide=opts.currSlide+val;if(opts.nextSlide<0){if(opts.nowrap)return false;opts.nextSlide=els.length-1;}
else if(opts.nextSlide>=els.length){if(opts.nowrap)return false;opts.nextSlide=0;}}
var cb=opts.onPrevNextEvent||opts.prevNextClick;if($.isFunction(cb))
cb(val>0,opts.nextSlide,els[opts.nextSlide]);go(els,opts,1,val>=0);return false;};function buildPager(els,opts){var $p=$(opts.pager);$.each(els,function(i,o){$.fn.cycle.createPagerAnchor(i,o,$p,els,opts);});opts.updateActivePagerLink(opts.pager,opts.startingSlide,opts.activePagerClass);};$.fn.cycle.createPagerAnchor=function(i,el,$p,els,opts){var a;if($.isFunction(opts.pagerAnchorBuilder)){a=opts.pagerAnchorBuilder(i,el);debug('pagerAnchorBuilder('+i+', el) returned: '+a);}
else
a='<a href="#">'+(i+1)+'</a>';if(!a)
return;var $a=$(a);if($a.parents('body').length===0){var arr=[];if($p.length>1){$p.each(function(){var $clone=$a.clone(true);$(this).append($clone);arr.push($clone[0]);});$a=$(arr);}
else{$a.appendTo($p);}}
opts.pagerAnchors=opts.pagerAnchors||[];opts.pagerAnchors.push($a);$a.bind(opts.pagerEvent,function(e){e.preventDefault();opts.nextSlide=i;var p=opts.$cont[0],timeout=p.cycleTimeout;if(timeout){clearTimeout(timeout);p.cycleTimeout=0;}
var cb=opts.onPagerEvent||opts.pagerClick;if($.isFunction(cb))
cb(opts.nextSlide,els[opts.nextSlide]);go(els,opts,1,opts.currSlide<i);});if(!/^click/.test(opts.pagerEvent)&&!opts.allowPagerClickBubble)
$a.bind('click.cycle',function(){return false;});if(opts.pauseOnPagerHover)
$a.hover(function(){opts.$cont[0].cyclePause++;},function(){opts.$cont[0].cyclePause--;});};$.fn.cycle.hopsFromLast=function(opts,fwd){var hops,l=opts.lastSlide,c=opts.currSlide;if(fwd)
hops=c>l?c-l:opts.slideCount-l;else
hops=c<l?l-c:l+opts.slideCount-c;return hops;};function clearTypeFix($slides){debug('applying clearType background-color hack');function hex(s){s=parseInt(s).toString(16);return s.length<2?'0'+s:s;};function getBg(e){for(;e&&e.nodeName.toLowerCase()!='html';e=e.parentNode){var v=$.css(e,'background-color');if(v.indexOf('rgb')>=0){var rgb=v.match(/\d+/g);return'#'+hex(rgb[0])+hex(rgb[1])+hex(rgb[2]);}
if(v&&v!='transparent')
return v;}
return'#ffffff';};$slides.each(function(){$(this).css('background-color',getBg(this));});};$.fn.cycle.commonReset=function(curr,next,opts,w,h,rev){$(opts.elements).not(curr).hide();opts.cssBefore.opacity=1;opts.cssBefore.display='block';if(w!==false&&next.cycleW>0)
opts.cssBefore.width=next.cycleW;if(h!==false&&next.cycleH>0)
opts.cssBefore.height=next.cycleH;opts.cssAfter=opts.cssAfter||{};opts.cssAfter.display='none';$(curr).css('zIndex',opts.slideCount+(rev===true?1:0));$(next).css('zIndex',opts.slideCount+(rev===true?0:1));};$.fn.cycle.custom=function(curr,next,opts,cb,fwd,speedOverride){var $l=$(curr),$n=$(next);var speedIn=opts.speedIn,speedOut=opts.speedOut,easeIn=opts.easeIn,easeOut=opts.easeOut;$n.css(opts.cssBefore);if(speedOverride){if(typeof speedOverride=='number')
speedIn=speedOut=speedOverride;else
speedIn=speedOut=1;easeIn=easeOut=null;}
var fn=function(){$n.animate(opts.animIn,speedIn,easeIn,cb)};$l.animate(opts.animOut,speedOut,easeOut,function(){if(opts.cssAfter)$l.css(opts.cssAfter);if(!opts.sync)fn();});if(opts.sync)fn();};$.fn.cycle.transitions={fade:function($cont,$slides,opts){$slides.not(':eq('+opts.currSlide+')').css('opacity',0);opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts);opts.cssBefore.opacity=0;});opts.animIn={opacity:1};opts.animOut={opacity:0};opts.cssBefore={top:0,left:0};}};$.fn.cycle.ver=function(){return ver;};$.fn.cycle.defaults={fx:'fade',timeout:4000,timeoutFn:null,continuous:0,speed:1000,speedIn:null,speedOut:null,next:null,prev:null,onPrevNextEvent:null,prevNextEvent:'click.cycle',pager:null,onPagerEvent:null,pagerEvent:'click.cycle',allowPagerClickBubble:false,pagerAnchorBuilder:null,before:null,after:null,end:null,easing:null,easeIn:null,easeOut:null,shuffle:null,animIn:null,animOut:null,cssBefore:null,cssAfter:null,fxFn:null,height:'auto',startingSlide:0,sync:1,random:0,fit:0,containerResize:1,pause:0,pauseOnPagerHover:0,autostop:0,autostopCount:0,delay:0,slideExpr:null,cleartype:!$.support.opacity,cleartypeNoBg:false,nowrap:0,fastOnEvent:0,randomizeEffects:1,rev:0,manualTrump:true,requeueOnImageNotLoaded:true,requeueTimeout:250,activePagerClass:'activeSlide',updateActivePagerLink:null,backwards:false};})(jQuery);(function($){$.fn.cycle.transitions.scrollHorz=function($cont,$slides,opts){$cont.css('overflow','hidden').width();opts.before.push(function(curr,next,opts,fwd){$.fn.cycle.commonReset(curr,next,opts);opts.cssBefore.left=fwd?(next.cycleW-1):(1-next.cycleW);opts.animOut.left=fwd?-curr.cycleW:curr.cycleW;});opts.cssFirst={left:0};opts.cssBefore={top:0};opts.animIn={left:0};opts.animOut={top:0};};})(jQuery);(function($){$.template=function(html,options){return new $.template.instance(html,options);};$.template.instance=function(html,options){if(options&&options['regx'])options.regx=this.regx[options.regx];this.options=$.extend({compile:false,regx:this.regx.standard},options||{});this.html=html;if(this.options.compile){this.compile();}
this.isTemplate=true;};$.template.regx=$.template.instance.prototype.regx={jsp:/\$\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,ext:/\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,jtemplates:/\{\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}\}/g};$.template.regx.standard=$.template.regx.jsp;$.template.helpers=$.template.instance.prototype.helpers={substr:function(value,start,length){return String(value).substr(start,length);}};$.extend($.template.instance.prototype,{apply:function(values){if(this.options.compile){return this.compiled(values);}else{var tpl=this;var fm=this.helpers;var fn=function(m,name,format,args){if(format){if(format.substr(0,5)=="this."){return tpl.call(format.substr(5),values[name],values);}else{if(args){var re=/^\s*['"](.*)["']\s*$/;args=args.split(',');for(var i=0,len=args.length;i<len;i++){args[i]=args[i].replace(re,"$1");}
args=[values[name]].concat(args);}else{args=[values[name]];}
return fm[format].apply(fm,args);}}else{return values[name]!==undefined?values[name]:"";}};return this.html.replace(this.options.regx,fn);}},compile:function(){var sep=$.browser.mozilla?"+":",";var fm=this.helpers;var fn=function(m,name,format,args){if(format){args=args?','+args:"";if(format.substr(0,5)!="this."){format="fm."+format+'(';}else{format='this.call("'+format.substr(5)+'", ';args=", values";}}else{args='';format="(values['"+name+"'] == undefined ? '' : ";}
return"'"+sep+format+"values['"+name+"']"+args+")"+sep+"'";};var body;if($.browser.mozilla){body="this.compiled = function(values){ return '"+
this.html.replace(/\\/g,'\\\\').replace(/(\r\n|\n)/g,'\\n').replace(/'/g,"\\'").replace(this.options.regx,fn)+"';};";}else{body=["this.compiled = function(values){ return ['"];body.push(this.html.replace(/\\/g,'\\\\').replace(/(\r\n|\n)/g,'\\n').replace(/'/g,"\\'").replace(this.options.regx,fn));body.push("'].join('');};");body=body.join('');}
eval(body);return this;}});var $_old={domManip:$.fn.domManip,text:$.fn.text,html:$.fn.html};$.fn.domManip=function(args,table,reverse,callback){if(args[0].isTemplate){args[0]=args[0].apply(args[1]);delete args[1];}
var r=$_old.domManip.apply(this,arguments);return r;};$.fn.html=function(value,o){if(value&&value.isTemplate)var value=value.apply(o);var r=$_old.html.apply(this,[value]);return r;};$.fn.text=function(value,o){if(value&&value.isTemplate)var value=value.apply(o);var r=$_old.text.apply(this,[value]);return r;};})(jQuery);jQuery.iUtil={getPosition:function(e)
{var x=0;var y=0;var es=e.style;var restoreStyles=false;if(jQuery(e).css('display')=='none'){var oldVisibility=es.visibility;var oldPosition=es.position;restoreStyles=true;es.visibility='hidden';es.display='block';es.position='absolute';}
var el=e;while(el){x+=el.offsetLeft+(el.currentStyle&&!jQuery.browser.opera?parseInt(el.currentStyle.borderLeftWidth)||0:0);y+=el.offsetTop+(el.currentStyle&&!jQuery.browser.opera?parseInt(el.currentStyle.borderTopWidth)||0:0);el=el.offsetParent;}
el=e;while(el&&el.tagName&&el.tagName.toLowerCase()!='body')
{x-=el.scrollLeft||0;y-=el.scrollTop||0;el=el.parentNode;}
if(restoreStyles==true){es.display='none';es.position=oldPosition;es.visibility=oldVisibility;}
return{x:x,y:y};},getPositionLite:function(el)
{var x=0,y=0;while(el){x+=el.offsetLeft||0;y+=el.offsetTop||0;el=el.offsetParent;}
return{x:x,y:y};},getSize:function(e)
{var w=jQuery.css(e,'width');var h=jQuery.css(e,'height');var wb=0;var hb=0;var es=e.style;if(jQuery(e).css('display')!='none'){wb=e.offsetWidth;hb=e.offsetHeight;}else{var oldVisibility=es.visibility;var oldPosition=es.position;es.visibility='hidden';es.display='block';es.position='absolute';wb=e.offsetWidth;hb=e.offsetHeight;es.display='none';es.position=oldPosition;es.visibility=oldVisibility;}
return{w:w,h:h,wb:wb,hb:hb};},getSizeLite:function(el)
{return{wb:el.offsetWidth||0,hb:el.offsetHeight||0};},getClient:function(e)
{var h,w,de;if(e){w=e.clientWidth;h=e.clientHeight;}else{de=document.documentElement;w=window.innerWidth||self.innerWidth||(de&&de.clientWidth)||document.body.clientWidth;h=window.innerHeight||self.innerHeight||(de&&de.clientHeight)||document.body.clientHeight;}
return{w:w,h:h};},getScroll:function(e)
{var t=0,l=0,w=0,h=0,iw=0,ih=0;if(e&&e.nodeName.toLowerCase()!='body'){t=e.scrollTop;l=e.scrollLeft;w=e.scrollWidth;h=e.scrollHeight;iw=0;ih=0;}else{if(document.documentElement){t=document.documentElement.scrollTop;l=document.documentElement.scrollLeft;w=document.documentElement.scrollWidth;h=document.documentElement.scrollHeight;}else if(document.body){t=document.body.scrollTop;l=document.body.scrollLeft;w=document.body.scrollWidth;h=document.body.scrollHeight;}
iw=self.innerWidth||document.documentElement.clientWidth||document.body.clientWidth||0;ih=self.innerHeight||document.documentElement.clientHeight||document.body.clientHeight||0;}
return{t:t,l:l,w:w,h:h,iw:iw,ih:ih};},getMargins:function(e,toInteger)
{var el=jQuery(e);var t=el.css('marginTop')||'';var r=el.css('marginRight')||'';var b=el.css('marginBottom')||'';var l=el.css('marginLeft')||'';if(toInteger)
return{t:parseInt(t)||0,r:parseInt(r)||0,b:parseInt(b)||0,l:parseInt(l)};else
return{t:t,r:r,b:b,l:l};},getPadding:function(e,toInteger)
{var el=jQuery(e);var t=el.css('paddingTop')||'';var r=el.css('paddingRight')||'';var b=el.css('paddingBottom')||'';var l=el.css('paddingLeft')||'';if(toInteger)
return{t:parseInt(t)||0,r:parseInt(r)||0,b:parseInt(b)||0,l:parseInt(l)};else
return{t:t,r:r,b:b,l:l};},getBorder:function(e,toInteger)
{var el=jQuery(e);var t=el.css('borderTopWidth')||'';var r=el.css('borderRightWidth')||'';var b=el.css('borderBottomWidth')||'';var l=el.css('borderLeftWidth')||'';if(toInteger)
return{t:parseInt(t)||0,r:parseInt(r)||0,b:parseInt(b)||0,l:parseInt(l)||0};else
return{t:t,r:r,b:b,l:l};},getPointer:function(event)
{var x=event.pageX||(event.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft))||0;var y=event.pageY||(event.clientY+(document.documentElement.scrollTop||document.body.scrollTop))||0;return{x:x,y:y};},traverseDOM:function(nodeEl,func)
{func(nodeEl);nodeEl=nodeEl.firstChild;while(nodeEl){jQuery.iUtil.traverseDOM(nodeEl,func);nodeEl=nodeEl.nextSibling;}},purgeEvents:function(nodeEl)
{jQuery.iUtil.traverseDOM(nodeEl,function(el)
{for(var attr in el){if(typeof el[attr]==='function'){el[attr]=null;}}});},centerEl:function(el,axis)
{var clientScroll=jQuery.iUtil.getScroll();var windowSize=jQuery.iUtil.getSize(el);if(!axis||axis=='vertically')
jQuery(el).css({top:clientScroll.t+((Math.max(clientScroll.h,clientScroll.ih)-clientScroll.t-windowSize.hb)/2)+'px'});if(!axis||axis=='horizontally')
jQuery(el).css({left:clientScroll.l+((Math.max(clientScroll.w,clientScroll.iw)-clientScroll.l-windowSize.wb)/2)+'px'});},fixPNG:function(el,emptyGIF){var images=jQuery('img[@src*="png"]',el||document),png;images.each(function(){png=this.src;this.src=emptyGIF;this.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+png+"')";});}};[].indexOf||(Array.prototype.indexOf=function(v,n){n=(n==null)?0:n;var m=this.length;for(var i=n;i<m;i++)
if(this[i]==v)
return i;return-1;});jQuery.iFisheye={build:function(options){return this.each(function(){var el=this;el.fisheyeCfg={items:jQuery(options.items,this),container:jQuery(options.container,this),pos:jQuery.iUtil.getPosition(this),itemWidth:options.itemWidth,itemsText:options.itemsText,proximity:options.proximity,valign:options.valign,halign:options.halign,maxWidth:options.maxWidth};jQuery.iFisheye.positionContainer(el,0);jQuery(window).bind('resize',function(){el.fisheyeCfg.pos=jQuery.iUtil.getPosition(el);jQuery.iFisheye.positionContainer(el,0);jQuery.iFisheye.positionItems(el);});jQuery.iFisheye.positionItems(el);el.fisheyeCfg.items.bind('mouseover',function(){var $itens=jQuery(el.fisheyeCfg.itemsText,this);$itens.hide();if($("#sugestoes").css('display')==='none'){if($.browser.msie){jQuery($itens.get(0)).show();}else{jQuery($itens.get(0)).fadeIn("fast");}}}).bind('mouseout',function(){jQuery(jQuery(el.fisheyeCfg.itemsText,this).get(0)).hide();});jQuery("#glb-cabecalho").bind('mousemove',function(e){if($("#sugestoes").css('display')==='none'){var pointer=jQuery.iUtil.getPointer(e);var toAdd=0;if(el.fisheyeCfg.halign&&el.fisheyeCfg.halign=='center'){var posx=pointer.x-el.fisheyeCfg.pos.x-(el.offsetWidth-el.fisheyeCfg.itemWidth*el.fisheyeCfg.items.size())/2-el.fisheyeCfg.itemWidth/2;}else if(el.fisheyeCfg.halign&&el.fisheyeCfg.halign=='right'){var posx=pointer.x-el.fisheyeCfg.pos.x-el.offsetWidth+el.fisheyeCfg.itemWidth*el.fisheyeCfg.items.size();}else{var posx=pointer.x-el.fisheyeCfg.pos.x;}
var posy=Math.pow(pointer.y-el.fisheyeCfg.pos.y-el.offsetHeight/2,2);el.fisheyeCfg.items.each(function(nr){distance=Math.sqrt(Math.pow(posx-nr*el.fisheyeCfg.itemWidth,2)
+posy);distance-=el.fisheyeCfg.itemWidth/2;distance=distance<0?0:distance;distance=distance>el.fisheyeCfg.proximity?el.fisheyeCfg.proximity:distance;distance=el.fisheyeCfg.proximity-distance;extraWidth=el.fisheyeCfg.maxWidth*distance/el.fisheyeCfg.proximity;this.style.width=el.fisheyeCfg.itemWidth+extraWidth+'px';this.style.left=el.fisheyeCfg.itemWidth*nr+toAdd+'px';toAdd+=extraWidth;});jQuery.iFisheye.positionContainer(el,toAdd);}});jQuery("#glb-cabecalho").bind('mouseleave',function(){el.fisheyeCfg.items.each(function(){this.style.width=el.fisheyeCfg.itemWidth+'px';});jQuery.iFisheye.positionItems(el);$(this).find(".holder").hide();});});},positionContainer:function(el,toAdd){if(el.fisheyeCfg.halign)
if(el.fisheyeCfg.halign=='center')
el.fisheyeCfg.container.get(0).style.left=(el.offsetWidth-el.fisheyeCfg.itemWidth*el.fisheyeCfg.items.size())/2-toAdd/2+'px';else if(el.fisheyeCfg.halign=='left')
el.fisheyeCfg.container.get(0).style.left=-toAdd/el.fisheyeCfg.items.size()+'px';else if(el.fisheyeCfg.halign=='right')
el.fisheyeCfg.container.get(0).style.left=(el.offsetWidth-el.fisheyeCfg.itemWidth*el.fisheyeCfg.items.size())-toAdd/2+'px';el.fisheyeCfg.container.get(0).style.width=el.fisheyeCfg.itemWidth*el.fisheyeCfg.items.size()+toAdd+'px';},positionItems:function(el){el.fisheyeCfg.items.each(function(nr){this.style.width=el.fisheyeCfg.itemWidth+'px';this.style.left=el.fisheyeCfg.itemWidth*nr+'px';});}};jQuery.fn.Fisheye=jQuery.iFisheye.build;var bbbUtil={fotoUrlReplace:function(url,formato){if(typeof url!=="string"){return"";};return url.replace(/original/ig,formato);},formata_data:function(d){if(typeof d!=="string"){return"";};var dataStr=d.replace(/-/g,"/")+" GMT-0300",newDate=new Date(dataStr);var arr_semana=new Array("dom","seg","ter","qua","qui","sex","sab");var hoje=new Date();var datastr=newDate.getDate()+"/"+(newDate.getMonth()+1)+"/"+newDate.getFullYear();var hojestr=hoje.getDate()+"/"+(hoje.getMonth()+1)+"/"+hoje.getFullYear();var ontem=(hoje.getDate()-1)+"/"+(hoje.getMonth()+1)+"/"+hoje.getFullYear();if(datastr==hojestr){return"hoje";}else if(datastr==ontem){return"ontem";}else{return(arr_semana[newDate.getDay()]);}},dia:function(d){if(typeof d!=="string"){return"";};var dataStr=d.replace(/-/g,"/")+" GMT-0300",newDate=new Date(dataStr);return newDate.getDate();},dia_server:function(d,isShort){arr=d.split("/");data=new Date(arr[2],arr[1]-1,arr[0]);hoje=new Date(datahora.getFullYear(),datahora.getMonth(),datahora.getDate())
dias=(hoje.getTime()-data.getTime())/86400000;if(isShort==true){var week=["dom","seg","ter","qua","qui","sex","sáb"];return dias==0?'hoje':(dias==1?'ontem':week[data.getDay()]);}else if(dias<8){var week=['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];switch(dias){case 0:return'Hoje';case 1:return'Ontem';case 7:return week[data.getDay()]+(data.getDay()>5?' passado':' passada');default:return week[data.getDay()];}}
return d;},cabecalho:function(o){var html=o.html();try{o.html(html.replace(/\d{2}\/\d{2}\/\d{4}/g,bbbUtil.dia_server));}catch(err){o.html(html);}},evento:function(str){try{document.write(bbbUtil.dia_server(str,true));}catch(err){document.write(str);}},tempo_decorrido:function(d){var agora=typeof(datahora)!="undefined"?datahora:new Date();var timedelta=agora-d,segundos=parseInt(timedelta/1000),minutos=parseInt(segundos/60),horas=parseInt(minutos/60),dias=parseInt(horas/24);if(dias>0)return dias+(dias>1?" dias":" dia");if(horas>0)return horas+(horas>1?" horas":" hora")+(minutos%60>1?" e "+(minutos%60)+" minutos":"");if(minutos>0)return minutos+(minutos>1?" minutos":" minuto");return'menos de 1 minuto';}};$(document).ready(function(){$('a[href^="http://assine.globo.com/"]').attr('target','_blank');});(function($){$.fn.tipTip=function(options){var defaults={activation:"hover",keepAlive:false,maxWidth:"200px",edgeOffset:3,defaultPosition:"bottom",delay:400,fadeIn:200,fadeOut:200,attribute:"title",tipClass:"",content:false,enter:function(){},exit:function(){}};var opts=$.extend(defaults,options);if($("#tiptip_holder").length<=0){var tiptip_holder=$('<div id="tiptip_holder" style="max-width:'+opts.maxWidth+';"></div>');var tiptip_content=$('<div id="tiptip_content"></div>');var tiptip_arrow=$('<div id="tiptip_arrow"></div>');var tiptip_borders=['<!--[if IE]>','<span class="tooltip-border tooltip-top"></span>','<span class="tooltip-border tooltip-right"></span>','<span class="tooltip-border tooltip-bottom"></span>','<span class="tooltip-border tooltip-left"></span>','<![endif]-->'].join('');$("body").append(tiptip_holder.html(tiptip_content).prepend(tiptip_arrow.html('<div id="tiptip_arrow_inner"></div>')).prepend(tiptip_borders));}else{var tiptip_holder=$("#tiptip_holder");var tiptip_content=$("#tiptip_content");var tiptip_arrow=$("#tiptip_arrow");}
return this.each(function(){var org_elem=$(this);if(opts.content){var org_title=opts.content;}else{var org_title="",tooltip_data_id=org_elem.attr("data-tooltip");if(tooltip_data_id){org_title=$("#"+tooltip_data_id).html();}else{org_title=org_elem.attr(opts.attribute);}}
if(org_title!=""){if(!opts.content){org_elem.removeAttr(opts.attribute);}
var timeout=false;if(opts.activation=="hover"){org_elem.hover(function(){active_tiptip();},function(){if(!opts.keepAlive){deactive_tiptip();}});if(opts.keepAlive){tiptip_holder.hover(function(){},function(){deactive_tiptip();});}}else if(opts.activation=="focus"){org_elem.focus(function(){active_tiptip();}).blur(function(){deactive_tiptip();});}else if(opts.activation=="click"){org_elem.click(function(){active_tiptip();return false;}).hover(function(){},function(){if(!opts.keepAlive){deactive_tiptip();}});if(opts.keepAlive){tiptip_holder.hover(function(){},function(){deactive_tiptip();});}}
function active_tiptip(){opts.enter.call(this);tiptip_content.html(org_title);tiptip_holder.hide().removeAttr("class").css("margin","0");tiptip_arrow.removeAttr("style");var top=parseInt(org_elem.offset()['top'],10);var left=parseInt(org_elem.offset()['left'],10);var org_width=parseInt(org_elem.outerWidth(),10);var org_height=parseInt(org_elem.outerHeight(),10);var tip_w=tiptip_holder.outerWidth();var tip_h=tiptip_holder.outerHeight();var w_compare=Math.round((org_width-tip_w)/2);var h_compare=Math.round((org_height-tip_h)/2);var marg_left=Math.round(left+w_compare);var marg_top=Math.round(top+org_height+opts.edgeOffset);var t_class="";var arrow_top="";var arrow_left=Math.round(tip_w-12)/2;if(opts.defaultPosition=="bottom"){t_class="_bottom";}else if(opts.defaultPosition=="top"){t_class="_top";}else if(opts.defaultPosition=="left"){t_class="_left";}else if(opts.defaultPosition=="right"){t_class="_right";}
var right_compare=(w_compare+left)<parseInt($(window).scrollLeft(),10);var left_compare=(tip_w+left)>parseInt($(window).width(),10);if((right_compare&&w_compare<0)||(t_class=="_right"&&!left_compare)||(t_class=="_left"&&left<(tip_w+opts.edgeOffset+5))){t_class="_right";arrow_top=Math.round(tip_h-13)/2;arrow_left=-12;marg_left=Math.round(left+org_width+opts.edgeOffset);marg_top=Math.round(top+h_compare);}else if((left_compare&&w_compare<0)||(t_class=="_left"&&!right_compare)){t_class="_left";arrow_top=Math.round(tip_h-13)/2;arrow_left=Math.round(tip_w);marg_left=Math.round(left-(tip_w+opts.edgeOffset+5));marg_top=Math.round(top+h_compare);}
var top_compare=(top+org_height+opts.edgeOffset+tip_h+8)>parseInt($(window).height()+$(window).scrollTop(),10);var bottom_compare=((top+org_height)-(opts.edgeOffset+tip_h+8))<0;if(top_compare||(t_class=="_bottom"&&top_compare)||(t_class=="_top"&&!bottom_compare)){if(t_class=="_top"||t_class=="_bottom"){t_class="_top";}else{t_class=t_class+"_top";}
arrow_top=tip_h;marg_top=Math.round(top-(tip_h+5+opts.edgeOffset));}else if(bottom_compare|(t_class=="_top"&&bottom_compare)||(t_class=="_bottom"&&!top_compare)){if(t_class=="_top"||t_class=="_bottom"){t_class="_bottom";}else{t_class=t_class+"_bottom";}
arrow_top=-12;marg_top=Math.round(top+org_height+opts.edgeOffset);}
if(t_class=="_right_top"||t_class=="_left_top"){marg_top=marg_top+5;}else if(t_class=="_right_bottom"||t_class=="_left_bottom"){marg_top=marg_top-5;}
if(t_class=="_left_top"||t_class=="_left_bottom"){marg_left=marg_left+5;}
tiptip_arrow.css({"margin-left":arrow_left+"px","margin-top":arrow_top+"px"});tiptip_holder.css({"margin-left":marg_left+"px","margin-top":marg_top+"px"}).attr("class","tip"+t_class);tiptip_holder.addClass(opts.tipClass);if(timeout){clearTimeout(timeout);}
timeout=setTimeout(function(){tiptip_holder.stop(true,true).fadeIn(opts.fadeIn);preventAnimationOnIE();},opts.delay);}
function deactive_tiptip(){opts.exit.call(this);if(timeout){clearTimeout(timeout);}
tiptip_holder.fadeOut(opts.fadeOut);preventAnimationOnIE();}
function preventAnimationOnIE(){if($.browser.msie){tiptip_holder.stop(true,true);}}}});};})(jQuery);(function(window){var re=/.*[A-Z]{3}(\d+)-.*/;var MatchIdVideo=function(urlVideo){var f=re.exec(urlVideo);return(f)?f[1]:"";};window.MatchIdVideo=MatchIdVideo;})(window||this);(function($){$.fn.bbbFlow=function(){return this.each(function(){slider=$(this).find('.bbbFlow');prevButton=$(this).find('.bbbFlowPrev');nextButton=$(this).find('.bbbFlowNext');container=slider.parent();step=container.height();container.css('position','relative');slider.css('position','relative');if(hasMoreSlides()){enable(nextButton);}
prevButton.bind('click.bbbFlow',prev);nextButton.bind('click.bbbFlow',next);});};var slider,prevButton,nextButton,container,step,sliding=false;function disable(elm){elm.addClass('inactive');}
function enable(elm){elm.removeClass('inactive');}
function getPosition(){var top=parseInt(slider.css('top'),10);return Math.abs(top);}
function hasMoreSlides(){return slider.height()>container.height();}
function isGoingToFirstSlide(){return getPosition()-step==0;}
function isGoingToLastSlide(){var bottomPosition=getPosition()+step;return bottomPosition+step+10>slider.height();}
function next(evt){if(nextButton.is('.inactive')){return false;}
enable(nextButton);enable(prevButton);if(isGoingToLastSlide()){disable(nextButton);}
if(!sliding){sliding=true;slider.animate({top:'-='+step},{duration:500,complete:function(){sliding=false;}});}
evt.preventDefault();}
function prev(evt){if(prevButton.is('.inactive')){return false;}
enable(prevButton);enable(nextButton);if(isGoingToFirstSlide()){disable(prevButton);}
if(!sliding){sliding=true;slider.animate({top:'+='+step},{duration:500,complete:function(){sliding=false;}});}
evt.preventDefault();}})(jQuery);(function($){$.fn.widgetEventos=function(){if(this.find('li.evento').length>1){if(this.is('.widget-eventos')){truncateText(this.find('a.titulo'),48);truncateText(this.find('p.texto'),85);}
else if(this.is('.widget-eventos-triplo')){truncateText(this.find('a.titulo'),52);truncateText(this.find('p.texto'),95);}
else if(this.is('.widget-eventos-wide')){truncateText(this.find('a.titulo'),40);truncateText(this.find('p.texto'),110);}
this.show().find('div.wrap').cycle({fx:'scrollHorz',speed:400,timeout:0,nowrap:true,next:this.find('.proximo'),prev:this.find('.anterior'),after:function(current,next,opts){var firstIndex=0,currentIndex=opts.currSlide,lastIndex=opts.slideCount-1;$(opts.prev)[currentIndex===firstIndex?'addClass':'removeClass']('inativo');$(opts.next)[currentIndex===lastIndex?'addClass':'removeClass']('inativo');}});}else if(this.find('li.evento').length==1){this.show().find('.proximo,.anterior').click(function(){return false;});}};function truncateText(element,limit){element.each(function(i){var text=$(this).html();if(text.length>limit){$(this).html(text.substring(0,limit)+'...');}});}})(jQuery);