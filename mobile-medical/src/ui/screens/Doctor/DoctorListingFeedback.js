import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";
import { ScreensView } from "../../../components";
import API from "../../../networking";
import { useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { Dimension } from "../../../commons";
import { CommentItem } from "./CommentItem";

let noMoreData = false;

export default function DoctorListingFeedback() {
  const route = useRoute();
  const dispatch = useDispatch();
  const doctorId = route?.params?.doctorId;
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (doctorId) {
      getFeedbacks();
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (page > 0) {
      getFeedbacks();
    }
  }, [page]);

  const getFeedbacks = async () => {
    const params = {
      page,
      size: 10,
      doctorId,
    };
    let feedbacksResponse = await API.getDoctorFeedbacks(dispatch, params);
    if (feedbacksResponse.length < 10) {
      noMoreData = true;
    }
    if (isLoading) {
      setIsLoading(false);
    }
    setComments([...comments, ...feedbacksResponse]);
  };

  const onEndReached = () => {
    if (!noMoreData) {
      setPage(page + 1);
    }
  };

  const renderItem = ({ item, index }) => {
    return <CommentItem item={item} />;
  };

  return (
    <ScreensView
      isScroll={false}
      styleContent={styles.container}
      titleScreen={"Danh sách nhận xét"}
    >
      <FlatList
        syle={{ flex: 1 }}
        data={comments}
        renderItem={renderItem}
        extraData={comments}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </ScreensView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Dimension.padding2x,
    backgroundColor: "white",
    paddingHorizontal: Dimension.padding2x,
    paddingBottom: 150,
  },
});
