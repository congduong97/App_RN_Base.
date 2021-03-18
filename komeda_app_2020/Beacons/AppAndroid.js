import React from 'react'
import { View, Text, NativeEventEmitter, NativeModules, TouchableOpacity, FlatList, SafeAreaView } from 'react-native'
import Beacons from './RabilooBeacon/BeaconAndroid'
import moment from 'moment'


const region = {
  identifier: "android",
  uuid: '01f32be3-426b-4acf-9cb3-bb86eb37d0ca',
};

class App extends React.Component {

  constructor() {
    super()
    this.state = {
      enterRegion: [],
      exitRegion: [],
      enterMove: [],
      exitMove: []
    }
  }

  renderItem = ({ item }) => {
    return (
      <View style={{ marginBottom: 20 }}>
        <Text>uuid: {item.uuid}</Text>
        <Text>rssi: {item.rssi}</Text>
        <Text>major: {item.major}</Text>
        <Text>proximity: {item.proximity}</Text>
        <Text>distance: {item.distance}</Text>
      </View>
    )
  }

  renderBeaconInfo = ({ item }) => {
    return (
      <View style={{ marginVertical: 20 }}>
        <Text>uuid: {item.uuid}</Text>
        <Text>major: {item.major}</Text>
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

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
            style={{ padding: 20, backgroundColor: 'green' }}
            onPress={async () => {
              // Start detecting all iBeacons in the nearby
              try {
                await Beacons.startRangingBeaconsInRegion(region)
                await Beacons.startMonitoringForRegion(region)
                console.log(`Beacons ranging started succesfully!`)
              } catch (err) {
                console.log(`Beacons ranging not started, error: ${error}`)
              }
            }}
          >
            <Text style={{ color: 'white' }}>Scanner</Text>
          </TouchableOpacity>
          <Text style={{ marginVertical: 20 }}>List Enter Advertisement Region : {this.state.enterRegion.length} time</Text>
          <FlatList
            style={{ width: '100%', height: '40%' }}
            data={this.state.enterMove}
            renderItem={this.renderMovieItem}
          />
          <Text style={{ marginVertical: 20 }}>List Exit Advertisement Region : {this.state.exitRegion.length} time</Text>
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
    // Tells the library to detect iBeacons
    Beacons.detectIBeacons();
    // Print a log of the detected iBeacons (1 per second)
    this.subscription = Beacons.BeaconsEventEmitter.addListener('beaconsDidRange', (data) => {
      console.log('Found beacons!', data.beacons);
      return fetch('https://reactnative.dev/movies.json')
        .then((response) => response.json())
        .then((json) => {
          console.log(" beaconsDidRange move : ", json.movies[0])
        })
        .catch((error) => {
          console.log(" beaconsDidRange error : ", error)
        });
    })
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
        //const time = moment().format(TIME_FORMAT);
        //this.setState({ regionExitDatasource: this.state.rangingDataSource.cloneWithRows([{ identifier, uuid, minor, major, time }]) });
      }
    );
  }

  componentWillUnmount() {
    this.subscription.remove()
    this.DidEnterSub.remove();
    this.DidExitSub.remove();
  }
}

export default App;