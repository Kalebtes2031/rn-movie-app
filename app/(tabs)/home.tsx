import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  FlatList,
  RefreshControl,
} from "react-native";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import SearchBar from "@/components/SearchBar";
import { useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import MovieCard from "../../components/MovieCard";
import { getTrendingMovies } from "@/services/firestoreService";
import TrendingCard from "@/components/TrendingCard";
import React, { useState } from "react";

export default function Index() {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
     refetch: refetchTrending,
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: refetchMovies,
  } = useFetch(() => fetchMovies({ query: "" }));

   const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchTrending(), refetchMovies()]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
    setRefreshing(false);
  };

  const aggregatedTrendingMovies = React.useMemo(() => {
    if (!trendingMovies) return [];

    const map = new Map();

    trendingMovies.forEach((movie) => {
      const id = movie.movie_id;
      if (map.has(id)) {
        const existing = map.get(id);
        map.set(id, {
          ...existing,
          count: (existing.count ?? 0) + (movie.count ?? 0),
        });
      } else {
        map.set(id, { ...movie });
      }
    });

    return Array.from(map.values());
  }, [trendingMovies]);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Image source={icons.logo} className="w-12 h-10 mt-6 mb-5 mx-auto" />

        {moviesLoading || trendingLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : moviesError || trendingError ? (
          <Text>Error: {moviesError?.message || trendingError?.message}</Text>
        ) : (
          <View className="flex-1 mt-5">
            <SearchBar
              onPress={() => {
                router.push("/search");
              }}
              placeholder="Search for a movie"
            />

            {trendingMovies && (
              <View className="mt-10">
                <Text className="text-lg text-white font-bold mb-3">
                  Trending Movies
                </Text>
                <FlatList
                  data={aggregatedTrendingMovies}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item) => item.movie_id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                  className="mb-4 mt-3"
                />
              </View>
            )}

            <>
              <Text className="text-lg text-white font-bold mt-5 mb-3">
                Latest Movies
              </Text>

              <FlatList
                data={movies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
