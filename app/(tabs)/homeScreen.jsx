import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "../../components/searchBar";
import FlatlistView from "../../components/flatlist";
import { fetchMovies } from "../../api/fetchData";
import { colors } from "../../constants";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movieName, setMovieName] = useState("don");
  const [page, setPage] = useState(1);

  const { data, status, isError } = useQuery({
    queryFn: () => fetchMovies(`s=${movieName}`, page),
    queryKey: [movieName, page],
    keepPreviousData: true, 
  });

  const [movies, setMovies] = useState([]);

 
  useEffect(() => {
    if (status === 'success') {
      if (page === 1) {
        setMovies(data?.Search || []);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...(data?.Search || [])]);
      }
    }
  }, [data, status, page]);

  
  useEffect(() => {
    if (status === 'success' && page === 1) {
      setMovies(data?.Search || []);
    }
  }, [movieName]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heroSection}>
        <SearchBar 
          value={searchQuery}
          handleChangeText={setSearchQuery}
          handleSubmit={() => {
            setMovieName(searchQuery);
            setPage(1);
          }}
        />
        <Text style={styles.result}>
          No. of movies found: {movies?.length || 0}
        </Text>
        {status === "success" && (
          <FlatList
            data={movies}
            renderItem={({ item }) => <FlatlistView item={item} />}
            onEndReachedThreshold={0.1}
            onEndReached={() => setPage((prevPage) => prevPage + 1)}
            ListFooterComponent={() => (
              status === "loading" ? 
              <ActivityIndicator size="large" color="white" /> : 
              <Text style={styles.loadMoreText}>Load More</Text>
            )}
          />
        )}
        {isError && <Text style={styles.errorText}>Some Error has occurred</Text>}
        {status === "loading" && page === 1 && <ActivityIndicator size="large" />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
  },
  heroSection: {
    marginHorizontal: 10,
    height: "100%",
  },
  result: {
    color: "white",
    marginVertical: 10,
  },
  loadMoreText: {
    color: "white",
    textAlign: 'center',
    paddingVertical: 10,
  },
  errorText: {
    color: "red",
    textAlign: 'center',
    paddingVertical: 10,
  },
});

export default Home;