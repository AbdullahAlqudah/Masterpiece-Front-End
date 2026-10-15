/* Storage wrapper — swap internals for Laravel API calls later. */
const Store={
  get(k,d=null){try{return JSON.parse(localStorage.getItem('khadra:'+k))??d}catch(e){return d}},
  set(k,v){try{localStorage.setItem('khadra:'+k,JSON.stringify(v))}catch(e){}}
};
