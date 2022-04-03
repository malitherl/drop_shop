import { HStack, Banner, Button, AppBar, IconButton, TextInput } from "@react-native-material/core";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { Icon } from "react-native-material-ui";
import { useNavigation } from '@react-navigation/native';
import { useState } from "react";

export default function Optional({route}){
    const navigation = useNavigation();
    const { id, quant } = route.params;
    const [showtext, setshowtext] = useState(false)
    const [msg, setmsg] = useState('')
    return(
        <View>
            <AppBar
            style={{paddingTop:'5%'}}
    title="Add a message"
    centerTitle={true}
    leading={props => (
      <IconButton icon={props => <Icon name="menu"  color={"#FFF"} />} />
    )}
    
  />
<Text style={{fontWeight:'bold', textAlign:'center', fontSize:15}}>Include a message for potential sponsors</Text>
  <Text style={{marginHorizontal:'5%'}}>Optional; included a written or recorded message to attract potential sponsorship</Text>

    <TouchableOpacity  onPress={()=>{setshowtext(!showtext)}}><Icon name="sms" style={{alignSelf:'center', marginVertical:'15%'}} size={40} color={msg!=''?'#6f03fc':''}></Icon></TouchableOpacity>
      {showtext&&<TextInput
      mode={'outlined'}
      style={{width:'90%', height:50, alignSelf:'center', marginHorizontal:'5%', marginVertical:'5%'}}
      label="Message"
      value={msg}
      onChangeText={text => setmsg(text)}
    />}
  
      <Icon name="camera" style={{alignSelf:'center', marginVertical:'15%'}} size={40}></Icon>
      
      <Icon name="mic" style={{alignSelf:'center', marginVertical:'15%'}} size={40}></Icon>
      <Button  onPress={()=>navigation.navigate('ConfirmQr')} title="Next" style={{width:'70%', alignSelf:'center'}}></Button>
    </View>
    )
}


