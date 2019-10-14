import {Component, Input, OnInit} from '@angular/core';
import {HomeModel} from '../../model/home.model';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-configuration-tcc',
  templateUrl: './configuration-tcc.component.html',
  styleUrls: ['./configuration-tcc.component.css']
})
export class ConfigurationTCCComponent implements OnInit {

  @Input() home: HomeModel;


  masterFile: string;

  campusList: string[] = [];
  buildingList: string[] = [];

  modelPara = 'model_parameter';
  supplier = 'supplier_market_name';
  consumer = 'consumer_market_name';
  schedule = 'schedule';
  inputsValues = 'inputs';
  outputsValues = 'outputs';
  modelType = 'model_type';
  terminalBox = 'terminal_box_type';

  supplyAir = 'supply-air setpoint';
  nominal = 'nominal zone-setpoint';
  buildingChiller = 'building chiller';
  variableVolume = 'variable-volume';

  controlInterval = 'control_interval';
  marketName = 'market_name';
  enableActuation = 'actuation_enable_onstart';
  actuationMethod = 'actuation_method';

  vavFile = {};

  filecontext: string;

  csvFile: string[];
  jsonFile: JSON;

  csvResult: number[][] = [];

  inputs: {
    mapped: string;
    point: string,
    topic: string,
    inital_value: number;
  }[] = [];

  monday: {
    start: string,
    end: string
  } = {
    start: '',
    end: ''
  };
  tuesday: {
    start: string,
    end: string
  } = {
    start: '',
    end: ''
  };
  wednesday: {
    start: string,
    end: string
  } = {
    start: '',
    end: ''
  };
  thrusday: {
    start: string,
    end: string
  } = {
    start: '',
    end: ''
  };
  friday: {
    start: string,
    end: string
  } = {
    start: '',
    end: ''
  };
  saturday: {
    start: string,
    end: string
  } = {
    start: '',
    end: ''
  };
  sunday: {
    start: string,
    end: string
  } = {
    start: '',
    end: ''
  };


  outputs: {
    mapped: string,
    point: string,
    topic: string,
    flexibility_range: number[],
    control_flexbility: number[],
    off_setpoint: number,
    actuator: string,
    release: string,
    offset: number,
    fallback: number
  }[] = [];

  // tslint:disable-next-line:variable-name
  equipment_configuration: {
    hasa_economizer: boolean,
    economizer_limit: number,
    supply_air_sepoint: number,
    nominal_zone_setpoint: number,
    building_chiller: boolean,
    variable_volume: boolean
  } = {
    hasa_economizer: false,
    economizer_limit: 0,
    supply_air_sepoint: 0,
    nominal_zone_setpoint: 0,
    building_chiller: false,
    variable_volume: false
  };

  // tslint:disable-next-line:variable-name
  model_configuration: {
    c0: number,
    c1: number,
    c2: number,
    c3: number,
    cpAir: number,
    COP: number,
    mDotAir: number
  } = {
    c0: 0,
    c1: 0,
    c2: 0,
    c3: 0,
    cpAir: 0,
    COP: 0,
    mDotAir: 0
  };

  // tslint:disable-next-line:variable-name
  rated_power: number;

  outputPointList: string[] = [];

  masterDevice: {
    deviceTopic: string,
    devicePoints: string[]
  }[] = [];

  deviceSection: string;

  campus: string;
  building: string;
  // tslint:disable-next-line:variable-name
  input_data_timezone: string;
  // tslint:disable-next-line:variable-name
  supplier_market_name: string;
  // tslint:disable-next-line:variable-name
  consumer_market_name: string;
  // tslint:disable-next-line:variable-name
  agent_name: string;

  // tslint:disable-next-line:variable-name
  model_type: string;

  // tslint:disable-next-line:variable-name
  terminal_box_type: string;

  // tslint:disable-next-line:variable-name
  agent_type: string;

  // tslint:disable-next-line:variable-name
  market_name: string;

  // tslint:disable-next-line:variable-name
  actuation_enabled_onstart = false;

  // tslint:disable-next-line:variable-name
  control_interval: number;

  // tslint:disable-next-line:variable-name
  actuation_method: string;


  finalCalculation = '';


  constructor() {
  }

  onFileLoad(fileLoadedEvent) {
    const textFromFileLoaded = fileLoadedEvent.target.result;
    this.filecontext = textFromFileLoaded;
    // alert(this.csvContent);
  }

  getMasterDriver(e) {

    console.log(e.target.value);

    const input = e.target;
    const fileName = e.target.value;
    const reader = new FileReader();
    try {
      reader.readAsText(input.files[0]);
    } catch (e) {
      console.log('these is some error');
    }
    console.log(fileName.split('.').pop());

    if (fileName.split('.').pop() === 'csv') {
      reader.onload = () => {
        const csvData = reader.result;
        console.log(csvData);
        this.csvFile = (csvData as string).split(/\r\n|\n/);
        this.convertToFormat();
        console.log(this.csvFile);
      };
    }

    if (fileName.split('.').pop() === 'json') {
      reader.onload = () => {
        this.vavFile = JSON.parse(reader.result.toString());
        for (let i in this.vavFile) {
          this.csvResult.push(this.vavFile[i]);
        }
      };
    }
  }

  convertToFormat() {

    let arr = this.csvFile[0].split(',');
    for (let i = 0; i < arr.length; i++) {
      this.csvResult[i] = [];
    }

    console.log(this.csvResult);
    for (let j = 1; j < this.csvFile.length; j++) {
      let tempArr = this.csvFile[j].split(',');

      for (let i = 0; i < tempArr.length; i++) {
        this.csvResult[i].push(+tempArr[i]);
      }
    }
    console.log(this.csvResult);

    for (let i = 0; i < arr.length; i++) {
      this.vavFile[arr[i]] = this.csvResult[i];
    }

    console.log(this.vavFile);
  }

  onfileInput(input: HTMLInputElement) {
    const files = input.files;
    const content = this.filecontext;
    if (files && files.length) {

      const fileToRead = files[0];

      const fileReader = new FileReader();
      fileReader.onload = this.onFileLoad;

      fileReader.readAsText(fileToRead, 'UTF-8');
      console.log(fileReader.readAsText(fileToRead, 'UTF-8'));
    }
  }

  onRefreshClick() {
    const obj = {
      campus: this.campus,
      building: this.building,
      input_data_timezone: this.input_data_timezone,
      agent_name: this.agent_name,
    };

    if (this.agent_type === 'AHU') {
      obj[this.supplier] = this.supplier_market_name;
      obj[this.consumer] = this.consumer_market_name;
    }

    if (this.agent_type === 'LIGHT' || this.agent_type === 'VAV') {
      obj[this.enableActuation] = this.actuation_enabled_onstart;
      obj[this.controlInterval] = this.control_interval;
      obj[this.marketName] = this.market_name;
    }

    if (this.agent_type === 'VAV') {
      obj[this.actuationMethod] = this.actuation_method;
    }


    obj[this.inputsValues] = this.inputs;
    obj[this.outputsValues] = this.outputs;

    obj[this.schedule] = {
      monday: this.monday,
      tuesday: this.tuesday,
      wednesday: this.wednesday,
      thrusday: this.thrusday,
      friday: this.friday,
      saturday: this.saturday,
      sunday: this.sunday
    };

    if (this.deviceSection === 'AHU') {
      obj[this.modelPara] = {
        equipment_configuration: this.equipment_configuration,
        model_configuration: this.model_configuration,
      };

      obj[this.modelPara].equipment_configuration[this.supplyAir] =
        this.equipment_configuration.supply_air_sepoint;
      obj[this.modelPara].equipment_configuration[this.nominal] =
        this.equipment_configuration.nominal_zone_setpoint;
      obj[this.modelPara].equipment_configuration[this.buildingChiller] =
        this.equipment_configuration.building_chiller;
      obj[this.modelPara].equipment_configuration[this.variableVolume] =
        this.equipment_configuration.variable_volume;
    }

    if (this.deviceSection === 'VAV') {
      obj[this.modelPara] = {};
      obj[this.modelPara] = this.vavFile;
      obj[this.modelPara][this.modelType] = this.model_type;
      obj[this.modelPara][this.terminalBox] = this.terminal_box_type;

    }

    if (this.deviceSection === 'LIGHT') {
      obj[this.modelPara] = {};
      obj[this.modelPara] = {
        rated_power: this.rated_power
      };
      obj[this.modelPara][this.modelType] = this.model_type;
    }


    // delete obj[this.modelPara].equipment_configuration.supply_air_sepoint;
    // delete obj[this.modelPara].equipment_configuration.nominal_zone_setpoint;
    // delete obj[this.modelPara].equipment_configuration.building_chiller;
    // delete obj[this.modelPara].equipment_configuration.variable_volume;
    this.finalCalculation = JSON.stringify(obj, null, 4);
    console.log(this.finalCalculation);
  }

  saveCriteriatCalculation() {
    const file = new Blob([this.finalCalculation ],
      {type: 'json'});
    FileSaver.saveAs(file, 'TCC.json');
  }

  getInputPointList(topic) {
    for (let i = 0; i < this.masterDevice.length; i++) {
      if (this.masterDevice[i].deviceTopic === topic) {
        return this.masterDevice[i].devicePoints;
        break;
      }
    }
  }

  getOutputPoints(deviceTopic) {
    console.log(deviceTopic);
    for (let i = 0; i < this.masterDevice.length; i++) {
      if (this.masterDevice[i].deviceTopic === deviceTopic) {
        this.outputPointList = this.masterDevice[i].devicePoints;
      }
    }
    console.log(this.outputPointList);
  }

  addInput() {
    this.inputs.push({topic: '', mapped: '', inital_value: 0, point: ''});
  }

  addOutput() {
    this.outputs.push({
      mapped: '',
      point: '',
      topic: '',
      flexibility_range: [0, 0],
      control_flexbility: [0, 0],
      off_setpoint: 0,
      actuator: '',
      release: '',
      offset: 0,
      fallback: 0
    });
  }

  ngOnInit() {
    this.masterDevice = this.home.masterDevice;
    console.log(this.masterDevice);
    let devicesLength = this.masterDevice.length - 1;
    while (devicesLength >= 0) {
      if (this.masterDevice[devicesLength] !== undefined) {
        // let i = 0;
        // let start = 0;
        // let end: number;
        // end = i;

        console.log(this.masterDevice[devicesLength].deviceTopic);

        // const campusBuidling = this.masterDevice[devicesLength].deviceTopic.substring(start + 1, end - 1);

        let campusbuidlingDetails: string[];
        campusbuidlingDetails = this.masterDevice[devicesLength].deviceTopic.split('/');

        if (!this.campusList.includes(campusbuidlingDetails[1])) {
          this.campusList.push(campusbuidlingDetails[1]);
        }

        if (!this.buildingList.includes(campusbuidlingDetails[2])) {
          this.buildingList.push(campusbuidlingDetails[2]);
        }
      }
      devicesLength--;
    }

    console.log(this.campusList);
    console.log(this.buildingList);
  }

  trackByIndex(index: number): any {
    return index;
  }

}
