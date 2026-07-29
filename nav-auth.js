/* nav-auth.js v3 — 统一入口导航条 */
(function(){
'use strict';
if(window.__VHNavInited)return;window.__VHNavInited=true;

var css=document.createElement('style');
css.textContent='.vh-nav-auth{position:fixed;top:0;left:0;right:0;z-index:9000;display:flex;align-items:center;justify-content:space-between;padding:0 1rem;height:48px;background:rgba(10,10,26,0.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid rgba(102,126,234,0.12)}.vh-nav-auth .vh-logo{font-size:0.95rem;font-weight:700;background:linear-gradient(135deg,#667eea,#764ba2);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;text-decoration:none}.vh-nav-auth .vh-btn{font-size:0.78rem;padding:0.35rem 0.9rem;border-radius:14px;border:1px solid rgba(102,126,234,0.4);background:transparent;color:#667eea;cursor:pointer;text-decoration:none;transition:0.2s}.vh-nav-auth .vh-btn:hover{background:rgba(102,126,234,0.1)}.vh-nav-auth .vh-btn-logout{color:#f44;border-color:rgba(255,68,68,0.4)}.vh-nav-auth .vh-user-info{display:flex;align-items:center;gap:0.5rem}.vh-nav-auth .vh-nick{font-size:0.82rem;color:#e0e0f0;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.vh-nav-auth .vh-role-badge{font-size:0.65rem;padding:0.15rem 0.4rem;border-radius:8px;background:rgba(102,126,234,0.2);color:#667eea}body.vh-nav-padding{padding-top:48px}';
document.head.appendChild(css);

function esc(s){return s.replace(/</g,'&lt;').replace(/>/g,'&gt;')}

function render(){
    var existing=document.getElementById('vhNavAuth');
    if(existing)existing.remove();
    var nav=document.createElement('div');
    nav.className='vh-nav-auth';nav.id='vhNavAuth';
    var sess=(window.VHAuth&&VHAuth.currentUser)?VHAuth.currentUser():null;
    if(sess&&sess.username){
        nav.innerHTML='<a class="vh-logo" href="view.html">开放创作者平台</a><div class="vh-user-info"><span class="vh-role-badge">'+(sess.role==='sub_admin'||sess.role==='admin'?'管理员':'用户')+'</span><span class="vh-nick">'+esc(sess.nickname||sess.username)+'</span><button class="vh-btn vh-btn-logout" onclick="VHAuth.logout();location.reload()">退出</button></div>';
    }else{
        nav.innerHTML='<a class="vh-logo" href="view.html">开放创作者平台</a><div><a class="vh-btn" href="auth.html">登录</a></div>';
    }
    document.body.prepend(nav);
    document.body.classList.add('vh-nav-padding');
}

if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',render);
}else{render()}

window.addEventListener('storage',function(e){if(e.key==='vh_session')render()});
})();
