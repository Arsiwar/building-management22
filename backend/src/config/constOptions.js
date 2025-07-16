const allowOrigins=require("./allowOrigins");
const corsOptions={
    origin:(origin,callbback)=>{
   if(allowOrigins.indexOf(origin)!== -1 || !origin){
    callbback(null,true)

}else{
    callbback(new Error("Not allowed by cors"))
}
},
credentials: true,
optionsSuccessStatus:200
}
module.exports=corsOptions