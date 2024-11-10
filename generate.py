from steamguard import SteamMobile, LoginConfirmType

user = input("Enter your username > ")
password = input("Enter your password > ")

mobile = SteamMobile(user, password)

mobile.get_steampowered()
mobile.get_steamcommunity()

code_type = mobile.login()

if code_type == LoginConfirmType.none:
    mobile.confirm_login()

elif code_type == LoginConfirmType.email:
    email_code = input('Enter Steam Guard Code Email > ')
    mobile.confirm_login(email_code)

elif code_type == LoginConfirmType.mobile:
    mobile_code = mobile.generate_steam_guard_code() or input('Enter Steam Guard Code Mobile > ')
    mobile.confirm_login(mobile_code)

data = mobile.export()
mobile.save_exported_data(data, f'{mobile.account_name}_cookies.json')

mobile.add_mobile_auth()

# SAVE data_mobile! If you lose it, you'll lose access to your account!
data_mobile = mobile.export_mobile()
mobile.save_exported_data(data_mobile, f'{mobile.account_name}_mobile.json')

email_code_confirm = input('Email Code Confirm > ')
mobile.add_mobile_auth_confirm(email_code_confirm)

