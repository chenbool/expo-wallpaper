import { StyleSheet, Text, View, Pressable} from 'react-native'
import React, { useMemo } from 'react'
import {
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { capitalize, hp } from '../helpers/common';
import { BlurView } from 'expo-blur';
import Animated, { Extrapolation, interpolate, useAnimatedStyle,FadeInDown } from 'react-native-reanimated';
import { theme } from '../constants/theme';
import { SectionView, CommonFilterRow, ColorFilter } from './filterViews';
import { data } from '../constants/data';

const FiltersModal = (props) => {
    const {modalRef, onClose, onApply, onReset, filters, setFilters} = props

    const snapPoints = useMemo(() => ['80%'], []);

    return (
        <BottomSheetModal
            style={styles.container}
            ref={modalRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={CustomBackdrop}
            // onChange={handleSheetChanges}
        >
            <BottomSheetView style={styles.contentContainer}>
                <View style={styles.content}>
                    <Text style={styles.filterText}>筛选</Text>

                    {
                        Object.keys(sections).map((sectionName, index) => {
                            let sectionView = sections[sectionName];
                            let title = capitalize(sectionName);
                            let sectionData = data.filters[sectionName]

                            if(title=='Order'){
                                title = '排序'
                            }else if(title=='Orientation'){
                                title = '方向'
                            }else if(title=='Type'){
                                title = '类别'
                            }else if(title=='Colors'){
                                title = '颜色'
                            }

                            return (
                                <Animated.View 
                                    entering={FadeInDown.delay((index*100)+100).springify().damping(11)}
                                    key={sectionName}
                                >
                                    <SectionView
                                        title={title}
                                        content={sectionView({
                                            data: sectionData,
                                            filters,
                                            setFilters,
                                            filterName: sectionName
                                        })}
                                    />
                                </Animated.View>
                            )
                        })
                    }

                {/* 操作按钮 actions */}
                <Animated.View 
                    entering={FadeInDown.delay(500).springify().damping(11)}
                    style={styles.buttons}
                >
                    <Pressable style={styles.resetButton} onPress={onReset}>
                        <Text style={[styles.buttonText,{color: theme.colors.neutral(0.8)}]}>重置</Text>
                    </Pressable>
                    <Pressable style={styles.applyButton} onPress={onApply}>
                        <Text style={[styles.buttonText,{color: theme.colors.white}]}>确认</Text>
                    </Pressable>
                </Animated.View>


                </View>
            </BottomSheetView>
        </BottomSheetModal>
    );
}


const sections = {
  "order": (props) => <CommonFilterRow {...props} />,
  "orientation": (props) => <CommonFilterRow {...props} />,
  "type": (props) => <CommonFilterRow {...props} />,
  "colors": (props) => <ColorFilter {...props} />
}


// 背景毛玻璃
const CustomBackdrop = ({ animatedIndex, style }) => {
    
    const containerAnimatedStyle = useAnimatedStyle(() => {
        let opacity = interpolate(
            animatedIndex.index,
            [-1, 0],
            [0, 1],
            Extrapolation.CLAMP
        );
        return {
            opacity
        }
    })

    // 此处可添加自定义背景组件的逻辑
    const containerStyle = [
        StyleSheet.absoluteFill,
        style,
        styles.overlay,
        containerAnimatedStyle
    ]

    return (
        <Animated.View style={containerStyle}>
            {/* blur view */}
            <BlurView
                style={StyleSheet.absoluteFill}
                tint="dark"
                intensity={35}
            />
        </Animated.View>
    )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // padding: 24,
    // justifyContent: 'center',
    // backgroundColor: 'grey',
    // height: hp(70)
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
    content: {
        flex: 1,
        gap: 15,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: '100%',
        // paddingBottom: 60
    },

    filterText: {
        fontSize: hp(3),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.neutral(0.8),
        marginBottom: 5
    },
    buttons: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingBottom: 50
    },
    applyButton: {
        flex: 1,
        backgroundColor: theme.colors.neutral(0.8),
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.radius.md,
        borderCurve: 'continuous'
    },
    resetButton: {
        flex: 1,
        backgroundColor: theme.colors.neutral(0.03),
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.radius.md,
        borderCurve: 'continuous',
        borderWidth: 2,
        borderColor: theme.colors.grayBG
    },
    buttonText: {
        fontSize: hp(2.2)
    }

})

export default FiltersModal