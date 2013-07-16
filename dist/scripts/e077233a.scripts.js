"use strict";angular.module("pogsUiApp",["ui","ui.bootstrap","ngResource","ngSanitize"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/pog/:id",{templateUrl:"views/pog.html",controller:"PogCtrl"}).when("/mart/:id/:type/:dataset",{templateUrl:"views/mart.html",controller:"MartCtrl"}).when("/search",{templateUrl:"views/search.html",controller:"SearchCtrl"}).when("/search/:page",{templateUrl:"views/search.html",controller:"SearchCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("pogsUiApp").controller("MainCtrl",["$scope","$location","Params",function(a,b,c){a.pogSearch={},a.pogSearch.subCellBool="",a.pogSearch.nuclearBool="",a.pogSearch.ppdbTarget="",a.pogSearch.pog="",a.pogSearchSubmit=function(){c.clear(),c.set({gene:a.pogSearch.gene,tid:a.pogSearch.tid,domain:a.pogSearch.domain,pog:a.pogSearch.pog,type:"byPOG",targetop:a.pogSearch.subCellBool,nucop:a.pogSearch.nuclearBool,location:a.pogSearch.subCellTarget,ppdb:a.pogSearch.ppdbTarget}),b.path("/search")}}]),angular.module("pogsUiApp").controller("PogCtrl",["$scope","$location","$routeParams","Pog","Domains","BlastDomains","Predotar","Targetp","Prednls","Ppdb","Nucpred","Tree",function(a,b,c,d,e,f,g,h,i,j,k,l){a.loadedBlast=!1,a.loadedOrtho=!1,a.loadedGroup=!1,a.loadedTree=!1,a.genemodels=[],a.id=c.id,a.dataset="blast",a.datatype="fasta",a.dataSubmit=function(){b.path("/mart/"+a.id+"/"+a.datatype+"/"+a.dataset)},a.urlmap=function(a){var b="",c={rice:[/()(Os[\w|\d]+\.+[\w|\d]+)()()/,"http://rice.plantbiology.msu.edu/cgi-bin/ORF_infopage.cgi?orf="],poplar:[/()(POPTR\_[\w|\d]+)(\.+)([\w|\d]+)/,"http://www.gramene.org/Populus_trichocarpa/Gene/Summary?g="],arab:[/()(AT[\w|\d]+)(\.+)([\w|\d]+)/,"http://www.arabidopsis.org/servlets/TairObject?type=locus&name="],maize:[/()(GRMZM[\w|\d]+)(\_)([\w|\d]+)/,"http://www.maizesequence.org/Zea_mays/Gene?db=core;g="],acmaize:[/()(AC[\.|\d|_|\w]+)()/,"http://www.maizesequence.org/Zea_mays/Gene?db=core;g="]};return _.each(c,function(c,d){var e=a.match(c[0]);"rice"!=d||_.isNull(e)||(e[2]="LOC_"+e[2]),e&&(b=c[1]+e[2])}),b},a.orgdata=[],a.pog=d.query({id:c.id},function(b){_.each(b.locus,function(b){_.each(b.organismdatum,function(b,c){a.genemodels.push(c),a.orgdata.push(b)})}),a.loadedGroup=!0,a.$broadcast("loadedGroup")}),a.domains=e.query({id:c.id},function(b){return a.loadedOrtho=!0,WZ_Tooltip(),b}),a.blast_domains={},a.loadBlastDomains=function(){0==a.loadedBlast&&(a.blast_domains=f.query({id:c.id},function(){a.loadedBlast=!0}))};var m=function(b,c){var d="http://cas-pogs.uoregon.edu/ui/",e=angular.element(b);if(!a.loadedGroup)return c(!1),void 0;var f=function(){return e.find("branch_length").each(function(){angular.element(this).text("1")}).promise()},g=function(){return e.find("name").each(function(){if(_.include(a.genemodels,angular.element(this).text())){var b=angular.element(this).text();angular.element(this).text(b+"*")}else{var c=angular.element("<annotation><desc>Click to Search For "+angular.element(this).text()+" POG</desc><uri>"+d+"pogs/search/?tid="+angular.element(this).text()+"&type=byPOG</uri></annotation>");angular.element(this).parent().append(c)}}).promise()};angular.element.when(f(),g()).done(c(e[2].outerHTML))};a.loadTree=function(a){m(a[c.id],function(a){var b={phyloxml:a,fileSource:!1};angular.element("#svgCanvas").html(""),new Smits.PhyloCanvas(b,"svgCanvas",1e3,1e3),angular.element("#svgCanvas > svg").attr("height","1100")})},a.$on("loadedGroup",function(){l.query({id:c.id},function(b){a.loadTree(b)})}),a.prednls=i.query({id:c.id}),a.nucpred=k.query({id:c.id}),a.predotar=g.query({id:c.id}),a.targetp=h.query({id:c.id}),a.ppdb=j.query({id:c.id})}]),angular.module("pogsUiApp").controller("MartCtrl",["$scope","$location","$routeParams","Fasta","Align",function(a,b,c,d,e){var f=a.dataset=c.dataset,g=a.type=c.type,h=a.id=c.id;a.loadedFasta=!1,a.loadedAlign=!1,a.loader=!0;var i=function(b){d.query({id:c.id,dataset:b},function(b){a.fasta=[],_.each(b.fasta,function(b){a.fasta.push(">"+b.genemodel+" | "+angular.element.trim(b.desc)+"\n"),a.fasta.push(b.aa_seq+"\n\n")}),a.fasta=a.fasta.join(""),a.loadedFasta=!0,a.loader=!1})},j=function(b){e.query({id:c.id,dataset:b},function(b){a.align=b,a.loadedAlign=!0,a.loader=!1})};a.loadedFasta||"fasta"!=g||i(f),a.loadedAlign||"align"!=g||j(f),a.back=function(){b.path("/pog/"+h)}}]),angular.module("pogsUiApp").controller("SearchCtrl",["$scope","$location","$routeParams","Params","Search",function(a,b,c,d,e){a.page=parseInt(c.page)||1,d.page(a.page),a.total_pages=0,a.loader=!0,a.loadedResults=!1,a.noResults=!1,a.setPage=function(a){b.path("/search/"+a)},a.results=e.query(d.get(),function(b){return 0==b.results.length?(a.loader=!1,a.noResults=!0,void 0):(a.loader=!1,a.loadedResults=!0,a.total_pages=Math.ceil(b.count/25),b)},function(){a.loader=!1,a.noResults=!0})}]),angular.module("pogsUiApp").factory("Pog",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/pog.jsonp",{id:"@id",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",query:{},cache:!0}})}]),angular.module("pogsUiApp").factory("Domains",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/domains.jsonp",{id:"@id",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",query:{},cache:!0}})}]),angular.module("pogsUiApp").factory("Nucpred",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/nucpred.jsonp",{id:"@id",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",isArray:!0,query:{},cache:!0}})}]),angular.module("pogsUiApp").factory("Targetp",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/targetp.jsonp",{id:"@id",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",isArray:!0,query:{},cache:!0}})}]),angular.module("pogsUiApp").factory("Predotar",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/predotar.jsonp",{id:"@id",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",isArray:!0,query:{},cache:!0}})}]),angular.module("pogsUiApp").factory("Prednls",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/prednls.jsonp",{id:"@id",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",isArray:!0,query:{},cache:!0}})}]),angular.module("pogsUiApp").factory("Ppdb",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/ppdb.jsonp",{id:"@id",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",isArray:!0,query:{},cache:!0}})}]),angular.module("pogsUiApp").factory("BlastDomains",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/blast_domains.jsonp",{id:"@id",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",query:{},cache:!0}})}]),angular.module("pogsUiApp").factory("Tree",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/tree.jsonp",{id:"@id",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",query:{},cache:!0}})}]),angular.module("pogsUiApp").factory("Align",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/align.jsonp",{id:"@id",dataset:"@dataset",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",query:{},cache:!0}})}]),angular.module("pogsUiApp").factory("Search",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/search.jsonp",{page:"@page",gene:"@gene",tid:"@tid",domain:"@domain",pog:"@pog",type:"@type",targetop:"@targetop",nucop:"@nucop",location:"@location",ppdb:"@ppdb",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",query:{},cache:!0}})}]),angular.module("pogsUiApp").factory("Fasta",["$resource",function(a){return a("http://cas-pogs.uoregon.edu/dev/api/fasta.jsonp",{id:"@id",dataset:"@dataset",alt:"json",callback:"JSON_CALLBACK"},{query:{method:"JSONP",query:{},cache:!0}})}]),angular.module("pogsUiApp").service("Params",function(){var a={page:"1",gene:"",tid:"",domain:"",pog:"",type:"",targetop:"",nucop:"",location:"",ppdb:""},b=_.clone(a),c=function(){b=_.clone(a)};return{set:function(a){c(),_.each(a,function(b,c){a[c]=b||""}),_.extend(b,a)},get:function(){return b},page:function(a){b.page=a},clear:function(){c()}}});var WZ_Tooltip=function(){function Tip(){tt_Tip(arguments,null)}function TagToTip(){var a=tt_GetElt(arguments[0]);a&&tt_Tip(arguments,a)}function UnTip(){tt_OpReHref(),tt_aV[DURATION]<0&&2&tt_iState?tt_tDurt.Timer("tt_HideInit()",-tt_aV[DURATION],!0):tt_aV[STICKY]&&2&tt_iState||tt_HideInit()}function tt_Extension(){return tt_ExtCmdEnum(),tt_aExt[tt_aExt.length]=this,this}function tt_SetTipPos(a,b){var c=tt_aElt[0].style;if(tt_x=a,tt_y=b,c.left=a+"px",c.top=b+"px",tt_ie56){var d=tt_aElt[tt_aElt.length-1];d&&(d.style.left=c.left,d.style.top=c.top)}}function tt_HideInit(){if(tt_iState){if(tt_ExtCallFncs(0,"HideInit"),tt_iState&=-13,tt_flagOpa&&tt_aV[FADEOUT]&&(tt_tFade.EndTimer(),tt_opa)){var a=Math.round(tt_aV[FADEOUT]/(tt_aV[FADEINTERVAL]*(tt_aV[OPACITY]/tt_opa)));return tt_Fade(tt_opa,tt_opa,0,a),void 0}tt_tHide.Timer("tt_Hide();",1,!1)}}function tt_Hide(){tt_db&&tt_iState&&(tt_OpReHref(),2&tt_iState&&(tt_aElt[0].style.visibility="hidden",tt_ExtCallFncs(0,"Hide")),tt_tShow.EndTimer(),tt_tHide.EndTimer(),tt_tDurt.EndTimer(),tt_tFade.EndTimer(),tt_op||tt_ie||(tt_tWaitMov.EndTimer(),tt_bWait=!1),(tt_aV[CLICKCLOSE]||tt_aV[CLICKSTICKY])&&tt_RemEvtFnc(document,"mouseup",tt_OnLClick),tt_ExtCallFncs(0,"Kill"),tt_t2t&&!tt_aV[COPYCONTENT]&&tt_UnEl2Tip(),tt_iState=0,tt_over=null,tt_ResetMainDiv(),tt_aElt[tt_aElt.length-1]&&(tt_aElt[tt_aElt.length-1].style.display="none"))}function tt_GetElt(a){return document.getElementById?document.getElementById(a):document.all?document.all[a]:null}function tt_GetDivW(a){return a?a.offsetWidth||a.style.pixelWidth||0:0}function tt_GetDivH(a){return a?a.offsetHeight||a.style.pixelHeight||0:0}function tt_GetScrollX(){return window.pageXOffset||(tt_db?tt_db.scrollLeft||0:0)}function tt_GetScrollY(){return window.pageYOffset||(tt_db?tt_db.scrollTop||0:0)}function tt_GetClientW(){return tt_GetWndCliSiz("Width")}function tt_GetClientH(){return tt_GetWndCliSiz("Height")}function tt_GetEvtX(a){return a?typeof a.pageX!=tt_u?a.pageX:a.clientX+tt_GetScrollX():0}function tt_GetEvtY(a){return a?typeof a.pageY!=tt_u?a.pageY:a.clientY+tt_GetScrollY():0}function tt_AddEvtFnc(a,b,c){a&&(a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent("on"+b,c))}function tt_RemEvtFnc(a,b,c){a&&(a.removeEventListener?a.removeEventListener(b,c,!1):a.detachEvent("on"+b,c))}function tt_GetDad(a){return a.parentNode||a.parentElement||a.offsetParent}function tt_MovDomNode(a,b,c){b&&b.removeChild(a),c&&c.appendChild(a)}function tt_Init(){tt_MkCmdEnum(),tt_Browser()&&tt_MkMainDiv()&&(tt_IsW3cBox(),tt_OpaSupport(),tt_AddEvtFnc(document,"mousemove",tt_Move),(TagsToTip||tt_Debug)&&tt_SetOnloadFnc(),tt_AddEvtFnc(window,"unload",tt_Hide))}function tt_MkCmdEnum(){var n=0;for(var i in config)eval("window."+i.toString().toUpperCase()+" = "+n++);tt_aV.length=n}function tt_Browser(){var n,nv,n6,w3c;if(n=navigator.userAgent.toLowerCase(),nv=navigator.appVersion,tt_op=document.defaultView&&typeof eval("window.opera")!=tt_u,tt_ie=-1!=n.indexOf("msie")&&document.all&&!tt_op){var ieOld=!document.compatMode||"BackCompat"==document.compatMode;tt_db=ieOld?document.body||null:document.documentElement,tt_db&&(tt_ie56=parseFloat(nv.substring(nv.indexOf("MSIE")+5))>=5.5&&typeof document.body.style.maxHeight==tt_u)}else tt_db=document.documentElement||document.body||(document.getElementsByTagName?document.getElementsByTagName("body")[0]:null),tt_op||(n6=document.defaultView&&typeof document.defaultView.getComputedStyle!=tt_u,w3c=!n6&&document.getElementById);if(tt_body=document.getElementsByTagName?document.getElementsByTagName("body")[0]:document.body||null,tt_ie||n6||tt_op||w3c)if(tt_body&&tt_db){if(document.attachEvent||document.addEventListener)return!0}else tt_Err("wz_tooltip.js must be included INSIDE the body section, immediately after the opening <body> tag.",!1);return tt_db=null,!1}function tt_MkMainDiv(){return tt_body.insertAdjacentHTML?tt_body.insertAdjacentHTML("afterBegin",tt_MkMainDivHtm()):typeof tt_body.innerHTML!=tt_u&&document.createElement&&tt_body.appendChild&&tt_body.appendChild(tt_MkMainDivDom()),window.tt_GetMainDivRefs&&tt_GetMainDivRefs()?!0:(tt_db=null,!1)}function tt_MkMainDivHtm(){return'<div id="WzTtDiV"></div>'+(tt_ie56?'<iframe id="WzTtIfRm" src="javascript:false" scrolling="no" frameborder="0" style="filter:Alpha(opacity=0);position:absolute;top:0px;left:0px;display:none;"></iframe>':"")}function tt_MkMainDivDom(){var a=document.createElement("div");return a&&(a.id="WzTtDiV"),a}function tt_GetMainDivRefs(){if(tt_aElt[0]=tt_GetElt("WzTtDiV"),tt_ie56&&tt_aElt[0]&&(tt_aElt[tt_aElt.length-1]=tt_GetElt("WzTtIfRm"),tt_aElt[tt_aElt.length-1]||(tt_aElt[0]=null)),tt_aElt[0]){var a=tt_aElt[0].style;return a.visibility="hidden",a.position="absolute",a.overflow="hidden",!0}return!1}function tt_ResetMainDiv(){tt_SetTipPos(0,0),tt_aElt[0].innerHTML="",tt_aElt[0].style.width="0px",tt_h=0}function tt_IsW3cBox(){var a=tt_aElt[0].style;a.padding="10px",a.width="40px",tt_bBoxOld=40==tt_GetDivW(tt_aElt[0]),a.padding="0px",tt_ResetMainDiv()}function tt_OpaSupport(){var a=tt_body.style;tt_flagOpa=typeof a.KhtmlOpacity!=tt_u?2:typeof a.KHTMLOpacity!=tt_u?3:typeof a.MozOpacity!=tt_u?4:typeof a.opacity!=tt_u?5:typeof a.filter!=tt_u?1:0}function tt_SetOnloadFnc(){if(tt_AddEvtFnc(document,"DOMContentLoaded",tt_HideSrcTags),tt_AddEvtFnc(window,"load",tt_HideSrcTags),tt_body.attachEvent&&tt_body.attachEvent("onreadystatechange",function(){"complete"==tt_body.readyState&&tt_HideSrcTags()}),/WebKit|KHTML/i.test(navigator.userAgent))var a=setInterval(function(){/loaded|complete/.test(document.readyState)&&(clearInterval(a),tt_HideSrcTags())},10)}function tt_HideSrcTags(){window.tt_HideSrcTags&&!window.tt_HideSrcTags.done&&(window.tt_HideSrcTags.done=!0,tt_HideSrcTagsRecurs(tt_body)||tt_Err("There are HTML elements to be converted to tooltips.\nIf you want these HTML elements to be automatically hidden, you must edit wz_tooltip.js, and set TagsToTip in the global tooltip configuration to true.",!0))}function tt_HideSrcTagsRecurs(a){for(var b,c,d=a.childNodes||a.children||null,e=d?d.length:0;e;){if(--e,!tt_HideSrcTagsRecurs(d[e]))return!1;if(b=d[e].getAttribute?d[e].getAttribute("onmouseover")||d[e].getAttribute("onclick"):"function"==typeof d[e].onmouseover?d[e].onmouseover||d[e].onclick:null,b&&(c=b.toString().match(/TagToTip\s*\(\s*'[^'.]+'\s*[\),]/),c&&c.length&&!tt_HideSrcTag(c[0])))return!1}return!0}function tt_HideSrcTag(a){var b,c;if(b=a.replace(/.+'([^'.]+)'.+/,"$1"),c=tt_GetElt(b)){if(tt_Debug&&!TagsToTip)return!1;c.style.display="none"}else tt_Err("Invalid ID\n'"+b+"'\npassed to TagToTip()."+" There exists no HTML element with that ID.",!0);return!0}function tt_Tip(a,b){!tt_db||8&tt_iState||(tt_iState&&tt_Hide(),tt_Enabled&&(tt_t2t=b,tt_ReadCmds(a)&&(tt_iState=5,tt_AdaptConfig1(),tt_MkTipContent(a),tt_MkTipSubDivs(),tt_FormatTip(),tt_bJmpVert=!1,tt_bJmpHorz=!1,tt_maxPosX=tt_GetClientW()+tt_GetScrollX()-tt_w-1,tt_maxPosY=tt_GetClientH()+tt_GetScrollY()-tt_h-1,tt_AdaptConfig2(),tt_OverInit(),tt_ShowInit(),tt_Move())))}function tt_ReadCmds(a){var b;b=0;for(var c in config)tt_aV[b++]=config[c];if(1&a.length){for(b=a.length-1;b>0;b-=2)tt_aV[a[b-1]]=a[b];return!0}return tt_Err("Incorrect call of Tip() or TagToTip().\nEach command must be followed by a value.",!0),!1}function tt_AdaptConfig1(){if(tt_ExtCallFncs(0,"LoadConfig"),tt_aV[TITLEBGCOLOR].length||(tt_aV[TITLEBGCOLOR]=tt_aV[BORDERCOLOR]),tt_aV[TITLEFONTCOLOR].length||(tt_aV[TITLEFONTCOLOR]=tt_aV[BGCOLOR]),tt_aV[TITLEFONTFACE].length||(tt_aV[TITLEFONTFACE]=tt_aV[FONTFACE]),tt_aV[TITLEFONTSIZE].length||(tt_aV[TITLEFONTSIZE]=tt_aV[FONTSIZE]),tt_aV[CLOSEBTN]){tt_aV[CLOSEBTNCOLORS]||(tt_aV[CLOSEBTNCOLORS]=new Array("","","",""));for(var a=4;a;)--a,tt_aV[CLOSEBTNCOLORS][a].length||(tt_aV[CLOSEBTNCOLORS][a]=1&a?tt_aV[TITLEFONTCOLOR]:tt_aV[TITLEBGCOLOR]);tt_aV[TITLE].length||(tt_aV[TITLE]=" ")}100!=tt_aV[OPACITY]||typeof tt_aElt[0].style.MozOpacity==tt_u||Array.every||(tt_aV[OPACITY]=99),tt_aV[FADEIN]&&tt_flagOpa&&tt_aV[DELAY]>100&&(tt_aV[DELAY]=Math.max(tt_aV[DELAY]-tt_aV[FADEIN],100))}function tt_AdaptConfig2(){tt_aV[CENTERMOUSE]&&(tt_aV[OFFSETX]-=tt_w-(tt_aV[SHADOW]?tt_aV[SHADOWWIDTH]:0)>>1,tt_aV[JUMPHORZ]=!1)}function tt_MkTipContent(a){tt_sContent=tt_t2t?tt_aV[COPYCONTENT]?tt_t2t.innerHTML:"":a[0],tt_ExtCallFncs(0,"CreateContentString")}function tt_MkTipSubDivs(){var a="position:relative;margin:0px;padding:0px;border-width:0px;left:0px;top:0px;line-height:normal;width:auto;",b=' cellspacing="0" cellpadding="0" border="0" style="'+a+'"><tbody style="'+a+'"><tr><td ';tt_aElt[0].style.width=tt_GetClientW()+"px",tt_aElt[0].innerHTML=""+(tt_aV[TITLE].length?'<div id="WzTiTl" style="position:relative;z-index:1;"><table id="WzTiTlTb"'+b+'id="WzTiTlI" style="'+a+'">'+tt_aV[TITLE]+"</td>"+(tt_aV[CLOSEBTN]?'<td align="right" style="'+a+'text-align:right;">'+'<span id="WzClOsE" style="position:relative;left:2px;padding-left:2px;padding-right:2px;'+"cursor:"+(tt_ie?"hand":"pointer")+';" onmouseover="tt_OnCloseBtnOver(1)" onmouseout="tt_OnCloseBtnOver(0)" onclick="tt_HideInit()">'+tt_aV[CLOSEBTNTEXT]+"</span></td>":"")+"</tr></tbody></table></div>":"")+'<div id="WzBoDy" style="position:relative;z-index:0;">'+"<table"+b+'id="WzBoDyI" style="'+a+'">'+tt_sContent+"</td></tr></tbody></table></div>"+(tt_aV[SHADOW]?'<div id="WzTtShDwR" style="position:absolute;overflow:hidden;"></div><div id="WzTtShDwB" style="position:relative;overflow:hidden;"></div>':""),tt_GetSubDivRefs(),tt_t2t&&!tt_aV[COPYCONTENT]&&tt_El2Tip(),tt_ExtCallFncs(0,"SubDivsCreated")}function tt_GetSubDivRefs(){for(var a=new Array("WzTiTl","WzTiTlTb","WzTiTlI","WzClOsE","WzBoDy","WzBoDyI","WzTtShDwB","WzTtShDwR"),b=a.length;b;--b)tt_aElt[b]=tt_GetElt(a[b-1])}function tt_FormatTip(){var a,b,c,d,e,f=tt_aV[PADDING],g=tt_aV[BORDERWIDTH],h=f+g<<1;tt_aV[TITLE].length?(c=tt_aV[TITLEPADDING],a=tt_aElt[1].style,a.background=tt_aV[TITLEBGCOLOR],a.paddingTop=a.paddingBottom=c+"px",a.paddingLeft=a.paddingRight=c+2+"px",a=tt_aElt[3].style,a.color=tt_aV[TITLEFONTCOLOR],-1==tt_aV[WIDTH]&&(a.whiteSpace="nowrap"),a.fontFamily=tt_aV[TITLEFONTFACE],a.fontSize=tt_aV[TITLEFONTSIZE],a.fontWeight="bold",a.textAlign=tt_aV[TITLEALIGN],tt_aElt[4]&&(a=tt_aElt[4].style,a.background=tt_aV[CLOSEBTNCOLORS][0],a.color=tt_aV[CLOSEBTNCOLORS][1],a.fontFamily=tt_aV[TITLEFONTFACE],a.fontSize=tt_aV[TITLEFONTSIZE],a.fontWeight="bold"),tt_aV[WIDTH]>0?tt_w=tt_aV[WIDTH]:(tt_w=tt_GetDivW(tt_aElt[3])+tt_GetDivW(tt_aElt[4]),tt_aElt[4]&&(tt_w+=f),tt_aV[WIDTH]<-1&&tt_w>-tt_aV[WIDTH]&&(tt_w=-tt_aV[WIDTH])),d=-g):(tt_w=0,d=0),a=tt_aElt[5].style,a.top=d+"px",g&&(a.borderColor=tt_aV[BORDERCOLOR],a.borderStyle=tt_aV[BORDERSTYLE],a.borderWidth=g+"px"),tt_aV[BGCOLOR].length&&(a.background=tt_aV[BGCOLOR]),tt_aV[BGIMG].length&&(a.backgroundImage="url("+tt_aV[BGIMG]+")"),a.padding=f+"px",a.textAlign=tt_aV[TEXTALIGN],tt_aV[HEIGHT]&&(a.overflow="auto",tt_aV[HEIGHT]>0?a.height=tt_aV[HEIGHT]+h+"px":tt_h=h-tt_aV[HEIGHT]),a=tt_aElt[6].style,a.color=tt_aV[FONTCOLOR],a.fontFamily=tt_aV[FONTFACE],a.fontSize=tt_aV[FONTSIZE],a.fontWeight=tt_aV[FONTWEIGHT],a.textAlign=tt_aV[TEXTALIGN],tt_aV[WIDTH]>0?b=tt_aV[WIDTH]:-1==tt_aV[WIDTH]&&tt_w?b=tt_w:(b=tt_GetDivW(tt_aElt[6]),tt_aV[WIDTH]<-1&&b>-tt_aV[WIDTH]&&(b=-tt_aV[WIDTH])),b>tt_w&&(tt_w=b),tt_w+=h,tt_aV[SHADOW]?(tt_w+=tt_aV[SHADOWWIDTH],e=Math.floor(4*tt_aV[SHADOWWIDTH]/3),a=tt_aElt[7].style,a.top=d+"px",a.left=e+"px",a.width=tt_w-e-tt_aV[SHADOWWIDTH]+"px",a.height=tt_aV[SHADOWWIDTH]+"px",a.background=tt_aV[SHADOWCOLOR],a=tt_aElt[8].style,a.top=e+"px",a.left=tt_w-tt_aV[SHADOWWIDTH]+"px",a.width=tt_aV[SHADOWWIDTH]+"px",a.background=tt_aV[SHADOWCOLOR]):e=0,tt_SetTipOpa(tt_aV[FADEIN]?0:tt_aV[OPACITY]),tt_FixSize(d,e)}function tt_FixSize(a,b){var c,d,e,f,g=tt_aV[PADDING],h=tt_aV[BORDERWIDTH];tt_aElt[0].style.width=tt_w+"px",tt_aElt[0].style.pixelWidth=tt_w,d=tt_w-(tt_aV[SHADOW]?tt_aV[SHADOWWIDTH]:0),c=d,tt_bBoxOld||(c-=g+h<<1),tt_aElt[5].style.width=c+"px",tt_aElt[1]&&(c=d-(tt_aV[TITLEPADDING]+2<<1),tt_bBoxOld||(d=c),tt_aElt[1].style.width=d+"px",tt_aElt[2].style.width=c+"px"),tt_h&&(e=tt_GetDivH(tt_aElt[5]),e>tt_h&&(tt_bBoxOld||(tt_h-=g+h<<1),tt_aElt[5].style.height=tt_h+"px")),tt_h=tt_GetDivH(tt_aElt[0])+a,tt_aElt[8]&&(tt_aElt[8].style.height=tt_h-b+"px"),f=tt_aElt.length-1,tt_aElt[f]&&(tt_aElt[f].style.width=tt_w+"px",tt_aElt[f].style.height=tt_h+"px")}function tt_DeAlt(a){var b;if(a&&(a.alt&&(a.alt=""),a.title&&(a.title=""),b=a.childNodes||a.children||null))for(var c=b.length;c;)tt_DeAlt(b[--c])}function tt_OpDeHref(a){if(tt_op)for(tt_elDeHref&&tt_OpReHref();a;){if(a.hasAttribute&&a.hasAttribute("href")){a.t_href=a.getAttribute("href"),a.t_stats=window.status,a.removeAttribute("href"),a.style.cursor="hand",tt_AddEvtFnc(a,"mousedown",tt_OpReHref),window.status=a.t_href,tt_elDeHref=a;break}a=tt_GetDad(a)}}function tt_OpReHref(){tt_elDeHref&&(tt_elDeHref.setAttribute("href",tt_elDeHref.t_href),tt_RemEvtFnc(tt_elDeHref,"mousedown",tt_OpReHref),window.status=tt_elDeHref.t_stats,tt_elDeHref=null)}function tt_El2Tip(){var a=tt_t2t.style;tt_t2t.t_cp=a.position,tt_t2t.t_cl=a.left,tt_t2t.t_ct=a.top,tt_t2t.t_cd=a.display,tt_t2tDad=tt_GetDad(tt_t2t),tt_MovDomNode(tt_t2t,tt_t2tDad,tt_aElt[6]),a.display="block",a.position="static",a.left=a.top=a.marginLeft=a.marginTop="0px"}function tt_UnEl2Tip(){var a=tt_t2t.style;a.display=tt_t2t.t_cd,tt_MovDomNode(tt_t2t,tt_GetDad(tt_t2t),tt_t2tDad),a.position=tt_t2t.t_cp,a.left=tt_t2t.t_cl,a.top=tt_t2t.t_ct,tt_t2tDad=null}function tt_OverInit(){tt_over=window.event?window.event.target||window.event.srcElement:tt_ovr_,tt_DeAlt(tt_over),tt_OpDeHref(tt_over)}function tt_ShowInit(){tt_tShow.Timer("tt_Show()",tt_aV[DELAY],!0),(tt_aV[CLICKCLOSE]||tt_aV[CLICKSTICKY])&&tt_AddEvtFnc(document,"mouseup",tt_OnLClick)}function tt_Show(){var a=tt_aElt[0].style;a.zIndex=Math.max(window.dd&&dd.z?dd.z+2:0,1010),(tt_aV[STICKY]||!tt_aV[FOLLOWMOUSE])&&(tt_iState&=-5),tt_aV[EXCLUSIVE]&&(tt_iState|=8),tt_aV[DURATION]>0&&tt_tDurt.Timer("tt_HideInit()",tt_aV[DURATION],!0),tt_ExtCallFncs(0,"Show"),a.visibility="visible",tt_iState|=2,tt_aV[FADEIN]&&tt_Fade(0,0,tt_aV[OPACITY],Math.round(tt_aV[FADEIN]/tt_aV[FADEINTERVAL])),tt_ShowIfrm()}function tt_ShowIfrm(){if(tt_ie56){var a=tt_aElt[tt_aElt.length-1];if(a){var b=a.style;b.zIndex=tt_aElt[0].style.zIndex-1,b.display="block"}}}function tt_Move(a){if(a&&(tt_ovr_=a.target||a.srcElement),a=a||window.event,a&&(tt_musX=tt_GetEvtX(a),tt_musY=tt_GetEvtY(a)),4&tt_iState){if(!tt_op&&!tt_ie){if(tt_bWait)return;tt_bWait=!0,tt_tWaitMov.Timer("tt_bWait = false;",1,!0)}tt_aV[FIX]?(tt_iState&=-5,tt_PosFix()):tt_ExtCallFncs(a,"MoveBefore")||tt_SetTipPos(tt_Pos(0),tt_Pos(1)),tt_ExtCallFncs([tt_musX,tt_musY],"MoveAfter")}}function tt_Pos(a){var b,c,d,e,f,g,h,i,j;return a?(c=tt_aV[JUMPVERT],d=ABOVE,e=OFFSETY,f=tt_h,g=tt_maxPosY,h=tt_GetScrollY(),i=tt_musY,j=tt_bJmpVert):(c=tt_aV[JUMPHORZ],d=LEFT,e=OFFSETX,f=tt_w,g=tt_maxPosX,h=tt_GetScrollX(),i=tt_musX,j=tt_bJmpHorz),c?b=tt_aV[d]&&(!j||tt_CalcPosAlt(a)>=h+16)?tt_PosAlt(a):!tt_aV[d]&&j&&tt_CalcPosDef(a)>g-16?tt_PosAlt(a):tt_PosDef(a):(b=i,tt_aV[d]?b-=f+tt_aV[e]-(tt_aV[SHADOW]?tt_aV[SHADOWWIDTH]:0):b+=tt_aV[e]),b>g&&(b=c?tt_PosAlt(a):g),h>b&&(b=c?tt_PosDef(a):h),b}function tt_PosDef(a){return a?tt_bJmpVert=tt_aV[ABOVE]:tt_bJmpHorz=tt_aV[LEFT],tt_CalcPosDef(a)}function tt_PosAlt(a){return a?tt_bJmpVert=!tt_aV[ABOVE]:tt_bJmpHorz=!tt_aV[LEFT],tt_CalcPosAlt(a)}function tt_CalcPosDef(a){return a?tt_musY+tt_aV[OFFSETY]:tt_musX+tt_aV[OFFSETX]}function tt_CalcPosAlt(a){var b=a?OFFSETY:OFFSETX,c=tt_aV[b]-(tt_aV[SHADOW]?tt_aV[SHADOWWIDTH]:0);return tt_aV[b]>0&&0>=c&&(c=1),(a?tt_musY-tt_h:tt_musX-tt_w)-c}function tt_PosFix(){var a,b;if("number"==typeof tt_aV[FIX][0])a=tt_aV[FIX][0],b=tt_aV[FIX][1];else for(el="string"==typeof tt_aV[FIX][0]?tt_GetElt(tt_aV[FIX][0]):tt_aV[FIX][0],a=tt_aV[FIX][1],b=tt_aV[FIX][2],!tt_aV[ABOVE]&&el&&(b+=tt_GetDivH(el));el;el=el.offsetParent)a+=el.offsetLeft||0,b+=el.offsetTop||0;tt_aV[ABOVE]&&(b-=tt_h),tt_SetTipPos(a,b)}function tt_Fade(a,b,c,d){d&&(b+=Math.round((c-b)/d),(c>a?b>=c:c>=b)?b=c:tt_tFade.Timer("tt_Fade("+a+","+b+","+c+","+(d-1)+")",tt_aV[FADEINTERVAL],!0)),b?tt_SetTipOpa(b):tt_Hide()}function tt_SetTipOpa(a){tt_SetOpa(tt_aElt[5],a),tt_aElt[1]&&tt_SetOpa(tt_aElt[1],a),tt_aV[SHADOW]&&(a=Math.round(.8*a),tt_SetOpa(tt_aElt[7],a),tt_SetOpa(tt_aElt[8],a))}function tt_OnCloseBtnOver(a){var b=tt_aElt[4].style;a<<=1,b.background=tt_aV[CLOSEBTNCOLORS][a],b.color=tt_aV[CLOSEBTNCOLORS][a+1]}function tt_OnLClick(a){a=a||window.event,a.button&&2&a.button||a.which&&3==a.which||(tt_aV[CLICKSTICKY]&&4&tt_iState?(tt_aV[STICKY]=!0,tt_iState&=-5):tt_aV[CLICKCLOSE]&&tt_HideInit())}function tt_Int(a){var b;return isNaN(b=parseInt(a))?0:b}function tt_GetWndCliSiz(a){var b,c=window["inner"+a],d="client"+a,e="number";if(typeof c==e){var f;return(b=document.body)&&typeof(f=b[d])==e&&f&&c>=f?f:(b=document.documentElement)&&typeof(f=b[d])==e&&f&&c>=f?f:c}return(b=document.documentElement)&&(c=b[d])?c:document.body[d]}function tt_SetOpa(a,b){var c=a.style;if(tt_opa=b,1==tt_flagOpa)if(100>b){typeof a.filtNo==tt_u&&(a.filtNo=c.filter);var d="hidden"!=c.visibility;c.zoom="100%",d||(c.visibility="visible"),c.filter="alpha(opacity="+b+")",d||(c.visibility="hidden")}else typeof a.filtNo!=tt_u&&(c.filter=a.filtNo);else switch(b/=100,tt_flagOpa){case 2:c.KhtmlOpacity=b;break;case 3:c.KHTMLOpacity=b;break;case 4:c.MozOpacity=b;break;case 5:c.opacity=b}}function tt_Err(a,b){(tt_Debug||!b)&&alert("Tooltip Script Error Message:\n\n"+a)}function tt_ExtCmdEnum(){var s;for(var i in config)s="window."+i.toString().toUpperCase(),eval("typeof("+s+") == tt_u")&&(eval(s+" = "+tt_aV.length),tt_aV[tt_aV.length]=null)}function tt_ExtCallFncs(a,b){for(var c=!1,d=tt_aExt.length;d;){--d;var e=tt_aExt[d]["On"+b];e&&e(a)&&(c=!0)}return c}var config=new Object,tt_Debug=!0,tt_Enabled=!0,TagsToTip=!0;config.Above=!1,config.BgColor="#E2E7FF",config.BgImg="",config.BorderColor="#003099",config.BorderStyle="solid",config.BorderWidth=1,config.CenterMouse=!1,config.ClickClose=!1,config.ClickSticky=!1,config.CloseBtn=!1,config.CloseBtnColors=["#990000","#FFFFFF","#DD3333","#FFFFFF"],config.CloseBtnText="&nbsp;X&nbsp;",config.CopyContent=!0,config.Delay=400,config.Duration=0,config.Exclusive=!1,config.FadeIn=100,config.FadeOut=100,config.FadeInterval=30,config.Fix=null,config.FollowMouse=!0,config.FontColor="#000044",config.FontFace="Verdana,Geneva,sans-serif",config.FontSize="8pt",config.FontWeight="normal",config.Height=0,config.JumpHorz=!1,config.JumpVert=!0,config.Left=!1,config.OffsetX=14,config.OffsetY=8,config.Opacity=100,config.Padding=3,config.Shadow=!1,config.ShadowColor="#C0C0C0",config.ShadowWidth=5,config.Sticky=!1,config.TextAlign="left",config.Title="",config.TitleAlign="left",config.TitleBgColor="",config.TitleFontColor="#FFFFFF",config.TitleFontFace="",config.TitleFontSize="",config.TitlePadding=2,config.Width=0;var tt_aElt=new Array(10),tt_aV=new Array,tt_sContent,tt_t2t,tt_t2tDad,tt_musX,tt_musY,tt_over,tt_x,tt_y,tt_w,tt_h,tt_aExt=new Array,tt_db,tt_op,tt_ie,tt_ie56,tt_bBoxOld,tt_body,tt_ovr_,tt_flagOpa,tt_maxPosX,tt_maxPosY,tt_iState=0,tt_opa,tt_bJmpVert,tt_bJmpHorz,tt_elDeHref,tt_tShow=new Number(0),tt_tHide=new Number(0),tt_tDurt=new Number(0),tt_tFade=new Number(0),tt_tWaitMov=new Number(0),tt_bWait=!1,tt_u="undefined";Number.prototype.Timer=function(a,b,c){(!this.value||c)&&(this.value=window.setTimeout(a,b))},Number.prototype.EndTimer=function(){this.value&&(window.clearTimeout(this.value),this.value=0)},tt_Init()};