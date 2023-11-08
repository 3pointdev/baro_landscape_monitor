import AuthDto from "src/dto/auth/auth.dto";

class AuthModule {
  public saveStorage(user: AuthDto) {
    window.localStorage.setItem("account", user.account);
    window.localStorage.setItem("token", user.token);
    window.localStorage.setItem("enterprise", user.enterprise);
    window.localStorage.setItem("enterprise_id", user.enterpriseId.toString());
    window.localStorage.setItem("name", user.name);
  }

  public destroyStorage() {
    window.localStorage.clear();
    window.location.replace("/login");
  }

  public isLogin() {
    return window.localStorage.token !== undefined;
  }
}
const authInstance = new AuthModule();
export default authInstance;
