export default class TableModel {
  public title: string = "";
  public column?: string = "";
  public align: "left" | "center" | "right" | "justify" | "char" | undefined =
    "left";
  public size?: string | number = "";
  public rowSpan?: boolean = false;
  public isSort?: boolean = false;
  public isDescription?: boolean = false;
}
