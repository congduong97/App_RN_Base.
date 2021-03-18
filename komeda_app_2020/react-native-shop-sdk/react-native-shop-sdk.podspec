require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-shop-sdk"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-shop-sdk
                   DESC
  s.homepage     = "https://github.com/github_account/react-native-shop-sdk"
  s.license      = "MIT"
  # s.license    = { :type => "MIT", :file => "FILE_LICENSE" }
  s.authors      = { "Your Name" => "yourname@email.com" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/github_account/react-native-shop-sdk.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,swift}"
  s.requires_arc = true

  s.dependency "React"
  s.vendored_libraries = 'libsdk-advertise.a'
  s.ios.vendored_frameworks = 'Frameworks/libsdk-advertise.a'
  s.vendored_frameworks = 'libsdk-advertise.a'

  # ...
  # s.dependency "..."
end

