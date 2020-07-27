import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { abc } from './test/testKeyof';
import { test } from './test/testDecorator';
import { testThis1 } from './test/testThis';
import { TestModule } from './test/testModule';
import { inspect } from 'util';
import { testWeakSet, inspectWeakSet } from './test/weakSet';
inspectWeakSet()
/*
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
*/
