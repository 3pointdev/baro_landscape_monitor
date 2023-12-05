import { CuttingEdgeType } from "config/constants";

export default class DataModel {
  public x: number = 0;
  public z: number = 0;
  public block: string = "";
  public isCutting: boolean = false;
  public cutEdge: CuttingEdgeType = CuttingEdgeType.OUTSIDE;
  public xLoad: number = 0;
  public zLoad: number = 0;
}
