/* Cart logic, separate from UI. Replace Store calls with /api/cart later. */
const Cart={
  items(){return Store.get('cart',[])},
  save(i){Store.set('cart',i);document.dispatchEvent(new Event('cart:change'))},
  add(id){const i=this.items(),l=i.find(x=>x.id===id);l?l.qty++:i.push({id:id,qty:1});this.save(i)},
  setQty(id,q){this.save(this.items().map(x=>x.id===id?{id:x.id,qty:Math.max(1,q)}:x))},
  remove(id){this.save(this.items().filter(x=>x.id!==id))},
  count(){return this.items().reduce((n,x)=>n+x.qty,0)},
  total(){return this.items().reduce((s,x)=>{const p=PRODUCTS.find(p=>p.id===x.id);return s+x.qty*(p?p.price:0)},0)}
};
