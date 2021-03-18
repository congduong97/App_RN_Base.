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
    styleContainerDate: {
        flex: 1,
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
    stylesItemView: {
        padding: 12,
        elevation: 3,
        shadowColor: 'gray',
        borderRadius: 12,
        backgroundColor: 'white',
        flex: 1,
        marginHorizontal: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center'
    },
    styleButton: {
        backgroundColor: '#00C6AD',
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 24,
        marginBottom: 12,
        borderRadius: 12,
    },
    styleViewSearch: {
        flexDirection: 'row', 
        backgroundColor: '#f2f2f2', 
        borderRadius: 12, 
        alignItems: 'center',
        paddingHorizontal: 12,
        marginHorizontal: 12,
        marginTop: 12
    }
});
