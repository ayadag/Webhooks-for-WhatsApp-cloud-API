const express=require("express");
const body_parser=require("body-parser");
const axios=require("axios");
require('dotenv').config();

const app=express().use(body_parser.json());

//const token=process.env.TOKEN;
const mytoken=process.env.MYTOKEN;//prasath_token
//var mytoken;
//const mykey=process.env.MYKEY
//var mykey;
const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log("webhook is listening on port "+ port);
});

/*axios.get('https://chatbasebot.com/version-test/api/1.1/wf/xyzg?key='+mykey+'/') . then(responseData => { 
         let mytoken=responseData.response.mytoken;

});*/
    
   /* function fn(mykey){
     sendHttpRequest('GET', 'https://chatbasebot.com/version-test/api/1.1/wf/xyzg?key='+mykey+'/').then(responseData => {
     let mytoken1=responseData.response.mytoken;
         return mytoken1;
              })
};*/


//to verify the callback url from dashboard side - cloud api side
app.get("/api/whatsapp",(req,res)=>{
    
   let mykey=req.query["key"];
   let mode=req.query["hub.mode"];
   let challange=req.query["hub.challenge"];
   let token=req.query["hub.verify_token"];
   //let mytoken="12345";
    //let mytoken = fn(mykey);


    if(mode && token){
        
        //let mytoken = fn(mykey);
        
        if(mode==="subscribe" && token===mytoken){
            res.status(200).send(challange)
        }else{
            res.status(403)
        }
    }

});

app.post("/api/whatsapp",(req,res)=>{ //i want some 

    let id=req.query["key"];
    let body_param=req.body;

    console.log(JSON.stringify(body_param,null,2));

    if(body_param.object){
        console.log("inside body param");
        if(body_param.entry && 
            body_param.entry[0].changes && 
            body_param.entry[0].changes[0].value.messages && 
            body_param.entry[0].changes[0].value.messages[0]  
            ){
               let phon_no_id=body_param.entry[0].changes[0].value.metadata.phone_number_id;
               let from = body_param.entry[0].changes[0].value.messages[0].from; 
               let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;
               let cont_name = body_param.entry[0].changes[0].value.contacts[0].profile.name;

               console.log("phone number "+phon_no_id);
               console.log("from "+from);
               console.log("boady param "+msg_body);

               axios({
                   method:"POST",
                   url:"https://chatbasebot.com/api/1.1/wf/wapp/",
                   data:{
                       key:id,
                       phon_number_id:phon_no_id,
                       from:from,
                       name:cont_name,
                       body:msg_body
                   },
                   headers:{
                       "Content-Type":"application/json"
                   }

               });

               res.sendStatus(200);
            }else{
                res.sendStatus(404);
            }

    }

});

app.get("/",(req,res)=>{
    res.status(200).send("hello this is webhook setup");
});
