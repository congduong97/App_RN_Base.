import {getLanguages} from 'react-native-i18n';
import {STRING} from '../../const/String';

export const setI18n = async () => {
  await getLanguages().then(languages => {
    if (languages[0].search('ja') === -1) {
      STRING.advanced = 'Advanced';
      STRING.countless_time = 'Countless time';
      STRING.join_event = 'Join Event';
      STRING.need_enable_permission = 'You need enable permission';
      STRING.type_zip_code = 'Zip Code (type is XXX-XXXX ,X is number';
      STRING.email_and_sub_email_can_not_be_duplicated =
        'Email and sub email can not be duplicated';
      STRING.status_of_residence = 'Status of residence';
      STRING.birth_day = 'Birthday';
      STRING.gender = 'Gender';
      STRING.job = 'Job';
      STRING.no_by_empty = 'No by empty';
      STRING.zip_code_has_minimum_7_number = 'Zip code has minimum 7 number';
      STRING.history_of_using_coupons = 'History of using coupons';
      STRING.term_if_use = 'Term of use';
      STRING.contact_to_company = 'Contact to company';
      STRING.login = 'Login';
      STRING.log_out = 'Log out';
      STRING.register = 'Register';
      STRING.end_of_login_session_please_log_in_again =
        'End of login session please log in again';
      STRING.cancel = 'Cancel';
      STRING.ok = 'Ok';
      STRING.email = 'Email';
      STRING.password = 'Password';
      STRING.forgot_password = 'Forgot password';
      STRING.see_more = 'VIEW ALL';
      STRING.send = 'Send';
      STRING.send_confirmation_successful = 'Send confirmation_successful';
      STRING.we_have_sent_a_confirmation_code_to_your_registration_email_please =
        'We have sent a confirmation code to your registration email please';
      STRING.error_not_type_email = 'Error not type email';
      STRING.error_password_confirm = 'Error password confirm';
      STRING.error_password_validation = 'Passwords must be text and number';
      STRING.type_password =
        'Passwords must be text , number  and minimum 8 characters ';
      STRING.code = 'Code';
      STRING.code_coupon = 'Code coupon';
      STRING.name = 'Name';
      STRING.email_already_exits = 'Email already exits';
      STRING.an_error_occurred = 'An error occurred';
      STRING.please_check_email_and_confirm_account =
        'Please check email and confirm account';
      STRING.please_try_again_later = 'Please try again later';
      STRING.sign_up_success = 'Sign up success';
      STRING.notification = 'Notification';
      STRING.notification_important = 'Notification important';
      STRING.network_error_try_again_later = 'Network error try again later';
      STRING.catalog_near_you = 'Catalog near you';
      STRING.my_bookmark = 'My bookmark';
      STRING.use_now = 'Use now';
      STRING.used = 'Used';
      STRING.detail = 'Detail';
      STRING.search = 'Search';
      STRING.store_near_you = 'Store near you';
      STRING.search_stores = 'Search stores';
      STRING.category = 'Category';
      STRING.phone = 'Phone';
      STRING.or_adress = 'Or adress';
      STRING.all = 'All';
      STRING.member_only = 'Member only';
      STRING.shop_only = 'Shop only';
      STRING.store = 'Store';
      STRING.video = 'Video';
      STRING.catalog = 'Catalog';
      STRING.setting = 'Setting';
      STRING.coupon = 'Coupon';
      STRING.go_back = 'Go back';
      STRING.agree_start_now = 'Agree start now';
      STRING.skipp = 'Skip';
      STRING.title = 'Title';
      STRING.are_you_sure_you_want_to_use_coupon =
        'Are you sure you want to use coupon';
      STRING.are_you_sure_you_want_to_sign_out_of_the_app =
        'Are you sure you want to sign out of the app';
      STRING.the_name_must_be_at_least_two_characters_long =
        'The name must be at least two characters long';
      STRING.email_not_already_exits = 'Email not already exits';
      STRING.wrong_password = 'Wrong password';
      STRING.do_not_have_an_account = 'Do not have an account';
      STRING.register_now = 'Register now';
      STRING.change_your_new_password_successfully =
        'Change your new password successfully';
      STRING.new_password_change_failed = 'New password change failed';
      STRING.confirmation_code_is_incorrect = 'Confirmation code is incorrect';
      STRING.please_re_enter_the_confirmation_code_that_was_sent_to_your_email =
        'Please re enter the confirmation code that was sent to your email';
      STRING.new_password = 'New password';
      STRING.confirm_password = 'Confirm password';
      STRING.please_login_to_use = 'Please login to use';
      STRING.go_to_catalog = 'Go to catalog';
      STRING.view_on_map = 'View on map';
      STRING.call_now = 'Call now';
      STRING.note = 'Note';
      STRING.catalog_in_store = 'Catalog in store';
      STRING.coupon_detail = 'Coupon detail';
      STRING.notification_detail = 'Notification detail';
      STRING.push_notification = 'Push_notification';
      STRING.please_sign_in_to_use_the_coupon =
        'Please sign in to use the coupon';
      STRING.register_member = 'Register member';
      STRING.push_notification_detail = 'Push notification detail';
      STRING.once_time_per_day = 'Once time per day';
      STRING.only_used_once = 'Only used once';
      STRING.day_off = 'Day off';
      STRING.work_time = 'Work time';
      STRING.detail_store = 'Detail store';
      STRING.time = 'Time';
      STRING.use = 'Use';
      STRING.shop = 'Shop';
      STRING.password_has_minimum_8_characters =
        'Password has minimum 8 characters';
      STRING.used_coupon = 'Used coupon';
      STRING.local = 'Local';
      STRING.zip_code = 'Zip code';
      STRING.date_work = 'Date work';
      STRING.date_off = 'Date off';
      STRING.please_select_a_time_less_than_the_current_time =
        'Please select a time less than the current time';
      STRING.sub_email = 'Sub email';
      STRING.sub_email_already_exits = 'Sub email already exits';
      STRING.need_enable_enable_location = 'Peed enable location always';
      STRING.permission = 'Permission';
      STRING.need_enable_notification =
        'Please turn on notification to receive notification';
      STRING.got_cha = 'Gotcha';
      STRING.congratulation = 'Congratulation';
      STRING.reward_description =
        'Your reward is tranferred to the coupon screen';
      STRING.go_to_coupon = 'Go to coupon';
      STRING.wrong_password_or_email = 'Wrong account or password';
      STRING.status_network_error = 'Network request failed';
      STRING.status_system_overload = 'System overload';
    }
  });
};
