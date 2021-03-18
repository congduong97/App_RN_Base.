import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import Modal from 'react-native-modal';
import { DEVICE_WIDTH } from '../../../const/System';
import { COLOR_RED, APP_COLOR } from '../../../const/Color';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { CheckBoxNameService } from '../../SearchResultsStoreMoreOptions/until/service';
import { STRING } from '../until/string'
import { setValueAllItem } from '../../Store/until/service';
import { setNameCheck } from '../until/service';
import { Api } from '../until/api'


export default class ItemModalSelectCity extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            placehoder: STRING.placehoderCity,
            loadingCity: false,
            errCity: false,
            dataListCities: [],
            totalPagesListCity: 1,
            isLoadingRefreshCity: false,
            page: 1,
            loadingNextPage: false
        };
    }

    componentDidMount() {
        setNameCheck.onChange('placehoderCity', data => {
            if (data.data.type === 'SetCheckCity' && data.data.checkCity) {
                this.closeOptions();
            }
        })
        this.getListCities();
    }
    getListCities = async (load) => {
        try {
            if (load) {
                this.setState({
                    isLoadingRefreshCity: true
                })
            }
            else {
                this.setState({
                    loadingCity: true
                })
            }
            const respones = await Api.getListCities(1, 10);
            if (respones.code === 200 && respones.res.status.code === 1000) {
                this.state.dataListCities = respones.res.data.content;
                this.state.totalPagesListCity = respones.res.data.totalPages;
                this.state.loadingCity = false;
            }
            else {
                this.state.errCity = true
            }

        } catch (err) {
            this.state.errCity = true
        }
        finally {
            this.setState({
                isLoadingRefreshCity: false,
                loadingCity: false,
            })
        }
    }

    getApiNextPageCity = async () => {
        try {
            this.setState({
                loadingNextPage: true
            });
            const response = await Api.getListCities(this.state.page + 1, 10);
            this.state.page = this.state.page + 1;
            if (response.code === 200 && response.res.status.code === 1000) {
                this.state.dataListCities = [...this.state.dataListCities, ...response.res.data.content];
                this.state.errCity = false
            }
        } catch (err) {
            this.state.errCity = true
        } finally {
            this.setState({ loadingNextPage: false });
        }
    };



    componentWillUnmount() {
        setNameCheck.unChange('placehoderCity');
    }
    enableModal = () => {
        // const { data } = this.props;
        const { dataListCities ,errCity} = this.state;
        if (dataListCities) {
            if (dataListCities.length === 0||errCity) {
                this.setState({
                    isClear: false,
                    isModalVisible: false,
                });
            }
            else {
                this.setState({
                    isModalVisible: true,
                });
            }
        }
    }
    setColorValueSlect = (index, item) => {
        const { placehoder } = this.state;
        if (item.name === placehoder) {
            return (
                APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1
            )
        }
    }
    setValueSelect = (item) => {
        const data = {
            city: item
        }
        const { valueText } = this.props;
        CheckBoxNameService.set(data);
        setValueAllItem.set({ type: 'setIDCitySearchName', item })
        if (valueText) {
            valueText(item.id, item.name)
        }
        this.state.placehoder = item.name;
        this.setState({
            isModalVisible: false
        })
    }
    renderItem = ({ index, item }) => {
        return (
            <TouchableOpacity
                onPress={() => this.setValueSelect(item)}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: this.setColorValueSlect(index, item),
                }}
            >
                <Text style={{ marginTop: 16, marginBottom: 16 }}>{item.name}</Text>
                <View style={{ width: '100%', borderBottomWidth: 1, borderColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1 }}></View>
            </TouchableOpacity>
        )

    }
    closeOptions = () => {
        let id = '';
        const { valueText } = this.props;
        if (valueText) {
            valueText(id)
        }
        const data = {
            city: {
                name: STRING.placehoderCity
            }
        }
        CheckBoxNameService.set(data);
        this.setState({
            isModalVisible: false,
            placehoder: STRING.placehoderCity
        })
        setNameCheck.set({ type: 'checkDistrictName', ischeck: true })
    }

  
    loadNextPage = () => {
        const { totalPagesListCity, loadingNextPage, page } = this.state;
        if (totalPagesListCity > page && !loadingNextPage) {
            this.getApiNextPageCity();
        }
    }

    renderContainer = () => {
        const { dataListCities, isLoadingRefreshCity } = this.state;
        return (
            <FlatList
                data={dataListCities}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoadingRefreshCity}
                        onRefresh={() => this.getListCities(true)}
                    />
                }
                renderItem={this.renderItem}
                keyExtractor={(item, index) => `${index}`}
                onEndReached={this.loadNextPage}
                onEndReachedThreshold={0.5}
            />
        )
    }
    render() {
        const { placehoder } = this.state;
        return (
            <TouchableOpacity style={styles.container} onPress={this.enableModal}>
                <View style={{ flex: 1 }}>
                    <Text style={{ paddingLeft: 10 }}>{placehoder}</Text>
                </View>
                <View>
                    <AntDesign name='caretdown' size={15} style={{ alignItems: 'flex-end', right: 5 }} color={'#525354'} />
                </View>
                <Modal isVisible={this.state.isModalVisible}
                    useNativeDriver={true}
                    onBackdropPress={this.closeOptions}
                    duration={0}
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropTransitionInTiming={800}
                    backdropTransitionOutTiming={800}
                    backdropOpacity={0.8}
                    swipeToClose={false}
                    hideModalContentWhileAnimating={true}
                    style={styles.modalStyle}
                >
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: COLOR_RED }} onPress={this.closeOptions}>
                            <Text style={{ color: COLOR_RED, marginTop: 16, fontWeight: 'bold', marginBottom: 16 }}>空欄</Text>
                        </TouchableOpacity>
                        {this.renderContainer()}
                    </View>
                </Modal>

            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        width: '92%',
        borderWidth: 1,
        borderColor: '#A3A4A5',
        height: 45,
        borderRadius: 4,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    modalStyle: {
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        width: DEVICE_WIDTH - 100,
        borderRadius: 4,
        height: DEVICE_WIDTH
    },

});

