import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList ,RefreshControl} from 'react-native';
import Modal from 'react-native-modal';
import { DEVICE_WIDTH } from '../../../const/System';
import {COLOR_RED, APP_COLOR} from '../../../const/Color';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { setValueAllItem } from '../../Store/until/service'
import { CheckBoxNameService } from '../until/service';
import {STRING} from '../until/string';
import {setNameCheck} from '../../SearchResultsStoreNameAddress/until/service';
import {Api} from '../until/api'
export default class ItemModalSelectClose extends PureComponent {
    constructor(props) {
        super(props);
        const dataCloseTime= CheckBoxNameService.get();
        this.state = {
            isModalVisible: false,
            placehoder:dataCloseTime.closeTime.name?dataCloseTime.closeTime.name:STRING.placehoderClosetime,
            dataCloseTime: [],
            errCloseTime: false,
            loadingCloseTime: false,
            isLoadingRefreshCloseTime:false
        };
    }
    componentDidMount() {
        setNameCheck.onChange('dataCloseTime', data => {
            if(data.data.type==='closetime'){
                this.closeOptions();
            }
        })
        this.getListCloseTime();
    }
    getListCloseTime = async (refeshLoading) => {
        try {
            if (refeshLoading) {
                this.setState({
                    isLoadingRefreshCloseTime: true
                })
            }
            else {
                this.setState({
                    loadingCloseTime: true
                })
            }

            const response = await Api.getListClosedTime();
            if (response.code === 200 && response.res.status.code === 1000) {
                this.state.dataCloseTime = response.res.data;
                this.state.loadingCloseTime = false;
                this.state.errCloseTime = false;
            }
            else {
                this.state.errCloseTime = true
            }
        } catch (err) {
            this.state.errCloseTime = true
        }
        finally {
            this.setState({
                isLoadingRefreshCloseTime: false,
                loadingCloseTime: false,
            })
        }
    }
    componentWillUnmount(){
        setNameCheck.unChange('dataCloseTime')
    }
    enableModal = () => {
        const { dataCloseTime,errCloseTime} = this.state;
        if (dataCloseTime) {
            if (dataCloseTime.length === 0||errCloseTime) {
                this.setState({
                    isModalVisible: false
                })
            }
            else {
                this.setState({
                    isModalVisible: true
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
            closeTime: item
        }
        const { valueText } = this.props;
        CheckBoxNameService.set(data)
        setValueAllItem.set({ type: 'setIDCity', item })
        if (valueText) {
            valueText(item.value, item.name)

        }
        this.state.placehoder = item.name;
        this.state.id = item.id
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
                <Text style={{  marginTop: 16, marginBottom: 16, fontSize: 18}}>{item.name}</Text>
                <View style={{ width: '100%', borderBottomWidth: 1, borderColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1 }}></View>
            </TouchableOpacity>
        )

    }
    closeOptions = () => {
        let id='';
        const { valueText } = this.props;
        if (valueText) {
            valueText(id)
        }
        const data = {
            closeTime:STRING.placehoderClosetime
        }
        CheckBoxNameService.set(data)
        this.setState({
            isModalVisible: false,
            placehoder:STRING.placehoderClosetime
        })
        setValueAllItem.set({ type: 'checkDistrict', idCheck: 0 })
    }
    callApiCloseTime=()=>{
        const {callApiCloseTime}=this.props;
        if(callApiCloseTime){
            callApiCloseTime(true);
        }
    }
    renderContainer = () => {
        const { dataCloseTime,isLoadingRefreshCloseTime} = this.state;
        return (
            <FlatList
                data={dataCloseTime}
                renderItem={this.renderItem}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoadingRefreshCloseTime}
                        onRefresh={() => this.getListCloseTime(true)}
                    />
                }
                keyExtractor={(item, index) => `${index}`}
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
                    hideModalContentWhileAnimating={true}
                    backdropOpacity={0.8}
                    swipeToClose={false}
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

