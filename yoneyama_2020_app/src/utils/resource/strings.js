const CHECK_LOGIC = {
  listFeature: {
    INFORMATION: 'Information',
    EVENT: 'Event',
    COUPON: 'Coupon',
    NEARBY_ACTIVITY: 'Activity',
    FLOOR_GUIDE: 'FloorGuide',
    SHOP_GUIDE: 'ShopGuide',
    SUB_MENU: 'SubMenu',
    SHOP: 'ShopDetail',
    PUSH_NOTIFICATION: 'Notification',
    FACILITY_INFORMATION_MENU: 'FacilityInformation',
    LIST_FOLLOW_SHOP: 'ShopGuide',
    DISPLAY_MEMBER_CARD: 'PointMember',
  },
};

const STRINGS_VN = {};
const STRINGS_JAPANESE = {
  //common string
  server_error: 'サーバーエラーです。',
  network_error: 'インターネットに接続していません。',
  reload: 'リロード',
  no_data: 'データがありません。',
  this_field_is_required: '本項目は必須です。',
  next: 'つぎへ',
  home: 'ホーム',
  notification: 'お知らせ',
  confirm: '認証',
  cancel: 'キャンセル',
  release: '解除',
  //validate string
  invalid: 'このフィールドは無効です',
  pass_not_match: 'パスワードが統一していません。',
  phone_not_match: '携帯電話番号が統一していません。',
  not_match: 'not match',
  password_only_include_letter_and_number_between_8_and_32_characters:
    '8文字以上32文字以内で入力してください。',
  phone_number_contain_10_numbers_and_only_numbers: '11桁で入力してください。',
  only_contain_number: '数字で入力してください。',
  validate_zip_code_strings: '郵便番号は7桁数字で入力してください。',
  Email_error: 'メールアドレスのフォーマットが正しくありません。',
  please_login_to_use_this: '本機能が使えるようにログインしてください。',
  please_try_again_later:
    'ただいま大変混み合っております。しばらく経ってから再度お試しください。',

  unfollow_shop: 'お気に入り解除',
  you_wanna_unfollow: 'この店舗をお気に入り解除しますか?',
  something_wrong: 'エラーが発生しました。もう一度やり直してください。',
  intro_page_1_title_h1: '最新情報や限定クーポンをいち早くGET！',
  intro_page_2_title_h1: 'アプリを開けばすぐにポイントが確認でき便利！',
  intro_page_3_title_h1:
    'セール・イベント情報お子様向け情報などプッシュ通知でお届け',
  intro_page_4_title_h1:
    'お気に入り登録施設に近づいた場合のみ情報のお届けや、近くの施設検索に位置情報を使用します。',

  intro_page_1_title_h2:
    'イベントや期間限定情報をタイムリーにお届け。クーポンでお得にお買い物をご利用いただけます。',
  intro_page_2_title_h2:
    '初回のみ会員連携を行えばID、パスワードを入力する手間なくポイント確認できます。',
  intro_page_3_title_h2:
    '通知は端末の設定からいつでも変更できますので、許可をオススメしています。',
  intro_page_4_title_h2:
    '位置情報は端末の設定からいつでもオフにできますので、許可をオススメしています。',

  see_detail: '詳細を表示する',
  check_member_card: '会員証チェック表示',
  member_information: '会員情報',
  top: 'トップ',
  digital_member_card: 'デジタル会員証',
  shop_guide: 'ショップガイド',
  mall_information: '施設情報',
  event: 'イベント',
  menu: 'More',
  follow: 'お気に入り',
  favorite: 'お気に入り',
  validate_pass: '数字、英字をそれぞれ1文字以上含めてください。',
};
const STRINGS_ENGLISH = {
  start: 'Start',
  previous: 'Previous',
  next: 'next',
  home: 'Home',
  follow: 'Follow',
  favorite: 'Favorite',
  notification: 'Notif',
  language: 'Language',
  see_detail: 'See detail',
  check_member_card: 'Check member card',
  member_information: 'Member information',
  top: 'Top',
  digital_member_card: 'digital member card',
  shop_guide: 'shop guide',
  mall_information: 'mall information',
  event: 'event',
  menu: 'Menu',
};

const LANGUAGE_LIST = [
  {code: 'ja', value: 'Japanese'},
  {code: 'en', value: 'English'},
  {code: 'vn', value: 'Việt Nam'},
  {code: 'ko', value: 'Korean'},
];

// let language;
const STRINGS = {
  ...STRINGS_VN,
  ...STRINGS_ENGLISH,
  ...STRINGS_JAPANESE,
};

const settingLanguage = async (initLanguage) => {};

settingLanguage();

export {STRINGS, LANGUAGE_LIST, CHECK_LOGIC};
