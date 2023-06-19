import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { FormRecCustomService } from '../services/fr.custom.service';
import { CustomTrainRequest } from 'src/fr-models/CustomTrainRequest';
import { Response } from 'express';

@Controller('fr-custom')
export class FormRecCustomController {
  constructor(
    private readonly formRecCustomService: FormRecCustomService
  ) { }

  @Get('first')
  async getValue(): Promise<string> {
    return await this.formRecCustomService.getValue();
  }

  @Post('train')
  startTraining(
    @Body() requestData: CustomTrainRequest,
    @Res() response: Response
  ) {
    console.log(requestData);
    this.formRecCustomService.trainModel(requestData).then(results => {
      return response
        .status(results.status)
        .send({
          "message": results.message
        });
    });
  }

  @Post('extract-custom')
  customModelExtract(
    @Body() requestData: any,
    @Res() response: Response
  ) {
    console.log(requestData);
    this.formRecCustomService.customModelExtract(requestData).then(results => {
      return response
        .status(results.status)
        .send({
          "message": results.message
        });
    });
  }
}