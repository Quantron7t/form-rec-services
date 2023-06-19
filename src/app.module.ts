import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { FormRecCustomController } from './controllers/fr.custom.controller';
import { UserMiddleware } from './middlewares/user.middleware';
import { AppService } from './services/app.service';
import { FormRecCustomService } from './services/fr.custom.service';
import { RequestService } from './services/request.service';
import { UserService } from './services/user.service';
import { PDFUtil } from './utils/pdf.util';
import { EnvironmentVariables } from './utils/constants';
import { FormRecRequests } from './utils/fr.requests.helper';

@Module({
  imports: [],
  controllers: [AppController,FormRecCustomController],
  providers: [
    AppService,
    UserService,
    RequestService,
    FormRecCustomService,
    PDFUtil,
    EnvironmentVariables,
    FormRecRequests
  ]
})
export class AppModule implements NestModule{ 
  //class is extended by NestModule to apply middleware to incoming requests 
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*'); //applies auth middleware for all requests
  }
}
