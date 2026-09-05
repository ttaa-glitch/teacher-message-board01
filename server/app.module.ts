import { Module } from '@nestjs/common';
import { MessageModule } from './modules/message/message.module';

@Module({
  imports: [MessageModule],
})
export class AppModule {}
