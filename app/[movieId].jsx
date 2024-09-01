import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import colors from '../constants/colors';
import { useQuery } from '@tanstack/react-query';
import { fetchSelectedMovie } from '../api/fetchData';
import CustomButton from '../components/customButton';
import { ScrollView } from 'react-native-gesture-handler';
import useMoviesStore from '../store/moviesStore';

const DEFAULT_IMAGE="https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg"

const SelectedMovie = () => {
  const { id } = useLocalSearchParams();
  const { data, status, isLoading } = useQuery({
    queryFn: () => fetchSelectedMovie(`${id}`),
    queryKey: ['movieName'],
  });

  const [isPresent, setIsPresent] = useState(false);
  const addMovies = useMoviesStore((state) => state.addMovies);
  const checkMovie = useMoviesStore((state) => state.checkMovie);

  useEffect(() => {
    if (data) { 
      const flag = checkMovie(data); 
      setIsPresent(flag); 
    }
  }, [data, checkMovie]); 

  const handleAddMovie = () => {
    if (!isPresent) {
      addMovies(data); 
      setIsPresent(true);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {status === 'success' && (
          <>
            <View style={styles.details}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <>
                  <View style={styles.header}>
                    <Image source={{uri:data.Poster==="N/A"? DEFAULT_IMAGE : data.Poster}} style={styles.poster} resizeMode="contain" />
                    <View style={styles.detailsOverview}>
                      <Text style={styles.title}>{data.Title}</Text>
                      <Text style={styles.info}>
                        {data.Released} • {data.Runtime}
                      </Text>
                      <Text style={styles.genre}>{data.Genre}</Text>
                      <Text style={styles.ratingText}>⭐ {data.imdbRating} IMDb rating</Text>
                    </View>
                  </View>
                  <View style={styles.section}>
                    <Text style={styles.plot}>
                      <Text style={styles.emphasis}>{data.Plot}</Text>
                    </Text>
                    <Text style={styles.actors}>Starring {data.Actors}</Text>
                    <Text style={styles.director}>Directed by {data.Director}</Text>
                  </View>
                  <CustomButton 
                    title={!isPresent ? 'Add to favorites' : 'Movie already present'}
                    handlePress={handleAddMovie}
                    textStyles=''
                    containerStyles={styles.buttonStyles}
                    isLoading={isPresent}
                  />
                </>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: colors["primary"],
  },
  details: {
    padding: 16,
    backgroundColor: '#fff',
    marginHorizontal: "5%",
    marginVertical: "30%",
    justifyContent: "space-around",
  },
  buttonStyles: {
    width: "100%",
    marginTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  section: {
    marginTop: 16,
  },
  poster: {
    width: 100,
    height: 150,
  },
  detailsOverview: {
    flex: 1,
    paddingLeft: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  genre: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 16,
    color: '#666',
  },
  plot: {
    fontSize: 16,
    marginBottom: 16,
  },
  emphasis: {
    fontStyle: 'italic',
  },
  actors: {
    fontSize: 16,
    marginBottom: 8,
  },
  director: {
    fontSize: 16,
  },
});

export default SelectedMovie;
