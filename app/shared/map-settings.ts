export class MapSettings {
  public static popupContent = {
    content:
      // tslint:disable-next-line:max-line-length
      "<div id ='main-div' style ='width:100%;position: absolute;top: 37px;right: -1px;bottom: auto;z-index: 1000;box-shadow: 0 0 4px 1px rgba(0,0,0,.4);background-color: #dcdcdc;pointer-events: visiblePainted;pointer-events: auto;overflow: auto;display: flex;align-items: stretch;'>" +
      '<div></div>' +
      "<div style ='box-sizing: border-box;flex-basis: 100%;width:100%;'>" +
      "<div style = 'padding: 0;margin: 0;width: 100%;box-shadow: 0 2px 4px 0 rgba(0,0,0,.5);'>" +
      "<div style = 'height: 40px;color: #fff;background-color: #000;padding: 9px 30px 0 10px;width: 100%;   position: relative;'>" +
      "<div id='headerName' style = 'overflow: hidden;text-overflow: ellipsis;white-space: nowrap;max-width: 210px;  float: left;'>{name}</div>" +
      "<div style = 'max-width: 140px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;   float: right;'>" +
      "<span style = 'color: #dcdcdc;' id='lastUpdate'>{lastUpdate}</span>" +
      '</div>' +
      // tslint:disable-next-line:max-line-length
      "<div style = 'position: absolute;cursor: pointer;top: 0;right: 0;width: 34px;height: 38px;display: -ms-flexbox;display: flex;justify-content: center;'>" +
      // tslint:disable-next-line:max-line-length
      // '<div id="closeicon" style="margin-bottom: 3px;">X</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      "<div style = 'padding: 8px;width: 100%;'>" +
      "<div style = 'min-height: 100px;position: relative;display: block;width: 100%;'>" +
      "<div style='visibility: inherit;display: block;height: 100%;'>" +
      "<div style='background-color: #fff;box-shadow: 0 2px 2px 0 rgba(0,0,0,.24), 0 0 2px 0 rgba(0,0,0,.12);margin-bottom: 10px;'>" +
      "<div style ='max-width: 100%;height: 64px;position: relative;'>" +
      "<div style = 'padding-right: 14px;padding-left: 14px;margin: 15px 0;width: 75px;height: 34px; font-size: 15px;font-weight: 700;text-transform: uppercase;text-align: center;float: left;'>" +
      "<img id='imgName' alt='truck' src='{imgName}'>" +
      '</div>' +
      "<div style = 'padding-top: 13px; overflow: hidden; float: left;width:52%;'>" +
      // tslint:disable-next-line:max-line-length
      "<div style='touch-action: none; user-select: none;color: #000;font-weight: 700;font-size: 15px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;'> <span  id='bodyName'>{name}</span> <img id='cfvImg' src='{cfvIcon}'></div>" +
      // tslint:disable-next-line:max-line-length
      "<div id='vDetail' style='touch-action: none; user-select: none;font-size: 12px;color: #4c4c51;margin-bottom: 10px;white-space: nowrap;max-width: 170px;text-overflow: ellipsis;    overflow: hidden;'>" +
      '{brand} {model} | {serialNumber}' +
      '</div>' +
      '</div>' +
      "<div style = 'width: 80px;float: right;padding-top: 20px;display:inline-flex;position:absolute;margin-left: 5px;    white-space: nowrap;text-overflow: ellipsis;overflow: hidden;'>" +
      "<div id='statusColor' style = 'width: 14px;height: 14px;overflow: hidden;position: relative;border-radius:50%;background-color:{statusColor}'>" +
      '</div>' +
      "<div id='status' style = 'color: {statusColor};font-size: 12px;font-weight: 700;padding-left:5px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;'>{status}</div>" +
      '</div>' +
      "<div style = 'position: absolute;width: calc(100% - 28px);height: 2px;background-color: #dcdcdc;left: 14px;right: 14px;bottom: 0;'>" +
      '</div>' +
      '</div>' +
      // tslint:disable-next-line:max-line-length
      "<div style = 'height: 64px;padding: 14px;background-color: #fff;width: 100%;display: flex;justify-content:space-between;align-items: center;text-align: center;'>" +
      "<div style = 'max-width: 33%;width: 33%;flex-basis: 33%; color:#000;'>" +
      "<div style = 'font-size: 12px;font-weight:800;padding-bottom:7px;'>{engHoursText}</div>" +
      "<div style = 'white-space: nowrap;overflow: hidden;text-overflow: ellipsis;font-weight: 500;'>" +
      "<span id='engHours' style = 'font-size: 24px;font-weight:600;'>{engHours}</span>" +
      '</div>' +
      '</div>' +
      "<div style = 'flex-shrink: 0;max-width: 33%;width: 33%; flex-basis: 33%;color:#000;'>" +
      "<div style = 'font-size: 12px;font-weight:800;padding-bottom:7px'>{fuelLevelText}</div>" +
      "<div style = 'white-space: nowrap;overflow: hidden;text-overflow: ellipsis;font-weight: 500;'>" +
      "<span id='fuelLevel' style = 'font-size: 24px;font-weight:600;'>{fuelLevel}</span>" +
      '</div>' +
      '</div>' +
      "<div  style = 'flex-shrink: 0;max-width: 33%;width: 33%; flex-basis: 33%;color:#000;'>" +
      "<div style = 'font-size: 12px;font-weight:800;padding-bottom:7px'>{currentSpeedText}</div>" +
      "<div style = 'white-space: nowrap;overflow: hidden;text-overflow: ellipsis;font-weight: 500;'>" +
      '<span style = \'font-size: 24px;font-weight:600;\' id="groundSpeed">{groundSpeed}</span><span style="font-size:13px;font-weight:600;" id="speedUnit"></span>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      "<div style = 'position: relative;height: 24px;text-transform: capitalize;color:#000;'>" +
      "<div style = 'float: left;'>{activeAlartTxt}</div>" +
      '</div>' +
      "<div style = 'background-color: #fff;box-shadow: 0 2px 2px 0 rgba(0,0,0,.24), 0 0 2px 0 rgba(0,0,0,.12); margin-bottom: 10px;'>" +
      "<div style = 'display: flex;align-items:center;padding-bottom:7px;'>" +
      "<div style = 'width: 100%;'>" +
      "<div style ='padding:14px'>" +
      '<div id="totalAlerts" style = \'font-size: 12px;color: #707070;text-transform: capitalize;float:left;\'> ' +
      '</div>' +
      '<div style=\'float:right;\'><input type="image" id="alertbut" src="/assets/images/arrow.png" width="22" height="22">' +
      '</div>' +
      '</div>' +
      '</div>' +
      "<div style = 'position: absolute;right: 14px;top: 0;bottom: 0;justify-content: center; font-size: 20px;cursor: pointer;display: flex;align-items: center;'>" +
      // tslint:disable-next-line:max-line-length
      "<span style = 'font-family: cnh-evo-iconfont!important;content: attr(data-icon);font-style: normal!important;font-weight: 400!important;font-variant: normal!important;text-transform: none!important;line-height: 1;'></span>" +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      "<div style = 'display: flex;justify-content: space-between;padding: 8px 0 0 0;'>" +
      '<div id="rmtDiv" style = \'float: left;display:none;width:50%\'>' +
      '<button class="\'remote-but\'" id="remotebut"  style = \'color:#fff; background-color:{brandColor};padding-top:8px;padding-bottom:8px;width: 100%;flex-basis: 100%;\'>' +
      "<span class='mat-button-wrapper' id='rmtSpan'></span>" +
      '</button>' +
      '<input type=hidden id="vId"' +
      ' value="{id}"/>' +
      '</div>' +
      '<div id="vDiv" style = \'float: right;width:100%\'>' +
      '<button class="\'vehicle-but\'" id="vbut"  style = \'color:#fff; background-color:{brandColor};padding-top:8px;padding-bottom:8px;width: 100%;flex-basis: 100%;\'>' +
      "<span class='mat-button-wrapper'> {vehicleDetailsTxt}</span>" +
      '</button>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>'
  };

  public static uniqueValueInfo = [
    {
      value: 'WORKINGTRACTORSCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-in-work-medium.png',
        '#25b03d'
      ),
      size: 50
    },
    {
      value: 'KEYONTRACTORSCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-key-on-medium.png',
        '#e7a603'
      ),
      size: 50
    },
    {
      value: 'IDLETRACTORSCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-idle-medium.png',
        '#f47825'
      ),
      size: 50
    },
    {
      value: 'MOVINGTRACTORSCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-moving-medium.png',
        '#F97C5A'
      ),
      size: 50
    },
    {
      value: 'TRAVELINGTRACTORSCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-travelling-medium.png',
        '#035db1'
      ),
      size: 50
    },
    {
      value: 'OFFTRACTORSCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-engine-off-medium.png',
        '#F97C5A'
      ),
      size: 50
    },
    {
      value: 'WORKINGTRACTORSCASE_IH',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-in-work-medium.png',
        '#25b03d'
      ),
      size: 50
    },
    {
      value: 'KEYONTRACTORSCASE_IH',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-key-on-medium.png',
        '#e7a603'
      ),
      size: 50
    },
    {
      value: 'IDLETRACTORSCASE_IH',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-idle-medium.png',
        '#f47825'
      ),
      size: 50
    },
    {
      value: 'MOVINGTRACTORSCASE_IH',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-moving-medium.png',
        '#F97C5A'
      ),
      size: 50
    },
    {
      value: 'TRAVELINGTRACTORSCASE_IH',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-travelling-medium.png',
        '#035db1'
      ),
      size: 50
    },
    {
      value: 'OFFTRACTORSCASE_IH',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-engine-off-medium.png',
        '#F97C5A'
      ),
      size: 50
    },
    {
      value: 'WORKINGTRACTORSCASE_IHQuadtrac 500',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-in-work-medium.png',
        '#25b03d'
      ),
      size: 50
    },
    {
      value: 'KEYONTRACTORSCASE_IHQuadtrac 500',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-key-on-medium.png',
        '#e7a603'
      ),
      size: 50
    },
    {
      value: 'IDLETRACTORSCASE_IHQuadtrac 500',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-idle-medium.png',
        '#f47825'
      ),
      size: 50
    },
    {
      value: 'MOVINGTRACTORSCASE_IHQuadtrac 500',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-moving-medium.png',
        '#F97C5A'
      ),
      size: 50
    },
    {
      value: 'TRAVELINGTRACTORSCASE_IHQuadtrac 500',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-travelling-medium.png',
        '#035db1'
      ),
      size: 50
    },
    {
      value: 'OFFTRACTORSCASE_IHQuadtrac 500',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-engine-off-medium.png',
        '#F97C5A'
      ),
      size: 50
    },
    {
      value: 'WORKINGTRACTORSCSAGQuadtrac 500',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-in-work-medium.png',
        '#25b03d'
      ),
      size: 50
    },
    {
      value: 'KEYONTRACTORSCSAGQuadtrac 500',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-key-on-medium.png',
        '#e7a603'
      ),
      size: 50
    },
    {
      value: 'IDLETRACTORSCSAGQuadtrac 500',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-idle-medium.png',
        '#f47825'
      ),
      size: 50
    },
    {
      value: 'MOVINGTRACTORSCSAGQuadtrac 500',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-moving-medium.png',
        '#F97C5A'
      ),
      size: 50
    },
    {
      value: 'TRAVELINGTRACTORSCSAGQuadtrac 500',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-travelling-medium.png',
        '#035db1'
      ),
      size: 50
    },
    {
      value: 'OFFTRACTORSCSAGQuadtrac 500',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-engine-off-medium.png',
        '#F97C5A'
      ),
      size: 50
    },
    {
      value: 'WORKINGTRACTORSNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-ccm-in-work-medium.png',
        '#25b03d'
      ),
      size: 50
    },
    {
      value: 'KEYONTRACTORSNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-ccm-key-on-medium.png',
        '#e7a603'
      ),
      size: 50
    },
    {
      value: 'IDLETRACTORSNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-ccm-idle-medium.png',
        '#f47825'
      )
    },
    {
      value: 'MOVINGTRACTORSNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-ccm-moving-medium.png',
        '#F97C5A'
      )
    },
    {
      value: 'TRAVELINGTRACTORSNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-ccm-travelling-medium.png',
        '#035db1'
      )
    },
    {
      value: 'OFFTRACTORSNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-ccm-engine-off-medium.png',
        '#F97C5A'
      )
    },
    {
      value: 'WORKINGTRACTORSNHAGCCM',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-ccm-in-work-medium.png',
        '#25b03d'
      ),
      size: 50
    },
    {
      value: 'KEYONTRACTORSNHAGCCM',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-ccm-key-on-medium.png',
        '#e7a603'
      ),
      size: 50
    },
    {
      value: 'IDLETRACTORSNHAGCCM',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-ccm-idle-medium.png',
        '#f47825'
      )
    },
    {
      value: 'MOVINGTRACTORSNHAGCCM',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-ccm-moving-medium.png',
        '#F97C5A'
      )
    },
    {
      value: 'TRAVELINGTRACTORSNHAGCCM',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-ccm-travelling-medium.png',
        '#035db1'
      )
    },
    {
      value: 'OFFTRACTORSNHAGCCM',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-ccm-engine-off-medium.png',
        '#F97C5A'
      )
    },

    {
      value: 'WORKINGCOMBINESCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-combine-in-work-medium.png',
        '#25b03d'
      ),
      size: 100
    },
    {
      value: 'KEYONCOMBINESCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-combine-key-on-medium.png',
        '#e7a603'
      ),
      size: 100
    },
    {
      value: 'IDLECOMBINESCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-combine-idle-medium.png',
        '#f47825'
      ),
      size: 100
    },
    {
      value: 'MOVINGCOMBINESCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-combine-moving-medium.png',
        '#F97C5A'
      ),
      size: 100
    },
    {
      value: 'TRAVELINGCOMBINESCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-combine-travelling-medium.png',
        '#035db1'
      ),
      size: 100
    },
    {
      value: 'OFFCOMBINESCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-combine-engine-off-medium.png',
        '#F97C5A'
      ),
      size: 100
    },
    {
      value: 'WORKINGCOMBINESNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-flagship-in-work-medium.png',
        '#25b03d'
      ),
      size: 100
    },
    {
      value: 'KEYONCOMBINESNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-flagship-key-on-medium.png',
        '#e7a603'
      ),
      size: 100
    },
    {
      value: 'IDLECOMBINESNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-flagship-idle-medium.png',
        '#f47825'
      )
    },
    {
      value: 'MOVINGCOMBINESNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-flagship-moving-medium.png',
        '#F97C5A'
      )
    },
    {
      value: 'TRAVELINGCOMBINESNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-flagship-travelling-medium.png',
        '#035db1'
      )
    },
    {
      value: 'OFFCOMBINESNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-flagship-engine-off-medium.png',
        '#F97C5A'
      )
    },
    {
      value: 'WORKINGCOMBINESNHAG4WD',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-flagship-in-work-medium.png',
        '#25b03d'
      ),
      size: 100
    },
    {
      value: 'KEYONCOMBINESNHAG4WD',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-flagship-key-on-medium.png',
        '#e7a603'
      ),
      size: 100
    },
    {
      value: 'IDLECOMBINESNHAG4WD',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-flagship-idle-medium.png',
        '#f47825'
      )
    },
    {
      value: 'MOVINGCOMBINESNHAG4WD',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-flagship-moving-medium.png',
        '#F97C5A'
      )
    },
    {
      value: 'TRAVELINGCOMBINESNHAG4WD',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-flagship-travelling-medium.png',
        '#035db1'
      )
    },
    {
      value: 'OFFCOMBINESNHAG4WD',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-flagship-engine-off-medium.png',
        '#F97C5A'
      )
    },
    {
      value: 'WORKINGPT FORAGE HARVESTERNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-forage-harvester-in-work-medium.png',
        '#25b03d'
      ),
      size: 100
    },
    {
      value: 'KEYONPT FORAGE HARVESTERNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-forage-harvester-key-on-medium.png',
        '#e7a603'
      ),
      size: 100
    },
    {
      value: 'IDLEPT FORAGE HARVESTERNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-forage-harvester-idle-medium.png',
        '#f47825'
      )
    },
    {
      value: 'MOVINGPT FORAGE HARVESTERNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-forage-harvester-moving-medium.png',
        '#F97C5A'
      )
    },
    {
      value: 'TRAVELINGPT FORAGE HARVESTERNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-forage-harvester-travelling-medium.png',
        '#035db1'
      )
    },
    {
      value: 'OFFPT FORAGE HARVESTERNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-forage-harvester-engine-off-medium.png',
        '#F97C5A'
      )
    },
    {
      value: 'WORKINGSP SPRAYERSNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-sprayer-guardian-in-work-medium.png',
        '#25b03d'
      ),
      size: 100
    },
    {
      value: 'KEYONSP SPRAYERSNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-sprayer-guardian-key-on-medium.png',
        '#e7a603'
      ),
      size: 100
    },
    {
      value: 'IDLESP SPRAYERSNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-sprayer-guardian-idle-medium.png',
        '#f47825'
      )
    },
    {
      value: 'MOVINGSP SPRAYERSNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-sprayer-guardian-moving-medium.png',
        '#F97C5A'
      )
    },
    {
      value: 'TRAVELINGSP SPRAYERSNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-sprayer-guardian-travelling-medium.png',
        '#035db1'
      )
    },
    {
      value: 'OFFSP SPRAYERSNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-sprayer-guardian-engine-off-medium.png',
        '#F97C5A'
      )
    },
    {
      value: 'WORKINGSP WINDROWERNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-windrower-yellow-in-work-medium.png',
        '#25b03d'
      ),
      size: 100
    },
    {
      value: 'KEYONSP WINDROWERNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-windrower-yellow-key-on-medium.png',
        '#e7a603'
      ),
      size: 100
    },
    {
      value: 'IDLESP WINDROWERNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-windrower-yellow-idle-medium.png',
        '#f47825'
      )
    },
    {
      value: 'MOVINGSP WINDROWERNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-windrower-yellow-moving-medium.png',
        '#F97C5A'
      )
    },
    {
      value: 'TRAVELINGSP WINDROWERNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-windrower-yellow-travelling-medium.png',
        '#035db1'
      )
    },
    {
      value: 'OFFSP WINDROWERNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-windrower-yellow-engine-off-medium.png',
        '#F97C5A'
      )
    },
    {
      value: 'WORKINGSP WINDROWERNHAGRED',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-windrower-yellow-in-work-medium.png',
        '#25b03d'
      ),
      size: 100
    },
    {
      value: 'KEYONSP WINDROWERNHAGRED',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-windrower-yellow-key-on-medium.png',
        '#e7a603'
      ),
      size: 100
    },
    {
      value: 'IDLESP WINDROWERNHAGRED',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-windrower-yellow-idle-medium.png',
        '#f47825'
      )
    },
    {
      value: 'MOVINGSP WINDROWERNHAGRED',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-windrower-yellow-moving-medium.png',
        '#F97C5A'
      )
    },
    {
      value: 'TRAVELINGSP WINDROWERNHAGRED',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-windrower-yellow-travelling-medium.png',
        '#035db1'
      )
    },
    {
      value: 'OFFSP WINDROWERNHAGRED',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-windrower-yellow-engine-off-medium.png',
        '#F97C5A'
      )
    },
    {
      value: 'WORKINGSP GRAPE HARVESTERNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-grape-harvester-in-work-medium.png',
        '#25b03d'
      ),
      size: 100
    },
    {
      value: 'KEYONSP GRAPE HARVESTERNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-grape-harvester-key-on-medium.png',
        '#e7a603'
      ),
      size: 100
    },
    {
      value: 'IDLESP GRAPE HARVESTERNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-grape-harvester-idle-medium.png',
        '#f47825'
      )
    },
    {
      value: 'MOVINGSP GRAPE HARVESTERNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-grape-harvester-moving-medium.png',
        '#F97C5A'
      )
    },
    {
      value: 'TRAVELINGSP GRAPE HARVESTERNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-grape-harvester-travelling-medium.png',
        '#035db1'
      )
    },
    {
      value: 'OFFSP GRAPE HARVESTERNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-grape-harvester-engine-off-medium.png',
        '#F97C5A'
      )
    },
    {
      value: 'WORKINGSUGAR CANE HARVESTERCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-sugarcane-in-work-medium.png',
        '#25b03d'
      ),
      size: 100
    },
    {
      value: 'KEYONSUGAR CANE HARVESTERCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-sugarcane-key-on-medium.png',
        '#e7a603'
      ),
      size: 100
    },
    {
      value: 'IDLESUGAR CANE HARVESTERCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-sugarcane-idle-medium.png',
        '#f47825'
      ),
      size: 100
    },
    {
      value: 'MOVINGSUGAR CANE HARVESTERCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-sugarcane-moving-medium.png',
        '#F97C5A'
      ),
      size: 100
    },
    {
      value: 'TRAVELINGSUGAR CANE HARVESTERCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-sugarcane-travelling-medium.png',
        '#035db1'
      ),
      size: 100
    },
    {
      value: 'OFFSUGAR CANE HARVESTERCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-sugarcane-engine-off-medium.png',
        '#F97C5A'
      ),
      size: 100
    },
    {
      value: 'WORKINGSP WINDROWERCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-windrowers-in-work-medium.png',
        '#25b03d'
      ),
      size: 100
    },
    {
      value: 'KEYONSP WINDROWERCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-windrowers-key-on-medium.png',
        '#e7a603'
      ),
      size: 100
    },
    {
      value: 'IDLESP WINDROWERCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-windrowers-idle-medium.png',
        '#f47825'
      ),
      size: 100
    },
    {
      value: 'MOVINGSP WINDROWERCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-windrowers-moving-medium.png',
        '#F97C5A'
      ),
      size: 100
    },
    {
      value: 'TRAVELINGSP WINDROWERCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-windrowers-travelling-medium.png',
        '#035db1'
      ),
      size: 100
    },
    {
      value: 'OFFSP WINDROWERCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-windrowers-engine-off-medium.png',
        '#F97C5A'
      ),
      size: 100
    },
    {
      value: 'WORKINGSP SPRAYERSCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-sprayer-in-work-medium.png',
        '#25b03d'
      ),
      size: 100
    },
    {
      value: 'KEYONSP SPRAYERSCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-sprayer-key-on-medium.png',
        '#e7a603'
      ),
      size: 100
    },
    {
      value: 'IDLESP SPRAYERSCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-sprayer-idle-medium.png',
        '#f47825'
      ),
      size: 100
    },
    {
      value: 'MOVINGSP SPRAYERSCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-sprayer-moving-medium.png',
        '#F97C5A'
      ),
      size: 100
    },
    {
      value: 'TRAVELINGSP SPRAYERSCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-sprayer-travelling-medium.png',
        '#035db1'
      ),
      size: 100
    },
    {
      value: 'OFFSP SPRAYERSCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-sprayer-engine-off-medium.png',
        '#F97C5A'
      ),
      size: 100
    },
    {
      value: 'WORKINGFLOATER APPLICATORSCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-sprayer-in-work-medium.png',
        '#25b03d'
      ),
      size: 100
    },
    {
      value: 'KEYONFLOATER APPLICATORSCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-sprayer-key-on-medium.png',
        '#e7a603'
      ),
      size: 100
    },
    {
      value: 'IDLEFLOATER APPLICATORSCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-sprayer-idle-medium.png',
        '#f47825'
      ),
      size: 100
    },
    {
      value: 'MOVINGFLOATER APPLICATORSCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-sprayer-moving-medium.png',
        '#F97C5A'
      ),
      size: 100
    },
    {
      value: 'TRAVELINGFLOATER APPLICATORSCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-sprayer-travelling-medium.png',
        '#035db1'
      ),
      size: 100
    },
    {
      value: 'OFFFLOATER APPLICATORSCSAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-sprayer-engine-off-medium.png',
        '#F97C5A'
      ),
      size: 100
    },
    {
      value: 'WORKINGFLOATER APPLICATORSNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-sprayer-guardian-in-work-large.png',
        '#25b03d'
      ),
      size: 100
    },
    {
      value: 'KEYONFLOATER APPLICATORSNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-sprayer-guardian-key-on-medium-selected.png',
        '#e7a603'
      ),
      size: 100
    },
    {
      value: 'IDLEFLOATER APPLICATORSNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-sprayer-guardian-idle-medium-selected.png',
        '#f47825'
      )
    },
    {
      value: 'MOVINGFLOATER APPLICATORSNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-sprayer-guardian-moving-medium-selected.png',
        '#F97C5A'
      )
    },
    {
      value: 'TRAVELINGFLOATER APPLICATORSNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-sprayer-guardian-travelling-medium-selected.png',
        '#035db1'
      )
    },
    {
      value: 'OFFFLOATER APPLICATORSNHAG',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-sprayer-guardian-engine-off-medium-selected.png',
        '#F97C5A'
      )
    },
    {
      value: 'WORKINGTRACTORSCSAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-in-work-medium-selected.png',
        '#25b03d'
      ),
      size: 50
    },
    {
      value: 'KEYONTRACTORSCSAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-key-on-medium-selected.png',
        '#e7a603'
      ),
      size: 50
    },
    {
      value: 'IDLETRACTORSCSAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-idle-medium-selected.png',
        '#f47825'
      ),
      size: 50
    },
    {
      value: 'MOVINGTRACTORSCSAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-moving-medium-selected.png',
        '#F97C5A'
      ),
      size: 50
    },
    {
      value: 'TRAVELINGTRACTORSCSAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-travelling-medium-selected.png',
        '#035db1'
      ),
      size: 50
    },
    {
      value: 'OFFTRACTORSCSAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-cch-engine-off-medium-selected.png',
        '#F97C5A'
      ),
      size: 50
    },
    {
      value: 'WORKINGTRACTORSNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-ccm-in-work-medium-selected.png',
        '#25b03d'
      ),
      size: 50
    },
    {
      value: 'KEYONTRACTORSNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-ccm-key-on-medium-selected.png',
        '#e7a603'
      ),
      size: 50
    },
    {
      value: 'IDLETRACTORSNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-ccm-idle-medium-selected.png',
        '#f47825'
      )
    },
    {
      value: 'MOVINGTRACTORSNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-ccm-moving-medium-selected.png',
        '#F97C5A'
      )
    },
    {
      value: 'TRAVELINGTRACTORSNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-ccm-travelling-medium-selected.png',
        '#035db1'
      )
    },
    {
      value: 'OFFTRACTORSNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-ccm-engine-off-medium-selected.png',
        '#F97C5A'
      )
    },

    {
      value: 'WORKINGCOMBINESCSAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-combine-in-work-medium-selected.png',
        '#25b03d'
      ),
      size: 100
    },
    {
      value: 'KEYONCOMBINESCSAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-combine-key-on-medium-selected.png',
        '#e7a603'
      ),
      size: 100
    },
    {
      value: 'IDLECOMBINESCSAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-combine-idle-medium-selected.png',
        '#f47825'
      ),
      size: 100
    },
    {
      value: 'MOVINGCOMBINESCSAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-combine-moving-medium-selected.png',
        '#F97C5A'
      ),
      size: 100
    },
    {
      value: 'TRAVELINGCOMBINESCSAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-combine-travelling-medium-selected.png',
        '#035db1'
      ),
      size: 100
    },
    {
      value: 'OFFCOMBINESCSAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-combine-engine-off-medium-selected.png',
        '#F97C5A'
      ),
      size: 100
    },
    {
      value: 'WORKINGCOMBINESNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-flagship-in-work-medium-selected.png',
        '#25b03d'
      ),
      size: 100
    },
    {
      value: 'KEYONCOMBINESNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-flagship-key-on-medium-selected.png',
        '#e7a603'
      ),
      size: 100
    },
    {
      value: 'IDLECOMBINESNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-flagship-idle-medium-selected.png',
        '#f47825'
      )
    },
    {
      value: 'MOVINGCOMBINESNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-flagship-moving-medium-selected.png',
        '#F97C5A'
      )
    },
    {
      value: 'TRAVELINGCOMBINESNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-flagship-travelling-medium-selected.png',
        '#035db1'
      )
    },
    {
      value: 'OFFCOMBINESNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-flagship-engine-off-medium-selected.png',
        '#F97C5A'
      )
    },
    {
      value: 'WORKINGPT FORAGE HARVESTERNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-forage-harvester-in-work-large.png',
        '#25b03d'
      ),
      size: 100
    },
    {
      value: 'KEYONPT FORAGE HARVESTERNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-forage-harvester-key-on-medium-selected.png',
        '#e7a603'
      ),
      size: 100
    },
    {
      value: 'IDLEPT FORAGE HARVESTERNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-forage-harvester-idle-medium-selected.png',
        '#f47825'
      )
    },
    {
      value: 'MOVINGPT FORAGE HARVESTERNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-forage-harvester-moving-medium-selected.png',
        '#F97C5A'
      )
    },
    {
      value: 'TRAVELINGPT FORAGE HARVESTERNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-forage-harvester-travelling-medium-selected.png',
        '#035db1'
      )
    },
    {
      value: 'OFFPT FORAGE HARVESTERNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-combine-forage-harvester-engine-off-medium-selected.png',
        '#F97C5A'
      )
    },
    {
      value: 'WORKINGPTSP SPRAYERSNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-sprayer-guardian-in-work-large.png',
        '#25b03d'
      ),
      size: 100
    },
    {
      value: 'KEYONSP SPRAYERSNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-sprayer-guardian-key-on-medium-selected.png',
        '#e7a603'
      ),
      size: 100
    },
    {
      value: 'IDLESP SPRAYERSNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-sprayer-guardian-idle-medium-selected.png',
        '#f47825'
      )
    },
    {
      value: 'MOVINGSP SPRAYERSNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-sprayer-guardian-moving-medium-selected.png',
        '#F97C5A'
      )
    },
    {
      value: 'TRAVELINGSP SPRAYERSNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-sprayer-guardian-travelling-medium-selected.png',
        '#035db1'
      )
    },
    {
      value: 'OFFSP SPRAYERSNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-sprayer-guardian-engine-off-medium-selected.png',
        '#F97C5A'
      )
    },
    {
      value: 'WORKINGSP GRAPE HARVESTERNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-grape-harvester-in-work-medium-selected.png',
        '#25b03d'
      ),
      size: 100
    },
    {
      value: 'KEYONSP GRAPE HARVESTERNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-grape-harvester-key-on-medium-selected.png',
        '#e7a603'
      ),
      size: 100
    },
    {
      value: 'IDLESP GRAPE HARVESTERNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-grape-harvester-idle-medium-selected.png',
        '#f47825'
      )
    },
    {
      value: 'MOVINGSP GRAPE HARVESTERNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-grape-harvester-moving-medium-selected.png',
        '#F97C5A'
      )
    },
    {
      value: 'TRAVELINGSP GRAPE HARVESTERNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-grape-harvester-travelling-medium-selected.png',
        '#035db1'
      )
    },
    {
      value: 'OFFSP GRAPE HARVESTERNHAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-grape-harvester-engine-off-medium-selected.png',
        '#F97C5A'
      )
    },
    {
      value: 'WORKINGSUGAR CANE HARVESTERCSAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-sugarcane-in-work-medium-selected.png',
        '#25b03d'
      ),
      size: 100
    },
    {
      value: 'KEYONSUGAR CANE HARVESTERCSAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-sugarcane-key-on-medium-selected.png',
        '#e7a603'
      ),
      size: 100
    },
    {
      value: 'IDLESUGAR CANE HARVESTERCSAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-sugarcane-idle-medium-selected.png',
        '#f47825'
      ),
      size: 100
    },
    {
      value: 'MOVINGSUGAR CANE HARVESTERCSAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-sugarcane-moving-medium-selected.png',
        '#F97C5A'
      ),
      size: 100
    },
    {
      value: 'TRAVELINGSUGAR CANE HARVESTERCSAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-sugarcane-travelling-medium-selected.png',
        '#035db1'
      ),
      size: 100
    },
    {
      value: 'OFFSUGAR CANE HARVESTERCSAG1',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-sugarcane-engine-off-medium-selected.png',
        '#F97C5A'
      ),
      size: 100
    },

    {
      value: 'WORKINGTRACTORSCSAG4WD',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-4wd-in-work-medium.png',
        '#25b03d'
      )
    },
    {
      value: 'KEYONTRACTORSCSAG4WD',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-4wd-key-on-medium.png',
        '#e7a603'
      )
    },
    {
      value: 'IDLETRACTORSCSAG4WD',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-4wd-idle-medium.png',
        '#f47825'
      )
    },
    {
      value: 'MOVINGTRACTORSCSAG4WD',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-4wd-moving-medium-selected.png',
        '#F97C5A'
      )
    },
    {
      value: 'TRAVELINGTRACTORSCSAG4WD',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-4wd-travelling-medium.png',
        '#035db1'
      )
    },
    {
      value: 'OFFTRACTORSCSAG4WD',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Cih/case/CIH-tractor-4wd-engine-off-medium.png',
        '#F97C5A'
      )
    },
    {
      value: 'WORKINGTRACTORSNHAG4WD',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-4wd-in-work-medium.png',
        '#25b03d'
      )
    },
    {
      value: 'KEYONTRACTORSNHAG4WD',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-4wd-key-on-medium.png',
        '#e7a603'
      )
    },
    {
      value: 'IDLETRACTORSNHAG4WD',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-4wd-idle-medium.png',
        '#f47825'
      )
    },
    {
      value: 'MOVINGTRACTORSNHAG4WD',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-4wd-moving-medium.png',
        '#F97C5A'
      )
    },
    {
      value: 'TRAVELINGTRACTORSNHAG4WD',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-4wd-travelling-medium.png',
        '#035db1'
      )
    },
    {
      value: 'OFFTRACTORSNHAG4WD',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-4wd-engine-off-medium.png',
        '#F97C5A'
      )
    },

    {
      value: 'WORKINGTRACTORSNHAGCCH',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-cch-in-work-medium.png',
        '#25b03d'
      )
    },
    {
      value: 'KEYONTRACTORSNHAGCCH',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-cch-key-on-medium.png',
        '#e7a603'
      )
    },
    {
      value: 'IDLETRACTORSNHAGCCH',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-cch-idle-medium.png',
        '#f47825'
      )
    },
    {
      value: 'MOVINGTRACTORSNHAGCCH',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-cch-moving-medium.png',
        '#F97C5A'
      )
    },
    {
      value: 'TRAVELINGTRACTORSNHAGCCH',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-cch-travelling-medium.png',
        '#035db1'
      )
    },
    {
      value: 'OFFTRACTORSNHAGCCH',
      symbol: MapSettings.getUniqueValueSymbol(
        '/assets/Icon-Vehicle-Nh/newholland/NH-tractor-cch-engine-off-medium.png',
        '#F97C5A'
      )
    }
  ];

  static getUniqueValueSymbol(name, color) {
    const verticalOffset = {
      screenLength: 40,
      maxWorldLength: 200,
      minWorldLength: 35
    };
    // The point symbol is visualized with an icon symbol. To clearly see the location of the point
    // we displace the icon vertically and add a callout line. The line connects the offseted symbol with the location
    // of the point feature.
    return {
      type: 'point-3d', // autocasts as new PointSymbol3D()
      symbolLayers: [
        {
          type: 'icon', // autocasts as new IconSymbol3DLayer()
          resource: {
            href: name
          },
          outline: {
            color: [0, 0, 0, 255],
            width: 1,
            type: 'esriSLS',
            style: 'esriSLSSolid'
          },
          size: 50
        }
      ],

      verticalOffset: verticalOffset

      // callout: {
      //   type: 'line', // autocasts as new LineCallout3D()
      //   color: 'white',
      //   size: 2,
      //   border: {
      //     color: color
      //   }
      // }
    };
  }
}
