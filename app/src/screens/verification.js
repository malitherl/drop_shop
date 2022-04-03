import { HStack, Banner, Button, AppBar, IconButton } from "@react-native-material/core";
import { Text, View, Image } from "react-native";
import { Icon } from "react-native-material-ui";
import { TextInput } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import { useState } from "react";


export default function Verification(){
    const navigation = useNavigation();
    const [name, setname] = useState('')
    const [location, setlocation] = useState('')
    const [phone, setphone] = useState('')
    const [address, setaddress] = useState('')
    return(
        <View>
            <AppBar
            style={{paddingTop:'5%'}}
    title="Verification"
    centerTitle={true}
    leading={props => (
      <IconButton icon={props => <Icon name="menu"  color={"#FFF"} />} />
    )}
    
  />

  <Text style={{fontSize:14, textAlign:'left', marginHorizontal:'5%', marginTop:'5%'}}>First, we will help you set up a profile 
and verify you are an “individual in crisis”
if you live in an area considered a “disaster”
or “war zone” this process is expedited</Text>

<Text style={{fontWeight:'bold', textAlign:'center', marginTop:'5%'}}>Please input your
 information below</Text>

 <TextInput
      mode={'outlined'}
      style={{width:'90%', height:50, alignSelf:'center', marginHorizontal:'5%', marginVertical:'5%'}}
      label="Name"
      value={name}
      onChangeText={text => setname(text)}
    />
    <TextInput
      mode={'outlined'}
      style={{width:'90%', height:50, alignSelf:'center', marginHorizontal:'5%', marginVertical:'5%'}}
      label="Location"
      value={location}
      onChangeText={text => setlocation(text)}
    />
    <TextInput
      mode={'outlined'}
      style={{width:'90%', height:50, alignSelf:'center', marginHorizontal:'5%', marginVertical:'5%'}}
      label="Phone"
      value={phone}
      onChangeText={text => setphone(text)}
    />
    <TextInput
      mode={'outlined'}
      style={{width:'90%', height:50, alignSelf:'center', marginHorizontal:'5%', marginVertical:'5%'}}
      label="Address"
      value={address}
      onChangeText={text => setaddress(text)}
    />

    <Button title="Next" onPress={()=>navigation.navigate('Store')} style={{width:'70%', alignSelf:'center', marginTop:'10%'}}></Button>

    
    </View>
    )
}


