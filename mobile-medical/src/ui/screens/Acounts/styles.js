import { StyleSheet, Platform, Dimensions } from 'react-native';
import { Colors } from '../../../commons'
const { width, height } = Dimensions.get('window')

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    styleText: {
        fontSize: 14, color: Colors.colorText1,
        fontFamily: 'SFProText-Regular'
    },
    styleButtonFace: {
        padding: 8,
        flexDirection: 'row',
        borderRadius: 8,
        elevation: 3,
        shadowColor: 'gray',
        marginHorizontal: 12,
        flex: 1,
        alignItems: 'center',
        justifyContent:  'center'
    },
    stylesButton: {
        backgroundColor: Colors.colorMain, width: '100%',
        borderRadius: 12,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    stylesConent: {
        backgroundColor: 'white',
        width: width - 48,
        height: height / 2,
        borderRadius: 24,
        elevation: 3,
        shadowColor: 'black',
        borderWidth: 0.5,
        borderColor: 'gray',
        padding: 24,
        justifyContent: 'space-between',
        marginTop: '18%'
    },
    styleLinearGra: {
        height: '40%',
        width: '100%',
        borderBottomRightRadius: 50,
        borderBottomLeftRadius: 50,
        position: 'absolute',
        top: 0, left: 0
    }
});
