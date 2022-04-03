import { HStack, Banner, Button, AppBar, IconButton } from "@react-native-material/core";
import { Text, View, Image } from "react-native";
import { Icon } from "react-native-material-ui";
import { useNavigation } from '@react-navigation/native';
import { useState } from "react";

export default function Item({route}){
    const navigation = useNavigation();
    const { name, img, description,id } = route.params;
    const [quant, setquant] = useState(0)
    return(
        <View>
            <AppBar
            style={{paddingTop:'5%'}}
    title="Item"
    centerTitle={true}
    leading={props => (
      <IconButton icon={props => <Icon name="menu"  color={"#FFF"} />} />
    )}
    
  />
  <Image style={{height:'50%', resizeMode:'contain', borderRadius:50, marginVertical:'15%', width:'80%', alignSelf:'center'}} source={{uri:img}}></Image>

  <Text style={{fontSize:20, textAlign:'center'}}>{name}</Text>
  <Text style={{fontSize:14, textAlign:'center', color:'#6f03fc'}}>{description}</Text>

      <HStack spacing={4} style={{alignSelf:'center'}}>
      <Button onPress={()=>{setquant(quant+1)}} key="add" color="#6f03fc" variant="text" compact trailing={props => <Icon name="expand-less" />} />
      <Text style={{fontSize:30, fontWeight:'bold'}}>{quant.toString()}</Text>
        <Button onPress={()=>{setquant(quant-1)}} key="remove" variant="text" color="#6f03fc" compact trailing={props => <Icon name="expand-more" />} />
      </HStack>
      <Button  onPress={()=>navigation.navigate('Optional',{id,quant})} title="Next" style={{width:'70%', alignSelf:'center'}}></Button>
    </View>
    )
}


