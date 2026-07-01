import{bs as c,K as o}from"./index-o3r5xRwT.js";const s=new o("antFadeIn",{"0%":{opacity:0},"100%":{opacity:1}}),r=new o("antFadeOut",{"0%":{opacity:1},"100%":{opacity:0}}),p=(t,a=!1)=>{const{antCls:e}=t,n=`${e}-fade`,i=a?"&":"";return[c(n,s,r,t.motionDurationMid,a),{[`
        ${i}${n}-enter,
        ${i}${n}-appear
      `]:{opacity:0,animationTimingFunction:"linear"},[`${i}${n}-leave`]:{animationTimingFunction:"linear"}}]};export{p as i};
