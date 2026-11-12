// 눈대중 계량 변환
const EYE_UNIT={"양파":[200,"개"],"감자":[150,"개"],"당근":[150,"개"],"애호박":[250,"개"],"고구마":[200,"개"],"파":[100,"대"],"두부":[300,"모"],"순두부":[350,"봉"],"밥":[200,"공기"],"마늘":[5,"쪽"],"계란":[50,"개"],"토마토":[150,"개"],"오이":[200,"개"],"단호박":[700,"통"],"가지":[150,"개"],"피망":[40,"개"],"파프리카":[150,"개"],"무":[200,"토막","손바닥 두께 "],"양배추":[1000,"통"],"배추":[2000,"포기"],"청양고추":[10,"개"],"표고버섯":[20,"개"],"새우":[15,"마리"],"고등어":[300,"마리"],"오징어":[250,"마리"],"우엉":[200,"대"],"연근":[300,"마디"],"아보카도":[150,"개"],"버터":[10,"조각","엄지 한 마디 크기 "],"생강":[10,"톨","엄지만 한 "],"쌀":[170,"컵","종이컵 "],"메추리알":[10,"알"],"스팸":[200,"캔"],"참치캔":[100,"캔"],"떡":[100,"줌"]};
const EYE_NOODLE=new Set(["파스타면","소면","메밀면","칼국수면","쫄면","냉면","라이스누들","당면","우동면","냉동 중화면","두부면","오트밀"]);
const EYE_CHEESE=/치즈/;
function eyNum(s){if(s.includes("/")){const[a,b]=s.split("/");return +a/+b}return +s}
function eyFrac(n){const f=[[.25,"1/4"],[1/3,"1/3"],[.5,"반"],[2/3,"2/3"],[.75,"3/4"]];let b=f[0];f.forEach(x=>{if(Math.abs(x[0]-n)<Math.abs(b[0]-n))b=x});return b[1]}
function eyCount(n,u,half="반"){
  if(n>=3&&/마리|알|개|장|쪽/.test(u))return `${Math.round(n)}${u}`;
  if(n<0.9){const fr=eyFrac(n);return fr==="반"?`반 ${u}`:`${fr}${u}`}
  const r=Math.round(n*2)/2,w=Math.floor(r);return r%1?`${w}${u} ${half}`:`${w}${u}`}
function eySpoon(n,u){if(n<0.9){const fr=eyFrac(n);return fr==="반"?`반 ${u}`:`${u} ${fr}`}const r=Math.round(n*2)/2,w=Math.floor(r);return r%1?`${w}${u} 반`:`${w}${u}`}
function eyML(ml){if(ml<=40)return eySpoon(ml/15,"숟가락");const c=ml/180;if(c<0.4)return "종이컵 1/3컵";if(c<0.75)return "종이컵 반 컵";const r=Math.round(c*2)/2,w=Math.floor(r);return "종이컵 "+(r%1?`${w}컵 반`:`${w}컵`)}
function eyG(g,key){
  const u=EYE_UNIT[key];if(u)return (u[2]||"")+eyCount(g/u[0],u[1]);
  if(/^물$|육수|우유|국물|콜라|쌍화탕/.test(key))return eyML(g);
  if(EYE_NOODLE.has(key)){const n=g/100;return n<0.9?(n<0.6?"반 인분":"1인분 조금 안 되게"):eyCount(n,"인분")}
  if(EYE_CHEESE.test(key))return eyCount(g/50,"줌");
  const grp=(GROUPS.find(x=>x[1].includes(key))||[""])[0];
  if(grp==="고기"||grp==="해산물"){if(g>=280){const n=g/600;return n<0.6?"반 근":eyCount(n,"근")}return eyCount(g/100,"줌")}
  if(g<=3)return "두 꼬집";if(g<=6)return "반 티스푼";
  if(/소스|퓌레|양념|페이스트|잼|장$|즙|버터|크림/.test(key))return g>40?eyML(g):eySpoon(g/12,"숟가락");
  if(g<=20)return eySpoon(g/12,"숟가락");
  return eyCount(g/100,"줌");
}
function eyTok(v,lo,hi,unit,key){
  const a=eyNum(lo),b=hi?eyNum(hi):null,m=b?(a+b)/2:a;
  if(/큰술|스푼|숟가락/.test(unit))return b?`${lo}~${hi}숟가락`:eySpoon(a,"숟가락");
  if(unit==="작은술")return b?`티스푼 ${lo}~${hi}`:eySpoon(a,"티스푼").replace(/^(\d+(?:티스푼)? ?반?)티스푼/,"티스푼 $1");
  if(/ml|mL/i.test(unit))return eyML(m);
  if(unit==="L")return eyML(m*1000);
  if(unit==="컵")return eyML(m*200);
  if(unit==="kg")return eyG(m*1000,key);
  if(unit==="g")return eyG(m,key);
  return v;
}
const EY_RE=/(?<!소주잔 )(?<![\d/.])(\d+(?:\.\d+)?(?:\/\d+)?)(?:~(\d+(?:\.\d+)?(?:\/\d+)?))?\s*(큰술|스푼|숟가락|작은술|mL|ml|L|kg|g|컵)(?![a-zA-Z])/g;
function eyeAmt(a,key){
  let s=a.replace(/\s*\((?:약\s*)?[\d.~\/]+\s*(?:mL|ml|L|g|kg)[^)]*\)/g,"");
  s=s.replace(/(,\s*)?약\s*[\d.~\/]+\s*(?:mL|ml|kg|g|L)(?![a-zA-Z])/g,"").replace(/\(\s*,?\s*\)/g,"").replace(/\(\s*,\s*/g,"(");
  if(/^\s*$/.test(s))s=a;
  return s.replace(EY_RE,(v,lo,hi,u)=>eyTok(v,lo,hi,u,key));
}
function eyeStep(text){
  return text.replace(/([가-힣]+)\s*(?<!소주잔 )(\d+(?:\.\d+)?(?:\/\d+)?)(?:~(\d+(?:\.\d+)?(?:\/\d+)?))?\s*(큰술|스푼|숟가락|작은술|mL|ml|L|kg|g|컵)(?![a-zA-Z])/g,(v,w,lo,hi,u)=>{
    const k=key(w);if(u==="컵"&&/소주잔/.test(text))return v;if(u==="g"||u==="kg"){const known=/^물$|육수|우유/.test(k)||EYE_UNIT[k]||EYE_NOODLE.has(k)||GROUPS.some(x=>x[1].includes(k));if(!known)return v}
    return w+" "+eyTok(v,lo,hi,u,k)+"\u0001"}).replace(/([가-힣])\u0001(을|를|과|와|이|가|은|는|으로|로)/g,(m,c,j)=>{
    const b=(c.charCodeAt(0)-0xAC00)%28,has=b!==0,rieul=b===8;
    const J={을:["을","를"],를:["을","를"],과:["과","와"],와:["과","와"],이:["이","가"],가:["이","가"],은:["은","는"],는:["은","는"],으로:[rieul?"로":"으로","로"],로:[rieul?"로":"으로","로"]}[j];
    return c+(has?J[0]:J[1])}).replace(/\u0001/g,"");
}
