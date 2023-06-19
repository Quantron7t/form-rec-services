import { Injectable } from '@nestjs/common';
import { PDFUtil } from '../utils/pdf.util';
import { EnvironmentVariables } from '../utils/constants';
import { HttpRequest } from 'src/utils/enums';
import { CustomTrainRequest } from '../fr-models/CustomTrainRequest';
import { FormRecResponse } from 'src/fr-models/FormRecResponse';
import { FormRecRequests } from 'src/utils/fr.requests.helper';
import { CustomExtractRequest } from 'src/fr-models/CustomExtractRequest';

@Injectable()
export class FormRecCustomService {

  constructor(
    private readonly formRecRequests : FormRecRequests,
    private readonly pdfUtil: PDFUtil,
    private readonly envVars: EnvironmentVariables
  ) { }

  async getValue(): Promise<string> {
    const x = await this.pdfUtil.splitPDFandSave();
    console.log(__dirname);
    return `{ "Message4": ${x} }`;
  }

  async trainModel(requestData: CustomTrainRequest): Promise<any> {
    console.log(this.envVars.formRecKey);
    const formRecTrainURL = `${this.envVars.formRecBaseURL}${this.envVars.formRecCustomTrainEndPoint}:build?${this.envVars.formRecModelVersion}`;
    const formRecTrainingHeaders = {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': this.envVars.formRecKey
    };

    const requestConfig = {
      headers: formRecTrainingHeaders,
      timeout: 30000
    };

    const response = await this.formRecRequests.handleFormRecRequests(HttpRequest.POST, formRecTrainURL, requestData, requestConfig);
    if (response.status == 202) {
      const operationLocation = response.headers['operation-location'];
      if (operationLocation) {
        this.pollAndSetModel(HttpRequest.GET, operationLocation, {}, requestConfig);
        return new Promise<FormRecResponse>((resolve) => {
          resolve({ status: 202, message: `Training started for model - ${requestData.modelId}` });
        });
      }
      else {
        return new Promise<FormRecResponse>((resolve) => {
          resolve({
            status: response.status,
            message: 'Could not create training operation',
            headers: response.headers,
            data: response.data
          });
        });
      }
    } else {
      return new Promise<FormRecResponse>((resolve) => {
        resolve(response);
      });
    }
  }

  async pollAndSetModel(httpRequestType, formRecURL, requestData, requestConfig) {
    const response = await this.formRecRequests.pollRequest(httpRequestType, formRecURL, requestData, requestConfig);
    console.log(response);
    //console.log(response.data?.result.modelId);
    //console.log(response.data?.result.description);
  }

  async customModelExtract(requestData: CustomExtractRequest): Promise<any> {
    const formRecTrainURL = `${this.envVars.formRecBaseURL}${this.envVars.formRecCustomTrainEndPoint}/${requestData.modelId}:analyze?${this.envVars.formRecModelVersion}`;
    const formRecTrainingHeaders = {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': this.envVars.formRecKey
    };

    const requestConfig = {
      headers: formRecTrainingHeaders,
      timeout: 30000
    };

    const response = await this.formRecRequests.handleFormRecRequests(HttpRequest.POST, formRecTrainURL, requestData, requestConfig);
    if (response.status == 202) {
      const operationLocation = response.headers['operation-location'];
      if (operationLocation) {
        //use await for pollExtractionData only if sync response needed
        this.pollExtractionData(HttpRequest.GET, operationLocation, {}, requestConfig);
        return new Promise<FormRecResponse>((resolve) => {
          resolve({ status: 202, message: `Training started for model - ${requestData.modelId}` });
        });
      }
      else {
        return new Promise<FormRecResponse>((resolve) => {
          resolve({
            status: response.status,
            message: 'Could not create training operation',
            headers: response.headers,
            data: response.data
          });
        });
      }
    } else {
      return new Promise<FormRecResponse>((resolve) => {
        resolve(response);
      });
    }
  }

  async pollExtractionData(httpRequestType, formRecURL, requestData, requestConfig) {
    const response = await this.formRecRequests.pollRequest(httpRequestType, formRecURL, requestData, requestConfig);
    console.log(response);
    //console.log(response.data?.result.modelId);
    //console.log(response.data?.result.description);
  }

}
