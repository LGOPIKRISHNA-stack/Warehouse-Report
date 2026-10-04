const path=require('path');
const http=require('http');
const express=require('express');
const cors=require('cors');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const mongoose=require('mongoose');
const {Server}=require('socket.io');
require('dotenv').config();

const app=express();
const server=http.createServer(app);
const io=new Server(server,{cors:{origin:'*'}});
app.use(cors()); app.use(express.json()); app.use(express.static(path.join(__dirname,'../public')));

const userSchema=new mongoose.Schema({name:String,email:{type:String,unique:true},password:String,role:{type:String,enum:['admin','employee'],default:'employee'}},{timestamps:true});
const reportSchema=new mongoose.Schema({employeeId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},date:{type:String,required:true},scanned:{type:Number,default:0},billed:{type:Number,default:0},ewayBills:{type:Number,default:0},maskAdding:{type:Number,default:0},notes:{type:String,default:''}},{timestamps:true});
reportSchema.index({employeeId:1,date:1},{unique:true});
const User=mongoose.model('User',userSchema); const Report=mongoose.model('Report',reportSchema);

function auth(req,res,next){try{const token=(req.headers.authorization||'').replace('Bearer ','');req.user=jwt.verify(token,process.env.JWT_SECRET);next();}catch(e){res.status(401).json({message:'Unauthorized'});}}
function adminOnly(req,res,next){if(req.user.role!=='admin')return res.status(403).json({message:'Admin only'});next();}

app.post('/api/auth/login',async(req,res)=>{const {email,password}=req.body; const u=await User.findOne({email}); if(!u||!(await bcrypt.compare(password,u.password)))return res.status(401).json({message:'Invalid email or password'}); const token=jwt.sign({id:u._id,name:u.name,email:u.email,role:u.role},process.env.JWT_SECRET,{expiresIn:'8h'});res.json({token,user:{id:u._id,name:u.name,email:u.email,role:u.role}});});
app.get('/api/me',auth,(req,res)=>res.json(req.user));
app.get('/api/employees',auth,adminOnly,async(req,res)=>res.json(await User.find({role:'employee'}).select('-password').sort({name:1})));
app.post('/api/employees',auth,adminOnly,async(req,res)=>{try{const {name,email,password}=req.body;const hash=await bcrypt.hash(password,10);const u=await User.create({name,email,password:hash,role:'employee'});res.status(201).json({id:u._id,name:u.name,email:u.email,role:u.role});}catch(e){res.status(400).json({message:e.code===11000?'Email already exists':e.message});}});
app.get('/api/reports',auth,async(req,res)=>{const employeeId=req.user.role==='admin'?(req.query.employeeId||null):req.user.id; const filter=employeeId?{employeeId}:{}; const rows=await Report.find(filter).populate('employeeId','name email').sort({date:-1});res.json(rows);});
app.post('/api/reports',auth,adminOnly,async(req,res)=>{try{const {employeeId,date,scanned,billed,ewayBills,maskAdding,notes}=req.body; const row=await Report.findOneAndUpdate({employeeId,date},{employeeId,date,scanned:Number(scanned)||0,billed:Number(billed)||0,ewayBills:Number(ewayBills)||0,maskAdding:Number(maskAdding)||0,notes:notes||''},{new:true,upsert:true,setDefaultsOnInsert:true});io.emit('report:changed',{employeeId:String(employeeId)});res.json(row);}catch(e){res.status(400).json({message:e.message});}});
app.delete('/api/reports/:id',auth,adminOnly,async(req,res)=>{await Report.findByIdAndDelete(req.params.id);io.emit('report:changed',{});res.json({ok:true});});

async function seed(){await mongoose.connect(process.env.MONGO_URI);const email=process.env.ADMIN_EMAIL;let a=await User.findOne({email});if(!a){a=await User.create({name:'Administrator',email,password:await bcrypt.hash(process.env.ADMIN_PASSWORD,10),role:'admin'});console.log('Admin created:',email,process.env.ADMIN_PASSWORD);} }
seed().then(()=>server.listen(process.env.PORT||5000,()=>console.log('Server running on http://localhost:'+process.env.PORT))).catch(e=>{console.error(e);process.exit(1)});
