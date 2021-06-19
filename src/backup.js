
import './App.css';
import React,{Component} from 'react';
import firebase from "firebase"
import keys from "./config"
import Carousel,{consts} from "react-elastic-carousel";
import FlatList from 'flatlist-react';
import TextField from '@material-ui/core/TextField';
import {Cloud,ThumbUpAltOutlined,Subject,Favorite,ShoppingCart,CallRounded,LocalOfferRounded,InfoOutlined,DescriptionOutlined,LanguageOutlined,WhatsApp,EmailOutlined,EmojiFlagsOutlined,CallOutlined, StorefrontOutlined,AccessTimeOutlined, ThreeDRotation ,RoomOutlined} from '@material-ui/icons';
import ReceiptIcon from '@material-ui/icons/Receipt';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CameraAltRounded from '@material-ui/icons/CameraAltRounded';
import Button from '@material-ui/core/Button';
const breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 2 },
  { width: 768, itemsToShow: 3 },
  { width: 1200, itemsToShow: 4 },
];

let img = []

export default class App extends Component{
 

  state = { data:[], customer:{} ,business:{}, uploadtext:"" ,code_sent:false,opt:"" };

  componentDidMount=()=>{

    console.log(this.props.access_code)
    var c = this.props.access_code.split("/")
   

    firebase.firestore().collection("business_data").doc(c[3]).collection("open_orders").doc(c[4]).collection("updates").orderBy("date").onSnapshot(querySnapshot => {
      const groups = [];

      querySnapshot.forEach(documentSnapshot => {

            groups.push({                
              key: documentSnapshot.id,
              ...documentSnapshot.data()

            }) 

          });

          this.setState({data:groups.reverse() });

          console.log(groups)
          
      })


      firebase.firestore().collection("business_data").doc(c[3]).collection("open_orders").doc(c[4]).onSnapshot(doc => { this.setState({customer:doc.data()}) })
      firebase.firestore().collection("business_data").doc(c[3]).onSnapshot(doc => { this.setState({business:doc.data()}) })


  }


  renderImages = item => {

   
    return (                 
     
            <div class={"card"}  style={{borderRadius:0,borderColor:"#CD6155"}} >

                <img alt="Responsive image" src={ item} style={{  margin:4,maxWidth: "100%",height:"auto",borderRadius:0}}  />
            
             </div>
    );
};

setUpRecaptcha = () => {

  console.log("inside captcha");

  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    "recaptcha-container",
    {
      size: "invisible",
      callback: function (response) {
        console.log("Captcha Resolved");
        this.onSignInSubmit();
      },
      defaultCountry: "IN",
    }
  );
};



onSignInSubmit = (e) => {
  if(this.state.uploadtext == "") return alert("Please type text to send.")
 
  else{
    this.setState({code_sent:true})
  console.log("inside submit");
  e.preventDefault();
  console.log(e);
  this.setUpRecaptcha();
  let phoneNumber = this.state.customer.customer_number
  console.log(phoneNumber);
  let appVerifier = window.recaptchaVerifier;
  firebase
    .auth()
    .signInWithPhoneNumber(phoneNumber, appVerifier)
    .then(function (confirmationResult) {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      window.confirmationResult = confirmationResult;
      // console.log(confirmationResult);
      console.log("OTP is sent");
    })
    .catch(function (error) {
      console.log(error);
    });
};

}

onSubmitOtp = (e) => {
  e.preventDefault();
  let otpInput = this.state.otp;
  let optConfirm = window.confirmationResult;
  // console.log(codee);
  optConfirm
    .confirm(otpInput)
    .then(function (result) {
      this.upload_msg()
      let user = result.user;
    })
    .catch(function (error) {
      console.log(error);
      alert("Incorrect OTP");
    });
};



  upload_msg=()=>{
    console.log(this.props.access_code)
    var c = this.props.access_code.split("/")


    if(this.state.uploadtext == "") return alert("Please type text to send.")
   

    firebase.firestore().collection("business_data").doc(c[3]).collection("open_orders").doc(c[4]).collection("updates").add({by:"customer", update_msg_subject:"New Message" ,update_msg : this.state.uploadtext, date : new Date().valueOf()  }).then(this.setState({uploadtext:""}))
  
  
  }

 


  render(){

    

  
    let x = this.state.data.map((data)=>{

      let y = new Date(data.date).getFullYear()

      y= y.toString().slice(-2);


      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];



      if(data.update_images){ 
        
        img = data.update_images.map((data)=>{

        return <li style={{display:"inline-block",marginLeft:5}}><img src={data} alt="Smiley face" style={{marginTop:"-10.5px",width:"300px",height:"200px"}}></img></li>
  
          })

        }


      return(

        data.update_images

        ?<section id="timeline">
              <article>
                <div class="inner">
                  <span class="date">
                    <span class="day">{new Date(data.date).getDate()} </span>
                    <span class="month">{months[new Date(data.date).getMonth()]} '{y}</span>  
                  </span>
                  <h2>{data.update_msg_subject}</h2>
                  <p>
                    <h4 style={{color:"#000",fontWeight:400,fontSize:16.5,marginTop:-5,marginBottom:8.5}}>{data.update_msg}</h4>
                    {/* <ul style={{marginLeft:-45,marginBottom:-5}}>
                      <Carousel breakPoints={breakPoints}  pagination={false} enableAutoPlay autoPlaySpeed={5000}   >
                        {img}
                      </Carousel>    
                      </ul> */}

                            <FlatList
                                  list={data.update_images}
                                  renderItem={ this.renderImages}
                                
                              ></FlatList>
                  </p>
                  
                  </div>
                  
              </article>
            </section>

        : data.by != undefined

        ?<section id="timelineby">

            <article>
              <div class="innerby">
              <span class="dateby">
                <span class="dayby">{new Date(data.date).getDate()} </span>
                <span class="monthby">{months[new Date(data.date).getMonth()]} '{y}</span>  
              </span>
                <h2>message by {data.update_msg_subject}</h2>
                <p>
                  <h4 style={{color:"#000",fontWeight:400,fontSize:16.5,marginTop:-5,marginBottom:-5}}>{data.update_msg}</h4>
                
                </p>
                </div>
                
            </article>
          </section>

        :<section id="timeline">

                <article>
                  <div class="inner">
                  <span class="date">
                    <span class="day">{new Date(data.date).getDate()} </span>
                    <span class="month">{months[new Date(data.date).getMonth()]} '{y}</span>  
                  </span>
                    <h2>{data.update_msg_subject}</h2>
                    <p>
                      <h4 style={{color:"#000",fontWeight:400,fontSize:16.5,marginTop:-5,marginBottom:-5}}>{data.update_msg}</h4>
                    
                    </p>
                    </div>
                    
                </article>
              </section>

      )


    })


    
    let y = new Date(this.state.customer.date).getFullYear()

    y= y.toString().slice(-2);


    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];


    let t = new Date().getHours()

    let time = ""

    t < 12 && t>=4 ? time = "Good Morning,"  : t >=12 && t<= 16 ? time =  "Good Afternoon," : t>16 && t<=23 ? time =  "Good Evening," :time =  "Welcome,"


  return (
    <div className="App">
      

      <div >
<head>
  <meta charset="UTF-8"></meta>
  <title>Timeline</title>
  
  
  
      <link rel="stylesheet" href="css/style.css">

  </link>
</head>

<body>

        <h4 style={{color:"#000",fontWeight:200,fontSize:35,textAlign:'center',marginTop:7.5,fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"}}>
            
            🙏
              
        </h4>

              <h4 style={{color:"#262626",marginLeft:0.5,textAlign:'center',fontWeight:700,fontSize:25,textTransform:"capitalize",marginTop:-30,marginBottom:5,fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"}}>
                  
                  {time}
                  
                </h4>
                

            <h4 style={{color:"#262626",textAlign:"center",borderRadius:-6,backgroundColor:"#eee",padding:4,marginLeft:0,fontWeight:200,fontSize:40,textTransform:"capitalize",marginTop:-1.5,marginBottom:15,}}>
                  
                  {this.state.customer.customer_name}
                  
                </h4>

                { this.state.code_sent 

                  ?<div>
                    
                        <form style={{marginBottom:"2.9%", width: '96%',margin:"2.5%"}} noValidate autoComplete="off">
                            <TextField value={this.state.otp} onChange={(v)=> this.setState({otp:v.target.value})} size="medium" style={{ marginTop:"2.5%" ,width: '100%'}} id="filled" label={`Enter the OTP sent to ${this.state.customer.customer_number}`} variant="outlined" />
                        </form>

                        <h4 style={{color:"#ff0000",textAlign:"left",borderRadius:-6,padding:4,marginLeft:10,fontWeight:700,fontSize:12,marginTop:-5.5,marginBottom:15,}}>
                  
                          OTP verification is mandatory to send a message to {this.state.business.name}
                          
                        </h4>
                    </div>

                  :<div>
                    
                    <form style={{marginBottom:"2.9%", width: '96%',margin:"2.5%"}} noValidate autoComplete="off">
                        <TextField value={this.state.uploadtext} onChange={(v)=> this.setState({uploadtext:v.target.value})} size="medium" style={{ marginTop:"2.5%" ,width: '100%'}} id="filled" label="Type a message here" variant="outlined" />
                      </form>


                      <div style={{flexDirection:"row",display:"inline",justifyContent:"space-between",margin:8}} >

                          <div style={{flexDirection:"row",display:"inline",marginLeft:2.5}}>
                              <a   target="_blank" >
                                <CameraAltRounded  style={{fontSize: 27.5,color:"#000",backgroundColor:"#eee",padding:7.5,borderRadius:360}} />
                              </a>
                              <a   target="_blank">
                                <AttachFileIcon  style={{fontSize: 22,color:"#000",backgroundColor:"#eee",padding:9.25,marginLeft:10,borderRadius:360}} />
                              </a>
                          </div>
                    </div>

                    </div>

                }

                    { this.state.code_sent 

                      ? <div style={{marginTop:7.5,marginRight:10.5,marginBottom:10,float:"right"}}  >
                            <Button color={"secondary"} onClick={()=>this.onSubmitOtp()} variant="contained">
                              Confirm
                            </Button>
                        </div>

                      :<div style={{flexDirection:"row",display:"inline",float:"right",marginTop:-42.5,marginRight:10.5}}  >
                            <Button onClick={this.onSignInSubmit} variant="contained">
                              Send
                            </Button>
                        </div>

                    }


                


                <h4 style={{color:"#262626",textAlign:"center",borderRadius:-6,backgroundColor:"#eee",padding:4,marginLeft:0,fontWeight:200,fontSize:40,textTransform:"capitalize",marginTop:50.5,marginBottom:15,}}>
                  
                  Updates
                  
                </h4>

            {x}

            <h4 style={{color:"#262626",textAlign:"center",borderRadius:-6,backgroundColor:"#eee",padding:4,marginLeft:0,fontWeight:200,fontSize:40,textTransform:"capitalize",marginTop:50,marginBottom:15,}}>
                  
                  Invoice
                  
                </h4>

            <section id="timeline">

              <article >
                <div class="inner">
                <span class="date">
                  <span class="day">{new Date(this.state.customer.date).getDate()} </span>
                  <span class="month">{months[new Date(this.state.customer.date).getMonth()]} '{y}</span>  
                </span>
                  <h2><p>
                    <a href={this.state.customer.invoice} target="_blank" style={{ marginLeft:"2%",textAlign:"center",borderRadius:6,width:"30%",paddingTop:15,paddingBottom:-5}}>
                      <ReceiptIcon  style={{ fontSize: 40,color:"black",marginLeft:"20%",marginRight:"5%",textAlign:"center", }} /><h4 style={{color:"#000",fontWeight:700,fontSize:16.5,marginTop:-35,marginLeft:45}}>  Download</h4>

                    </a>
                  
                  </p>
                  </h2>
                  
                  </div>
                  
              </article>
            </section>


            <h4 style={{color:"#262626",textAlign:"center",borderRadius:-6,backgroundColor:"#eee",padding:4,marginLeft:0,fontWeight:200,fontSize:40,textTransform:"capitalize",marginTop:56.5,marginBottom:105,}}>
                  
                  ThankYou
                  
                </h4>

        


        <footer class={"card row"} style={{position:"fixed" ,textAlign:"center", bottom:"10px",paddingTop:10,paddingBottom:-30,margin:-10,height:90,backgroundColor:"#262626",opacity:0.9, width: "105%",borderRadius:0}} >
        
                <h4 style={{color:"#fff",textAlign:'center',fontWeight:500,fontSize:15,textTransform:"capitalize",marginTop:0,marginBottom:15,fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"}}>
                  
                  {this.state.business.name}
                  
                </h4>
                

                <a  href={`tel:${this.state.business.phonenumber}` } target="_blank" style={{ textAlign:"center",backgroundColor:"#eee",borderRadius:6,width:"30%",backgroundColor:"#ff0000",opacity:0.75,paddingTop:15,paddingBottom:5}}>
                  <CallRounded  style={{fontSize: 25,color:"#fff",marginLeft:"15%",marginRight:"15%",textAlign:"center", }} />
                </a>
                  
                
               <a href={`whatsapp://send?text=Hello, ${'\n\n'}Just visited my order page, wanted to know more.&phone=${this.state.business.phonenumber}`} target="_blank" style={{ marginLeft:"2%",textAlign:"center",backgroundColor:"#eee",borderRadius:6,width:"30%",backgroundColor:"#33cc33",paddingTop:15,paddingBottom:5}}>
                  <WhatsApp  style={{ fontSize: 25,color:"white",marginLeft:"5%",marginRight:"5%",textAlign:"center", }} />
                </a>
                       
  
               <a href={  `//${"www.google.com"}` }  target="_blank" style={{ marginLeft:"2%",textAlign:"center",backgroundColor:"#eee",borderRadius:6,width:"30%",backgroundColor:"#0033cc",opacity:1,paddingTop:15,paddingBottom:5}}>
                  <LanguageOutlined  style={{ fontSize: 23,color:"white",marginLeft:"5%",marginRight:"5%",textAlign:"center", }} />
                </a>
                 

                    

                <a href={`https://www.google.com/maps/dir/?api=1&destination=${this.state.business.address}&dir_action=navigate` } target="_blank" style={{ marginLeft:"2%",textAlign:"center",backgroundColor:"#eee",borderRadius:6,width:"30%",backgroundColor:"#007aff",paddingTop:15,paddingBottom:5}}>
                  <RoomOutlined  style={{ fontSize: 23,color:"white",marginLeft:"5%",marginRight:"5%",textAlign:"center", }} />
                </a>


                


                </footer>
        
  
  
</body>




</div>
 
       </div>
  );

  }
}


