import { View, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useRef } from 'react'
import { icons } from '../constants'
import useMoviesStore from '../store/moviesStore'

const Pagination = ({handlePagination}) => {
    const items = useMoviesStore(state=>state.items)
    const initialnIdx = useRef(0);
    const lastIndx= useRef(5)

    function left(){
        if(initialnIdx.current===0){
            return;
        }

        initialnIdx.current-=5;
        const remainder = (lastIndx.current)%5
        lastIndx.current -= remainder===0?5:remainder
        handlePagination(initialnIdx.current,lastIndx.current)
    }

    function right(){
        if(lastIndx.current===items){
            return;
        }

        initialnIdx.current+=5;
        lastIndx.current = Math.min(lastIndx.current+5, items)
        handlePagination(initialnIdx.current,lastIndx.current)
    }

    return (
    <View style={styles.container}>
        <TouchableOpacity disabled={initialnIdx===0}
            onPress={left}
        >
            <Image source={icons.leftArrow}
                resizeMode='contain'
                style={{height:30, width:30}}
            />
        </TouchableOpacity>
        <TouchableOpacity disabled={lastIndx===items}
            onPress={right}
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