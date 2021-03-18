import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useApp, useMergeState } from "../../../AppProvider";
import { StyleSheet, Text, View, Dimensions, Image, FlatList, TouchableOpacity } from "react-native";
import { Colors, Dimension, Fonts } from "../../../commons";
import { ScreensView, InputView, TextView, ButtonView, IconView } from "../../../components";
import styles from "./styles";
import ActionKey from './ActionKey'
import ChoiceValueView from './component/ChoiceValueView'
import API from "../../../networking";
import actions from "../../../redux/actions";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-simple-toast";
import { IconViewType } from "../../../components/IconView";

export default function FitterDoctor(props) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute();
    const onSearchFitter = route?.params?.onSearchFitter
    const dataSelect = route?.params?.dataSelect
    console.log("dataSelect:    ", dataSelect)
    const [stateScreen, setStateScreen] = useMergeState({
        dataAcdemics: [],
        dataSpecialities: [],
        dataHealthFacilities: []
    })
    const { dataAcdemics, dataSpecialities, dataHealthFacilities } = stateScreen
    const [dataMedicalFacility, setDataMedicalFacility] = useState(dataSelect.healthFacilityData ? dataSelect.healthFacilityData : {})
    const [dataChuyenKhoa, setDataChuyenKhoa] = useState(dataSelect.medicalSpecialityData ? dataSelect.medicalSpecialityData : {})
    const [dataHocHamHocVi, setDataHocHamHocVi] = useState(dataSelect.academicData ? dataSelect.academicData : {})
    const { refDialog } = useApp();

    useEffect(() => {
        getDataServer();
    }, []);

    const getDataServer = async () => {
        dispatch(actions.showLoading())
        let data = await API.getAcademics(dispatch, {
            "status": "1"
        });
        let dataCoSoYTe = await API.getCoSoYTe(dispatch, {
            // "appointmentOption": 2
        });
        if (dataMedicalFacility.id) {
            getSpecialities(dataMedicalFacility.id)
        }
        setStateScreen({
            dataAcdemics: data,
            dataHealthFacilities: dataCoSoYTe
        })
        dispatch(actions.hideLoading())
    }

    const getSpecialities = async (id) => {
        let data = await API.getSpecialities(dispatch, id, {
            // hasClinic: true
        });
        setStateScreen({
            dataSpecialities: data
        })
    }

    const handleOnPress = ({ id }) => {
        switch (id) {
            case ActionKey.ShowChooseAMedicalFacility:
                showDialog(id, (dataMedicalFacility ? dataMedicalFacility : {}), dataHealthFacilities);
                break
            case ActionKey.ShowChooseChuyenKhoa:
                if (dataMedicalFacility && dataMedicalFacility.id) {
                    showDialog(id, (dataMedicalFacility ? dataMedicalFacility : {}), dataSpecialities);
                } else {
                    Toast.showWithGravity(
                        "Bạn cần chọn cơ sở y tế trước khi chọn chuyên khoa",
                        Toast.LONG,
                        Toast.CENTER
                    );
                }
                break
            case ActionKey.ShowChooseHocHamHocVi:
                showDialog(id, dataHocHamHocVi ? dataHocHamHocVi : {}, dataAcdemics);
                break
        }
    }

    const handleSelected = ({ id, data }) => {
        switch (id) {
            case ActionKey.ShowChooseAMedicalFacility:
                setDataMedicalFacility(data)
                getSpecialities(data.id)
                setDataChuyenKhoa({})
                break
            case ActionKey.ShowChooseChuyenKhoa:
                setDataChuyenKhoa(data)
                break
            case ActionKey.ShowChooseHocHamHocVi:
                console.log("data:    ", data)
                setDataHocHamHocVi(data)
                break
        }
    };

    const handleChangeValue = () => {

    }

    const showDialog = (typeDialog, itemSelect, data) => {
        refDialog?.current &&
            refDialog.current
                .configsDialog({
                    visibleClose: true,
                    isScroll: true,
                })
                .drawContents(
                    <ChoiceValueView
                        typeDialog={typeDialog}
                        refDialog={refDialog.current}
                        onPress={handleSelected}
                        itemSelect={itemSelect}
                        data={data}
                    />
                )
                .visibleDialog();
    };

    const fitterDoctor = () => {
        navigation.goBack()
        let data = {
            'advancedSearch': true,
            'status': 1,
            'name': "",
            'page': 0,
            'size': 30,
        }
        if (dataMedicalFacility?.id) {
            data.healthFacilityId = dataMedicalFacility?.id
            data.healthFacilityData = dataMedicalFacility
        }
        if (dataChuyenKhoa?.id) {
            data.medicalSpecialityId = dataChuyenKhoa?.id
            data.medicalSpecialityData = dataChuyenKhoa
        }
        if (dataHocHamHocVi?.id) {
            data.academicId = dataHocHamHocVi?.id
            data.academicData = dataHocHamHocVi
        }
        onSearchFitter && onSearchFitter(data)
    }

    const onPressClearData = ({ id }) => {
        switch (id) {
            case ActionKey.ShowChooseAMedicalFacility:
                setDataMedicalFacility({})
                setDataChuyenKhoa({})
                setStateScreen({
                    dataSpecialities: {}
                })
                break
            case ActionKey.ShowChooseChuyenKhoa:
                setDataChuyenKhoa({})
                break
            case ActionKey.ShowChooseHocHamHocVi:
                setDataHocHamHocVi({})
                break
        }
    }

    return (
        <ScreensView styleContent={{ paddingHorizontal: 12, }} titleScreen={"Lọc tìm kiếm"}
            renderFooter={
                <ButtonView
                    title={"Lọc tìm kiếm"}
                    onPress={fitterDoctor}
                    style={{ marginBottom: 20, marginHorizontal: 15 }}
                />
            }
        >

            <TextView
                id={ActionKey.ShowChooseAMedicalFacility}
                onPress={handleOnPress}
                numberOfLines={1}
                nameIconRight={"ic-arrow-down"}
                sizeIconRight={Dimension.sizeIcon20}
                styleIconRight={{ alignSelf: 'flex-end', marginBottom: 4 }}
                style={[styles.stButtonSelectbox]}
                styleContainerText={{ flex: 1, }}
                styleTitle={styles.stTitleButton}
                styleValue={styles.stValueButton}
                title={"Chọn cơ sở y tế khám:"}
                value={dataMedicalFacility.name ? dataMedicalFacility.name : ''}
                rightElement={
                    <IconView
                        id={ActionKey.ShowChooseAMedicalFacility}
                        onPress={onPressClearData}
                        name={dataMedicalFacility.name ? 'close-circle-outline' : ''}
                        type={IconViewType.MaterialCommunityIcons}
                        size={14}
                        color={Colors.textLabel}
                        style={{ alignSelf: 'flex-end', padding: 8 }}
                    />
                }
            />

            <TextView
                id={ActionKey.ShowChooseChuyenKhoa}
                numberOfLines={1}
                onPress={handleOnPress}
                nameIconRight={"ic-arrow-down"}
                sizeIconRight={Dimension.sizeIcon20}
                styleIconRight={{ alignSelf: 'flex-end', marginBottom: 4 }}
                style={[styles.stButtonSelectbox]}
                styleContainerText={{ flex: 1, }}
                styleTitle={styles.stTitleButton}
                styleValue={styles.stValueButton}
                title={"Chuyên khoa:"}
                value={dataChuyenKhoa.name ? dataChuyenKhoa.name : ''}
                rightElement={
                    <IconView
                        id={ActionKey.ShowChooseChuyenKhoa}
                        onPress={onPressClearData}
                        name={dataChuyenKhoa.name ? 'close-circle-outline' : ''}
                        type={IconViewType.MaterialCommunityIcons}
                        size={14}
                        color={Colors.textLabel}
                        style={{ alignSelf: 'flex-end', padding: 8 }}
                    />
                }
            />

            <TextView
                id={ActionKey.ShowChooseHocHamHocVi}
                onPress={handleOnPress}
                nameIconRight={"ic-arrow-down"}
                sizeIconRight={Dimension.sizeIcon20}
                styleIconRight={{ alignSelf: 'flex-end', marginBottom: 4 }}
                style={[styles.stButtonSelectbox]}
                styleContainerText={{ flex: 1, }}
                styleTitle={styles.stTitleButton}
                styleValue={styles.stValueButton}
                title={"Học hàm học vị:"}
                value={dataHocHamHocVi.name ? dataHocHamHocVi.name : ''}
                rightElement={
                    <IconView
                        id={ActionKey.ShowChooseHocHamHocVi}
                        onPress={onPressClearData}
                        name={dataHocHamHocVi.name ? 'close-circle-outline' : ''}
                        type={IconViewType.MaterialCommunityIcons}
                        size={14}
                        color={Colors.textLabel}
                        style={{ alignSelf: 'flex-end', padding: 8 }}
                    />
                }
            />
        </ScreensView>
    );
}
