import React, {
  useRef,
  memo,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {View, TouchableOpacity} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {SIZE, FetchApi} from '../../../utils';
import {AppIcon} from '../../../elements';
import MarkerItem from './MarkerItem';

const StoreMap = ({data, markers}) => {
  const mapRef = useRef(null);
  const mapMaker = useRef();
  const iconCenter = useRef();
  const latitude = parseFloat(data.latitude);
  const longitude = parseFloat(data.longitude);
  let markerSlice = [];
  if (Array.isArray(markers)) {
    markerSlice = [...markers].slice(0, 10);
  }

  const onRegionChangeComplete = async (e) => {
    mapMaker.current.getNewMarkers(e);
  };

  const onPress = (e) => {
    const {coordinate} = e.nativeEvent;
    mapRef.current.animateCamera({
      center: {latitude: coordinate.latitude, longitude: coordinate.longitude},
    });
    onRegionChangeComplete(coordinate);
  };

  const onTouchStart = () => {
    iconCenter.current.setCenter(true);
  };

  return (
    <View>
      <MapView
        ref={mapRef}
        style={{width: SIZE.device_width, height: SIZE.device_width / 1.55}}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0342,
          longitudeDelta: 0.1086,
        }}
        showsUserLocation={true}
        onRegionChangeComplete={onRegionChangeComplete}
        // onPress={onPress}
        onRegionChange={(e) => iconCenter.current.setCoordinates(e)}
        // onTouchStart={onTouchStart}
      >
        <MarkerContainer ref={mapMaker} markers={markerSlice} />
        <MarkerCenter ref={iconCenter} />
      </MapView>
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          backgroundColor: 'white',
          borderRadius: 6,
          height: 40,
          width: 40,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          iconCenter.current.setCenter(false);
          mapRef.current.animateCamera({center: {latitude, longitude}});
        }}>
        <AppIcon
          icon={'location-arrow'}
          iconSize={30}
          type={'FontAwesome'}
          iconColor={'#68463A'}
        />
      </TouchableOpacity>
    </View>
  );
};

const MarkerContainer = forwardRef((props, ref) => {
  const [newMarkers, setNewMarkers] = useState(props.markers || []);

  useImperativeHandle(ref, () => ({getNewMarkers}), []);

  const getNewMarkers = async (coor) => {
    let result = await FetchApi.getListStore(
      10,
      1,
      coor.latitude,
      coor.longitude,
    );
    if (result.success && result.data) {
      setNewMarkers(result.data.content);
    }
  };

  return newMarkers.map((marker) => (
    <MarkerItem
      key={'' + marker.latitude15 + marker.longitude16}
      data={marker}
    />
  ));
});

const MarkerCenter = forwardRef((props, ref) => {
  // const [showCenter, setShowCenter] = useState(false);
  const showCenter = useRef(false);
  const [coor, setCoor] = useState({latitude: 0, longitude: 0});

  useImperativeHandle(ref, () => ({setCenter, setCoordinates}), []);

  const setCenter = (bool) => {
    // setShowCenter(bool);
  };
  const setCoordinates = (e) => {
    showCenter.current = true;
    setCoor({...coor, latitude: e.latitude, longitude: e.longitude});
  };

  if (showCenter.current) {
    return (
      <MapView.Marker
        draggable
        tracksViewChanges={false}
        coordinate={{
          latitude: coor.latitude,
          longitude: coor.longitude,
        }}>
        <AppIcon
          icon={'dot-circle-o'}
          iconSize={20}
          type={'FontAwesome'}
          iconColor={'#6F452F'}
        />
      </MapView.Marker>
      // <View
      //   style={{
      //     zIndex: 0,
      //     position: 'absolute',
      //     alignSelf: 'center',
      //     bottom: SIZE.device_width / 1.55 / 2,
      //   }}>
      //   <AppIcon
      //     icon={'dot-circle-o'}
      //     iconSize={20}
      //     type={'FontAwesome'}
      //     iconColor={'#6F452F'}
      //   />
      // </View>
    );
  }
  return null;
});

export default memo(StoreMap);
