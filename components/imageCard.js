import { View, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { hp, wp, getImageSize } from '../helpers/common'
import { Image } from 'expo-image'
import { theme } from '../constants/theme'

const ImageCard = (props) => {
    const {item, columns, index} = props;

    // 检测是否最后一个
    const isLastInRow = () => {
        return (index + 1) % columns === 0;
    }

    // 获取图片尺寸
    const getImageHeight = () => {
        let { imageHeight: height, imageWidth: width } = item;
        return { height: getImageSize(height, width) };
    }

  return (
    <Pressable style={[styles.imageWrapper, !isLastInRow() && styles.spacing]}>
        <Image
            style={[styles.image, getImageHeight()]}
            source={item?.webformatURL}
            transition={100}
        />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  image: {
    height: 300,
    width: '100%',
  },
  imageWrapper: {
    backgroundColor: theme.colors.grayBG,
    borderRadius: theme.radius.xs,
    borderCurve: 'continuous',
    overflow: 'hidden',
    marginBottom: wp(2)
  },
    spacing: {
        marginRight: wp(2)
    },

})

export default ImageCard