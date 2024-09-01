import { router, Tabs } from 'expo-router';
import {colors, icons} from '@/constants'
import { Image, TouchableOpacity, Text } from 'react-native';
import useAuthStore from '@/store/authStore'

function Layout(){
    const user = useAuthStore(state=>state.user)
    const setUser = useAuthStore(state=>state.setUser)

    return <Tabs screenOptions={{
        tabBarActiveTintColor:colors["secondary"].DEFAULT,
        tabBarActiveBackgroundColor: colors["black"][200],
        tabBarInactiveTintColor:colors["gray"][200],
        tabBarStyle:{
            backgroundColor:colors.primary,
            height:60,
            paddingBottom:10
        },
        tabBarIconStyle: { display: "none" },
        tabBarLabelStyle: {
            fontWeight: "700",
            fontSize: 15,
        },
    }}>
        <Tabs.Screen name="homeScreen" options={
            {
                headerTitle: "MOVIELOGY",
                headerTitleAlign:"center",
                headerTintColor:colors["gray"][100],
                headerStyle: {
                    backgroundColor: colors.primary
                },
                headerRight: ()=>{
                    return (
                    <TouchableOpacity
                        onPress={()=>{
                            router.dismissAll("/")
                            setUser({...user, isLoggedIn:false})
                        }}
                        
                    >
                    <Image
                            source={icons.logout}
                            style={{height:20, width:30}}
                            resizeMode='center'
                        />
                    </TouchableOpacity>)
                }
            }
        }/>
        <Tabs.Screen name="favorites" options={
            {
                headerTitle: "Favorites",
                headerTitleAlign:"center",
                headerTintColor:colors["gray"][100],
                headerStyle: {
                    backgroundColor: colors.primary
                },
            }
        }/>
    </Tabs>
}

export default Layout;
