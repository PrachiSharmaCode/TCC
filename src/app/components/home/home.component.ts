import {Component, OnInit} from '@angular/core';
import {parse} from 'papaparse';
import {HomeModel} from '../../model/home.model';

interface point {
  referenceName: string;
  volttronPointName: string;
}

// tslint:disable-next-line:class-name
interface device {
  deviceTopic: string;
  devicePoints: point[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  showHomePage = true;
  masterFile: string;
  home: HomeModel = new HomeModel();

  constructor() {
  }

  showConfigurationPage() {
    if (this.showHomePage === true) {
      this.showHomePage = false;
    } else {
      this.showHomePage = true;
    }
  }


  getMasterDriver(e) {
    const reader = new FileReader();
    //  const reader = e.target.files;
    // tslint:disable-next-line:only-arrow-functions no-shadowed-variable
    reader.onload = () => {
      const masterDriverConfig = JSON.parse(reader.result.toString());
      // tslint:disable-next-line:variable-name
      const device_names = Object.keys(masterDriverConfig).filter(key => !(key.endsWith('.csv')));
      // tslint:disable-next-line:no-shadowed-variable
      const devices = device_names.map(device => {
        const deviceData = JSON.parse(parse(masterDriverConfig[device].data).data.join('\n'));
        if (deviceData.registry_config) {
          const registryConfigName = deviceData.registry_config.split('//')[1];
          const registryConfigData = parse(masterDriverConfig[registryConfigName].data).data;
          const registryConfigEntries = registryConfigData.slice(1).map(line => {
            if (line[0] && line[1]) {
              return {
                referenceName: line[0],
                volttronPointName: line[1]
              } as point;
            }
          });
          const deviceEntry = {
            deviceTopic: device,
            devicePoints: registryConfigEntries
          } as device;
          return deviceEntry;
        }
      });
      this.home.setMasterDriver(devices);
      this.showConfigurationPage();
      return devices;
    };
    if (e.target.files !== undefined) {
      reader.readAsText(e.target.files[0]);
    }
  }

  goToHomePage() {
    if (!this.showHomePage) {
      this.showHomePage = true;
    }
  }

  ngOnInit() {
  }

}
