import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import React from 'react'
import colors from '@/constants/colors'

const CustomBotton = ({title, handlePress, textStyles, isLoading, containerStyles}
) => {
  return (
    <TouchableOpacity
        onPress={handlePress}
        style={{...styles.buttonSyles, opacity:isLoading?50:"", ...containerStyles}}
        disabled={isLoading}
    >
      <Text style={{...styles.buttonText, ...textStyles}}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    buttonSyles:{
        backgroundColor:"#FF9C01",
        justifyContent:"center",
        alignItems:"center",
        minHeight:62,
        borderRadius:10
    },
    buttonText:{
        color:colors["primary"],
        fontWeight:"700",
        fontSize:20
    }
})

export default CustomBotton