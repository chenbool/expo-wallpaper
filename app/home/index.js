import { View, Text, StyleSheet, Pressable, ScrollView, TextInput,ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FontAwesome6, Feather, Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme'
import { wp, hp } from '../../helpers/common'
import Categories from '../../components/categories';
import { apiCall } from '../../api';
import ImageGrid from '../../components/imageGrid';
import FiltersModal from '../../components/filtersModal';
import { useRouter } from 'expo-router';
// import { debounce } from 'lodash';

var page = 1;

const HomeScreen = () => {

    const {top} = useSafeAreaInsets();
    const paddingTop = top > 0 ? top + 10 : 30;
    const [search, setSearch] = useState('');
    const searchInputRef = useRef();
    const [activeCategory, setActiveCategory] = useState(null);
    const [images, setImages] = useState([]);
    // 过滤器
    const modalRef = useRef(null);
    const [filters, setFilters] = useState(null);
    // 滚动
    const scrollRef = useRef(null);
    // 记录是否到底 防止多次加载
    const [isEndReached, setIsEndReached] = useState(false);
    // 路由
    const router = useRouter();

    // 启动加载
    useEffect(() => {
        fetchImages();
    }, []);

    // 获取图片
    const fetchImages = async (params = { page: 1 }, append = true) => {
        // console.log('params: ', params);
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

    // 过滤器
    const openFiltersModal = () => {
        // console.log('打开')
        // console.log(modalRef.current)
        modalRef?.current?.present();
    };
    const closeFiltersModal = () => {
        modalRef?.current?.close();
    };

    // const handleSheetChanges = (index) => {
    //     console.log('面板状态变化:', index);
    // }

    const applyFilters = () => {
        // console.log('applying filters');
        if(filters){
            page = 1;
            setImages([]);
            let params = {
                page,
                ...filters
            }
            if(activeCategory) params.category = activeCategory;
            if(search) params.q = search;
            fetchImages(params, false);
        }
        closeFiltersModal();
    }

    const resetFilters = () => {
        // console.log('filters filters');
        setFilters(null);

        if(filters){
            page = 1;
            setImages([]);
            let params = {
                page
            }
            if(activeCategory) params.category = activeCategory;
            if(search) params.q = search;
            fetchImages(params, false);
        }
        closeFiltersModal();
    }


    // 清除 过滤器的 标签
    const clearThisFilter = (filterName) => {
        let filterz = {...filters};
        delete filterz[filterName];
        setFilters({...filterz});
        page = 1;
        setImages([]);
        let params = {
            page,
            ...filterz
        }
        if(activeCategory) params.category = activeCategory;
        if(search) params.q = search;
        fetchImages(params, false);
    }


    // 设置 分类选中的状态
    const handleChangeCategory = (cat) => {
        setActiveCategory(cat);
        clearSearch();
        setImages([])
        page = 1;
        let params = {
            page,
            ...filters
        };
        if (cat) params.category = cat;
        fetchImages(params, false);
        // console.log('active category: ', activeCategory);
    }


    // 搜索
    const handleSearch = (text) => {
        
        setSearch(text);
        if (text.length > 2) {
            // search for this text
            page = 1;
            setImages([]);
            // clear cateogry when searching
            setActiveCategory(null);
            fetchImages({ page, q: text, ...filters });
        }

        if (text === "") {
            // console.log('null -> ',text)

            // reset results
            page = 1;
            searchInputRef.current.clear();
            setImages([]);
            // clear cateogry when searching
            setActiveCategory(null);
            fetchImages({ page,...filters}, false);
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

    // 监测滚动
    const handleScroll = (event) => {
        const contentHeight = event.nativeEvent.contentSize.height;
        const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
        const scrollOffset = event.nativeEvent.contentOffset.y;
        const bottomPosition = contentHeight - scrollViewHeight;

        if(scrollOffset >= bottomPosition - 1) {
            
            if(!isEndReached) {
                setIsEndReached(true);
                console.log('到底了');
                ++page;
                let params = {
                    page,
                    ...filters
                }
                if(activeCategory) params.category = activeCategory;
                if(search) params.q = search;
                fetchImages(params);
            }
        } else if(isEndReached) {
            setIsEndReached(false);
        }
    }

    // 点击滚动到 最上面
    const handleScrollUp = () => {
        scrollRef?.current?.scrollTo({
            y: 0,
            animated: true
        })
    }


  return (
    <View style={[styles.container, {paddingTop}]}>
        {/* header 头部 */}
        <View style={styles.header}>
            <Pressable onPress={handleScrollUp}>
                <Text style={styles.title}> Solon </Text>
            </Pressable> 
            <Pressable onPress={openFiltersModal}>
                <FontAwesome6 
                name="bars-staggered" 
                size={22} 
                color={theme.colors.neutral(0.7)}
                />
            </Pressable> 
        </View>

        <ScrollView
            onScroll={handleScroll}
            scrollEventThrottle={5} // 在滚动过程中，滚动事件每隔多久触发一次（以毫秒为单位）
            ref={scrollRef}
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
                <Categories activeCategory={activeCategory} handleChangeCategory={handleChangeCategory}/>
            </View>



            {/* 过滤条件显示 filters */}
            {
                filters && (
                    <View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
                            
                            {
                                Object.keys(filters).map((key, index) => {
                                    return (
                                    <View key={key} style={styles.filterItem}>

                                        {
                                            key === 'colors' ? (
                                                <View style={{
                                                height: 20,
                                                width: 30,
                                                borderRadius: 7,
                                                backgroundColor: filters[key]
                                                }} />
                                            ) : (
                                                <Text style={styles.filterItemText}>{filters[key]}</Text>
                                            )
                                        }
                                        

                                        <Pressable style={styles.filterCloseIcon} onPress={() => clearThisFilter(key)}>
                                            <Ionicons name="close" size={14} color={theme.colors.neutral[0.5]} />
                                        </Pressable>
                                    </View>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                )
            }


            {/* 图片布局 */}
            <View>
                {
                    images.length > 0 && <ImageGrid images={images} router={router}/>
                }
            </View>

            {/* 加载 loading */}
            <View style={{marginBottom: 70, marginTop: images.length>0? 10: 70}}>
                <ActivityIndicator size="large" />
            </View>


        </ScrollView>


        {/* 过滤器 */}
        <FiltersModal 
            modalRef={modalRef}
            filters={filters}
            setFilters={setFilters}
            onClose={closeFiltersModal}
            onApply={applyFilters}
            onReset={resetFilters}
        >

        </FiltersModal>


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
    fontSize: hp(3.5),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
  },
    searchBar: {
        marginHorizontal: wp(3),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.neutral(0.05),
        backgroundColor: theme.colors.white,
        padding: 6,
        paddingLeft: 10,
        borderRadius: theme.radius.sm,
    },
    searchIcon: {
        padding: 6,
        opacity: 0.6,
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
        borderRadius: theme.radius.xs,
    },
    filters: {
        paddingHorizontal: wp(4),
        gap: 10
    },
    filterItem: {
        backgroundColor: theme.colors.grayB,
        padding: 3,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: theme.radius.xs,
        padding: 8,
        gap: 10,
        paddingHorizontal: 10,
    },
    filterItemText: {
        fontSize: hp(1.9)
    },
    filterCloseIcon: {
        backgroundColor: theme.colors.neutral(0.1),
        padding: 4,
        borderRadius: 7
    }

})

export default HomeScreen