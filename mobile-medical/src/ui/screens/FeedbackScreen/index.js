import React from "react";
import { useState } from "react";
import {
    useNavigation,
} from "@react-navigation/native";
import { useApp, useMergeState } from "../../../AppProvider";
import { StyleSheet, Text, View, Dimensions, Image, FlatList } from "react-native";
import { Colors, Dimension, Fonts } from "../../../commons";
import { ScreensView, InputView, TextView, ButtonView } from "../../../components";
import styles from "./styles";
import ActionKey from './ActionKey'
import AppNavigate from "../../../navigations/AppNavigate";
import { TouchableOpacity } from "react-native-gesture-handler";
const { width, height } = Dimensions.get('window');

export default function FeedbackScreen(props) {
    const navigation = useNavigation();
    const [textCodePatient, setTextCodePatient] = useState(' ')
    const [dataMedicalFacility, setDataMedicalFacility] = useState({})
    const [dataNamePatient, setDataNamePatient] = useState({})
    const { refDialog } = useApp();

    const handleAgree = ({ id }) => {
        switch (id) {
            case ActionKey.createFeedback:
                AppNavigate.navigateToFeedbackNewScreen(navigation.dispatch)
                break
        }
    }

    const onNavigatorDetailFeedback = () => {
        AppNavigate.navigateToFeedbackDetail(navigation.dispatch)
    }

    const renderItemCall = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={onNavigatorDetailFeedback} style={[styles.styleViewItemList]}>
                <Text style={[styles.stTextTitleEmpty, { textAlign: 'left', fontSize: 16 }]} numberOfLines={1}>{'Góp ý : Phản ánh quy trình làm việc của viện'}</Text>
                <Text style={[styles.styleText, {}]}>{'Góp ý cách làm việc của Viện không đạt chuẩn theo yêu cầu như quảng cáo'}</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, alignItems: 'center' }}>
                    <Text style={[styles.styleText, { color: Colors.colorMain }]}>{'15/10/2020'}</Text>
                    <Text style={[styles.styleText, {
                        color: item.staus === 1 ? Colors.colorMain : Colors.colorCancel,
                        backgroundColor: item.staus === 1 ? Colors.colorBtBack : Colors.colorBtEdit,
                        paddingHorizontal: 12,
                        height: 30,
                        borderRadius: 15,
                        textAlignVertical: 'center'
                    }]}>{item.staus === 1 ? 'Đang xử lý' : "Đã xử lý"}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const EmptyView = () => {
        return (
            <View style={styles.stContentEmpty}>
                <Image
                    source={require('../../../../assets/images/image_feedback.png')}
                    style={styles.stImageEmpty}
                    resizeMode="contain"
                />
                <Text style={styles.stTextTitleEmpty}>
                    {"Bạn chưa có góp ý nào"}
                </Text>
                <Text style={styles.stTextContentEmpty}>
                    Hãy tạo một góp ý những điều bạn chưa hài lòng để chúng tôi được phục vụ bạn tốt hơn.
                    Xin cảm ơn !
                </Text>

                <ButtonView
                    id={ActionKey.createFeedback}
                    title={"Tạo góp ý cho chúng tôi"}
                    onPress={handleAgree}
                    style={{
                        marginBottom: 20,
                        marginHorizontal: 15,
                        marginTop: 12
                    }}
                />
            </View>
        );
    };

    return (
        <ScreensView styleContent={{ paddingHorizontal: 12, }} titleScreen={"Góp ý"}
            nameIconRight={'ic-edit'}
            sizeIconRight={20}
            onPressRight={() => { handleAgree({ id: ActionKey.createFeedback }) }}
        >

            <FlatList
                style={{ marginTop: 12 }}
                keyboardShouldPersistTaps="never"
                data={[{ id: 1, staus: 1 }, { id: 2, staus: 2 }]}
                // data={[]}
                // extraData={patientRecordsData.current}
                renderItem={renderItemCall}
                keyExtractor={(item, index) => item?.id + ""}
                onEndReachedThreshold={0.2}
                removeClippedSubviews
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<EmptyView />}
            />
        </ScreensView>
    );
}
