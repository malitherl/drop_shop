import { HStack, Banner, Button, AppBar, IconButton } from "@react-native-material/core";
import { Text, View, Image } from "react-native";
import { Icon } from "react-native-material-ui";
import { useNavigation } from '@react-navigation/native';

export default function Onboard(){
    const navigation = useNavigation();
    return(
        <View>
            <AppBar
            style={{paddingTop:'5%'}}
    title="Drop Shop"
    centerTitle={true}
    leading={props => (
      <IconButton icon={props => <Icon name="menu"  color={"#FFF"} />} />
    )}
    
  />
  <Image style={{height:'50%', resizeMode:'contain', borderRadius:10, marginVertical:'15%'}} source={{uri:'https://images.unsplash.com/photo-1541976844346-f18aeac57b06?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1335&q=80'}}></Image>

  <Text style={{fontSize:20, textAlign:'center'}}>Select option below to get started</Text>

      <HStack spacing={4} style={{alignSelf:'center'}}>
      <Button onPress={()=>{navigation.navigate('HelpType')}} key="help" variant="text" title="I want to help" compact />
        <Button onPress={()=>{navigation.navigate('Verification')}} key="request" variant="text" title="I need help" compact />
      </HStack>
    </View>
    )
}


