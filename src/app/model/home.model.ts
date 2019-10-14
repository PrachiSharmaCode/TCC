export class HomeModel {

  private _masterDevice: {
    deviceTopic: string,
    devicePoints: string[]
  }[] = [];

  setMasterDriver(devices: {
    deviceTopic: string,
    devicePoints: {
      referenceName: string,
      volttronPointName: string,
    }[]
  }[]) {
    for (let i = 0; i < devices.length; i++) {
      if (devices[i] !== undefined) {
        const str = devices[i].deviceTopic;
        const tempPoints: string[] = [];
        for (let j = 0; j < devices[i].devicePoints.length; j++) {
          if (devices[i].devicePoints[j] !== undefined) {
            tempPoints.push(devices[i].devicePoints[j].volttronPointName);
          }
        }

        const temp: {
          deviceTopic: string,
          devicePoints: string[]
        } = {
          deviceTopic: str,
          devicePoints: tempPoints
        };
        this._masterDevice.push(temp);
      } else {
        continue;
      }
    }
    console.log(this._masterDevice);
  }


  get masterDevice(): { deviceTopic: string; devicePoints: string[] }[] {
    return this._masterDevice;
  }

  set masterDevice(value: { deviceTopic: string; devicePoints: string[] }[]) {
    this._masterDevice = value;
  }
}
