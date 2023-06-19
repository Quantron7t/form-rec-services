import * as dotenv from 'dotenv';

dotenv.config();

export class EnvironmentVariables {
    public formRecKey : string = process.env.FR_KEY;
    public formRecCustomTrainEndPoint : string = process.env.FR_CUSTOM_TRAIN_ENDPOINT;
    public formRecBaseURL : string = process.env.FR_BASE_URL;
    public formRecModelVersion : string = process.env.FR_MODEL_VERSION;
}