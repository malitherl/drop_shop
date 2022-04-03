import { HStack, Banner, Button, AppBar, IconButton } from "@react-native-material/core";
import { Text, View, Image } from "react-native";
import { Icon } from "react-native-material-ui";
import { useNavigation } from '@react-navigation/native';

export default function HelpType(){
    const navigation = useNavigation();
    return(
        <View>
            <AppBar
            style={{paddingTop:'5%'}}
    title="Thank You"
    centerTitle={true}
    leading={props => (
      <IconButton icon={props => <Icon name="menu"  color={"#FFF"} />} />
    )}
    
  />
  <Text style={{marginHorizontal:'5%', marginTop:'5%'}}>We are greatful for your help! 
What did you have in mind?</Text>

<Text style={{fontSize:20, textAlign:'center', marginTop:'5%'}}>Select option below</Text>

<Button onPress={()=>navigation.navigate('BrowseRequests')} title="Donate" style={{width:'70%', alignSelf:'center', marginTop:'15%'}}></Button>

<Button title="Volunteer" style={{width:'70%', alignSelf:'center', marginTop:'15%'}}></Button>

<Button title="Add my store*" style={{width:'70%', alignSelf:'center', marginTop:'15%'}}></Button>

<Button title="Help Deliver*" style={{width:'70%', alignSelf:'center', marginTop:'15%'}}></Button>


    </View>
    )
}


