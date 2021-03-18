import { StyleSheet, Platform, Dimensions } from 'react-native';
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
        width: width - 48,
        height: height / 2,
        borderRadius: 24,
        elevation: 3,
        shadowColor: 'black',
        borderWidth: 0.5,
        borderColor: 'gray',
        padding: 12,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingVertical: 24, paddingHorizontal: 12
    },
    styleLinearGra: {
        height: '25%',
        width: '100%',
        borderBottomRightRadius: 50,
        borderBottomLeftRadius: 50,
        position: 'absolute',
        top: 0, left: 0
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
    styleContainerDate: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },
    stylesIconLeft: {
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        color: '#9AA6B4'
    },
});
