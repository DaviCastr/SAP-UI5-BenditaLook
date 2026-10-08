const LOCAL_HOSTS = ["localhost", "127.0.0.1"];

export default class Environment {

    public static isLocal(): boolean {
        return LOCAL_HOSTS.includes(window.location.hostname);
    }

}
