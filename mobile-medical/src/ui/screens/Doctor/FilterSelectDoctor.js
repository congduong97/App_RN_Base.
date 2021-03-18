import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import { useApp, useMergeState } from "../../../AppProvider";
import { ScreensView, InputView, TextView, ButtonView, IconView } from "../../../components";
// import IconView, { IconViewType } from "../../../components/IconView";
import {
    Colors,
    Dimension,
    Fonts,
    ImagesUrl,
    fontsValue,
    validateImageUri,
} from "../../../commons";
import AppNavigate from "../../../navigations/AppNavigate";
import API from "../../..";
import { BookAppointmentKey, getGenderName } from "../../../models";
import ChoiceValueView from './component/ChoiceValueView'
import ActionKey from './ActionKey'
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { IconViewType } from "../../../components/IconView";

const idNameDoctor = "idNameDoctor"
const dataGender = [
    {
        id: 1,
        name: "nam",
        code: "male",
    },
    {
        id: 2,
        name: "Nữ",
        code: "female",
    },
    {
        id: 3,
        name: "Khác",
        code: "other",
    },
];
export default function ViewFilterDoctor(props) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute();
    const dataSpecialities = route?.params?.dataSpecialities
    const dataAcademics = route?.params?.dataAcademics
    const dataClinics = route?.params?.dataClinics
    const searchFilterDoctor = route?.params?.searchFilterDoctor
    const dataParamsSelect = route?.params?.dataParamsSelect
    const medicalSpecialityId = dataParamsSelect?.medicalSpecialityId
    const clinicId = dataParamsSelect?.clinicId

    const makeAppointData = useSelector(
        (state) => state.MakeAppointmentReducer.makeAppointData
    );
    const typeBook = makeAppointData?.[BookAppointmentKey.TypeBook]

    const { refDialog } = useApp();
    const [stateScreen, setStateScreen] = useMergeState({
        // keySearchNameDoctor: dataParamsSelect.nameDoctor || '',
        itemSelectClinic: {},
        itemSelectSpecoalities: {},
        itemSelectAcademics: {},
        itemSelectGender: {},
    });
    const {
        // keySearchNameDoctor,
        itemSelectClinic, itemSelectSpecoalities, itemSelectAcademics, itemSelectGender, } = stateScreen;

    useEffect(() => {
        let itemClinic = {}
        let itemChuyenKhoa = {}
        let itemAcademics = {}
        let itemGender = {}
        if (dataParamsSelect.clinicId) {
            itemClinic = dataClinics.filter((item) => item.id == dataParamsSelect.clinicId)
            itemClinic = itemClinic[0] ? itemClinic[0] : {}
        } else if (clinicId) {
            itemClinic = dataClinics.filter((item) => item.id == clinicId)
            itemClinic = itemClinic[0] ? itemClinic[0] : {}
        }

        if (dataParamsSelect.medicalSpecialityId) {
            itemChuyenKhoa = dataSpecialities.filter((item) => item.id == dataParamsSelect.medicalSpecialityId)
            itemChuyenKhoa = itemChuyenKhoa[0] ? itemChuyenKhoa[0] : {}
        } else if (medicalSpecialityId) {
            itemChuyenKhoa = dataSpecialities.filter((item) => item.id == medicalSpecialityId)
            itemChuyenKhoa = itemChuyenKhoa[0] ? itemChuyenKhoa[0] : {}
        }

        if (dataParamsSelect.academicId) {
            itemAcademics = dataAcademics.filter((item) => item.id == dataParamsSelect.academicId)
            itemAcademics = itemAcademics[0] ? itemAcademics[0] : {}
        }

        if (dataParamsSelect.gender) {
            itemGender = dataGender.filter((item) => item.code == dataParamsSelect.gender)
            itemGender = itemGender[0] ? itemGender[0] : {}
        }

        setStateScreen({
            itemSelectClinic: itemClinic,
            itemSelectSpecoalities: itemChuyenKhoa,
            itemSelectAcademics: itemAcademics,
            itemSelectGender: itemGender
        })
    }, [dataSpecialities, dataClinics]);

    const searchFilter = async () => {
        let params = {}
        if (itemSelectSpecoalities && itemSelectSpecoalities.id) {
            params = {
                ...params,
                ...{ medicalSpecialityId: itemSelectSpecoalities.id }
            }
        }
        if (itemSelectClinic && itemSelectClinic.id) {
            params = {
                ...params,
                ...{ clinicId: itemSelectClinic.id }
            }
        }
        if (itemSelectAcademics && itemSelectAcademics.id) {
            params = {
                ...params,
                ...{ academicId: itemSelectAcademics.id }
            }
        }
        if (itemSelectGender && itemSelectGender.code) {
            params = {
                ...params,
                ...{ gender: itemSelectGender.code }
            }
        }
        // if (keySearchNameDoctor) {
        //     params = {
        //         ...params,
        //         ...{ nameDoctor: keySearchNameDoctor }
        //     }
        // }

        console.log("params:   ", params)
        navigation.goBack()
        searchFilterDoctor(params)
    }

    const onChangeSearchValue = ({ id, data }) => {
        switch (id) {
            // case idNameDoctor:
            //     setStateScreen({ keySearchNameDoctor: data });
            //     break;
            case ActionKey.ShowChooseChuyenKhoa:
                setStateScreen({ itemSelectSpecoalities: {} });
                break;
            case ActionKey.ShowChooseHocHamHocVi:
                setStateScreen({ itemSelectAcademics: {} });
                break;
            case ActionKey.Gender:
                setStateScreen({ itemSelectGender: {} });
                break;
            case ActionKey.ShowChooseClinic:
                setStateScreen({ itemSelectClinic: {} });
                break;
            default:
                break;
        }

    };

    const handleOnPress = ({ id }) => {
        if (id === ActionKey.ShowChooseChuyenKhoa) {
            showDialog(id, itemSelectSpecoalities, dataSpecialities);
        } else if (id === ActionKey.ShowChooseHocHamHocVi) {
            showDialog(id, itemSelectAcademics, dataAcademics);
        } else if (id === ActionKey.ShowChooseClinic) {
            showDialog(id, itemSelectClinic, dataClinics);
        } else if (id === ActionKey.Gender) {
            showDialog(id, itemSelectGender);
        }
    };

    const handleSelected = ({ id, data }) => {
        switch (id) {
            case ActionKey.Gender:
                console.log("data:    ", data)
                setStateScreen({ itemSelectGender: data })
                break
            case ActionKey.ShowChooseChuyenKhoa:
                setStateScreen({ itemSelectSpecoalities: data })
                break
            case ActionKey.ShowChooseHocHamHocVi:
                setStateScreen({ itemSelectAcademics: data })
                break
            case ActionKey.ShowChooseClinic:
                setStateScreen({ itemSelectClinic: data })
                break
        }
    }

    const showDialog = (typeDialog, itemSelect, data) => {
        refDialog?.current &&
            refDialog.current
                .configsDialog({
                    // visibleClose: false,
                    isScroll: true,
                })
                .drawContents(
                    <ChoiceValueView
                        itemSelect={itemSelect}
                        typeDialog={typeDialog}
                        onPress={handleSelected}
                        refDialog={refDialog.current}
                        data={data}
                    />
                )
                .visibleDialog();
    };

    return (
        <ScreensView styleContent={{ padding: 12 }} titleScreen={"Lọc tìm kiếm"}
            renderFooter={
                <ButtonView
                    title={"Lọc tìm kiếm"}
                    onPress={searchFilter}
                    style={{ marginBottom: 20, marginHorizontal: 15 }}
                />
            }
        >

            {/* <InputView
                id={idNameDoctor}
                label={"Tên bác sĩ:"}
                isShowLabel={true}
                placeholder={"Nhập tên bác sỹ..."}
                placeholderTextColor={"gray"}
                offsetLabel={Platform.OS === "ios" ? -1 : -3}
                iconRightColor={Colors.colorMain}
                style={styles.stInput}
                value={keySearchNameDoctor}
                styleInput={styles.styleContainInput}
                onChangeText={onChangeSearchValue}
                textDisable={styles.textDisable}
            /> */}

            {typeBook === 1 && <InputView
                onPress={handleOnPress}
                onClearText={onChangeSearchValue}
                id={ActionKey.ShowChooseClinic}
                label={"Phòng ban:"}
                isShowLabel={true}
                iconRightName={"ic-arrow-down"}
                iconRighSize={Dimension.sizeIcon20}
                iconRightColor={Colors.colorMain}
                placeholder={"Chọn phòng ban:"}
                editable={false}
                numberOfLines={2}
                placeholderTextColor={"gray"}
                offsetLabel={Platform.OS === "ios" ? -1 : -3}
                iconRightColor={Colors.colorMain}
                style={styles.stInput}
                value={itemSelectClinic?.name ? itemSelectClinic?.name : ''}
                styleInput={styles.styleContainInput}
                textDisable={styles.textDisable}
            />}

            <InputView
                onPress={handleOnPress}
                onClearText={onChangeSearchValue}
                id={ActionKey.ShowChooseChuyenKhoa}
                label={"Chuyên khoa:"}
                isShowLabel={true}
                iconRightName={"ic-arrow-down"}
                iconRighSize={Dimension.sizeIcon20}
                iconRightColor={Colors.colorMain}
                placeholder={"Chọn chuyên khoa..."}
                editable={false}
                numberOfLines={2}
                placeholderTextColor={"gray"}
                offsetLabel={Platform.OS === "ios" ? -1 : -3}
                iconRightColor={Colors.colorMain}
                style={styles.stInput}
                value={itemSelectSpecoalities?.name ? itemSelectSpecoalities?.name : ''}
                styleInput={styles.styleContainInput}
                textDisable={styles.textDisable}
            />

            <InputView
                onPress={handleOnPress}
                onClearText={onChangeSearchValue}
                editable={false}
                id={ActionKey.Gender}
                isShowLabel={true}
                iconRightName={"ic-arrow-down"}
                iconRighSize={Dimension.sizeIcon20}
                iconRightColor={Colors.colorMain}
                label={"Giới tính:"}
                numberOfLines={2}
                placeholder={"Chọn giới tính..."}
                placeholderTextColor={"gray"}
                offsetLabel={Platform.OS === "ios" ? -1 : -3}
                iconRightColor={Colors.colorMain}
                style={styles.stInput}
                value={itemSelectGender?.name ? itemSelectGender?.name : ''}
                styleInput={styles.styleContainInput}
                textDisable={styles.textDisable}
            />

            <InputView
                onPress={handleOnPress}
                onClearText={onChangeSearchValue}
                editable={false}
                id={ActionKey.ShowChooseHocHamHocVi}
                isShowLabel={true}
                iconRightName={"ic-arrow-down"}
                iconRighSize={Dimension.sizeIcon20}
                iconRightColor={Colors.colorMain}
                label={"Học hàm, học vị:"}
                numberOfLines={2}
                placeholder={"Chọn học hàm học vị..."}
                placeholderTextColor={"gray"}
                offsetLabel={Platform.OS === "ios" ? -1 : -3}
                styleViewLabel={{ backgroundColor: "white", paddingHorizontal: 3 }}
                iconRightColor={Colors.colorMain}
                style={styles.stInput}
                value={itemSelectAcademics?.name ? itemSelectAcademics?.name : ''}
                styleInput={styles.styleContainInput}
                textDisable={styles.textDisable}
            />

        </ScreensView>
    );
}

const styles = StyleSheet.create({
    stInput: {
        // margin: Dimension.margin,
        // // marginTop: Dimension.margin2x,
        // borderRadius: Dimension.radiusButton,
        // borderBottomWidth: 1,
        // borderBottomColor: Colors.colorBg2,
        marginTop: 40,
        borderWidth: 0,
        borderBottomColor: Colors.colorBg2,
        borderBottomWidth: 1,
        position: "relative",
    },
    styleContainInput: {
        borderColor: Colors.colorBg2,
        borderWidth: 0,
    },
    textDisable: {
        color: Colors.colorText,
        fontSize: Dimension.fontSize16,
        fontFamily: Fonts.SFProDisplaySemibold,
        marginHorizontal: Dimension.margin5,
    },
});
