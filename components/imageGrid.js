import { View, StyleSheet } from 'react-native'
import React from 'react'
import { MasonryFlashList } from "@shopify/flash-list";
import ImageCard from './imageCard';
import { getColumnCount, wp } from '../helpers/common'

const ImageGrid = (props) => {
        // 接受参数
    const {images} = props;
    // 根据屏幕尺寸 设置 个数
    const columns = getColumnCount();
  return (
    
    <View style={styles.container}>  
        {/* 流式布局插件 */}
        <MasonryFlashList 
            data={images}
            numColumns={columns}
            initialNumToRender={1000}
            renderItem={({ item, index }) => <ImageCard item={item} columns={columns} index={index}/>}
            estimatedItemSize={200}
            contentContainerStyle={styles.listContainerStyle}
        />

    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        minHeight: 3,
        width: wp(100),
    },
    listContainerStyle: {
        paddingHorizontal: wp(4),
    },

})

export default ImageGrid