import React from 'react'
import { View, Text, NativeEventEmitter, NativeModules, TouchableOpacity, FlatList, SafeAreaView } from 'react-native'
import moment from 'moment'
import Beacons from './RabilooBeacon/Beacon'
// const { RNiBeacon } = NativeModules;
// const calendarManagerEmitter = new NativeEventEmitter(RNiBeacon);

const region1 = {
  identifier: "aa",
  uuid: '01f32be3-426b-4acf-9cb3-bb86eb37d0ca',
};
// const region2 = {
//   identifier: "bb",
//   uuid: '01f32be3-426b-4acf-9cb3-bb86eb37d0ca',
//   major: 2
// };
// const region3 = {
//   identifier: "cc",
//   uuid: '01f32be3-426b-4acf-9cb3-bb86eb37d0ca',
//   major: 3
// };
// const region4 = {
//   identifier: 'Estimotes4',
//   uuid: '01f32be3-426b-4acf-9cb3-bb86eb37d0ca',
//   major: 4
// };
// const region5 = {
//   identifier: 'Estimotes5',
//   uuid: '01f32be3-426b-4acf-9cb3-bb86eb37d0ca',
//   major: 5
// };

class App extends React.Component {

  startTime = 0;

  constructor() {
    super()
    this.state = {
      enterRegion: [],
      exitRegion: [],
      beacon: {
        uuid: '',
        major: 0,
        minor: 0,
        accuracy: 0
      },
      totalTime: '',
      enterMove: [],
      exitMove: []
    }
  }

  renderItem = ({ item }) => {
    return (
      <View style={{ marginBottom: 20 }}>
        <Text>uuid: {item.uuid}</Text>
        <Text>major: {item.major}</Text>
        <Text>minor: {item.minor}</Text>
        <Text>distance: {item.accuracy}</Text>
      </View>
    )
  }

  renderBeaconInfo = ({ item }) => {
    return (
      <View style={{ marginVertical: 20 }}>
        <Text>uuid: {item.uuid}</Text>
        <Text>time: {item.time}</Text>
      </View>
    )
  }

  renderMovieItem = ({ item }) => {
    return (
      <View style={{ marginVertical: 20 }}>
        <Text>id : {item.id} , title : {item.title} , year : {item.releaseYear}</Text>
        <Text>update time : {item.time}</Text>
      </View>
    )
  }

  formatDate = (time) => {
    let hour = time / 3600 + '';
    hour = parseInt(hour);
    let min = (time - hour * 3600) / 60 + '';
    min = parseInt(min);
    const second = time - hour * 3600 - min * 60;
    return `${hour}:${min}:${second}`;
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
          <TouchableOpacity
            style={{ padding: 10, backgroundColor: 'green' }}
            onPress={async () => {
              //if (this.state.region.length > 0)
              await Beacons.startRangingBeaconsInRegion(region1);
              await Beacons.startMonitoringForRegion(region1)
              this.startTime = 0;
              //await Beacons.startMonitoringForRegion(region2)
              //await Beacons.startMonitoringForRegion(region3)
              //Beacons.startRangingBeaconsInRegion(region)
            }}
          >
            <Text style={{ color: 'white' }}>Scanner</Text>
          </TouchableOpacity>
          <Text style={{ margin: 10 }}>Beacon Info - Total time : {this.state.totalTime}</Text>
          <View style={{ alignSelf: 'flex-start' }}>
            <Text>uuid: {this.state.beacon.uuid}</Text>
            <Text>major: {this.state.beacon.major}</Text>
            <Text>minor: {this.state.beacon.minor}</Text>
            <Text>distance: {this.state.beacon.accuracy}</Text>
          </View>
          <Text style={{ marginVertical: 20 }}>List Enter Advertisement Region : {this.state.enterMove.length} time</Text>
          <FlatList
            style={{ width: '100%', height: '40%' }}
            data={this.state.enterMove}
            renderItem={this.renderMovieItem}
          />
          <Text style={{ marginVertical: 20 }}>List Exit Advertisement Region : {this.state.exitMove.length} time</Text>
          <FlatList
            style={{ width: '100%', height: '40%' }}
            data={this.state.exitMove}
            renderItem={this.renderMovieItem}
          />
        </View>

      </SafeAreaView>
    )
  }

  componentDidMount() {
    Beacons.requestAlwaysAuthorization();


    //Beacons.startMonitoringForRegion(region);
    //Beacons.startRangingBeaconsInRegion(region);
    //Beacons.startMonitoringForRegion()

    Beacons.allowsBackgroundLocationUpdates(true)
    Beacons.startUpdatingLocation();
    // Beacons.getMonitoredRegions().then(res => {
    //   console.log("region 1111 ", res);
    //   this.setState({
    //     region: res
    //   })
    // })
    this.subscription = Beacons.BeaconsEventEmitter.addListener(
      'beaconsDidRange',
      (data) => {
        // data.region - The current region
        // data.region.identifier
        // data.region.uuid

        // data.beacons - Array of all beacons inside a region
        //  in the following structure:
        //    .uuid
        //    .major - The major version of a beacon
        //    .minor - The minor version of a beacon
        //    .rssi - Signal strength: RSSI value (between -100 and 0)
        //    .proximity - Proximity value, can either be "unknown", "far", "near" or "immediate"
        //    .accuracy - The accuracy of a beacon
        console.log("beacons data :", data.beacons)

        if (data.beacons.length > 0) {
          this.startTime = this.startTime + 1;
          const timeStr = this.formatDate(this.startTime);
          this.setState({
            beacon: data.beacons[0],
            totalTime: timeStr
          })
        }

        return fetch('https://reactnative.dev/movies.json')
          .then((response) => response.json())
          .then((json) => {
            console.log(" beaconsDidRange move : ", json.movies[0])
          })
          .catch((error) => {
            console.log(" beaconsDidRange error : ", error)
          });
        // this.setState({
        //   beacons: data.beacons
        // })
        //this.setState()
        //region.minor = data.b
      }
    );
    this.DidEnterSub = Beacons.BeaconsEventEmitter.addListener(
      'regionDidEnter',
      (data) => {
        // good place for background tasks
        console.log('monitoring - regionDidEnter data: ', data);
        const time = moment(new Date()).format('MMMM Do YYYY, h:mm:ss a')
        // this.state.enterRegion.push({ uuid: data.uuid, minor: data.minor, major: data.major, time })
        // this.setState({
        //   enterRegion: this.state.enterRegion
        // })
        return fetch('https://reactnative.dev/movies.json')
          .then((response) => response.json())
          .then((json) => {
            if (json.movies.length > 0) {
              this.state.enterMove.push({ ...json.movies[0], time })
              this.setState({
                enterMove: this.state.enterMove
              })
            }

          })
          .catch((error) => {
            console.error(error);
          });

        //const time = moment().format(TIME_FORMAT);
        //this.setState({ regionEnterDatasource: this.state.rangingDataSource.cloneWithRows([{ identifier:data.identifier, uuid:data.uuid, minor:data.minor, major:data.major, time }]) });
      }
    );
    this.DidExitSub = Beacons.BeaconsEventEmitter.addListener(
      'regionDidExit',
      ({ identifier, uuid, minor, major }) => {
        // good place for background tasks
        console.log('monitoring - regionDidExit data: ', { identifier, uuid, minor, major });
        const time = moment(new Date()).format('MMMM Do YYYY, h:mm:ss a')
        // this.state.exitRegion.push({ uuid: uuid, minor: minor, major: major, time })
        // this.setState({
        //   exitRegion: this.state.exitRegion
        // })
        //const time = moment().format(TIME_FORMAT);
        //this.setState({ regionExitDatasource: this.state.rangingDataSource.cloneWithRows([{ identifier, uuid, minor, major, time }]) });
        return fetch('https://reactnative.dev/movies.json')
          .then((response) => response.json())
          .then((json) => {
            if (json.movies.length > 0) {
              this.state.exitMove.push({ ...json.movies[1], time })
              this.setState({
                exitMove: this.state.exitMove
              })
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    );
  }

  componentWillUnmount() {
    this.subscription.remove();
    this.DidEnterSub.remove();
    this.DidExitSub.remove();
    if (Beacons) {
      Beacons.stopRangingBeaconsInRegion(region1);
      Beacons.stopMonitoringForRegion(region1);
    }
  }
}

export default App;