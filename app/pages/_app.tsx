import { Provider } from "mobx-react";
import authInstance from "modules/auth.module";
import App from "next/app";
import { NextRouter, withRouter } from "next/router";
import "reflect-metadata";
import initializeStore, { RootStore } from "src/mobx/store";
import { IDefaultProps } from "src/viewModel/default.viewModel";
import "styles/globals.css";

class MyApp extends App<any, any, any> {
  public mobxStore: RootStore;
  public router: NextRouter;

  static async getInitialProps(appContext: any) {
    const appProps = await App.getInitialProps(appContext);
    const headers =
      typeof window === "undefined"
        ? appContext.ctx.req.headers
        : window.navigator?.userAgent;
    return {
      ...appProps,
      headers: headers,
    };
  }

  constructor(props: IDefaultProps) {
    super(props);
    this.router = props.router;
    this.state = {
      isMount: false,
    };
    this.setState = this.setState.bind(this);

    this.mobxStore = initializeStore({
      headers: props.headers,
      host: props.headers.host,
      userAgent: props.headers["user-agent"],
      router: props.router,
    });
  }

  async componentDidMount() {
    const initialize = async () => {
      window.localStorage.sender = `/admin/id:${new Date().getTime()}`;
      this.mobxStore.viewModel.popAuth();
      if (!authInstance.isLogin() && this.props.router.pathname !== "/login") {
        await this.props.router.push("/login");
      }
    };

    await initialize().then(() => {
      this.setState({ isMount: true });
    });
  }

  render() {
    const { Component, pageProps, headers } = this.props;

    if (this.state.isMount)
      return (
        <Provider {...this.mobxStore}>
          <Component
            {...pageProps}
            headers={headers}
            version={process.env.NEXT_PUBLIC_VERSION}
            router={this.router}
          />
        </Provider>
      );
  }
}

export default withRouter(MyApp);
