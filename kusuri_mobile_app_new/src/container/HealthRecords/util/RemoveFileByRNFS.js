import RNFS from "react-native-fs";
const removeFile = async (filepath) => {
  RNFS.exists(filepath)
    .then((result) => {
      if (result) {
        RNFS.unlink(filepath)
          .then(() => {
            console.log("Xóa thành công file csv.");
          })
          .catch(async (err) => {
            console.log("Lỗi  xóa file", err);
          });
      }
    })
    .catch((err) => {
      console.log("Lỗi  xóa file", err);
    });
};

const removeListFile = async (listFile) => {
  if (Array.isArray(listFile) && listFile.length > 0) {
    listFile.forEach((file) => {
      console.log("file:", file);
      if (file && file.filepath) {
        RNFS.exists(filepath)
          .then((result) => {
            if (result) {
              RNFS.unlink(filepath)
                .then(() => {})
                .catch(async (err) => {});
            }
          })
          .catch((err) => {});
      }
    });
  }
};

export { removeFile, removeListFile };
