/*! nice-validator 0.10.11
 * (c) 2012-2016 Jony Zhang <niceue@live.com>, MIT Licensed
 * https://github.com/niceue/nice-validator
 */
!function(e){"function"==typeof define&&(define.amd||define.cmd)?define([],function(){return e}):e(jQuery)}(function(e,t){"use strict";function i(t,n){function s(){a._init(a.$el[0],n)}var a=this;return a instanceof i?(a.$el=e(t),void(a.$el.length?i.loading?e(window).on("validatorready",s):s():Q(t)&&(Z[t]=n))):new i(t,n)}function n(e,t){if(X(e)){var i,s=t?t===!0?this:t:n.prototype;for(i in e)g(i)&&(s[i]=a(e[i]))}}function s(e,t){if(X(e)){var i,n=t?t===!0?this:t:s.prototype;for(i in e)n[i]=e[i]}}function a(t){switch(e.type(t)){case"function":return t;case"array":var i=function(e){return t.msg=t[1],t[0].test(K(e))||t[1]||!1};return i.msg=t[1],i;case"regexp":return function(e){return t.test(K(e))}}}function r(t){var i,n,s;if(t&&t.tagName){switch(t.tagName){case"INPUT":case"SELECT":case"TEXTAREA":case"BUTTON":case"FIELDSET":i=t.form||e(t).closest("."+b);break;case"FORM":i=t;break;default:i=e(t).closest("."+b)}for(n in Z)if(e(i).is(n)){s=Z[n];break}return e(i).data(v)||e(i)[v](s).data(v)}}function l(e,t){var i=W(G(e,O+"-"+t));if(i)return i=new Function("return "+i)(),i?a(i):void 0}function o(e,t,i){var n=t.msg,s=t._r;return X(n)&&(n=n[s]),Q(n)||(n=G(e,V+"-"+s)||G(e,V)||(i?Q(i)?i:i[s]:"")),n}function u(e){var t;return e&&(t=B.exec(e)),t&&t[0]}function d(e){return Q(e)||X(e)&&("error"in e||"ok"in e)?e:void 0}function c(e){return"INPUT"===e.tagName&&"checkbox"===e.type||"radio"===e.type}function f(e){return Date.parse(e.replace(/\.|\-/g,"/"))}function g(e){return/^\w+$/.test(e)}function m(e){return"#"===e.charAt(0)?e.replace(/(:|\.|\[|\])/g,"\\$1"):'[name="'+e+'"]:input'}var p,h,v="validator",_="."+v,y=".rule",k=".field",w=".form",b="nice-"+v,M="msg-box",x="aria-required",$="aria-invalid",O="data-rule",V="data-msg",C="data-tip",A="data-ok",F="data-timely",T="data-target",E="data-display",j="data-must",R="novalidate",N=":verifiable",S=/(&)?(!)?\b(\w+)(?:\[\s*(.*?\]?)\s*\]|\(\s*(.*?\)?)\s*\))?\s*(;|\|)?/g,D=/(\w+)(?:\[\s*(.*?\]?)\s*\]|\(\s*(.*?\)?)\s*\))?/,q=/(?:([^:;\(\[]*):)?(.*)/,I=/[^\x00-\xff]/g,B=/top|right|bottom|left/,L=/(?:(cors|jsonp):)?(?:(post|get):)?(.+)/i,U=/[<>'"`\\]|&#x?\d+[A-F]?;?|%3[A-F]/gim,H=e.noop,P=e.proxy,W=e.trim,J=e.isFunction,Q=function(e){return"string"==typeof e},X=function(e){return e&&"[object Object]"===Object.prototype.toString.call(e)},z=document.documentMode||+(navigator.userAgent.match(/MSIE (\d+)/)&&RegExp.$1),G=function(e,i,n){return e&&e.tagName?n===t?e.getAttribute(i):void(null===n?e.removeAttribute(i):e.setAttribute(i,""+n)):null},K=function(t){return e(t).val()},Y=window.console||{log:H,info:H},Z={},ee={debug:0,timely:1,theme:"default",ignore:"",focusInvalid:!0,beforeSubmit:H,msgWrapper:"span",msgMaker:function(t){var i;return i='<span role="alert" class="msg-wrap n-'+t.type+'">'+t.arrow,t.result?e.each(t.result,function(e,n){i+='<span class="n-'+n.type+'">'+t.icon+'<span class="n-msg">'+n.msg+"</span></span>"}):i+=t.icon+'<span class="n-msg">'+t.msg+"</span>",i+="</span>"},msgArrow:"",msgIcon:'<span class="n-icon"></span>',msgClass:"",validClass:"n-valid",invalidClass:"n-invalid"},te={"default":{formClass:"n-default",msgClass:"n-right"}};e.fn[v]=function(t){var n=this,s=arguments;return n.is(":input")?n:(!n.is("form")&&(n=this.find("form")),!n.length&&(n=this),n.each(function(){var n=e(this).data(v);if(n)if(Q(t)){if("_"===t.charAt(0))return;n[t].apply(n,Array.prototype.slice.call(s,1))}else t&&(n._reset(!0),n._init(this,t));else new i(this,t)}),this)},e.fn.isValid=function(e,t){var i,n,s=r(this[0]),a=J(e);return s?(s.checkOnly=!!t,n=s.options,i=s._multiValidate(this.is(":input")?this:this.find(N),function(t){t||!n.focusInvalid||s.checkOnly||s.$el.find("["+$+"]:first").focus(),a&&(e.length?e(t):t&&e()),s.checkOnly=!1}),a?this:i):!0},e.expr[":"].verifiable=function(e){var t=e.nodeName.toLowerCase();return("input"===t&&!{submit:1,button:1,reset:1,image:1}[e.type]||"select"===t||"textarea"===t)&&e.disabled===!1},e.expr[":"].filled=function(e){return!!W(K(e))},i.prototype={_init:function(t,i){var a,r,l,o=this;J(i)&&(i={valid:i}),i=i||{},l=G(t,"data-"+v+"-option"),l=l&&"{"===l.charAt(0)?new Function("return "+l)():{},r=te[i.theme||l.theme||ee.theme],a=o.options=e.extend({},ee,r,o.options,i,l),o.rules=new n(a.rules,!0),o.messages=new s(a.messages,!0),o.elements=o.elements||{},o.deferred={},o.errors={},o.fields={},o._initFields(a.fields),o.msgOpt={type:"error",pos:u(a.msgClass),wrapper:a.msgWrapper,cls:a.msgClass,style:a.msgStyle,arrow:a.msgArrow,icon:a.msgIcon,show:a.msgShow,hide:a.msgHide},Q(a.target)&&o.$el.find(a.target).addClass("msg-container"),o.$el.data(v)||(o.$el.data(v,o).addClass(b+" "+a.formClass).on("submit"+_+" validate"+_,P(o,"_submit")).on("reset"+_,P(o,"_reset")).on("showmsg"+_,P(o,"_showmsg")).on("hidemsg"+_,P(o,"_hidemsg")).on("focusin"+_+" click"+_,N,P(o,"_focusin")).on("focusout"+_+" validate"+_,N,P(o,"_focusout")),a.timely&&o.$el.on("keyup"+_+" input"+_+" compositionstart compositionend",N,P(o,"_focusout")).on("click"+_,":radio,:checkbox","click",P(o,"_focusout")).on("change"+_,'select,input[type="file"]',"change",P(o,"_focusout")),o._novalidate=G(t,R),G(t,R,R))},_guessAjax:function(t){var i=this;if(!(i.isAjaxSubmit=!!i.options.valid)){var n=(e._data||e.data)(t,"events");n&&n.valid&&e.map(n.valid,function(e){return~e.namespace.indexOf("form")?1:null}).length&&(i.isAjaxSubmit=!0)}},_initFields:function(t){var i=this,n=null===t;n&&(t=i.fields),X(t)&&e.each(t,function(e,t){if(null===t||n){var s=i.elements[e];s&&i._resetElement(s,!0),delete i.fields[e]}else i.fields[e]=Q(t)?{rule:t}:t}),i.$el.find(N).each(function(){i._parse(this)})},_parse:function(e){var t,i,n=this,s=n.options,a=e.name,r=G(e,O);return r&&G(e,O,null),(e.id&&"#"+e.id in n.fields||!a||null!==r&&(t=n.fields[a])&&r!==t.rule&&t.key!==e.id)&&(a="#"+e.id),a?(t=n.fields[a]||{},t.key=a,t.rule=r||t.rule||"",t.display||!(t.display=G(e,E))&&s.display&&(t.display=s.display),t.rule&&((null!==G(e,j)||/match\(|checked/.test(t.rule))&&(t.must=!0),~t.rule.indexOf("required")&&(t.required=!0,G(e,x,!0)),"showOk"in t||(t.showOk=s.showOk),i=G(e,F),i?t.timely=+i:"timely"in t&&G(e,F,+t.timely),t=n._parseRule(t),t.old={}),Q(t.target)&&G(e,T,t.target),Q(t.tip)&&G(e,C,t.tip),n.fields[a]=t):void 0},_parseRule:function(i){var n=q.exec(i.rule);if(n)return i._i=0,n[1]&&(i.display=n[1]),n[2]&&(i.rules=[],n[2].replace(S,function(){var n=arguments;n[4]=n[4]||n[5],i.rules.push({and:"&"===n[1],not:"!"===n[2],or:"|"===n[6],method:n[3],params:n[4]?e.map(n[4].split(", "),function(e){return W(e)}):t})})),i},_multiValidate:function(i,n){var s=this,a=s.options;return s.hasError=!1,a.ignore&&(i=i.not(a.ignore)),i.each(function(){return s._validate(this),s.hasError&&a.stopOnError?!1:void 0}),n&&(s.validating=!0,e.when.apply(null,e.map(s.deferred,function(e){return e})).done(function(){n.call(s,!s.hasError),s.validating=!1})),e.isEmptyObject(s.deferred)?!s.hasError:t},_submit:function(i){function n(){var e,t;h=!0,p&&(e=p.name)?(p.name="",t=r.submit,s.$el.append('<input type="hidden" name="'+e+'" value="'+p.value+'">'),t.call(r)):r.submit()}var s=this,a=s.options,r=i.target,l="submit"===i.type&&!i.isDefaultPrevented();i.preventDefault(),h&&~(h=!1)||s.submiting||"validate"===i.type&&s.$el[0]!==r||a.beforeSubmit.call(s,r)===!1||(s.isAjaxSubmit===t&&s._guessAjax(r),a.debug&&Y.log("\n<<< event: "+i.type),s._reset(),s.submiting=!0,s._multiValidate(s.$el.find(N),function(t){var i,o=t||2===a.debug?"valid":"invalid";t||(a.focusInvalid&&s.$el.find("["+$+"]:first").focus(),i=e.map(s.errors,function(e){return e})),s.submiting=!1,s.isValid=t,J(a[o])&&a[o].call(s,r,i),s.$el.trigger(o+w,[r,i]),a.debug&&Y.log(">>> "+o),t&&l&&!s.isAjaxSubmit&&n()}))},_reset:function(e){var t=this;t.errors={},e&&(t.reseting=!0,t.$el.find(N).each(function(e,i){t._resetElement(i)}),delete t.reseting)},_resetElement:function(e,t){this._setClass(e,null),this.hideMsg(e),t&&G(e,x,null)},_getTimely:function(e,t){var i=G(e,F);return null!==i?+i:+t.timely},_focusin:function(e){var t,i,n=this,s=n.options,a=e.target;n.validating||"click"===e.type&&document.activeElement===a||(s.focusCleanup&&"true"===G(a,$)&&(n._setClass(a,null),n.hideMsg(a)),i=G(a,C),i?n.showMsg(a,{type:"tip",msg:i}):(G(a,O)&&n._parse(a),t=n._getTimely(a,s),8!==t&&9!==t||n._focusout(e)))},_focusout:function(i,n){var s,a,r,l,o,u,d,f=this,g=f.options,m=i.target,p=i.type,h="focusin"===p,v="validate"===p,_=0;if("compositionstart"===p&&(f.pauseValidate=!0),"compositionend"===p&&(f.pauseValidate=!1),!f.pauseValidate&&(s=f.getField(m))){if(s._e=p,a=s.old,r=K(m),!n&&c(m)&&(n=f.$el.find('input[name="'+m.name+'"]').get(0)),d=f._getTimely(n||m,g),!v){if(!d)return;if(g.ignoreBlank&&!r&&!h)return void f.hideMsg(m);if("focusout"===p){if(2===d||8===d){if(!r)return;s.isValid&&!a.showOk?f.hideMsg(m):f._makeMsg(m,s,a)}}else{if(2>d&&!i.data)return;if(l=+new Date,l-(m._ts||0)<100||"keyup"===p&&"input"===m._et)return;if(m._ts=l,m._et=p,"keyup"===p){if(o=i.keyCode,u={8:1,9:1,16:1,32:1,46:1},9===o&&!r)return;if(48>o&&!u[o])return}h||(_=d>=100?d:400)}}g.ignore&&e(m).is(g.ignore)||(clearTimeout(s._t),s.value=r,d!==t&&(s.timely=d),_?s._t=setTimeout(function(){f._validate(m,s)},_):(v&&(s.old={}),f._validate(m,s)))}},_setClass:function(t,i){var n=e(t),s=this.options;s.bindClassTo&&(n=n.closest(s.bindClassTo)),n.removeClass(s.invalidClass+" "+s.validClass),null!==i&&n.addClass(i?s.validClass:s.invalidClass)},_showmsg:function(t,i,n){var s=this,a=t.target;e(a).is(":input")?s.showMsg(a,{type:i,msg:n}):"tip"===i&&s.$el.find(N+"["+C+"]",a).each(function(){s.showMsg(this,{type:i,msg:n})})},_hidemsg:function(t){var i=e(t.target);i.is(":input")&&this.hideMsg(i)},_validatedField:function(t,i,n){var s=this,a=s.options,r=i.isValid=n.isValid=!!n.isValid,l=r?"valid":"invalid";n.key=i.key,n.ruleName=i._r,n.id=t.id,n.value=K(t),r?n.type="ok":(s.submiting&&(s.errors[i.key]=n.msg),s.isValid=!1,s.hasError=!0),s.elements[i.key]=n.element=t,s.$el[0].isValid=r?s.isFormValid():r,i.old=n,J(i[l])&&i[l].call(s,t,n),J(a.validation)&&a.validation.call(s,t,n),e(t).attr($,r?null:!0).trigger(l+k,[n,s]),s.$el.triggerHandler("validation",[n,s]),s.checkOnly||(s._setClass(t,n.skip||"tip"===n.type?null:r),s._makeMsg.apply(s,arguments))},_makeMsg:function(t,i,n){(i.msgMaker||this.options.msgMaker)&&(n=e.extend({},n),"focusin"===i._e&&(n.type="tip"),this[n.showOk||n.msg||"tip"===n.type?"showMsg":"hideMsg"](t,n,i))},_validatedRule:function(i,n,s,a){n=n||c.getField(i),a=a||{};var r,l,u,d,c=this,f=c.options,g=n._r,m=n.timely||f.timely,p=9===m||8===m,h=!1;if(null===s)return void c._validatedField(i,n,{isValid:!0,skip:!0});if(s===t?u=!0:s===!0||""===s?h=!0:Q(s)?r=s:X(s)&&(s.error?r=s.error:(r=s.ok,h=!0)),l=n.rules[n._i],l.not&&(r=t,h="required"===g||!h),l.or)if(h)for(;n._i<n.rules.length&&n.rules[n._i].or;)n._i++;else u=!0;else l.and&&(n.isValid||(u=!0));u?h=!0:(h&&n.showOk!==!1&&(d=G(i,A),r=null===d?Q(n.ok)?n.ok:r:d,!Q(r)&&Q(n.showOk)&&(r=n.showOk),Q(r)&&(a.showOk=h)),h&&!p||(r=(o(i,n,r||l.msg||c.messages[g])||c.messages.fallback).replace(/\{0\|?([^\}]*)\}/,function(){return c._getDisplay(i,n.display)||arguments[1]||c.messages[0]})),h||(n.isValid=h),a.msg=r,e(i).trigger((h?"valid":"invalid")+y,[g,r])),!p||u&&!l.and||(h||n._m||(n._m=r),n._v=n._v||[],n._v.push({type:h?u?"tip":"ok":"error",msg:r||l.msg})),f.debug&&Y.log("   "+n._i+": "+g+" => "+(h||r)),(h||p)&&n._i<n.rules.length-1?(n._i++,c._checkRule(i,n)):(n._i=0,p?(a.isValid=n.isValid,a.result=n._v,a.msg=n._m||"",n.value||"focusin"!==n._e||(a.type="tip")):a.isValid=h,c._validatedField(i,n,a),delete n._m,delete n._v)},_checkRule:function(i,n){var s,a,r,o=this,u=n.key,c=n.rules[n._i],f=c.method,g=K(i),m=c.params;o.submiting&&o.deferred[u]||(r=n.old,n._r=f,r&&!n.must&&!c.must&&c.result!==t&&r.ruleName===f&&r.id===i.id&&g&&r.value===g?s=c.result:(a=l(i,f)||o.rules[f]||H,s=a.call(o,i,m,n),a.msg&&(c.msg=a.msg)),X(s)&&J(s.then)?(o.deferred[u]=s,n.isValid=t,!o.checkOnly&&o.showMsg(i,{type:"loading",msg:o.messages.loading},n),s.then(function(s,a,r){var l,u=r.responseText,f=n.dataFilter||o.options.dataFilter||d;/jsonp?/.test(this.dataType)?u=s:"{"===W(u).charAt(0)&&(u=e.parseJSON(u)),l=f.call(this,u,n),l===t&&(l=f.call(this,u.data,n)),c.data=this.data,c.result=n.old?l:t,o._validatedRule(i,n,l)},function(e,t){o._validatedRule(i,n,o.messages[t]||t)}).always(function(){delete o.deferred[u]})):o._validatedRule(i,n,s))},_validate:function(e,t){var i=this;if(!e.disabled&&null===G(e,R)&&(t=t||i.getField(e),t&&(t.rules||i._parse(e),t.rules)))return i.options.debug&&Y.info(t.key),t.isValid=!0,t.required||t.must||K(e)||c(e)?(i._checkRule(e,t),t.isValid):(i._validatedField(e,t,{isValid:!0}),!0)},test:function(e,i){var n,s,a,r=this,l=D.exec(i);return l&&(s=l[1],s in r.rules&&(a=l[2]||l[3],a=a?a.split(", "):t,n=r.rules[s].call(r,e,a))),n===!0||n===t||null===n},getRangeMsg:function(e,t,i,n){function s(e,t){return d?e>t:e>=t}if(t){var a,r=this,l=i.rules[i._i],o=r.messages[l.method]||"",u=t[0].split("~"),d="false"===t[1],c=u[0],f=u[1],g="rg",m=[""],p=W(e)&&+e===+e;return 2===u.length?c&&f?(p&&s(e,+c)&&s(+f,e)&&(a=!0),m=m.concat(u),g=d?"gtlt":"rg"):c&&!f?(p&&s(e,+c)&&(a=!0),m.push(c),g=d?"gt":"gte"):!c&&f&&(p&&s(+f,e)&&(a=!0),m.push(f),g=d?"lt":"lte"):(e===+c&&(a=!0),m.push(c),g="eq"),o&&(n&&o[g+n]&&(g+=n),m[0]=o[g]),a||(l.msg=r.renderMsg.apply(null,m))}},renderMsg:function(){var e=arguments,t=e[0],i=e.length;if(t){for(;--i;)t=t.replace("{"+i+"}",e[i]);return t}},_getDisplay:function(e,t){return Q(t)?t:J(t)?t.call(this,e):""},_getMsgOpt:function(t){return e.extend({},this.msgOpt,Q(t)?{msg:t}:t)},_getMsgDOM:function(t,i){var n,s,a,r,l=e(t);if(l.is(":input")?(a=i.target||G(t,T),a&&(a=J(a)?a.call(this,t):this.$el.find(a),a.length&&(a.is(":input")?t=a.get(0):a.hasClass(M)?n=a:r=a)),n||(s=c(t)&&t.name||!t.id?t.name:t.id,n=this.$el.find(i.wrapper+"."+M+'[for="'+s+'"]'))):n=l,!n.length)if(l=this.$el.find(a||t),n=e("<"+i.wrapper+">").attr({"class":M+(i.cls?" "+i.cls:""),style:i.style||"","for":s}),c(t)){var o=l.parent();n.appendTo(o.is("label")?o.parent():o)}else r?n.appendTo(r):n[i.pos&&"right"!==i.pos?"insertBefore":"insertAfter"](l);return n},showMsg:function(t,i,n){if(t){var s,a,r,l=this,o=l.options;if(X(t)&&!t.jquery&&!i)return void e.each(t,function(e,t){var i=l.elements[e]||l.$el.find(m(e))[0];l.showMsg(i,t)});i=l._getMsgOpt(i),t=e(t).get(0),i.msg||"error"===i.type||(a=G(t,"data-"+i.type),null!==a&&(i.msg=a)),Q(i.msg)&&(e(t).is(N)&&(n=n||l.getField(t),n&&(i.style=n.msgStyle||i.style,i.cls=n.msgClass||i.cls,i.wrapper=n.msgWrapper||i.wrapper,i.target=n.target||o.target)),(s=(n||{}).msgMaker||o.msgMaker)&&(r=l._getMsgDOM(t,i),!B.test(r[0].className)&&r.addClass(i.cls),6===z&&"bottom"===i.pos&&(r[0].style.marginTop=e(t).outerHeight()+"px"),r.html(s.call(l,i))[0].style.display="",J(i.show)&&i.show.call(l,r,i.type)))}},hideMsg:function(t,i,n){var s,a=this,r=a.options;t=e(t).get(0),i=a._getMsgOpt(i),e(t).is(N)&&(n=n||a.getField(t),n&&((n.isValid||a.reseting)&&G(t,$,null),i.wrapper=n.msgWrapper||i.wrapper,i.target=n.target||r.target)),s=a._getMsgDOM(t,i),s.length&&(J(i.hide)?i.hide.call(a,s,i.type):(s[0].style.display="none",s[0].innerHTML=null))},getField:function(e){var t,i=this;if(Q(e))t=e;else{if(G(e,O))return i._parse(e);t=e.id&&"#"+e.id in i.fields||!e.name?"#"+e.id:e.name}return i.fields[t]},setField:function(e,t){var i={};e&&(Q(e)?i[e]=t:i=e,this._initFields(i))},isFormValid:function(){var e,t,i=this.fields;for(e in i)if(t=i[e],t.rules&&(t.required||t.must||K(m(e)))&&!t.isValid)return t.isValid;return!0},holdSubmit:function(e){this.submiting=e===t||e},cleanUp:function(){this._reset(1)},destroy:function(){this._reset(1),this.$el.off(_).removeData(v),G(this.$el[0],R,this._novalidate)}},e(window).on("beforeunload",function(){this.focus()}),e(document).on("click",":submit",function(){var e,t=this;t.form&&(p=t,e=t.getAttributeNode("formnovalidate"),(e&&null!==e.nodeValue||null!==G(t,R))&&(h=!0))}).on("focusin submit validate","form,."+b,function(t){if(null===G(this,R)){var i,n=e(this);n.data(v)||(i=r(this),e.isEmptyObject(i.fields)?(G(this,R,R),n.off(_).removeData(v)):"focusin"===t.type?i._focusin(t):i._submit(t))}}),new s({fallback:"This field is not valid.",loading:"Validating..."}),new n({required:function(t,i,n){var s=this,a=W(K(t)),r=!0;if(i)if(1===i.length){if(g(i[0])){if(s.rules[i[0]]){if(!a&&!s.test(t,i[0]))return G(t,x,null),null;G(t,x,!0)}}else if(!a&&!e(i[0],s.$el).length)return null}else if("not"===i[0])e.each(i.slice(1),function(){return r=a!==W(this)});else if("from"===i[0]){var l,u=s.$el.find(i[1]),d="_validated_";return r=u.filter(function(){return!!W(K(this))}).length>=(i[2]||1),r?a||(l=null):l=o(u[0],n)||!1,e(t).data(d)||u.data(d,1).each(function(){t!==this&&s._checkRule(this,s.getField(this))}).removeData(d),l}return r&&!!a},integer:function(e,t){var i,n="0|",s="[1-9]\\d*",a=t?t[0]:"*";switch(a){case"+":i=s;break;case"-":i="-"+s;break;case"+0":i=n+s;break;case"-0":i=n+"-"+s;break;default:i=n+"-?"+s}return i="^(?:"+i+")$",new RegExp(i).test(K(e))||this.messages.integer[a]},match:function(t,i,n){if(i){var s,a,r,l,o,u,d,c,g=this,p="eq";if(1===i.length?r=i[0]:(p=i[0],r=i[1]),u=m(r),d=g.$el.find(u)[0]){if(c=g.getField(d),s=K(t),a=K(d),n._match||(g.$el.on("valid"+k+_,u,function(){e(t).trigger("validate")}),n._match=c._match=1),!n.required&&""===s&&""===a)return null;if(o=i[2],o&&(/^date(time)?$/i.test(o)?(s=f(s),a=f(a)):"time"===o&&(s=+s.replace(/:/g,""),a=+a.replace(/:/g,""))),"eq"!==p&&!isNaN(+s)&&isNaN(+a))return!0;switch(l=g.messages.match[p].replace("{1}",g._getDisplay(t,c.display||r)),p){case"lt":return+a>+s||l;case"lte":return+a>=+s||l;case"gte":return+s>=+a||l;case"gt":return+s>+a||l;case"neq":return s!==a||l;default:return s===a||l}}}},range:function(e,t,i){return this.getRangeMsg(K(e),t,i)},checked:function(e,t,i){if(c(e)){var n,s,a=this;return e.name?s=a.$el.find('input[name="'+e.name+'"]').filter(function(){var e=this;return!n&&c(e)&&(n=e),!e.disabled&&e.checked}).length:(n=e,s=n.checked),t?a.getRangeMsg(s,t,i):!!s||o(n,i,"")||a.messages.required}},length:function(e,t,i){var n=K(e),s=("true"===t[1]?n.replace(I,"xx"):n).length;return this.getRangeMsg(s,t,i,t[1]?"_2":"")},remote:function(t,i,n){if(i){var s,a=this,r=L.exec(i[0]),l=n.rules[n._i],o={},u="",d=r[3],c=r[2]||"POST",f=(r[1]||"").toLowerCase();return l.must=!0,o[t.name]=K(t),i[1]&&e.map(i.slice(1),function(e){var t,i;~e.indexOf("=")?u+="&"+e:(t=e.split(":"),e=W(t[0]),i=W(t[1])||e,o[e]=a.$el.find(m(i)).val())}),o=e.param(o)+u,!n.must&&l.data&&l.data===o?l.result:("cors"!==f&&/^https?:/.test(d)&&!~d.indexOf(location.host)&&(s="jsonp"),e.ajax({url:d,type:c,data:o,dataType:s}))}},validate:function(t,i){var n="_validated_";i&&!e(t).data(n)&&this.$el.find(e.map(i,function(e){return m(e)}).join(",")).data(n,1).trigger("validate").removeData(n)},filter:function(e,t){var i,n=K(e);i=n.replace(t?new RegExp("["+t[0]+"]","gm"):U,""),i!==n&&(e.value=i)}}),i.config=function(t){e.each(t,function(e,t){"rules"===e?new n(t):"messages"===e?new s(t):ee[e]=t})},i.setTheme=function(t,i){X(t)?e.extend(!0,te,t):Q(t)&&X(i)&&(te[t]=e.extend(te[t],i))},e[v]=i,function(t){var n,s,a,r,l,o,u=document,d=u.getElementsByTagName("script");if(t)s=d[0],n=t.match(/(.*(?:\/|\?))local(?:\/|=)([\w\-]{2,5})(?=\.js)?/);else for(a=d.length,r=/(.*validator(?:\.min)?.js)\?.*local=([\w\-]*)/;a--&&!n;)s=d[a],n=(s.hasAttribute?s.src:s.getAttribute("src",4)||"").match(r);n&&(l=n[1].split("/").slice(0,-1).join("/")+"/",o=u.createElement("link"),o.rel="stylesheet",o.href=l+"jquery.validator.css",s.parentNode.insertBefore(o,s),t||(i.loading=1,o=u.createElement("script"),o.src=l+"local/"+(n[2]||u.documentElement.lang||"en").replace("_","-")+".js",a="onload"in o?"onload":"onreadystatechange",o[a]=function(){o.readyState&&!/loaded|complete/.test(o.readyState)||(e(window).trigger("validatorready"),delete i.loading,o=o[a]=null)},s.parentNode.insertBefore(o,s)))}(e._VALIDATOR_URI)});


/*********************************
 * Themes, rules, and i18n support
 * Locale: Chinese; 中文
 *********************************/
(function(factory) {
    'function' === typeof define && (define.amd || define.cmd) ? define(function(require, exports, module){
        var $ = require('jquery')||jQuery; $._VALIDATOR_URI = module.uri;
        require('../jquery.validator.min')($);
        factory($);
    }) : factory(jQuery);
}(function($) {

    /* Global configuration
     */
    $.validator.config({
        //stopOnError: true,
        //focusCleanup: true,
        //theme: 'yellow_right',
        //timely: 2,

        // Custom rules
        rules: {
            digits: [/^\d+$/, "请填写数字"]
            ,letters: [/^[a-z]+$/i, "请填写字母"]
            ,date: [/^\d{4}-\d{2}-\d{2}$/, "请填写有效的日期，格式:yyyy-mm-dd"]
            ,time: [/^([01]\d|2[0-3])(:[0-5]\d){1,2}$/, "请填写有效的时间，00:00到23:59之间"]
            ,email: [/^[\w\+\-]+(\.[\w\+\-]+)*@[a-z\d\-]+(\.[a-z\d\-]+)*\.([a-z]{2,4})$/i, "请填写有效的邮箱"]
            ,url: [/^(https?|s?ftp):\/\/\S+$/i, "请填写有效的网址"]
            ,qq: [/^[1-9]\d{4,}$/, "请填写有效的QQ号"]
            ,IDcard: [/^\d{6}(19|2\d)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)?$/, "请填写正确的身份证号码"]
            ,tel: [/^(?:(?:0\d{2,3}[\- ]?[1-9]\d{6,7})|(?:[48]00[\- ]?[1-9]\d{6}))$/, "请填写有效的电话号码"]
            ,mobile: [/^1[3-9]\d{9}$/, "请填写有效的手机号"]
            ,zipcode: [/^\d{6}$/, "请检查邮政编码格式"]
            ,chinese: [/^[\u0391-\uFFE5]+$/, "请填写中文字符"]
            ,username: [/^[a-zA-Z]{1}[a-zA-Z0-9]{5,19}$/, "以字母开头，支持字母、数字，6-20位"]
            ,password: [/^[a-zA-Z0-9_]{6,20}$/, "长度为6-20位的字母、数字、下划线"]
            ,company: [/^([a-zA-Z0-9_\(\)-]|[\u4e00-\u9fa5]|[（）]){4,50}$/, "企业名称长度4-50，只能由中英文、数字及\"_\"、\"-\"、()、（）组成"]
            ,nickName: [/^([a-zA-Z]|[\u4e00-\u9fa5]){2,50}$/, "联系人姓名长度2-50位，只能包括中文字、英文字母"]
            ,money: [/^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/, "请正确填写金额，最多2位小数"]
            ,bankNumber: [/^\d{12,19}$/, '银行卡号是12-19位数字']
            ,accept: function (element, params){
                if (!params) return true;
                var ext = params[0],
                    value = $(element).val();
                return (ext === '*') ||
                       (new RegExp(".(?:" + ext + ")$", "i")).test(value) ||
                       this.renderMsg("只接受{1}后缀的文件", ext.replace(/\|/g, ','));
            }
            
        },

        // Default error messages
        messages: {
            0: "此处",
            fallback: "{0}格式不正确",
            loading: "正在验证...",
            error: "网络异常",
            timeout: "请求超时",
            required: "{0}不能为空",
            remote: "{0}已被使用",
            integer: {
                '*': "请填写整数",
                '+': "请填写正整数",
                '+0': "请填写正整数或0",
                '-': "请填写负整数",
                '-0': "请填写负整数或0"
            },
            match: {
                eq: "{0}与{1}不一致",
                neq: "{0}与{1}不能相同",
                lt: "{0}必须小于{1}",
                gt: "{0}必须大于{1}",
                lte: "{0}不能大于{1}",
                gte: "{0}不能小于{1}"
            },
            range: {
                rg: "请填写{1}到{2}的数",
                gte: "请填写不小于{1}的数",
                lte: "请填写最大{1}的数",
                gtlt: "请填写{1}到{2}之间的数",
                gt: "请填写大于{1}的数",
                lt: "请填写小于{1}的数"
            },
            checked: {
                eq: "请选择{1}项",
                rg: "请选择{1}到{2}项",
                gte: "请至少选择{1}项",
                lte: "请最多选择{1}项"
            },
            length: {
                eq: "请填写{1}个字符",
                rg: "请填写{1}到{2}个字符",
                gte: "请至少填写{1}个字符",
                lte: "请最多填写{1}个字符",
                eq_2: "",
                rg_2: "",
                gte_2: "",
                lte_2: ""
            }
        },
        msgWrapper: 'span',
        msgMaker: function(opt){
            return '<span class="'+ opt.type +'">' + opt.msg + '</span>';
        }
    });

    /* Themes
     */
    var TPL_ARROW = '<span class="n-arrow"><b>◆</b><i>◆</i></span>';
    $.validator.setTheme({
        'simple_right': {
            formClass: 'n-simple',
            msgClass: 'n-right'
        },
        'simple_bottom': {
            formClass: 'n-simple',
            msgClass: 'n-bottom'
        },
        'yellow_top': {
            formClass: 'n-yellow',
            msgClass: 'n-top',
            msgArrow: TPL_ARROW
        },
        'yellow_right': {
            formClass: 'n-yellow',
            msgClass: 'n-right',
            msgArrow: TPL_ARROW
        },
        'yellow_right_effect': {
            formClass: 'n-yellow',
            msgClass: 'n-right',
            msgArrow: TPL_ARROW,
            msgShow: function($msgbox, type){
                var $el = $msgbox.children();
                if ($el.is(':animated')) return;
                if (type === 'error') {
                    $el.css({left: '20px', opacity: 0})
                        .delay(100).show().stop()
                        .animate({left: '-4px', opacity: 1}, 150)
                        .animate({left: '3px'}, 80)
                        .animate({left: 0}, 80);
                } else {
                    $el.css({left: 0, opacity: 1}).fadeIn(200);
                }
            },
            msgHide: function($msgbox, type){
                var $el = $msgbox.children();
                $el.stop().delay(100).show()
                    .animate({left: '20px', opacity: 0}, 300, function(){
                        $msgbox.hide();
                    });
            }
        }
    });
}));