import { View, Text, StyleSheet,Button, Platform, ActivityIndicator, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { BlurView } from 'expo-blur'
import { hp, wp } from '../../helpers/common'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Image } from 'expo-image'
import { theme } from '../../constants/theme'
import { Octicons, Entypo} from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Toast from 'react-native-toast-message';

const ImageScreen = () => {

    // 路由
    const router = useRouter();
    const item = useLocalSearchParams();
    const [status, setStatus] = useState('loading');
    // console.log('img ->',item)
    let uri = item.webformatURL;
    const fileName = item?.previewURL?.split('/').pop();
    const imageUrl = uri;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    
    const onLoad = () => {
        setStatus('');
    }

    // 图片尺寸
    const getSize = () => {
        const aspectRatio = item?.imageWidth / item?.imageHeight;

        const maxWidth = Platform.OS === 'web' ? wp(50) : wp(92);
        let calculatedHeight = maxWidth / aspectRatio;
        let calculatedWidth = maxWidth;

        if (aspectRatio < 1) { // portrait image
            calculatedWidth = calculatedHeight * aspectRatio;
        }
        return {
            width: calculatedWidth,
            height: calculatedHeight
        }
    }

    // 下载
    const handleDownloadImage = async () => {
        if (Platform.OS === 'web') {
            const anchor = document.createElement('a');
            anchor.href = imageUrl;
            anchor.target = "_blank";
            anchor.download = fileName || 'download';
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
        } else {
            setStatus('downloading');
            let uri = await downloadFile();
            if (uri) showToast('图片下载完成') // show toast later
        }
    }

    // Sharing
    const handleShareImage = async () => {
        if (Platform.OS === 'web') {
            showToast('Link copied');
        } else {
            setStatus('sharing');
            let uri = await downloadFile();
            if (uri) {
                // share image
                await Sharing.shareAsync(uri);
            }
        }


    }

    // 弹窗
    const showToast = (message) => {
        Toast.show({
            type: 'success',
            text1: message,
            position: 'bottom'
        });
    }

    // 自定义
    const toastConfig = {
        success: ({ text1, props, ...rest }) => {
            return (
            <View style={styles.toast}>
                <Text style={styles.toastText}>{text1}</Text>
            </View>
            )
        }
    }

    const downloadFile = async () => {
        try {
            const { uri } = await FileSystem.downloadAsync(imageUrl, filePath);
            // console.log('downloaded at: ', uri);
            setStatus('');
            return uri;
        } catch (err) {
            console.log('got error: ', err.message);
            Alert.alert('Image', err.message);
            setStatus('');
            return null;
        }
    }


  return (
    <BlurView
        tint='dark' // 模糊色调 ('light' | 'dark' | 'extraLight')
        intensity={70}
        style={styles.container}
    >

        <View style={[getSize()]}>
            {/* 加载 */}
            <View style={styles.loading}>
                {
                    status === 'loading' && <ActivityIndicator size="large" color="white" />
                }
            </View>

            <Image
                transition={100}
                style={[styles.image, getSize()]}
                source={uri}
                onLoad={onLoad}
            />
        </View>
        {/* <Button title="返回" onPress={() => router.back()} /> */}
        <View style={styles.buttons}>
            <Animated.View entering={FadeInDown.springify()} >
                <Pressable style={styles.button} onPress={() => router.back()}>
                    <Octicons name="x" size={24} color="white" />
                </Pressable>
            </Animated.View>

            <Animated.View entering={FadeInDown.springify().delay(100)}>
                {
                    status === 'downloading' ? (
                        <View style={styles.button}>
                            <ActivityIndicator size="small" color="white" />
                        </View>
                    ) : (
                        <Pressable style={styles.button} onPress={handleDownloadImage}>
                            <Octicons name="download" size={24} color="white" />
                        </Pressable>
                    )
                }
            </Animated.View>

            <Animated.View entering={FadeInDown.springify().delay(200)}>
                {
                    status === 'sharing' ? (
                        <View style={styles.button}>
                        <ActivityIndicator size="small" color="white" />
                        </View>
                    ) : (
                        <Pressable style={styles.button} onPress={handleShareImage}>
                            <Entypo name="share" size={22} color="white" />
                        </Pressable>
                    )
                }

            </Animated.View>

        </View>
        <Toast config={toastConfig} visibilityTime={2500} />   
    </BlurView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(4),
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    image: {
        borderRadius: theme.radius.lg,
        borderWidth: 2,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderColor: 'rgba(255,255,255,0.1)',
    },
    loading: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttons: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 50,
    },
    button: {
        height: hp(6),
        width: hp(6),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: theme.radius.lg,
        borderCurve: 'continuous'
    },
    toast: {
        padding: 15,
        paddingHorizontal: 30,
        borderRadius: theme.radius.xl,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)'
    },
    toastText: {
        fontSize: hp(1.8),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.white
    }


})

export default ImageScreen