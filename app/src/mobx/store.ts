import { configure } from "mobx";
import MockViewModel from "src/viewModel/mockViewModel";
import ViewModel, { IDefaultProps } from "src/viewModel/viewModel";

const isServer = typeof window === "undefined";

let store: any = null;
configure({ enforceActions: "observed" });

export class RootStore {
  //public 뷰모델네임 : 뷰모델타입;

  public viewModel: ViewModel;
  public mockViewModel: MockViewModel;

  constructor(initialData: IDefaultProps) {
    const initData = Object.assign(initialData, { initialData });
    //this.뷰모델네임 = new 뷰모델(initData);

    this.viewModel = new ViewModel(initData);
    this.mockViewModel = new MockViewModel(initData);
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
