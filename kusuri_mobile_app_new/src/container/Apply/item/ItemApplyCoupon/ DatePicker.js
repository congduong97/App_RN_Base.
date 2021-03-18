import React, { PureComponent } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
  APP_COLOR,
  COLOR_BLACK,
  COLOR_GRAY,
  COLOR_RED_LIGHT,
  COLOR_RED,
} from "../../../../const/Color";
import { STRING } from "../../../../const/String";
import { Item, Right, Text, View } from "native-base";
import Icon from "react-native-vector-icons/Ionicons";

import DateTimePicker from "react-native-modal-datetime-picker";

export class DatePicker extends PureComponent {
  constructor(props) {
    super(props);
    const { dateInit, name } = this.props;
    this.state = {
      date: dateInit || "",
      error: false,
      titleError: "",
      loading: false,
    };
  }
  componentDidMount() {
    const { onRef } = this.props;
    onRef(this);
  }

  _showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    // console.log('A date has been picked: ', date);
    const { selectedDate, onStatusError } = this.props;

    const dateNow = new Date();
    const dateSelect = new Date(date);
    if (dateSelect.getTime() > dateNow.getTime()) {
      onStatusError(true);

      this.setState({
        error: true,
        titleError: STRING.please_select_a_time_less_than_the_current_time,
        date: "",
        isDateTimePickerVisible: false,
      });
    } else {
      onStatusError(false);
      const time = `${dateSelect.getFullYear()}/${dateSelect.getMonth() +
        1}/${dateSelect.getDate()}`;
      selectedDate(time);
      this.setState({
        date: time,
        isDateTimePickerVisible: false,
        error: false,
        titleError: "",
      });
    }
  };
  checkData = () => {
    const { noByEmpty, onStatusError, selectedDate } = this.props;
    const { date } = this.state;

    if (noByEmpty == true && !date) {
      this.setState({ error: true, titleError: STRING.no_by_empty });
      onStatusError(true);
    } else if (date != STRING.birth_day) {
      const dateNow = new Date();
      const dateSelected = new Date(date);
      if (dateSelected.getTime() > dateNow.getTime()) {
        this.setState({
          error: true,
          titleError: STRING.please_select_a_time_less_than_the_current_time,
          isDateTimePickerVisible: false,
        });
        onStatusError(true);
      } else {
        const time = `${dateSelected.getFullYear()}/${dateSelected.getMonth() +
          1}/${dateSelected.getDate()}`;
        selectedDate(dateSelected.getTime());
        onStatusError(false);
        this.setState({
          isDateTimePickerVisible: false,
          error: false,
          titleError: "",
        });
      }
    }
  };
  getColor = () => {
    const { error } = this.state;
    return error ? COLOR_RED : APP_COLOR.COLOR_TEXT;
  };

  render() {
    const { error, titleError, date } = this.state;
    const { dateInit, name, noByEmpty } = this.props;
    return (
      <View>
        <View
          style={{
            height: 30,
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            marginTop: 10,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Icon size={20} name={"md-calendar"} color={this.getColor()} />
            <Text style={{ color: COLOR_GRAY, fontSize: 15, marginLeft: 8 }}>
              {name}
            </Text>
          </View>
          {noByEmpty ? (
            <Text style={{ color: COLOR_RED }}>{"必須"}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={() => {
            this._showDateTimePicker();
          }}
          style={[styles.buttonBorder, { borderColor: this.getColor() }]}
        >
          <Text
            style={{
              color:
                date != STRING.birth_day ? APP_COLOR.COLOR_TEXT : COLOR_GRAY,
              fontSize: 14,
            }}
          >
            {date}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.textError, { color: COLOR_RED_LIGHT }]}>
          {error === true ? titleError : ""}
        </Text>

        {/*</Item>*/}

        <DateTimePicker
          display="spinner"
          datePickerModeAndroid={"spinner"}
          date={dateInit ? new Date(dateInit) : new Date()}
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonBorder: {
    height: 50,
    width: "100%",
    borderStyle: "solid",
    borderBottomWidth: 0.7,
    borderTopColor: COLOR_RED,
    borderTopWidth: 1.24,
    borderLeftWidth: 1.24,
    borderRightWidth: 1.24,
    borderRadius: 4,
    marginTop: 5,
    justifyContent: "center",
    paddingLeft: 8,
  },
  wrapperContainer: {
    width: "100%",
    height: 50,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 0.5,
    marginBottom: 10,
  },
  item: {},
  textInput: {
    marginLeft: -5,
    color: COLOR_BLACK,
    fontSize: 14,
    fontFamily: "SegoeUI",
  },
  wrapperError: {
    marginTop: 5,
    width: "100%",
  },
  textError: {
    fontSize: 14,
    fontFamily: "SegoeUI",
  },
});
