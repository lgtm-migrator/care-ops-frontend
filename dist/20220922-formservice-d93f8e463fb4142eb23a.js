"use strict";(globalThis.webpackChunkcare_ops_frontend=globalThis.webpackChunkcare_ops_frontend||[]).push([[624],{1075:(e,t,s)=>{s.r(t),s.d(t,{startFormServiceApp:()=>c}),s(492);var r=s(8088),o=s.n(r),n=s(7739),i=s.n(n),a=s(8895);s(1949);const d=a.Z.extend({beforeStart(e){let{formId:t,patientId:s,responseId:r}=e;return[i().request("entities","fetch:forms:model",t),i().request("entities","fetch:forms:definition",t),i().request("entities","fetch:forms:fields",null,s,t),i().request("entities","fetch:formResponses:submission",r)]},onStart(e,t,s,r,o){let[n]=t,[i]=s,[a]=r,[d]=o;parent.postMessage({message:"form:pdf",args:{definition:i,formData:a.data.attributes||{},formSubmission:d.data,contextScripts:n.getContextScripts(),reducers:n.getReducers()}},window.origin)}}),f=o().Router.extend({routes:{"formservice/:formId/:patientId(/:responseId)":"startFormService"},startFormService(e,t,s){(new d).start({formId:e,patientId:t,responseId:s})}});function c(){new f,o().history.start({pushState:!0})}},7948:(e,t,s)=>{s.d(t,{Z:()=>r});const r="00000000-0000-0000-0000-000000000000"}}]);