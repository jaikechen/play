import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { abc } from './test/testKeyof';
import { test } from './test/testDecorator';
import { testThis1 } from './test/testThis';
import { TestModule } from './test/testModule';
import { inspect } from 'util';
import { testWeekSet } from './test/weekSet';

const a = 'this is'
for (let c of a)
{
  c = 'f'
  console.log(c)
}
console.log(a)
console.log( typeof a[Symbol.iterator])

/*
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
*/
