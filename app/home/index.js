import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FontAwesome6, Feather, Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme'
import { wp, hp } from '../../helpers/common'
import Categories from '../../components/categories';
import { apiCall } from '../../api';
import ImageGrid from '../../components/imageGrid';
import { debounce } from 'lodash';

var page = 1;

const HomeScreen = () => {

    const {top} = useSafeAreaInsets();
    const paddingTop = top > 0 ? top + 10 : 30;
    const [search, setSearch] = useState('');
    const searchInputRef = useRef();
    const [activeCategory, setActiveCategory] = useState(null);
    const [images, setImages] = useState([]);

    // 启动加载
    useEffect(() => {
        fetchImages();
    }, []);

    // 获取图片
    const fetchImages = async (params = { page: 1 }, append = true) => {
        console.log('params: ', params);
        let res = await apiCall(params);
        // console.log('res: ', res.data?.hits[0]);
        // 获取成功 保存 到 数组
        if (res.success && res?.data?.hits) {
            if (append) {
                setImages([...images, ...res.data.hits])
            } else {
                setImages([...res.data.hits])
            }
        }
    };

    // 设置 分类选中的状态
    const handleChangeCategory = (cat) => {
        setActiveCategory(cat);
        clearSearch();
        setImages([])
        page = 1;
        let params = {
        page,
        };
        if (cat) params.category = cat;
        fetchImages(params, false);
        // console.log('active category: ', activeCategory);
    }


    // 
    const handleSearch = (text) => {
        
        setSearch(text);
        if (text.length > 2) {
            // search for this text
            page = 1;
            setImages([]);
            fetchImages({ page, q: text });
        }

        if (text === "") {
            console.log('null -> ',text)

            // reset results
            page = 1;
            searchInputRef.current.clear();
            setImages([]);
            fetchImages({ page });
        }
    };
    
    // 抖动 loadsh 效果
    const handleTextDebounce = useCallback(handleSearch, []);  
    // const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);    

    // 清除
    const clearSearch = () => {
        setSearch("");
        searchInputRef.current.clear();
    }

  return (
    <View style={[styles.container, {paddingTop}]}>
        {/* header 头部 */}
        <View style={styles.header}>
            <Pressable >
                <Text style={styles.title}> Solon </Text>
            </Pressable> 
            <Pressable >
                <FontAwesome6 
                name="bars-staggered" 
                size={22} 
                color={theme.colors.neutral(0.7)}
                />
            </Pressable> 
        </View>

        <ScrollView
            contentContainerStyle={{gap: 15}}
        >
            {/* search 搜索框 */}

            <View style={styles.searchBar}>
                <View style={styles.searchIcon}>
                    <Feather 
                        name="search" 
                        size={24} 
                        color={theme.colors.neutral(0.6)} 
                    />
                </View>

                <TextInput
                    placeholder='关键字...'
                    value={search}
                    ref={searchInputRef}
                    onChangeText={handleTextDebounce}
                    style={styles.searchInput}
                />

                {/* 输入文字 显示 删除按钮 */}
                {
                    search && (
                        <Pressable onPress={() => handleSearch("") } style={styles.closeIcon}>
                            <Ionicons 
                                name="close" 
                                size={24} 
                                color={theme.colors.neutral(0.6)} 
                            />
                        </Pressable>
                    )
                }

            </View>

            {/* categories 分类 */}
            <View style={styles.categories}>
                {/* 导入组件 */}
                <Categories activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />
            </View>

            {/* 图片布局 */}
            <View>
                {
                    images.length > 0 && <ImageGrid images={images} />
                }
            </View>


        </ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15
  },
  header: {
    marginHorizontal: wp(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
  },
    searchBar: {
        marginHorizontal: wp(3),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.grayBG,
        backgroundColor: theme.colors.white,
        padding: 6,
        paddingLeft: 10,
        borderRadius: theme.radius.sm,
    },
    searchIcon: {
        padding: 6
    },
    searchInput: {
        flex: 1,
        borderRadius: theme.radius.sm,
        paddingVertical: 6,
        fontSize: hp(1.8),
    },
    closeIcon: {
        backgroundColor: theme.colors.neutral(0.1),
        padding: 6,
        borderRadius: theme.radius.sm
    },
    categories: {

    },

})

export default HomeScreen