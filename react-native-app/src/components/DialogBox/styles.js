import * as d from '../../commons/utils/devices';
const styles = {
  container: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: d.windowSize.height,
    width: d.windowSize.width,
  },
  overlayStyle: {
    height: d.windowSize.height,
    width: d.windowSize.width,
    position: 'absolute',
    backgroundColor: '#000',
  },
  dialogStyle: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  titleStyle: {
    fontSize: 18 * d.ratioW,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  descriptionStyle: {
    fontSize: 15 * d.ratioW,
    marginTop: 10,
    marginHorizontal: 5 * d.ratioW,
  },
  buttonContainer: {
    borderTopWidth: 0.5,
    borderColor: '#757575',
    flexDirection: 'row',
    height: 50,
    marginTop: 50,
  },
  cancelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.5,
    borderColor: '#757575',
    flex: 0.5,
  },
  cancelStyle: {
    fontSize: 20 * d.ratioW,
    fontWeight: '600',
    color: '#F22F3D',
  },
  acceptContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.5,
  },
  acceptStyle: {
    fontSize: 20 * d.ratioW,
    fontWeight: '600',
    color: '#216FEF',
  },
};

export default styles;
