import { StatusBar } from 'expo-status-bar';
import React, { useRef } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Animated } from 'react-native';

import data from './data';

const { width, height } = Dimensions.get('window');
const dotSize = 40;
const tickerHeight = 40;
const circleSize = width * .5;

const Circle = ({ scrollX }) => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.circleContainer]}> 
      {data.map(({ color }, index) => {
        const inputRange = [
          (index - .55) * width,
          index * width, 
          (index + .55) * width
        ];
        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0, 1, 0],
          extrapolate: 'clamp'
        })
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0, .2, 0]
        });
        return (
          <Animated.View
            key={index}
            style={[styles.circle, {backgroundColor: color, opacity, transform: [{ scale }]}]}
          />
        );
      })}
    </View>
  );
};

const Ticker = ({ scrollX }) => {
  const inputRange = [-width, 0, width]
  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [tickerHeight, 0, -tickerHeight]
  })
  return (
    <View style={styles.ticketContainer}>
      <Animated.View style={{transform: [{ translateY }]}}>
        {data.map(({ type }, index) => {
          return (
            <Text key={index} style={styles.tickerText}>
              {type}
            </Text>
          )
        })}
      </Animated.View>

    </View>
  )
}

const Item = ({ imageUri, heading, description, index, scrollX }) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const inputOpacity = [(index -.3) * width, index * width, (index + .3) * width]
  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0, 1, 0]
  })
  const translateXHeading = scrollX.interpolate({
    inputRange,
    outputRange: [width * .1, 0 , -width * .1]
  })
  const translateXDescription = scrollX.interpolate({
    inputRange, 
    outputRange: [width * .7, 0, -width * .7]
  })
  const opacity = scrollX.interpolate({
    inputRange: inputOpacity,
    outputRange: [0, 1, 0]
  })
  return (
    <View style={styles.itemStyle}>
      <Animated.Image
        source={imageUri}
        style={[
          styles.imageStyle,
          {transform: [{ scale }]}
        ]}
      />
      <View style={styles.textContainer}>
        <Animated.Text style={[styles.heading, {opacity, transform: [{ translateX: translateXHeading }]}]}>
          {heading}
        </Animated.Text>
        <Animated.Text style={[styles.description, {transform: [{ translateX: translateXDescription }]}]}>
          {description}
        </Animated.Text>
      </View>
    </View>
  )
}

const Pagination = ({ scrollX }) => {
  const inputRange = [-width, 0, width];
  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: [-dotSize, 0, dotSize],
  });
  return (
    <View style={[styles.pagination]}>
      <Animated.View
        style={[
          styles.paginationIndicator,
          {
            position: 'absolute',
            transform: [{ translateX }],
          },
        ]}
      />
      {data.map((item) => {
        return (
          <View key={item.key} style={styles.paginationDotContainer}>
            <View
              style={[styles.paginationDot, { backgroundColor: item.color }]}
            />
          </View>
        );
      })}
    </View>
  );
};


export default function App() {
  const scrollX = useRef(new Animated.Value(0)).current
  return (
    <View style={styles.container}>
      <StatusBar style="auto" hidden/>
      <Circle scrollX={scrollX} />
      <Animated.FlatList
        keyExtractor={(item) => item.key} 
        data={data}
        renderItem={({ item, index}) => (
          <Item {...item} index={index} scrollX={scrollX}/>
        )}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        horizontal
        onScroll={Animated.event(
          [{ nativeEvent: {contentOffset: {x: scrollX} }}],
          {useNativeDriver: true}
        )}
        scrollEventThrottle={16}
      />
      <Text style={styles.logo}>
          Sheep
      </Text>
      <Pagination scrollX={scrollX} />
      <Ticker scrollX={scrollX} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    position: 'absolute',
    top: '25%'
  },
  ticketContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    overflow: 'hidden',
    height: tickerHeight
  }, 
  tickerText: {
    fontSize: tickerHeight,
    lineHeight: tickerHeight,
    textTransform: 'uppercase',
    fontWeight: '800'
  },
  itemStyle: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageStyle: {
    width: width * .75,
    height: width * .75,
    resizeMode: 'contain',
    flex: 1,
    paddingBottom: 20
  },
  textContainer: {
    alignItems: 'flex-start',
    alignSelf: 'flex-end',
    flex: .5
  },
  heading: {
    color: '#444',
    textTransform: 'uppercase',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 5
  },
  description: {
    color: '#ccc',
    fontWeight: '600',
    textAlign: 'left',
    width: width * .75,
    marginRight: 10,
    fontSize: 16,
    lineHeight: 16 * 1.5
  },
  pagination: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    flexDirection: 'row',
    height: dotSize,
  },
  paginationDot: {
    width: dotSize * 0.3,
    height: dotSize * 0.3,
    borderRadius: dotSize * 0.15,
  },
  paginationDotContainer: {
    width: dotSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationIndicator: {
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  logo: {
    opacity: 0.9,
    height: 40,
    width: 220,
    position: 'absolute',
    left: 10,
    bottom: 10,
    fontSize: 30,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 5,
    transform: [
      { translateX: -220 / 2 },
      { translateY: -40 / 2 },
      { rotateZ: '-90deg' },
      { translateX: 220 / 2 },
      { translateY: 40 / 2 },
    ],
  }
});

