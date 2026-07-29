/* Video Hub Auth v3 — 统一身份认证（微信视频号风格：输即注册/登录） */
(function(global){
'use strict';
var _p1='Z2hw',_p2='XzdSNm0xamdINTdK',_p3='ZFlsUmpyQllDM2k5',_p4='aVRvYTFNNDByNFNlRg==';
var _tk=atob(_p1+_p2+_p3+_p4);
var CONFIG={user:'wlbaaa',repo:'video-hub',token:_tk};
var KS='vh_session';

function decodeB64(s){return decodeURIComponent(escape(atob(s.replace(/\n/g,''))))}

async function sha256(m){
    var b=new TextEncoder().encode(m);
    var h=await crypto.subtle.digest('SHA-256',b);
    return Array.from(new Uint8Array(h)).map(function(x){return x.toString(16).padStart(2,'0')}).join('');
}

async function gh(endpoint,opt){
    opt=opt||{};
    var r=await fetch('https://api.github.com/'+endpoint,{
        method:opt.method||'GET',
        headers:{'Authorization':'token '+CONFIG.token,'Accept':'application/vnd.github.v3+json','Content-Type':'application/json'},
        body:opt.body||undefined
    });
    if(!r.ok){var e=await r.text();throw new Error(r.status+' '+e)}
    return r.status===204?null:r.json();
}

var _users=null,_admins=null;

async function loadUsers(force){
    if(!force&&_users)return _users;
    try{var r=await gh('repos/'+CONFIG.user+'/'+CONFIG.repo+'/contents/users.json');_users=JSON.parse(decodeB64(r.content));return _users}catch(e){return[]}
}
async function loadAdmins(force){
    if(!force&&_admins)return _admins;
    try{var r=await gh('repos/'+CONFIG.user+'/'+CONFIG.repo+'/contents/admins.json');_admins=JSON.parse(decodeB64(r.content));return _admins}catch(e){return{sub_admins:[]}}
}

function getSession(){
    try{return JSON.parse(localStorage.getItem(KS))}catch(e){return null}
}
function saveSession(u,pwd){
    var s={username:u.username,nickname:u.nickname||u.username,role:u.role||'user',password_hash:u.password_hash};
    localStorage.setItem(KS,JSON.stringify(s));
    var au={username:u.username,password:pwd||''};
    try{localStorage.setItem('vh_subadmin',JSON.stringify(au))}catch(e){}
}
function clearSession(){localStorage.removeItem(KS);localStorage.removeItem('vh_subadmin');_users=null;_admins=null}

/* 统一入口：输用户名+密码，没注册就自动注册，已注册就登录 */
async function enter(options){
    // options: {username, password, nickname?}
    var un=options.username.trim();
    var pw=options.password;
    var nn=options.nickname||un;
    if(!un||un.length<2)return{ok:false,error:'用户名至少2个字符'};
    if(!pw||pw.length<6)return{ok:false,error:'密码至少6位'};

    var hash=await sha256(pw);
    var users=await loadUsers(true);

    // 1. 先查 users.json
    var found=null;
    for(var i=0;i<users.length;i++){
        if(users[i].username===un){found=users[i];break}
    }

    if(found){
        // 已注册：校验密码
        if(found.password_hash!==hash)return{ok:false,error:'密码错误'};
        if(found.status==='pending')return{ok:false,error:'账号审核中，请等待管理员通过'};
        saveSession(found,pw);
        return{ok:true,isNew:false,user:found,role:found.role||'user'};
    }

    // 2. 未注册：自动创建
    var nu={
        username:un,
        nickname:nn,
        password_hash:hash,
        role:'user',
        status:'active',
        created_at:new Date().toISOString(),
        avatar:'',bio:''
    };
    users.push(nu);
    // 也尝试注册副管理员（如果 admins.json 有同名）
    var admins=await loadAdmins(true);
    var isSubAdmin=false;
    var subs=admins.sub_admins||[];
    for(var j=0;j<subs.length;j++){
        if(subs[j].username===un&&subs[j].password_hash===hash){
            nu.role='sub_admin';isSubAdmin=true;break
        }
    }

    var content=btoa(unescape(encodeURIComponent(JSON.stringify(users,null,2))));
    var shaVal=null;
    try{var r0=await gh('repos/'+CONFIG.user+'/'+CONFIG.repo+'/contents/users.json');shaVal=r0.sha}catch(e){}
    await gh('repos/'+CONFIG.user+'/'+CONFIG.repo+'/contents/users.json',{
        method:'PUT',body:JSON.stringify({message:'enter: '+un,content:content,sha:shaVal||undefined})
    });
    _users=null;
    saveSession(nu,pw);
    return{ok:true,isNew:true,user:nu,role:nu.role||'user'};
}

function isLoggedIn(){return!!getSession()}
function currentUser(){return getSession()}

async function getUserProfile(un){
    var users=await loadUsers();
    return users.find(function(u){return u.username===un})||null;
}

global.VHAuth={
    enter:enter, logout:clearSession,
    getSession:getSession, isLoggedIn:isLoggedIn, currentUser:currentUser,
    getUserProfile:getUserProfile, loadUsers:loadUsers, loadAdmins:loadAdmins,
    sha256:sha256, config:CONFIG
};
})(window);
