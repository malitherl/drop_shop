import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Button, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Line } from 'react-native-svg';
import { Icon } from 'react-native-elements'
import { FlatList, ScrollView, TextInput } from 'react-native-gesture-handler';
import { List } from 'react-native-paper';
import { AppBar, IconButton } from '@react-native-material/core';


export default function BrowseRequests() {
    const navigation = useNavigation();
    const [expanded, setExpanded] = useState(true);

    const [image, setImage] = useState(
        [{"id": "1", "title": "banana","name":"Nadiya", "image": "https://images.immediate.co.uk/production/volatile/sites/30/2017/01/Bananas-218094b-scaled.jpg", "price": "2", "shopid": "1"}, {"id": "2", "title": "apple", "name":"Nadiya", "image": "https://media.istockphoto.com/photos/red-apple-picture-id184276818?k=20&m=184276818&s=612x612&w=0&h=QxOcueqAUVTdiJ7DVoCu-BkNCIuwliPEgtAQhgvBA_g=", "price": "2", "shopid": "1"}]);

    



    const renderItem = ({ item }) => {
        
        return (
            <View>
                
          <TouchableOpacity onPress={()=>navigation.navigate('ReqItem',{title:item.title, name:item.name, description:item.description,img:item.image, id:item.id})}><Image source={{uri:item.image}} style={styles.gallery}></Image></TouchableOpacity>
          <Text style={{position:'absolute', zIndex:2, backgroundColor:'#FFF', color:"#000", fontWeight:'bold', fontSize:20, opacity:0.7}}>  ฿ {item.value}  </Text>
          </View>
        );
      };
    

   
    
    return (
        <View>
            <AppBar
            style={{paddingTop:'5%'}}
    title="Again...Thank You!"
    centerTitle={true}
    leading={props => (
      <IconButton icon={props => <Icon name="menu"  color={"#FFF"} />} />
    )}
    
  />
            <Text style={{marginHorizontal:'5%'}}>Browse requests below, pay all or some of the listed donation price to provide item(s) to a verified person in crisis</Text>
            <Text style={{fontSize:20, textAlign:'center', marginTop:'5%'}}>Requests</Text>
            <View style={styles.body}>
           
            <View style={{marginTop:'10%', height:'80%'}}>
            
            
                <FlatList
                numColumns={2}
                data={image}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                
            />
            </View>
           
         

            
            
            
            
     </View>
        </View>
    );

}

const styles = StyleSheet.create({
    
    body:{
        paddingHorizontal:'10%',
    },
    
    logo: {
        width:'60%',
        height:'75%',
        resizeMode:'contain',
        alignSelf:'center',
    },
    title: {
        fontFamily:'Roboto',
        color:"#000",
        fontSize:25,
        textAlign:'center',
        fontWeight:'bold'
    },
    subtitle: {
        fontFamily:'Roboto',
        color:"#000",
        fontSize:20,
        textAlign:'left',
        fontWeight:'bold'
    },
    btntext: {
        fontFamily:'Roboto',
        color:"#FFF",
        fontSize:20,
        textAlign:'center'
    },
    btn: {
        backgroundColor:"#005792",
        paddingVertical:'2.5%',
        width:'90%',
        alignSelf:'center',
        borderRadius:20,
        marginTop:'10%'

    },
    horizontal: {
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        marginBottom:'5%'
    }, 
    link: {
        color:"#005792",
        fontSize:20,
        textAlign:'right'
    },
    input: {
        width:'100%',
        backgroundColor:"#F2F2F2",
        alignSelf:'center',
        borderRadius:10,
        fontSize:18,
        paddingVertical:'2.5%',
        paddingHorizontal:'5%',
        marginBottom:'5%',
        borderColor:"#E0E0E0",
        borderWidth:1
    },
    amount: {
        fontWeight:'bold',
        fontSize:40,
        textAlign:'center'
    },
    footer: {
        backgroundColor:"#005792",
        width:'100%',
        display:'flex',
        flexDirection:'row',
        position:'absolute',
        justifyContent:'space-evenly',
        bottom:0,
        paddingVertical:'5%',
        alignSelf:'center',
    },
    gallery: {
        width:155,
        height:155,
        resizeMode:'cover',
        marginHorizontal:'1.5%',
        marginVertical:'1.5%'
    }

});