import QRCode from 'react-native-qrcode-svg';
import { HStack, Banner, Button, AppBar, IconButton } from "@react-native-material/core";
import { Text, View, Image } from "react-native";
import { Icon } from "react-native-material-ui";
import { useNavigation } from '@react-navigation/native';

export default function ConfirmQr(){
    const navigation = useNavigation();
    return(
        <View>
            <AppBar
            style={{paddingTop:'5%'}}
    title="Pick Up"
    centerTitle={true}
    leading={props => (
      <IconButton icon={props => <Icon name="menu"  color={"#FFF"} />} />
    )}
    
  />
  <Banner
    text="Success! You got a sponsor. Muntaser Syed
    funded your request."
    buttons={
      <HStack spacing={2}>
        <Button key="fix-it" variant="text" title="Send a thank you note" compact />
        <Button key="learn-more" variant="text" title="Later" compact />
      </HStack>
    }
  />
  <Text style={{marginHorizontal:'5%', marginTop:'5%'}}>You can pick up your item(s) at Ebtesam’s Supplies, address/location at check out show this QR code.  After you have acquired your supplies click next.</Text>
  <View style={{alignSelf:'center', marginTop:'15%'}}>
<QRCode
      value="http://awesome.link.qr"
      size={200}
    /></View>
<Button title="Next" style={{width:'70%', alignSelf:'center', marginTop:'15%'}}></Button>
      
    </View>
    )
}


