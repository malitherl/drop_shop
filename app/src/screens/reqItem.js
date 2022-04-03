import { HStack, Banner, Button, AppBar, IconButton } from "@react-native-material/core";
import { Text, View, Image } from "react-native";
import { Icon } from "react-native-material-ui";
import { useNavigation } from '@react-navigation/native';
import { useState } from "react";

export default function ReqItem({route}){
    const navigation = useNavigation();
    const { name,title, img, description,id } = route.params;
    const [quant, setquant] = useState(0)
    return(
        <View>
            <AppBar
            style={{paddingTop:'5%'}}
    title={name+"'s Request"}
    centerTitle={true}
    leading={props => (
      <IconButton icon={props => <Icon name="menu"  color={"#FFF"} />} />
    )}
    
  />
  <Image style={{height:'50%', resizeMode:'contain', borderRadius:50, marginVertical:'15%', width:'80%', alignSelf:'center'}} source={{uri:img}}></Image>

  <Text style={{fontSize:20, textAlign:'center'}}>{title}</Text>
  <Text style={{fontSize:14, textAlign:'center', color:'#6f03fc'}}>Amount to pay</Text>

      <HStack spacing={4} style={{alignSelf:'center'}}>
      <Button onPress={()=>{setquant(0)}} key="reset" title="RESET" variant="text" color="#6f03fc" compact  />
      <Button onPress={()=>{setquant(quant+1)}} key="add" color="#6f03fc" variant="text" compact trailing={props => <Icon name="expand-less" />} />
      <Text style={{fontSize:30, fontWeight:'bold'}}>{quant.toString()}.00</Text>
        <Button onPress={()=>{setquant(quant-1)}} key="remove" variant="text" color="#6f03fc" compact trailing={props => <Icon name="expand-more" />} />
        <Button onPress={()=>{setquant(quant+5)}} key="all" title="ALL" variant="text" color="#6f03fc" compact  />
      </HStack>
      <Button  onPress={()=>navigation.navigate('Thankyou')} title="Next" style={{width:'70%', alignSelf:'center'}}></Button>
    </View>
    )
}


