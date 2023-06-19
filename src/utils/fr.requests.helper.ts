import axios from "axios";
import { FormRecResponse } from "src/fr-models/FormRecResponse";

export class FormRecRequests {
    async handleFormRecRequests(httpRequestType, formRecURL, requestData, requestConfig): Promise<FormRecResponse> {
        try {
          const { data, status, headers } = await axios(
            {
              method: httpRequestType,
              url: formRecURL,
              headers: requestConfig.headers,
              data: requestData,
              timeout : requestConfig.timeout ? requestConfig.timeout : 30000            
            }
          );
    
          return new Promise((resolve) => {
            resolve({ status: status, message: 'Request Complete', headers: headers, data: data });
          });
    
    
        } catch (error) {
          if (axios.isAxiosError(error)) {
            return new Promise((resolve) => {
              const finalError = error.response.data?.error?.message ? error.response.data?.error?.message : "Something went wrong"
              const formRecError = error.response.data?.error?.innererror?.message
              resolve({ status: error.response.status, message: formRecError ? formRecError : finalError });
            });
          } else {
            console.log('unexpected error: ', error);
            return new Promise((resolve) => {
              resolve({ status: 500, message: 'An unexpected error occurred' });
            });
          }
        }
      }
    
      async pollRequest(httpRequestType, formRecURL, requestData, requestConfig, attempt = 1, maxAttempts = 10): Promise<FormRecResponse> {
        if (attempt == maxAttempts) {
          return new Promise((resolve) => {
            resolve({ status: 504, message: "Timed out during operation location polling" });
          });
        }
        const response = await this.handleFormRecRequests(httpRequestType,formRecURL, requestData, requestConfig);
        if (response.data?.status == "succeeded") {
          return new Promise((resolve) => {
            resolve(response);
          });
        }
        else {
          setTimeout(() => {
            console.log("Delayed for 1 second.");
            this.pollRequest(httpRequestType,formRecURL, requestData, requestConfig, attempt + 1);
          }, 1000 * attempt);
        }
    
      }
} 