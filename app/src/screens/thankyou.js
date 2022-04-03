import { HStack, Banner, Button, AppBar, IconButton } from "@react-native-material/core";
import { Text, View, Image } from "react-native";
import { Icon } from "react-native-material-ui";
import { useNavigation } from '@react-navigation/native';

export default function ThankYou(){
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
  <Banner
    text="You have a message from Nadiya"
    buttons={
      <HStack spacing={2}>
        <Button key="fix-it" variant="text" title="Read" compact />
        <Button key="learn-more" variant="text" title="Later" compact />
      </HStack>
    }
  />

  <Text style={{fontSize:20, textAlign:'center', fontWeight:'bold', marginTop:'15%', marginBottom:'5%'}}>Thank you for your donation</Text>
  <Text style={{textAlign:'center'}}>Donations like yours help people in crisis all 
around the world. People like you make our work possible! We will let notify you when Nadiya receives their item(s) and if they are able to send a thank youn note!</Text>

  

    </View>
    )
}


