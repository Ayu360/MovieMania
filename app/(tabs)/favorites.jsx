import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import useMoviesStore from '../../store/moviesStore'
import FlatlistView from '../../components/flatlist'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../constants'
import Pagination from '../../components/pagination'

const favorites = () => {
    const getMovies = useMoviesStore((state)=>state.getMovies)
    const items = useMoviesStore(state=>state.items)
    const movies = useMoviesStore(state=>state.paginatedMovies)
    const initialIdx = useRef(0);
    const lastIdx= useRef(5)

    function handleforwardPagination(){
        getMovies(initialIdx.current,lastIdx.current)
        initialIdx.current += 5
        lastIdx.current+=5

        if (initialIdx.current > items) {
         initialIdx.current = items % 5;
        } else if (initialIdx.current < 0) {
            initialIdx.current = 0;
        } else {
            initialIdx.current = initialIdx.current;
        }

        if (lastIdx.current > items) {
            lastIdx.current = items;
          } else if (lastIdx.current < 0) {
            lastIdx.current = 5;
          } else {
            lastIdx.current = lastIdx.current;
          }

        
        
    }
    function handlebackwardPagination(){
        getMovies(initialIdx.current,lastIdx.current)
        initialIdx.current -= 5
        lastIdx.current-=5
        if (initialIdx.current > items) {
            initialIdx.current = items % 5;
           } else if (initialIdx.current < 0) {
               initialIdx.current = 0;
           } else {
               initialIdx.current = initialIdx.current;
           }
   
           if (lastIdx.current > items) {
                lastIdx.current = items;
            } else if (lastIdx.current < 0) {
                lastIdx.current = 5;
            } else {
                lastIdx.current = lastIdx.current;
            }
    }

    return (
    <SafeAreaView style={styles.container}>
        <View style={styles.heroSection}>
            {
                items>0 && 
                <>
                    <FlatList
                        data={movies}
                        keyExtractor={(item) => item.imdbID.toString()}
                        renderItem={({ item }) => <FlatlistView item={item} />}
                    />
                    {
                        items>5 &&
                        <Pagination handleforwardPagination={handleforwardPagination}
                            handlebackwardPagination={handlebackwardPagination}
                        />
                    }
                </>
            }
            {
                items===0 &&
                <Text style={styles.result}>No Item Found</Text>
            }
        </View>
    </SafeAreaView>
  )
}

export default favorites

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors["primary"]
    },
        heroSection: {
        marginHorizontal: 10,
        marginVertical: 5,
        height: "100%"
    },
    result: {
      color: "white",
      marginVertical:10
    }
})