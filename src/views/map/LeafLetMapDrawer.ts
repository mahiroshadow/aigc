import * as L from 'leaflet'
class MapDrawer {
  private _map: L.Map
  constructor(mountedDom: HTMLDivElement) {
    this._map = this.mapInit(mountedDom)
  }

  /**
   * 初始化地图信息
   * @param
   **/
  mapInit(mountedDom: HTMLDivElement) {
    return L.map(mountedDom, {
      attributionControl: false,
      crs: L.CRS.Simple
    }).setView([0, 0], 5)
  }
  /**
   * 添加多边形数据
   * @param
   **/
  addPolygon(polygon: L.LatLngExpression[], color?: string) {
    L.polygon(polygon, { color: color || 'black' }).addTo(this._map)
  }
}

export { MapDrawer }
