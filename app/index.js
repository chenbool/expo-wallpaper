import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { wp, hp } from '../helpers/common'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { theme } from '../constants/theme'
import { useRouter } from 'expo-router'

const WelcomeScreen = () => {
    const router = useRouter();

  return (
    <View style={styles.container}>
        <StatusBar style="light" />

        <Image
        source={require('../assets/images/welcome.png')}
        style={styles.bgImage}
        resizeMode='cover'
        />

        {/* 线性渐变 */}
        <Animated.View entering={FadeInDown.duration(600)} style={{flex: 1}}>
            <LinearGradient
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)', 'white', 'white']}
                style={styles.gradient}
                start={{x: 0.5, y: 0}}
                end={{x: 0.5, y: 0.8}}
            />

            <View style={styles.contentContainer}>
                <Animated.Text entering={FadeInDown.delay(400).springify()} style={styles.title}> 
                    Solon
                </Animated.Text>
                <Animated.Text entering={FadeInDown.delay(500).springify()} style={styles.punchline}> 
                   人生没有白走的路，每一步都算数
                </Animated.Text>
                <Animated.View entering={FadeInDown.delay(600).springify()}>
                    <Pressable onPress={() => router.push('home')} style={styles.startButton}>
                        <Text style={styles.startText}> 浏 览 </Text>
                    </Pressable>
                </Animated.View>
            </View>

        </Animated.View>

    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bgImage: {
        width: wp(100),
        height: hp(100),
        position: 'absolute'
    },
    gradient: {
        width: wp(100),
        height: hp(65),
        bottom: 0,
        position: 'absolute'
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 14,
    },
    title: {
        fontSize: hp(6),
        color: theme.colors.neutral(0.9),
        fontWeight: theme.fontWeights.bold
    },
    punchline: {
        fontSize: hp(2),
        letterSpacing: 2,
        marginBottom: 10,
        fontWeight: theme.fontWeights.medium,
        color: theme.colors.neutral(0.7),
    },
    startButton: {
        marginBottom: 60,
        backgroundColor: theme.colors.neutral(0.9),
        padding: 12,
        paddingHorizontal: 90,
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
    },
    startText: {
        color: theme.colors.white,
        fontSize: hp(2.5),
        fontWeight: theme.fontWeights.medium,
        letterSpacing: 2,
    },


})

export default WelcomeScreen