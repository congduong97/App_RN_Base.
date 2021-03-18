package eddystone;

public class AppInfo {
    public static AppInfo instance = null;
    private String deviceId = "";
    private String accessToken = "";
    private String url = "";
    private String namespace = "";
    private String memberCode = "";

    public static AppInfo getInstance() {
        if (instance == null) {
            instance = new AppInfo();
        }
        return instance;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getUrl() {
        return url;
    }

    public void setNamespace(String namespace) {
        this.namespace = namespace;
    }

    public String getNamespace() {
        return namespace;
    }

    public void setMemberCode(String memberCode) {
        this.memberCode = memberCode;
    }

    public String getMemberCode() {
        return memberCode;
    }
}
