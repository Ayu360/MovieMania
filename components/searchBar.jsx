import { View, TextInput, StyleSheet } from 'react-native'
import React from 'react'

import {colors} from '../constants'

const SearchBar = ({value, placeholder="Enter the movie name", handleChangeText, handleSubmit}) => {
  return (
    <View style={styles.container}>
        <TextInput 
          style={styles.input}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          onEndEditing={handleSubmit}
        />

    
        <TouchableOpacity>
            <Image
                source={icons.search}
                style={styles.img}
                resizeMode='contain'
            />
        </TouchableOpacity>
    

    </View> 
  )
}

/*

className='flex-1 text-white font-pregular text-base mt-0.5'
*/

const styles = StyleSheet.create({
    container: {
        width:"100%",
        height:50,
        paddingHorizontal: 5,
        borderColor: colors["black"][200],
        backgroundColor:colors["black"][100],
        borderWidth: 2,
        borderRadius:10,
        alignItems:"center",
        flexDirection:"row",
        gap:5
    },
    input:{
        flex:1,
        color:"white",
        fontSize:16,
        marginTop:0.5
    },
    img:{
      width:30,
      height:30,
    }
})

export default SearchBar
import { useState } from 'react'
import { TouchableOpacity, Image } from 'react-native'

import { icons } from '../constants'

       