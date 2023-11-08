import { configure } from "mobx";
import DefaultViewModel, {
  IDefaultProps,
} from "src/viewModel/default.viewModel";
import ViewModel from "src/viewModel/viewModel";

const isServer = typeof window === "undefined";

let store: any = null;
configure({ enforceActions: "observed" });

export class RootStore {
  //public 뷰모델네임 : 뷰모델타입;
  public defaultViewModel;
  public viewModel: ViewModel;

  constructor(initialData: IDefaultProps) {
    const initData = Object.assign(initialData, {});
    //this.뷰모델네임 = new 뷰모델(initData);
    this.defaultViewModel = new DefaultViewModel(initData);
    this.viewModel = new ViewModel(initData);
  }
}

export default function initializeStore(initData: IDefaultProps) {
  if (isServer) {
    return new RootStore(initData);
  }
  if (store === null) {
    store = new RootStore(initData);
  }

  return store;
}
