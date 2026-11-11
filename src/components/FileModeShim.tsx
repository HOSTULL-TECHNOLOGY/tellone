/**
 * Only rendered in the offline "open index.html" export (NEXT_PUBLIC_STATIC_FILE=1).
 * Every page is exported flat into one folder ("en__shop__merch.html"), so this script:
 *  - turns site links ("/shop/merch") into the matching file on click,
 *  - quietly ignores Next's background prefetches (there is no server to answer them),
 *  - stops history updates from throwing on file:// URLs.
 * It never ships on the hosted site.
 */
const script = `(function(){
  var L=["pcm","yo","ha","ig","en","dashboard"];
  function toFile(path){
    var hash="",q="",i=path.indexOf("#"); if(i>=0){hash=path.slice(i);path=path.slice(0,i);}
    i=path.indexOf("?"); if(i>=0){q=path.slice(i);path=path.slice(0,i);}
    var s=path.split("/").filter(Boolean); if(L.indexOf(s[0]||"")<0) s.unshift("en");
    var name=(s.length===1&&s[0]==="en")?"index":s.join("__");
    return "./"+name+".html"+q+hash;
  }
  window.__tbhToFile=toFile;
  try{var rs=history.replaceState.bind(history),ps=history.pushState.bind(history);
    history.replaceState=function(){try{return rs.apply(null,arguments)}catch(e){}};
    history.pushState=function(){try{return ps.apply(null,arguments)}catch(e){}};}catch(e){}
  var f=window.fetch&&window.fetch.bind(window);
  window.fetch=function(input,init){
    var u=(typeof Request!=="undefined"&&input instanceof Request)?input.url:String(input||"");
    if(u.indexOf("_rsc")>=0||u.indexOf(".txt")>=0||(init&&init.headers&&JSON.stringify(init.headers).indexOf("RSC")>=0)) return new Promise(function(){});
    return f?f(input,init):Promise.reject(new Error("offline"));
  };
  document.addEventListener("click",function(e){
    if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey) return;
    var a=e.target&&e.target.closest&&e.target.closest("a[href]"); if(!a||a.target==="_blank"||a.hasAttribute("download")) return;
    var h=a.getAttribute("href"); if(!h||h.charAt(0)!=="/") return;
    e.preventDefault(); e.stopImmediatePropagation(); location.href=toFile(h);
  },true);
  document.addEventListener("submit",function(e){
    var fm=e.target; var act=fm&&fm.getAttribute&&fm.getAttribute("action");
    if(!act||act.charAt(0)!=="/"||(fm.method||"get").toLowerCase()!=="get") return;
    e.preventDefault(); var p=new URLSearchParams(new FormData(fm)).toString(); location.href=toFile(act+(p?"?"+p:""));
  },true);
})();`;

export function FileModeShim() {
  if (process.env.NEXT_PUBLIC_STATIC_FILE !== "1") return null;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
