import assert from 'assert';
import createSchedule from '../index';
import mocks from './mocks';

describe(`Создание расписания`, () => {
  it(`Запуск без входных данных`, () => {
    assert.throws(createSchedule, /Некорректно определена сетка тарифов/);
  });
  it(`Один прибор`, () => {
    assert.deepEqual(createSchedule(mocks[0].input), mocks[0].output);
  });
  it(`Дневной и ночной прибор`, () => {
    assert.deepEqual(createSchedule(mocks[1].input), mocks[1].output);
  });
  it(`Два ночных прибора малой мощности`, () => {
    assert.deepEqual(createSchedule(mocks[2].input), mocks[2].output);
  });
  it(`Два ночных прибора большой мощности`, () => {
    assert.deepEqual(createSchedule(mocks[3].input), mocks[3].output);
  });
  it(`Перегрузка по мощности`, () => {
    assert.throws(() => {
      createSchedule(mocks[4].input);
    }, /Умный дом не сможет включить test1 из-за перегрузки по мощности/);
  });
});
