import { View, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import { icons } from '../constants'
import useMoviesStore from '../store/moviesStore'

const Pagination = ({handleforwardPagination, handlebackwardPagination}) => {
    const initalIdx = useMoviesStore(state=>state.intialIdx)
    const lastIdx = useMoviesStore(state=>state.lastIdx)
    const items = useMoviesStore(state=>state.items)
    return (
    <View style={styles.container}>
        <TouchableOpacity disabled={initalIdx===0}
            onPress={handlebackwardPagination}
        >
            <Image source={icons.leftArrow}
                resizeMode='contain'
                style={{height:30, width:30}}
            />
        </TouchableOpacity>
        <TouchableOpacity disabled={lastIdx===items}
            onPress={handleforwardPagination}
        >
            <Image source={icons.rightArrow}
                resizeMode='contain'
                style={{height:30, width:30}}
            />
        </TouchableOpacity>
    </View>
  )
}///

const styles = StyleSheet.create({
    container:{
        with:"100%",
        height:50,
        flexDirection:"row",
        justifyContent:"space-between",
        marginBottom:"5%"
    }
})

export default Pagination