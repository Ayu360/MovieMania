import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SearchBar from "../searchBar";
import FlatlistView from "../flatlist";
import { fetchMovies } from "../../api/fetchData";
import { colors } from "../../constants";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState();
  const [movieName, setMovieName] = useState("don")
  const [page, setPage] = useState(1)
  const { data, status, isError } = useQuery({
    queryFn: () => {
      return fetchMovies(`s=${movieName}`,page)
    },
    queryKey: [movieName, page]
  });

  // const movies = data?.Search;
  const [movies, setMovies] = useState(data?.Search)

  useEffect(()=>{
    if(status==='success')
      if(page === 1)
      setMovies(data?.Search)
      else
      setMovies((state)=>[...state, ...data?.Search])
  },[status])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heroSection}>
        <SearchBar 
          value={searchQuery}
          handleChangeText={setSearchQuery}
          handleSubmit={()=>{
            setMovieName(searchQuery)
            setPage(()=>1)
            setMovies([])
          }}
        />
        <Text style={styles.result}>
          No. of movies found: {movies?.length>0?movies?.length:0}
          </Text>
        {status === "success" && (
          <FlatList
            data={movies}
            keyExtractor={(item) => item.imdbID.toString()}
            renderItem={({ item }) => <FlatlistView item={item} />}
            onEndReachedThreshold={0.1}
            onEndReached={()=>setPage((page)=>page+1)}
            ListFooterComponent={()=>
            {
              movies?.lenght!==0 && 
              <Text style={{color:"white"}}>
                {
                  status=== "loading"?"Loading":"Load More"
                }
              </Text>
            }
            }
          />
        )}
        {isError && <Text>Some Error has occured</Text>}
        {status === "loading" && <ActivityIndicator size="large" />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors["primary"]
  },
  heroSection: {
    marginHorizontal: 10,
    // marginVertical: 5,
    height: "100%"
  },
  result: {
    color: "white",
    marginVertical:10
  }
});

export default Home;
