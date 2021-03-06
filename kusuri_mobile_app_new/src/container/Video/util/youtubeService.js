export const getImageWithLinkYouTube = (link) => {
  let video_id = link.split("v=")[1];
  const ampersandPosition = video_id.indexOf("&");
  if (ampersandPosition !== -1) {
    video_id = video_id.substring(0, ampersandPosition);
  }
  return `https://img.youtube.com/vi/${video_id}/default.jpg`;
};
export const getIDWithLinkYouTube = (link) => {
  let video_id = link.split("v=")[1];
  const ampersandPosition = video_id.indexOf("&");
  if (ampersandPosition != -1) {
    video_id = video_id.substring(0, ampersandPosition);
  }
  return video_id;
};
