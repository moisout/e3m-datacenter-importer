export interface DateClass {
  actionStatus: boolean;
  data: DatumData;
}

export interface DatumData {
  subitems: Subitem[];
  title: string;
}

interface Subitem {
  data: SubitemData;
  layersCode?: string;
  kind: string;
  plotareaId: number;
  legendDivId: string;
  legendCode: string;
  idx: number;
}

interface SubitemData {
  plotOptions: PlotOptions;
  yAxis: YAxis;
  xAxis: XAxi[];
  exporting: Credits;
  credits: Credits;
  series: Series[];
  legend: Legend;
  subtitle: Subtitle;
  tooltip: DataTooltip;
  title: DataTitle;
  chart: Chart;
}

interface Chart {
  borderRadius: number;
  zoomType: string;
  width: number;
  height: number;
}

interface Credits {
  enabled?: boolean;
}

interface Legend {
  layout: string;
  useHTML: boolean;
  labelFormat: string;
  width: number;
}

interface PlotOptions {
  column?: Column;
}

interface Column {
  pointPlacement?: string;
  pointRange?: number;
  stacking?: string;
}

interface Series {
  color: string;
  shadow: boolean;
  data: (number | null)[][];
  tooltip: SeriesTooltip;
  index: number;
  type: string;
  lineWidth: number;
  yAxis: number;
  marker: Credits;
  name: string;
  usernotes: string;
  step?: string;
  id: string;
  legendIndex: number;
  showInLegend: boolean;
  xAxis?: string;
}

interface SeriesTooltip {
  valueDecimals: number;
  pointFormat?: string;
  valueSuffix: string;
}

interface Subtitle {}

interface DataTitle {
  text: null;
}

interface DataTooltip {
  headerFormat: string;
  valueDecimals: number;
  pointFormat: string;
  dateTimeLabelFormats: Subtitle;
  style: Style;
  xDateFormat: string;
}

interface Style {
  cursor: string;
  whiteSpace: string;
  width: string;
}

interface XAxi {
  min?: number;
  max?: number;
  minTickInterval?: number;
  dateTimeLabelFormats: DateTimeLabelFormats;
  type?: string;
  id?: string;
  linkedTo?: number;
  minorTickLength?: number;
  tickLength?: number;
  lineColor?: string;
  minorGridLineWidth?: number;
  lineWidth?: number;
  labels?: Credits;
  categories?: string[];
}

interface DateTimeLabelFormats {
  week: string;
  hour: string;
  month: string;
  year: string;
  day: string;
}

interface YAxis {
  startOnTick: boolean;
  endOnTick: boolean;
  plotLines: any[];
  title: YAxisTitle;
  showEmpty: boolean;
  labels: Labels;
  min?: number;
}

interface Labels {
  format: string;
}

interface YAxisTitle {
  margin?: number;
  text: string | null;
}
