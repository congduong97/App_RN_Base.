run code push
changeKey roi day
  -staging 
    ios: appcenter codepush release-react -a Yakuodo-Co./Yaukudo-IOS -d Staging -m
    android: appcenter codepush release-react -a Yakuodo-Co./Yakuodo-Android -d Staging -m
 -product
    ios: appcenter codepush release-react -a Yakuodo-Co./Yaukudo-IOS -d Production -m
    android: appcenter codepush release-react -a Yakuodo-Co./Yakuodo-Android -d Production -m
login
    7802 0014 2868 1536
    123456

version codepush :
ios -v11  