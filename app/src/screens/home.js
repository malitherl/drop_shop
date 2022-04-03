import { Text, View, Image, ToastAndroid } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import { useEffect, useState } from 'react';
import { Icon } from 'react-native-elements';
import { AppBar, IconButton } from '@react-native-material/core';

export default function Home({route}) {
    const navigation = useNavigation();
    //const {userid, name} = route.params;
    

      const [like, setlike] = useState('1')
      const [donate, setdonate] = useState('')
      const [success, setsuccess] = useState(false);
      const [pendingreq, setpendingreq] = useState({"requests": [{"id": "1", "name": "muntaser", "amount": "2", "details": " hello i need dollars to buy this chips packet", "phone": "+13218775974", "imageurl": "https://api.twilio.com/2010-04-01/Accounts/AC2e9791a102ff64ae9008e3fbb3a5cec5/Messages/MM617a87f7fcdb937a3e056c2315843bbd/Media/ME171ff51f769d679cf681f5a234d62908", "timestamp": "1647170324", "balance": 2.0, "status": "unfilled", "latlng": {"latitude": "50.511409592011084", "longitide": "30.62187653816344"}}, {"id": "2", "name": "muntaser", "amount": "3", "details": " hello i need help buying bread at lat50.50307 long30.47261", "phone": "+13218775974", "imageurl": "https://api.twilio.com/2010-04-01/Accounts/AC2e9791a102ff64ae9008e3fbb3a5cec5/Messages/MM3bd2635dbaa827f4f800dffb3ef57ebf/Media/ME6c9f3f83f787d2b3005539b6cc40c5b2", "timestamp": "1647189185", "balance": 3.0, "status": "unfilled", "latlng": {"latitude": "50.50307", "longitide": "30.47261"}}]})
     

     


      

      useEffect(() => {
          _getAllMarkers();
      }, [])

      const _getAllMarkers = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var raw = JSON.stringify({
          "action": "getallrequests"
        });
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        
        fetch("https://us-central1-aiot-fit-xlab.cloudfunctions.net/dropshop", requestOptions)
          .then(response => response.json())
          .then(result => {console.log(result);setpendingreq(result)})
          .catch(error => console.log('error', error));
    }

    const _donate = (id, amount) => {
        console.log(id,amount);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "action": "donate2request",
        "requestid": id,
        "amount": amount
        });

        console.log(raw);

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("https://us-central1-aiot-fit-xlab.cloudfunctions.net/dropshops", requestOptions)
        .then(response => response.json())
        .then(result => {console.log(result);if(result.status=="donation successful"){ToastAndroid.show('Donation successful! Thank you', ToastAndroid.SHORT);}})
        .catch(error => console.log('error', error));
    }
    
        return (
    <View style={{backgroundColor:"#fff", flex:1}}>
        <AppBar
            style={{paddingTop:'5%'}}
    title={"Custom Requests"}
    centerTitle={true}
    leading={props => (
      <IconButton icon={props => <Icon name="menu"  color={"#FFF"} />} />
    )}
    
  />
      
    
            <Text style={{fontWeight:'bold',textAlign:'left', marginHorizontal:'5%', textAlignVertical:'center', color:"#7242f5", fontSize:30, marginTop:'10%', marginBottom:'.5%'}}>Drop Shop Custom Orders</Text>
            <Text style={{fontFamily:'Roboto',textAlign:'left', marginHorizontal:'5%', textAlignVertical:'center', color:"#000", fontSize:15, marginBottom:'5%'}}>Help a person in need. Every penny counts.</Text>
            
            <View style={{height:500}}>
                <ScrollView>{pendingreq.requests.map((item)=>(<View style={{alignSelf:'center', alignContent:'center', borderRadius:20, borderWidth:1, borderColor:'#EAEAEA', paddingBottom:'5%', backgroundColor:"#005BBB", elevation:1}}>
            <View style={{alignSelf:'center', alignContent:'center', borderRadius:20,backgroundColor:"#FFD500", opacity:1, marginBottom:'5%', paddingBottom:'5%'}}>
                <View style={{alignSelf:'center', alignContent:'center', borderRadius:20,backgroundColor:"#FFF", opacity:1, marginBottom:'5%'}}>
                    <Text style={{position:'absolute', opacity:0.5, borderTopRightRadius:20,borderBottomLeftRadius:20, top:0, right:0, zIndex:3, backgroundColor:'#FFD500', width:100, height:50, textAlignVertical:'center', textAlign:'center', fontFamily:'Roboto'}}>{item.status}</Text>
                <Image source={{uri:item.imageurl}} style={{width:300, height:150, borderRadius:20}}></Image>
                <Text style={{fontWeight:'bold', color:'#000', fontSize:20, marginHorizontal:'5%'}}>${item.balance}</Text>
                <Text style={{fontFamily:'Roboto', color:'#000', fontSize:15, marginHorizontal:'5%', marginBottom:'0%', flexWrap:'wrap', width:250}}>{item.details}</Text>
                <Text style={{fontFamily:'Roboto', color:'#005BBB', fontSize:10, marginHorizontal:'5%', marginBottom:'5%'}}>{item.restaurantname}</Text>
                </View>
                <Icon name={like==item.id?"heart":"hearto"} type="ant-design" onPress={()=>setlike(item.id)} color={like==item.id?"red":"black"}></Icon>
            </View>
            {like==item.id&&<View style={{flexDirection:'row', alignSelf:'center', width:'70%'}}><View style={{width:'70%', backgroundColor:"#FFF", height:40, borderBottomLeftRadius:10,borderTopLeftRadius:10, alignSelf:'center', padding:'2.5%', opacity:0.5}}>
                <TextInput placeholder="Donate" style={{fontFamily:'Roboto'}} value={donate} onChangeText={(e)=>setdonate(e)}></TextInput>
            </View>
            <TouchableOpacity onPress={()=>_donate(item.id,donate)}>
                <View style={{ marginTop:'5%',borderBottomRightRadius:10,borderTopRightRadius:10,width:40, height:40, alignSelf:'center', backgroundColor:"#FFF", justifyContent:'center', elevation:1}}><Icon name="check" color="#005BBB"></Icon>
        </View></TouchableOpacity>
            </View>}
            </View>))}</ScrollView>

            </View>
            <TouchableOpacity onPress={()=>navigation.navigate('Maps')}><View  style={{backgroundColor:"#7242f5", borderRadius:10, width:'25%', padding:'2.5%', marginLeft:'5%'}}>
                <View style={{flexDirection:'row', justifyContent:'space-around'}}><Icon name="map" color="#FFF"></Icon><Text style={{fontWeight:'100', textAlign:'center', color:"#FFF"}}>Map View</Text></View>
            </View></TouchableOpacity>
            

          

            

        
    </View>
    )
};