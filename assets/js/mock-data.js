/* SAMPLE DATA ONLY — replaced by GET /api/services and /api/products once Laravel exists. */
const SERVICES=[
 {id:'tree-planting',icon:'bi-tree',title:'Tree Planting',desc:'We choose, plant and establish the right tree for your soil and space.',img:'services/tree-planting.jpg',page:'plant-tree.html'},
 {id:'tree-replacement',icon:'bi-arrow-repeat',title:'Tree Replacement',desc:'Replace a sick or damaged tree with a healthy one.',img:'services/tree-replacement.jpg',page:'replace-tree.html'},
 {id:'consultation',icon:'bi-chat-heart',title:'Agricultural Consultation',desc:'Book an expert to diagnose problems and plan your garden.',img:'services/consultation.jpg',page:'consultation.html'},
 {id:'maintenance',icon:'bi-scissors',title:'Tree Maintenance',desc:'Pruning, feeding and seasonal care by trained providers.',img:'services/maintenance.jpg',page:'pruning-removal.html'},
 {id:'tree-gift',icon:'bi-gift',title:'Tree Gifting',desc:'Give a living tree with a personal message and certificate.',img:'services/tree-gift.jpg',page:'tree-gift.html'},
 {id:'public-planting',icon:'bi-people',title:'Public Planting',desc:'Fund trees in parks, schools and neighborhoods.',img:'projects/public-planting.jpg',page:'public-planting.html'}];
const PRODUCTS=[
 {id:1,name:'Organic Compost 10 kg',cat:'Soil',price:12,stock:true,img:'products/compost.jpg'},
 {id:2,name:'Olive Sapling',cat:'Trees',price:18,stock:true,img:'trees/olive-tree.jpg'},
 {id:3,name:'Lemon Tree (2 yr)',cat:'Trees',price:25,stock:true,img:'trees/lemon-tree.jpg'},
 {id:4,name:'Natural Plant Fertilizer',cat:'Soil',price:9,stock:true,img:'products/fertilizer.jpg'},
 {id:5,name:'Pruning Shears',cat:'Tools',price:15,stock:false,img:'products/shears.jpg'},
 {id:6,name:'Indoor Herb Kit',cat:'Indoor',price:14,stock:true,img:'products/herb-kit.jpg'},
 {id:7,name:'Drip Watering Set',cat:'Tools',price:22,stock:true,img:'products/drip-set.jpg'},
 {id:8,name:'Balcony Planter Box',cat:'Indoor',price:19,stock:true,img:'products/planter.jpg'}];
/* Sample public-planting initiatives (GET /api/initiatives later). */
const INITIATIVES=[
 {id:'school-forest',title:'School Forest Project',goal:500,raised:320,img:'projects/school-forest.jpg'},
 {id:'city-park',title:'City Park Revival',goal:1000,raised:410,img:'projects/city-park.jpg'},
 {id:'olive-grove',title:'Community Olive Grove',goal:300,raised:270,img:'projects/olive-grove.jpg'}];
/* Subscription plans: [name, $/month, features] (GET /api/plans later). */
const PLANS=[['Basic',9,['1 tree check / quarter','AI chatbot','Care reminders']],['Standard',24,['Monthly visit','Pruning included','AI care plans','10% shop discount']],['Premium',49,['Priority visits','Pruning + feeding','Unlimited AI plans','20% shop discount','Tree QR tracking']]];
