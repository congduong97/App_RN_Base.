import { StyleSheet, Platform, Dimensions } from 'react-native';
import { Dimension } from '../../../commons';
const { width, height } = Dimensions.get('window')
const colorMain = '#00C6AD'

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    borderStyleBase: {
        width: 30,
        height: 45
    },

    borderStyleHighLighted: {
    },

    underlineStyleBase: {
        width: 45,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderRadius: 8,
        borderColor: colorMain,
        borderWidth: 1,
        color: colorMain
    },

    underlineStyleHighLighted: {
    },

    viewContent: {
        backgroundColor: 'white',
        padding: 12,
        width: width - 48,
        height: height / 2,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        borderRadius: 24,
        // borderWidth: 0.5,
        // borderColor: 'gray',
        // marginTop: '20%',
    },
    styleLinearGra: {
        height: '35%',
        width: '100%',
        borderBottomRightRadius: 50,
        borderBottomLeftRadius: 50,
        position: 'absolute',
        top: 0, left: 0,
        paddingTop: 12
    },
    styleText: {
        fontSize: 14, color: 'black',
        fontFamily: 'SFProText-Regular'
    },
    stylesButton: {
        backgroundColor: colorMain, width: '90%',
        borderRadius: 12,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styleContent: {
        backgroundColor: "white",
        paddingHorizontal: Dimension.padding2x,
        marginTop: Platform.OS === "ios" ? 50 : 30,
        paddingBottom: Platform.OS === "ios" ? 80 : 50,
        alignItems: 'center',
        // elevation: 5,
        // shadowOpacity: 1,
    },

    styleHeader: {
        height: Platform.OS === "ios" ? 200 : 180,
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 60,
        elevation: 3,
        shadowOpacity: 5,
        justifyContent: "flex-start",
    },
});
