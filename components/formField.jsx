import { View, Text, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";

import colors from "../constants/colors";

const FormField
 = ({title, value, handleChangeText, placeHolder}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <View style={styles.container}>
      <Text style={styles.titleStyles}>{title} :</Text>
      <View style = {styles.heroSection}>
        <TextInput
          placeholder={placeHolder}
          onChangeText={handleChangeText}
          style={styles.textInput}
          secureTextEntry={title==="Password" && !showPassword}
        />
      </View>
    </View>
  );
};

/*
      
            >
            <TextInput 
                className='flex-1 text-white font-psemibold text-base'
                value={value}
                placeholder={placeHolder}
                placeholderTextColor="#7b7b8b"
                onChangeText={handleChangeText}
                secureTextEntry={title==="password" && !showPassword}
            />

            {
                title==="password" &&
                <TouchableOpacity onPress={()=>setShowPassword(!showPassword)}>
                    <Image
                        source={!showPassword? icons.eye : icons.eyeHide}
                        resizeMode='contain'
                        className='w-6 h-6'
                    />
                </TouchableOpacity>
            }

           

*/

const styles = StyleSheet.create({
  container: {
    gap: 5,
  },
  titleStyles:{
    fontSize:16,
    color:colors["gray"][100]
  },
  heroSection:{
    borderWidth:2,
    borderColor:colors["black"][200],
    width:"100%",
    paddingHorizontal:4,
    borderRadius:10,
    backgroundColor:colors["black"][100],
    alignItems:"center",
    flexDirection:"row",
  },
  textInput:{
    flex:1,
    height:40,
    fontSize:16,
    color:"white",
    // height:"50%"
  }
});

export default FormField
;
