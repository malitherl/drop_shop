import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Image, TextInput } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { Chip, Modal, Provider, Portal } from 'react-native-paper';

export default function Maps() {
  const [hasPermission, setHasPermission] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [visible, setVisible] = React.useState(false);

    const [like, setlike] = useState('1')
    const [donate, setdonate] = useState('')
    const [success, setsuccess] = useState(false);
    const [pendingreq, setpendingreq] = useState({"requests": [{"id": "1", "name": "muntaser", "amount": "2", "details": " hello i need dollars to buy this chips packet", "phone": "+13218775974", "imageurl": "https://api.twilio.com/2010-04-01/Accounts/AC2e9791a102ff64ae9008e3fbb3a5cec5/Messages/MM617a87f7fcdb937a3e056c2315843bbd/Media/ME171ff51f769d679cf681f5a234d62908", "timestamp": "1647170324", "balance": 2.0, "status": "unfilled", "latlng": {"latitude": "50.511409592011084", "longitide": "30.62187653816344"}}]})



  let loc = 'Waiting..';

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [select, setselect] = useState(0)
  
    const [markers, setMarkers]= useState([{"id": "1", "name": "muntaser", "amount": "2", "details": " hello i need dollars to buy this chips packet", "phone": "+13218775974", "imageurl": "https://api.twilio.com/2010-04-01/Accounts/AC2e9791a102ff64ae9008e3fbb3a5cec5/Messages/MM617a87f7fcdb937a3e056c2315843bbd/Media/ME171ff51f769d679cf681f5a234d62908", "timestamp": "1647170324", "balance": 2.0, "status": "unfilled", "latlng": {"latitude": "50.511409592011084", "longitide": "30.62187653816344"}}, {"id": "2", "name": "muntaser", "amount": "3", "details": " hello i need help buying bread at lat50.50307 long30.47261", "phone": "+13218775974", "imageurl": "https://api.twilio.com/2010-04-01/Accounts/AC2e9791a102ff64ae9008e3fbb3a5cec5/Messages/MM3bd2635dbaa827f4f800dffb3ef57ebf/Media/ME6c9f3f83f787d2b3005539b6cc40c5b2", "timestamp": "1647189185", "balance": 3.0, "status": "unfilled", "latlng": {"latitude": "50.50307", "longitide": "30.47261"}}]);

    

    

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


    useEffect(() => {
      _getAllMarkers();
      
    }, [])

 

      


  const navigation = useNavigation();

 



  return (
    <Provider>
    <Portal>
      <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={{borderRadius:10, width:'90%', alignSelf:'center', backgroundColor:"#FFF", padding:'5%'}}>
      <View style={{alignSelf:'center', alignContent:'center', borderRadius:20, borderWidth:1, borderColor:'#EAEAEA', paddingBottom:'5%', backgroundColor:"#005BBB", elevation:1}}>
            <View style={{alignSelf:'center', alignContent:'center', borderRadius:20,backgroundColor:"#FFD500", opacity:1, marginBottom:'5%', paddingBottom:'5%'}}>
                <View style={{alignSelf:'center', alignContent:'center', borderRadius:20,backgroundColor:"#FFF", opacity:1, marginBottom:'5%'}}>
                    <Text style={{position:'absolute', opacity:0.5, borderTopRightRadius:20,borderBottomLeftRadius:20, top:0, right:0, zIndex:3, backgroundColor:'#FFD500', width:100, height:50, textAlignVertical:'center', textAlign:'center', fontFamily:'Roboto'}}>{pendingreq.requests[select].status}</Text>
                <Image source={{uri:pendingreq.requests[select].imageurl}} style={{width:300, height:150, borderRadius:20}}></Image>
                <Text style={{fontWeight:'bold', color:'#000', fontSize:20, marginHorizontal:'5%'}}>${pendingreq.requests[select].balance}</Text>
                <Text style={{fontFamily:'Roboto', color:'#000', fontSize:15, marginHorizontal:'5%', marginBottom:'0%', flexWrap:'wrap', width:250}}>{pendingreq.requests[select].details}</Text>
                <Text style={{fontFamily:'Roboto', color:'#005BBB', fontSize:10, marginHorizontal:'5%', marginBottom:'5%'}}>{pendingreq.requests[select].restaurantname}</Text>
                </View>
                <Icon name={like==pendingreq.requests[select].id?"heart":"hearto"} type="ant-design" onPress={()=>setlike(pendingreq.requests[select].id)} color={like==pendingreq.requests[select].id?"red":"black"}></Icon>
            </View>
            {like==pendingreq.requests[select].id&&<View style={{flexDirection:'row', alignSelf:'center', width:'70%'}}><View style={{width:'70%', backgroundColor:"#FFF", height:40, borderBottomLeftRadius:10,borderTopLeftRadius:10, alignSelf:'center', padding:'2.5%', opacity:0.5}}>
                <TextInput placeholder="Donate" style={{fontFamily:'Roboto'}} value={donate} onChangeText={(e)=>setdonate(e)}></TextInput>
            </View>
            <TouchableOpacity onPress={()=>_placeBid(pendingreq.requests[select].id)}>
                <View style={{ marginTop:'5%',borderBottomRightRadius:10,borderTopRightRadius:10,width:40, height:40, alignSelf:'center', backgroundColor:"#FFF", justifyContent:'center', elevation:1}}><Icon name="check" color="#005BBB"></Icon>
        </View></TouchableOpacity>
        </View>}
        </View>
      </Modal>

    </Portal>
    <View style={{flex:1, backgroundColor:"#fff", paddingTop:'10%'}}>
      <View style={{backgroundColor:"#FFF", borderTopLeftRadius:20, borderTopRightRadius:20}}>
                      <MapView style={{width: 500,height: 800, alignSelf:'center'}} 
                        initialRegion={{
                            latitude: 38.830007,
                            longitude: -77.314510,
                            latitudeDelta: .005,
                            longitudeDelta: .005
                            }} 
                            >
                            {
                                pendingreq.requests.map((marker, i) => (
                                    <MapView.Marker key={i} onPress={()=>{setselect(i);showModal();}} coordinate={{"latitude":parseFloat(marker.latlng.latitude),"longitude":parseFloat(marker.latlng.longitide)}} title={marker.name} description={marker.details}>
                                    </MapView.Marker>
                                    
                                    
                                ))}
                        </MapView>
                  


          </View>
          <View>
              <Icon></Icon>
              <Icon></Icon>
              <Icon></Icon>
          </View>
    </View>
    </Provider>
  );
}