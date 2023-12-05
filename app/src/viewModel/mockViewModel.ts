import { plainToInstance } from "class-transformer";
import { CuttingEdgeType } from "config/constants";
import { action, makeObservable, observable, runInAction } from "mobx";
import { NextRouter } from "next/router";
import DataModel from "src/model/data.model";

export interface IDefaultProps {
  headers: any;
  host: string;
  router: NextRouter;
  userAgent: string;
}

export default class MockViewModel {
  public renderData: DataModel = new DataModel();
  public beforeData: DataModel = new DataModel();
  public dataList: DataModel[] = [new DataModel()];

  constructor(props: IDefaultProps) {
    makeObservable(this, {
      renderData: observable,
      beforeData: observable,
      dataList: observable,

      processingData: action,
      setBinarySingleData: action,
      cutExtract: action,
      dataReset: action,
    });
  }

  processingData = async (mockData) => {
    let data = await this.setBinarySingleData(mockData);

    runInAction(() => {
      this.beforeData = this.renderData;
      this.renderData = data;
    });

    if (data.isCutting) {
      let dataList = [...this.dataList];

      if (data.cutEdge !== CuttingEdgeType.FRONT_SIDE) {
        const findCondition = (loopTarget): string | boolean => {
          if (
            loopTarget.z < data.z
              ? Math.abs(loopTarget.z - data.z) >= 0.1
              : Math.abs(loopTarget.z - data.z) >= 0.4
          )
            return false;

          if (data.cutEdge === CuttingEdgeType.OUTSIDE) {
            if (loopTarget.x > data.x) return "modify";
          } else {
            if (loopTarget.x <= data.x) return "delete";
          }

          return false;
        };

        for (let i = 0; i < dataList.length; i++) {
          const loopTarget = dataList[i];
          if (findCondition(loopTarget) === "delete") {
            dataList.splice(i, 1);
            i--;
          } else if (findCondition(loopTarget) === "modify") {
            dataList[i] = plainToInstance(DataModel, {
              ...data,
              z: loopTarget.z,
              block: loopTarget.block,
            });
          }
        }
      }

      const isDataListLengthValid =
        dataList.length <= 1 ||
        (Math.abs(this.beforeData.x - data.x) < 0.7 &&
          Math.abs(this.beforeData.z - data.z) < 0.7);

      if (isDataListLengthValid) {
        dataList.push(data);
      }

      runInAction(() => {
        this.dataList = dataList;
      });
    }
  };

  setBinarySingleData = async (mockData) => {
    const position = mockData?.path_position?.split(" ") || [];
    const block = mockData?.block;
    const xLoad = mockData?.Xload;
    const zLoad = mockData?.Zload;

    let data: DataModel = { ...this.renderData };

    const lastData = this.dataList[this.dataList.length - 1];

    if (position.length > 0) {
      data = {
        ...data,
        x: Math.floor(+position[0] * 10) / 100,
        z: Math.floor(+position[2] * 10) / 100,
      };
      if (
        this.beforeData.isCutting &&
        data.isCutting &&
        Math.abs(this.beforeData.z - data.z) < 0.1
      ) {
        data.cutEdge = CuttingEdgeType.FRONT_SIDE;
      } else if (Math.floor(+position[0] * 10) / 100 < 9) {
        data.cutEdge = CuttingEdgeType.INSIDE;
      } else {
        data.cutEdge = CuttingEdgeType.OUTSIDE;
      }
    } else {
      data = {
        ...data,
        x: +lastData?.x,
        z: +lastData?.z,
      };
    }

    if (block) {
      data = this.cutExtract(data, block);
    } else {
      data = {
        ...data,
        block: lastData?.block,
      };
    }

    if (xLoad) {
      data = { ...data, xLoad: +xLoad };
    } else {
      data = {
        ...data,
        xLoad: +lastData?.xLoad,
      };
    }

    if (zLoad) {
      data = { ...data, zLoad: +zLoad };
    } else {
      data = {
        ...data,
        zLoad: +lastData?.zLoad,
      };
    }

    return data;
  };

  cutExtract = (data: DataModel, block: string): DataModel => {
    const cuttingRegex = /^G(?:0[1-3]|[1-3])(?![0-9])[\s\S]*$/;
    const functionRegex = /^N\d{3}.*/;
    const moveRegex = /^[XZUW]/;
    const programRegex = /^O\d{4}/;
    const isCuttingCode = cuttingRegex.test(block) || functionRegex.test(block);

    // if (programRegex.test(block)) location.reload();

    if (isCuttingCode) {
      data.isCutting = true;
    } else {
      const isMoveCode = moveRegex.test(block);

      if (
        this.dataList[this.dataList.length - 1]?.isCutting &&
        isMoveCode &&
        +data.z <= 0.01
      ) {
        data.isCutting = true;
      } else {
        data.isCutting = false;
      }
    }

    data = { ...data, block: block };
    return data;
  };

  public dataReset = () => {
    runInAction(() => {
      this.renderData = new DataModel();
      this.beforeData = new DataModel();
      this.dataList = [new DataModel()];
    });
  };
}
