import { router, Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from "../constants";
import { TouchableOpacity, Text } from "react-native";


const queryClient = new QueryClient()

export default function RootLayout(){

    return (
        <GestureHandlerRootView style={{flex:1}}>
            <QueryClientProvider client={queryClient}>
                <Stack screenOptions={{
                    // headerShown:false,
                }}>
                    <Stack.Screen name="index" options={
                        {
                            headerShown:false,
                        }
                    }/>
                    
                    <Stack.Screen name="(auth)" options={
                        {
                            headerShown:false
                        }
                    }/>
                    <Stack.Screen name="(tabs)" options={
                        {
                            headerShown:false
                        }
                    }/>
                    <Stack.Screen name="[movieId]" options={
                        {
                            headerTitle: "MOVIEMANIA",
                            headerTitleAlign:"center",
                            headerTintColor:colors["gray"][100],
                            headerStyle: {
                                backgroundColor: colors.primary
                            },
                            headerLeft:()=>{
                                return <TouchableOpacity onPress={()=>router.back()}>
                                    <Text style={{color:"white"}}>Back</Text>
                                </TouchableOpacity>    
                            }
                        }
                    }/>

                </Stack>
            </QueryClientProvider>
        </GestureHandlerRootView>
    )
}