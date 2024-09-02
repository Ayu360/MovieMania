import React, { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SearchBar from "../../components/searchBar";
import FlatlistView from "../../components/flatlist";
import { fetchMovies } from "../../api/fetchData";
import { colors } from "../../constants";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState();
  const [movieName, setMovieName] = useState("inception")
  const { data, status, isError } = useQuery({
    queryFn: () => fetchMovies(`s=${movieName}`),
    queryKey: [movieName]
  });

  const movies = data?.Search;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heroSection}>
        <SearchBar 
          value={searchQuery}
          handleChangeText={setSearchQuery}
          handleSubmit={()=>setMovieName(searchQuery)}
        />
        <Text style={styles.result}>
          No. of movies found: {data?.Search?.length>0?data?.Search?.length:0}
          </Text>
        {status === "success" && (
          <FlatList
            data={movies}
            keyExtractor={(item) => item.imdbID.toString()}
            renderItem={({ item }) => <FlatlistView item={item} />}
          />
        )}
        {isError && <Text>Hi</Text>}
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
