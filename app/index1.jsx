import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import colors from '@/constants/colors';
import { useQuery } from '@tanstack/react-query';
import {fetchSelectedMovie} from '@/api/fetchData'
import CustomBotton from '@/components/customButton'
import { ScrollView } from 'react-native-gesture-handler';


const selectedMovie = () => {
  // const {id} = useLocalSearchParams()
  const id = " tt5295990"
  const { data, status, isError, isLoading } = useQuery({
    queryFn: () => fetchSelectedMovie(`${id}`),
    queryKey: ['movieName']
  });

  // const {
  //   Title: title,
  //   Poster: poster,
  //   Released: released,
  //   Runtime: runtime,
  //   Genre: genre,
  //   Plot: plot,
  //   Actors: actors,
  //   Director: director,
  //   imdbRating,
  //   imdbID,
  // } = data;

  // console.log(data?.Title)

  return (
    <View style={styles.container}>
      <ScrollView>
        {
          status==='success' &&
          <>
            <View style={styles.details}>
              {isLoading ? (
                  <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                  <>
                    <View style={styles.header}>
                      <Image source={{ uri: data.Poster }} style={styles.poster}  resizeMode='contain'/>
                      <View style={styles.detailsOverview}>
                        <Text style={styles.title}>{data.Title}</Text>
                        <Text style={styles.info}>
                          {data.Released} • {data.Runtime}
                        </Text>
                        <Text style={styles.genre}>{data.Genre}</Text>
                        <Text style={styles.ratingText}>
                          ⭐ {data.imdbRating} IMDb rating
                        </Text>
                      </View>
                    </View>
                    <View style={styles.section}>
                      <Text style={styles.plot}>
                        <Text style={styles.emphasis}>{data.Plot}</Text>
                      </Text>
                      <Text style={styles.actors}>Starring {data.Actors}</Text>
                      <Text style={styles.director}>Directed by {data.Director}</Text>
                    </View>
                    <CustomBotton 
                      title='Add to favorites'
                      handlePress={()=>router.navigate("/(tabs)/homeScreen")} 
                      // handlePress={()=>router.push("/(auth)")} 
                      textStyles='' 
                      containerStyles={styles.buttonSyles}
                      isLoading={false}  
                  />
                  </>
                )
              }
            </View>
          </>
        }
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    height:"100%",
    width:"100%",
    backgroundColor:colors["primary"], 
  },
  details: {
    padding: 16,
    backgroundColor: '#fff',
    marginHorizontal:"5%",
    marginVertical:"30%",
    justifyContent:"space-around"
  },
  buttonSyles:{
      width:"100%",
      marginTop:30
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  section: {
    marginTop: 16,
  },
  btnBack: {
    marginRight: 16,
  },
  backText: {
    fontSize: 18,
    color: '#007AFF',
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
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  btnAdd: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 4,
    marginLeft: 16,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
  },
  userRatingText: {
    fontSize: 16,
    color: '#000',
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

export default selectedMovie