package eddystone;

public class Beacon {
    public String namespace = "";
    public String instance = "";
    public long lastDetectedTimestamp = 0;

    public Beacon(String namespace, String instance, long lastDetectedTimestamp) {
        this.namespace = namespace;
        this.instance = instance;
        this.lastDetectedTimestamp = lastDetectedTimestamp;
    }

    public String getInstance() {
        return instance;
    }

    public String getNamespace() {
        return namespace;
    }

    public long getLastDetectedTimestamp() {
        return lastDetectedTimestamp;
    }
}
