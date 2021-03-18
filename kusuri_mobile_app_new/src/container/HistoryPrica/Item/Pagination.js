import React, { Component } from 'react'
import { Text, View,TouchableOpacity } from 'react-native'
import AntDesign from "react-native-vector-icons/AntDesign";
import { APP_COLOR, COLOR_WHITE } from '../../../const/Color';

export default class Pagination extends Component {
  constructor(){
    super();
    this.state={
        numberPage:1,
        totalPages:null,
    }
}

componentDidMount() {
  this.setState({totalPages:this.props.totalPages})
}


renderPageIndex = () => {
  const dataPage = [];
  for(let i = 1; i < this.state.totalPages+1; i++){
    dataPage.push(i);
  }
  return dataPage.map((page, index) => {
    let backgroundColor = "#F19B9F";
    if (
      this.state.numberPage === page
    ) {
      backgroundColor = APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1;
    }
    if (this.state.numberPage === page) {
      backgroundColor = APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1;
    }
    return (
      <TouchableOpacity
        style={{
          width: 25,
          height: 25,
          borderRadius: 25 / 2,
          alignItems: "center",
          borderWidth: 0.5,
          margin: 4,
          marginTop: 7,
          borderColor: "#F19B9F",
          backgroundColor: backgroundColor ? backgroundColor : "#F19B9F",
          justifyContent: "center"
        }}
        onPress={() => this.onPressPage(page, index)}
        key={index}
      >
        <Text style={{ color: COLOR_WHITE }}>{page}</Text>
      </TouchableOpacity>
    );
  });

} 
onPressPage = (page, index) => {
  this.setState(
    {
      numberPage: page, 
    }
  );
};
    
onNextPress = ()=>{
  const {numberPage ,totalPages} = this.state;
  if(numberPage< totalPages){
    this.setState({numberPage:this.state.numberPage+1})
  }
  
}
onPrevPress=()=>{
  const {numberPage } = this.state;
  if(numberPage > 1){
    this.setState({numberPage:this.state.numberPage-1})
  }
  
}

  render() {
    const {numberPage,totalPages} = this.state;
    let disablePrevBtn = numberPage === 1;
    let disableNextBtn = numberPage === totalPages;
    

    return (
      <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical:16
      }}
    >
  <TouchableOpacity
      disabled={disablePrevBtn}
      style={{
        borderTopLeftRadius:16,
        borderBottomLeftRadius:16,
        paddingHorizontal:10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        left: 16,
        backgroundColor: disablePrevBtn ? "#F19B9F": APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1
      }}
      onPress={this.onPrevPress}
    >
      <View style={{ marginLeft: 0 }}>
        <AntDesign name="left" size={15} color={COLOR_WHITE} />
      </View>
      <Text
        style={{
          color: COLOR_WHITE,
          fontSize: 10,
          right: 3,
          fontWeight: "bold",
          paddingHorizontal:20
        }}
      >
        前のページへ
      </Text>
    </TouchableOpacity>
    <View style={{ flexDirection: "row",paddingHorizontal:24 }}>
      {this.renderPageIndex()}
    </View>

    <TouchableOpacity
      disabled={
        disableNextBtn
     }
      style={{
       borderTopRightRadius:16,
       borderBottomRightRadius:16,
       paddingHorizontal:10,
        justifyContent: "center",
        flexDirection: "row",
        justifyContent: "center",
        right: 16,
        alignItems: "center",
        backgroundColor:disableNextBtn ? "#F19B9F": APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1
      }}
      onPress={this.onNextPress}
    >
      <Text
        style={{
          color: COLOR_WHITE,
          fontSize: 10,
          fontWeight: "bold",
          paddingHorizontal:20
        }}
      >
        次のページへ
      </Text>
      <View>
        <AntDesign name="right" size={15} color={COLOR_WHITE} />
      </View>
    </TouchableOpacity>
  </View>
    )
  }
}
