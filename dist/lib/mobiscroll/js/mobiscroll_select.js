!function(e){var t={inputClass:"",invalid:[],rtl:!1,group:!1,groupLabel:"Groups"};e.mobiscroll.presetShort("select"),e.mobiscroll.presets.select=function(l){function a(){var t,l=0,a=[],n=[],s=[[]];return p.group?(p.rtl&&(l=1),e("optgroup",f).each(function(t){a.push(e(this).attr("label")),n.push(t)}),s[l]=[{values:a,keys:n,label:p.groupLabel}],t=g,l+=p.rtl?-1:1):t=f,a=[],n=[],e("option",t).each(function(){var t=e(this).attr("value");a.push(e(this).text()),n.push(t),e(this).prop("disabled")&&b.push(t)}),s[l]=[{values:a,keys:n,label:_}],s}function n(e,t){var a=[];if(h){var n=[],s=0;for(s in l._selectedValues)n.push(T[s]),a.push(s);d.val(n.join(", "))}else d.val(e),a=t?l.values[i]:null;t&&(r=!0,f.val(a).change())}function s(e){if(h&&e.hasClass("dw-v")&&e.closest(".dw").find(".dw-ul").index(e.closest(".dw-ul"))==i){var t=e.attr("data-val"),a=e.hasClass("dw-msel");return a?(e.removeClass("dw-msel").removeAttr("aria-selected"),delete l._selectedValues[t]):(e.addClass("dw-msel").attr("aria-selected","true"),l._selectedValues[t]=t),l.live&&n(t,!0),!1}}var r,o,i,u,d,v,c=e.extend({},l.settings),p=e.extend(l.settings,t,c),f=e(this),h=f.prop("multiple"),w=this.id+"_dummy",m=h?f.val()?f.val()[0]:e("option",f).attr("value"):f.val(),g=f.find('option[value="'+m+'"]').parent(),x=g.index()+"",V=x,C=(e('label[for="'+this.id+'"]').attr("for",w),e('label[for="'+w+'"]')),_=void 0!==p.label?p.label:C.length?C.text():f.attr("name"),b=[],y=[],T={},k=p.readonly;p.group&&!e("optgroup",f).length&&(p.group=!1),p.invalid.length||(p.invalid=b),p.group?p.rtl?(o=1,i=0):(o=0,i=1):(o=-1,i=0),e("#"+w).remove(),d=e('<input type="text" id="'+w+'" class="'+p.inputClass+'" readonly />').insertBefore(f),e("option",f).each(function(){T[e(this).attr("value")]=e(this).text()}),l.attachShow(d);var A=f.val()||[],q=0;for(q;q<A.length;q++)l._selectedValues[A[q]]=A[q];return n(T[m]),f.off(".dwsel").on("change.dwsel",function(){r||l.setValue(h?f.val()||[]:[f.val()],!0),r=!1}).addClass("dw-hsel").attr("tabindex",-1).closest(".ui-field-contain").trigger("create"),l._setValue||(l._setValue=l.setValue),l.setValue=function(t,s,r,o,u){var d,v=e.isArray(t)?t[0]:t;if(m=void 0!==v?v:e("option",f).attr("value"),h){l._selectedValues={};var c=0;for(c;c<t.length;c++)l._selectedValues[t[c]]=t[c]}if(p.group?(g=f.find('option[value="'+m+'"]').parent(),V=g.index(),d=p.rtl?[m,g.index()]:[g.index(),m],V!==x&&(p.wheels=a(),l.changeWheel([i]),x=V+"")):d=[m],l._setValue(d,s,r,o,u),s){var w=h?!0:m!==f.val();n(T[m],w)}},l.getValue=function(e){var t=e?l.temp:l.values;return t[i]},{width:50,wheels:v,headerText:!1,multiple:h,anchor:d,formatResult:function(e){return T[e[i]]},parseValue:function(){var t=f.val()||[],a=0;if(h)for(l._selectedValues={},a;a<t.length;a++)l._selectedValues[t[a]]=t[a];return m=h?f.val()?f.val()[0]:e("option",f).attr("value"):f.val(),g=f.find('option[value="'+m+'"]').parent(),V=g.index(),x=V+"",p.group&&p.rtl?[m,V]:p.group?[V,m]:[m]},validate:function(t,n,s){if(void 0===n&&h){var r=l._selectedValues,d=0;e(".dwwl"+i+" .dw-li",t).removeClass("dw-msel").removeAttr("aria-selected");for(d in r)e(".dwwl"+i+' .dw-li[data-val="'+r[d]+'"]',t).addClass("dw-msel").attr("aria-selected","true")}if(n===o)if(V=l.temp[o],V!==x){if(g=f.find("optgroup").eq(V),V=g.index(),m=g.find("option").eq(0).val(),m=m||f.val(),p.wheels=a(),p.group)return l.temp=p.rtl?[m,V]:[V,m],p.readonly=[p.rtl,!p.rtl],clearTimeout(u),u=setTimeout(function(){l.changeWheel([i],void 0,!0),p.readonly=k,x=V+""},1e3*s),!1}else p.readonly=k;else m=l.temp[i];var v=e(".dw-ul",t).eq(i);e.each(p.invalid,function(t,l){e('.dw-li[data-val="'+l+'"]',v).removeClass("dw-v")})},onBeforeShow:function(t){h&&p.counter&&(p.headerText=function(){var t=0;return e.each(l._selectedValues,function(){t++}),t+" "+p.selectedText}),p.wheels=a(),p.group&&(l.temp=p.rtl?[m,g.index()]:[g.index(),m])},onClear:function(t){l._selectedValues={},d.val(""),e(".dwwl"+i+" .dw-li",t).removeClass("dw-msel").removeAttr("aria-selected")},onMarkupReady:function(t){t.addClass("dw-select"),e(".dwwl"+o,t).on("mousedown touchstart",function(){clearTimeout(u)}),h&&(t.addClass("dwms"),e(".dwwl",t).eq(i).addClass("dwwms").attr("aria-multiselectable","true"),e(".dwwl",t).on("keydown",function(t){32==t.keyCode&&(t.preventDefault(),t.stopPropagation(),s(e(".dw-sel",this)))}),y=e.extend({},l._selectedValues))},onValueTap:s,onSelect:function(e){n(e,!0),p.group&&(l.values=null)},onCancel:function(){p.group&&(l.values=null),!l.live&&h&&(l._selectedValues=e.extend({},y))},onChange:function(e){l.live&&!h&&(d.val(e),r=!0,f.val(l.temp[i]).change())},onDestroy:function(){d.remove(),f.removeClass("dw-hsel").removeAttr("tabindex")}}}}(jQuery);