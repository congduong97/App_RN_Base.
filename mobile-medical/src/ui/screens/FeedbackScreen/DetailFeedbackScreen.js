import React from "react";
import { useState } from "react";
import {
    useNavigation,
} from "@react-navigation/native";
import { useApp, useMergeState } from "../../../AppProvider";
import { StyleSheet, Text, View, Dimensions, Image, FlatList, TouchableOpacity, TextInput } from "react-native";
import { Colors, Dimension, Fonts } from "../../../commons";
import { ScreensView, InputView, TextView, ButtonView, IconView } from "../../../components";
import styles from "./styles";
import ActionKey from './ActionKey'
import AppNavigate from "../../../navigations/AppNavigate";
import ChoiceValueView from './component/ChoiceValueView'
import DialogNotification from './component/DialogNotification'
import SlideBannerView from '../Home/SlideBannerView'
const { width, height } = Dimensions.get('window');

const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First Item',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
    },
];

export default function FeedbackScreen(props) {
    const navigation = useNavigation();
    const [textFeedback, setTextFeedback] = useState()
    const { refDialog } = useApp();

    const renderItem = ({ item, index }) => {
        return (
            <View style={{ flexDirection: 'row', padding: 8, elevation: 3, borderRadius: 12, marginHorizontal: 12, marginBottom: 12, alignItems: 'center' }}>
                <Image
                    source={require('../../../../assets/images/avatar.jpg')}
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                    }}
                />

                <View style={{ flex: 1, paddingHorizontal: 12 }}>
                    <Text style={[styles.stTextTitleEmpty, { textAlign: 'left', fontSize: 16, marginTop: 0 }]} numberOfLines={1}>{'Nguyễn thị mai'}</Text>

                    <TextView
                        style={{}}
                        styleValue={[styles.styleText, { fontSize: 12, marginLeft: 4, color: '#B0B3C7' }]}
                        value={"5.0"}
                        styleIconLeft={{}}
                        nameIconLeft={"ic-star-light"}
                        colorIconLeft={Colors.todayColorCalendar}
                        sizeIconLeft={12}
                    />

                    <Text style={[styles.styleText, {}]} numberOfLines={2}>{'Góp ý cách làm việc của Viện không đạt chuẩn theo yêu cầu như quảng cáo'}</Text>

                    <TextView
                        style={{ marginTop: 12 }}
                        styleValue={[styles.styleText, { color: Colors.colorMain, fontSize: 14, marginLeft: 4 }]}
                        value={"1 tháng trước"}
                        styleIconLeft={{}}
                        nameIconLeft={"ic-time-clock"}
                        colorIconLeft={Colors.colorMain}
                        sizeIconLeft={14}
                    />
                </View>
            </View>
        )
    }

    const drawComment = () => {
        return (
            <View style={{ flexDirection: 'row', paddingHorizontal: 12, alignItems: 'center', backgroundColor: 'white', borderTopRightRadius: 12, borderTopLeftRadius: 12 }}>
                <IconView
                    style={{ padding: 8 }}
                    name={'ic-camera'}
                />

                <TextInput
                    style={{ flex: 1 }}
                    onChangeText={text => setTextFeedback(text)}
                    placeholder={'Hãy viết nhận xét của bạn ở đây'}
                    value={textFeedback} />

                <IconView
                    style={{ padding: 8 }}
                    name={'ic-send'}
                />
            </View>
        )
    }

    return (
        <ScreensView styleContent={{ backgroundColor: '#f2f2f2' }} titleScreen={"Chi tiết góp ý"}
        >
            <SlideBannerView />

            <View style={{ marginHorizontal: 12, backgroundColor: 'white', borderBottomRightRadius: 12, borderBottomLeftRadius: 12, padding: 12 }}>
                <Text style={[styles.styleText, { color: 'black', lineHeight: 18 }]}>Phản ánh quy trình làm việc của viện không như quảng cáo</Text>
                <Text style={[styles.styleText, { fontSize: 12, lineHeight: 18, marginTop: 8 }]}>Góp ý cách làm việc của Viện không đạt chuẩn theo yêu cầu như quảng cáo</Text>

                <Text style={[styles.stTextTitleEmpty, { textAlign: 'left', fontSize: 16 }]} numberOfLines={1}>{'Bệnh viện Đa khoa Yên Bái'}</Text>
                <Text style={[styles.styleText, { fontSize: 12 }]}>{'Chào bạn ý kiến của bạn đang được chúng tôi giải quyết, cám ơn bạn góp ý'}</Text>

                {/* <Text style={[styles.styleText, { color: Colors.colorMain, fontSize: 10 }]}>{'15/10/2020'}</Text> */}

                <TextView
                    style={{ marginTop: 4 }}
                    styleValue={[styles.styleText, { color: Colors.colorMain, fontSize: 10, marginLeft: 4 }]}
                    value={"15/10/2020"}
                    styleIconLeft={{}}
                    nameIconLeft={"ic-time-clock"}
                    colorIconLeft={Colors.colorMain}
                    sizeIconLeft={12}
                />

                <View style={[{
                    borderBottomColor: Colors.colorMain,
                    borderBottomWidth: 0.5,
                    marginTop: 12
                }]} />

                <View style={{ flexDirection: 'row', marginTop: 12 }}>
                    <TextView
                        style={{ flex: 1, justifyContent: 'center' }}
                        styleValue={[styles.styleText, { color: Colors.colorCancel, fontSize: 14, marginLeft: 4 }]}
                        value={"Không đồng ý"}
                        styleIconLeft={{}}
                        nameIconLeft={"ic-time-clock"}
                        colorIconLeft={Colors.colorCancel}
                        sizeIconLeft={14}
                    />

                    <TextView
                        style={{ flex: 1, justifyContent: 'center' }}
                        styleValue={[styles.styleText, { color: Colors.colorMain, fontSize: 14, marginLeft: 4 }]}
                        value={"Đồng ý"}
                        styleIconLeft={{}}
                        nameIconLeft={"ic-time-clock"}
                        colorIconLeft={Colors.colorMain}
                        sizeIconLeft={14}
                    />
                </View>
            </View>

            <FlatList
                style={{ marginTop: 12 }}
                data={DATA}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />

            {drawComment()}
        </ScreensView>
    );
}
