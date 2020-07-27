import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { abc } from './test/testKeyof';
import { test } from './test/testDecorator';
import { testThis1 } from './test/testThis';
import { TestModule } from './test/testModule';
import { inspect } from 'util';
import { testWeekSet } from './test/weekSet';
import { testDate1 } from './test/testRefrence';
//testString()
testDate1()
/*
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
*/
