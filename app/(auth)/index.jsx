import { View, Text, StyleSheet, Alert, ScrollView, Image } from 'react-native'
import { Link } from 'expo-router';
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuthStore from '../../store/authStore';
import { router } from 'expo-router';
import FormField from '../../components/formField';


import colors from '../../constants/colors'
import { images } from '../../constants'
import CustomButton from '../../components/customButton'

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

const SignIn = () => {
  const [newUser, setNewUser] = useState({
    email:null,
    userName:null,
    password:null,
  })
  const setUser = useAuthStore((state)=>state.setUser)

  function handleSubmit(){
    if(!newUser.email && !newUser.userName && !newUser.password  ) {
      Alert.alert("Incomplete Details", "Please fill all the details")
      return false;
    }

    if(!validateEmail(newUser.email)){
      Alert.alert("Email invalid", "Please enter valid email")
      return false;
    }

    const userDetails={
      ...newUser,
      isLoggedIn:true
    }

    setUser(userDetails)
    return true;
  }

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={{height:"100%"}}>
      <View style={styles.heroSection}>
        <View>
          <Image 
            source={images.logo}
            style={styles.logo}
            resizeMode='contain'
          />
          <Text style={{color:colors["gray"][100], fontSize:20}} >Log In to MovieMania</Text>
        </View>
        <View style={{width:"100%", gap:20}}>
          <FormField 
            title="Email" 
            placeholder="Enter your email" 
            handleChangeText={(e)=>setNewUser({...newUser,email:e})}
            />

          <FormField 
            title="User" 
            placeholder="Enter your user name" 
            handleChangeText={(e)=>setNewUser({...newUser,userName:e})}
            />

          <FormField 
            title="Password" 
            placeholder="Enter your password" 
            handleChangeText={(e)=>setNewUser({...newUser,password:e})}
            />

        </View>
        <View style={{width:"100%"}}>
          <CustomButton
            title='Get-IN'
            handlePress={()=>{
              const res = handleSubmit();
              if(res) router.replace("(tabs)/homeScreen")
            }}
            textStyles='' 
            isLoading={false}  
            containerStyles={styles.buttonSyles}
            />
          

          <View style={styles.footer}>
            <Text style={styles.footerIntro}>
              Don't want to continue?
            </Text>
            <Link href="../" replace style={styles.footerLink}>Main Screen</Link>
          </View>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    backgroundColor:colors["primary"],
    height:"100%",
    padding:4
  },
  heroSection:{
    width:"100%",
    paddingHorizontal:4,
    marginVertical:6,
    minHeight:"85%",
    justifyContent:"space-around",
    gap:10
  },
  logo:{
    width:"60%",
    height:84
  },
  textInput:{
    with:"100%",
    height:50,
    padding:5,
    backgroundColor:"#ccc",
    borderRadius:10,
  },
  footer:{
    justifyContent:"center",
    flexDirection:"row",
    paddingTop:5,
    gap:2,

  },
  footerIntro:{
    fontSize:15,
    color:colors["gray"][100]
  },
  footerLink:{
    fontSize:15,
    color:colors["secondary"].DEFAULT
  },
  buttonSyles:{
    width:"100%",
    marginTop:30
  }
})

export default SignIn