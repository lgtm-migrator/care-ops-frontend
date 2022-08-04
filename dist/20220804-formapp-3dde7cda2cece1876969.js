"use strict";(globalThis.webpackChunkcare_ops_frontend=globalThis.webpackChunkcare_ops_frontend||[]).push([[891],{8172:(e,t,o)=>{o.r(t),o.d(t,{startFormApp:()=>L}),o(3923);var n=o(7198),r=o(5291),s=o.n(r),i=o(8088),a=o.n(i),u=o(9230),m=o.n(u),c=o(6031),d=o(2182);const l=Formio.Displays.displays.webform.prototype.init;Formio.Displays.displays.webform.prototype.init=function(){if(this.options.data){const e=(0,n.l7)({},this.options.data);this._submission={data:e},this._data=e}l.call(this)};const p=Formio.Evaluator.evaluator;Formio.Evaluator.evaluator=function(e){try{for(var t=arguments.length,o=new Array(t>1?t-1:0),n=1;n<t;n++)o[n-1]=arguments[n];return p(e,...o)}catch(e){console.error(e)}};const h=Formio.Evaluator.evaluate;function f(e,t,o,r){return Formio.createForm(document.createElement("div"),{},{evalContext:r}).then((r=>{const s=(0,n.u4)(o,((t,o)=>FormioUtils.evaluate(o,r.evalContext({formSubmission:t,formData:e}))||t),t);return r.destroy(),s}))}Formio.Evaluator.evaluate=function(e){try{for(var t=arguments.length,o=new Array(t>1?t-1:0),n=1;n<t;n++)o[n-1]=arguments[n];return h(e,...o)}catch(e){console.error(e)}};const g=Formio.Components.components.nested,v=Formio.Components.components.select;class y extends v{static schema(){for(var e=arguments.length,t=new Array(e),o=0;o<e;o++)t[o]=arguments[o];return v.schema({label:"Directory",key:"directory",type:"directory",dataSrc:"custom",searchField:!0,customOptions:{noChoicesText:"Type a minimum of 3 characters for results"}},...t)}get defaultSchema(){return y.schema()}constructor(){super(...arguments),this.updateCustomItems=(0,n.Ds)(this.updateCustomItems,300)}updateItems(e,t){this.visible?this.updateCustomItems(t,e):this.itemsLoadedResolve()}getCustomItems(e){return!e||e.length<3?Promise.resolve([]):this.evaluate(this.component.data.custom,{values:[],searchInput:e},"values")}updateCustomItems(e,t){e||this.active?(this.loading=!0,this.getCustomItems(t).then((e=>{this.loading=!1,this.setItems(e||[])})).catch((e=>{this.handleLoadingError(e)}))):this.itemsLoadedResolve()}}Formio.use({components:{snippet:class extends g{constructor(){super(...arguments),this.noField=!0}static schema(){for(var e=arguments.length,t=new Array(e),o=0;o<e;o++)t[o]=arguments[o];return g.schema({label:"Snippet",key:"snippet",type:"snippet",components:[],input:!1,persistent:!1,snippet:null},...t)}},directory:y}});var b=o(4878);let w,F;function C(){window.scrollTo({top:0})}function x(e,t){return w.request("fetch:directory",{directoryName:e,query:t})}function S(e){return function(e,t){return Formio.createForm(document.createElement("div"),{}).then((o=>{const r=(0,n.u4)(e,((e,t)=>(0,n.l7)({},e,FormioUtils.evaluate(t,o.evalContext(e)))),t);return o.destroy(),r}))}(e,{getDirectory:x,Handlebars:m(),TEMPLATES:{},parsePhoneNumber:c._})}const I=function(e,t){const o=function(e,t,o,r){return(0,n.u4)(t,((t,o)=>{const n=e.evalContext({formSubmission:t,prevSubmission:r});return n.hasChanged=FormioUtils.evaluate("return function hasChanged(key) { return !_.isEqual(_.get(formSubmission, key), _.get(prevSubmission, key)); }",n),FormioUtils.evaluate(o,n)||t}),o)}(e,t,structuredClone(e.submission.data),F);e.data=o,e.setSubmission({data:o},{fromChangeReducers:!0,fromSubmission:!1}),F=structuredClone(e.submission.data)},P=(0,n.Ds)(I,100),E=(0,n.Ds)((function(e){w.request("update:storedSubmission",e)}),2e3);async function k(e){let{definition:t,storedSubmission:o,formData:r,formSubmission:s,reducers:i,changeReducers:a,contextScripts:u,beforeSubmit:m}=e;const c=await S(u),d=o||await f(r,s,i,c);F=structuredClone(d);const l=await Formio.createForm(document.getElementById("root"),t,{evalContext:c,data:d,onChange(e,t){let{fromChangeReducers:o}=e,{instance:n}=t;o&&l.initialized||n&&n.inEditGrid||(E(l.submission.data),P(l,a))}});l.nosubmit=!0,w.off("form:submit"),w.off("form:errors"),w.on({"form:errors"(e){l.showErrors((0,n.UI)(e,(e=>({message:e}))),!0)},"form:submit"(){l.setPristine(!1),l.checkValidity(l.submission.data,!0,l.submission.data)&&l.submit()}}),l.on("prevPage",C),l.on("nextPage",C),l.on("error",(()=>{w.request("ready:form")})),l.on("submit",(e=>{if(P.cancel(),I(l,a),l.setPristine(!1),!l.checkValidity(e.data,!0,e.data))return;const t=FormioUtils.evaluate(m,l.evalContext({formSubmission:e.data}));w.request("submit:form",{response:(0,n.l7)({},e,{data:t})})})),w.request("ready:form")}async function q(e){let{definition:t,contextScripts:o}=e;const r=await S(o);(0,n.l7)(r,{isPreview:!0}),Formio.createForm(document.getElementById("root"),t,{evalContext:r})}async function D(e){let{definition:t,formSubmission:o,contextScripts:r}=e;const s=await S(r);(0,n.l7)(s,{isResponse:!0}),Formio.createForm(document.getElementById("root"),t,{readOnly:!0,renderMode:"form",evalContext:s,data:o}).then((e=>{e.on("prevPage",C),e.on("nextPage",C)}))}async function R(e){let{definition:t,formData:o,formSubmission:n,reducers:r,contextScripts:s}=e;const i=await S(s),a=await f(o,n,r,i);(await Formio.createForm(document.getElementById("root"),t,{evalContext:i,data:a})).nosubmit=!0}const _=a().Router.extend({initialize(){window.addEventListener("message",(e=>{let{data:t,origin:o}=e;o===window.origin&&t&&t.message&&this.trigger(t.message,t.args)}),!1),this.on("print:form",(()=>{window.print()})),this.request("version",d.dd.frontend)},request(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return new Promise((o=>{this.once(e,o),parent.postMessage({message:e,args:t},window.origin)}))},routes:{"formapp/":"renderForm","formapp/preview":"renderPreview","formapp/:id":"renderResponse","formapp/pdf/:formId/:patientId(/:responseId)":"renderPdf"},renderForm(){this.request("fetch:form:data").then(k)},renderPreview(){this.request("fetch:form").then(q)},renderResponse(e){this.request("fetch:form:response",{responseId:e}).then(D)},renderPdf(e,t,o){this.once("form:pdf",R),s()("body").append(`<iframe class="iframe-hidden" src="/formservice/${e}/${t}${o?`/${o}`:""}"></iframe>`)}});function L(){new b.Z({el:"#root"}).startPreloader(),w=new _,a().history.start({pushState:!0})}},4878:(e,t,o)=>{o.d(t,{Z:()=>c});var n=o(9230),r=o.n(n),s=o(7198),i=o(2681),a=o(6718);const u=r().template({1:function(e,t,o,n,r){return'<div class="spinner-child"></div>'},compiler:[8,">= 4.3.0"],main:function(e,t,o,n,r){var s,i=e.lookupProperty||function(e,t){if(Object.prototype.hasOwnProperty.call(e,t))return e[t]};return'\n  <div class="spinner-circle js-spinner" style="opacity:0">\n  '+(null!=(s=i(o,"each").call(null!=t?t:e.nullContext||{},null!=t?i(t,"dots"):t,{name:"each",hash:{},fn:e.program(1,r,0),inverse:e.noop,data:r,loc:{start:{line:3,column:2},end:{line:3,column:58}}}))?s:"")+'\n  </div>\n  <p class="spinner-text js-loading" style="opacity:0">'+e.escapeExpression(e.lambda((s=(s=(s=r&&i(r,"intl"))&&i(s,"regions"))&&i(s,"preload"))&&i(s,"loading"),t))+"</p>\n"},useData:!0}),m=a.View.extend({className:"spinner",template:u,ui:{spinner:".js-spinner",loading:".js-loading"},onRender(){const e=this.getOption("timeout");e?this.showLoader(e/2,e/2+200):this.showLoader(0,300)},showLoader(e,t){i.Z.timeline({easing:"easeInQuad",delay:e}).add({opacity:[0,1],targets:this.ui.spinner[0],duration:t}).add({opacity:[0,1],targets:this.ui.loading[0],duration:t-100},100)},templateContext:{dots:(0,s.w6)(12)}}),c=a.Region.extend({timeout:500,startPreloader(){this.show(new m({timeout:this.getOption("timeout")}))}})}}]);