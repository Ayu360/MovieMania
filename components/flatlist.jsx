import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { colors } from '../constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { router } from 'expo-router';

const DEFAULT_IMAGE="https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg"

function shortenString(inputString) {
    if (inputString.length > 24) {
      return inputString.substring(0, 24) + "..";
    } else {
      return inputString;
    }
}

import {icons} from '../constants';



const FlatlistView = ({item}) => {
  return (
    <View style={styles.container}>
        <Image
            source={{uri:item.Poster==="N/A"? DEFAULT_IMAGE : item.Poster}}
            style={styles.image}
            resizeMode='contain'
        />
        <View style={styles.contentSection}>
            <Text style={styles.heading}>
                {
                    shortenString(item.Title)
                }
            </Text>
            <Text style={styles.year}>ℹ️   {item.Year}</Text>
        </View>
        <TouchableOpacity onPress={()=>{
            router.navigate({
                pathname: '[movieId]',
                params: { id: item.imdbID }
            })
        }}>
            <Image
                source={icons.rightArrow}
                style={{width:20, height:20}}
                resizeMode='contain'
            />
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        height:100,
        width:"100%",
        flexDirection:"row",
        backgroundColor:colors.secondary[200],
        marginBottom:10,
        borderRadius:10,
        padding: 10
        
    },
    image:{
        height:80,
        width:80,
        borderWidth:2,
        borderBlockColor:"black"
    },
    contentSection:{
        width:"70%",
        gap:10
    },
    heading:{
        fontSize:20,
        fontWeight:"600",
    },
    year:{
        fontSize:16,
        color:colors.primary,
        fontWeight:"500",
    }
})

export default FlatlistView