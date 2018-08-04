// import inputData from './data/input'
const { devices, rates, maxPower } = {
  devices: [
    {
      id: 'F972B82BA56A70CC579945773B6866FB',
      name: 'Посудомоечная машина',
      power: 950,
      duration: 3,
      mode: 'night'
    },
    {
      id: 'C515D887EDBBE669B2FDAC62F571E9E9',
      name: 'Духовка',
      power: 2000,
      duration: 2,
      mode: 'day'
    },
    {
      id: '02DDD23A85DADDD71198305330CC386D',
      name: 'Холодильник',
      power: 50,
      duration: 24
    },
    {
      id: '1E6276CC231716FE8EE8BC908486D41E',
      name: 'Термостат',
      power: 50,
      duration: 24
    },
    {
      id: '7D9DC84AD110500D284B33C82FE6E85E',
      name: 'Кондиционер',
      power: 850,
      duration: 1
    },
    {
      id: '7D9DC84AD110500D284B33C82FE6E85Z',
      name: '_Телевизор',
      power: 1200,
      duration: 2
    },
    {
      id: '7D9DC84AD110500D284B33C82FE6E85A',
      name: '_Тёплый пол',
      power: 1700,
      duration: 3
    },
    {
      id: '7D9DC84AD110500D284B33C82FE6E85B',
      name: '_Жалюзи',
      power: 1700,
      duration: 3,
      mode: 'day'
    }
  ],
  rates: [
    {
      from: 7,
      to: 10,
      value: 6.46
    },
    {
      from: 10,
      to: 17,
      value: 5.38
    },
    {
      from: 17,
      to: 21,
      value: 6.46
    },
    {
      from: 21,
      to: 23,
      value: 5.38
    },
    {
      from: 23,
      to: 7,
      value: 1.79
    }
  ],
  maxPower: 2100
};

const l = console.log;

const TWENTY_FOUR_HOURS = 24;
const schedule = Object.assign({}, [...Array(TWENTY_FOUR_HOURS)].map(_ => []));
const powers = [...Array(TWENTY_FOUR_HOURS)].map(_ => 0);
const dayStartHour = 10; // TODO: calculate from tarif
const nightStartHour = 23; // TODO: calculate from tarif

// const dayDevices = devices.filter(device => device.mode === 'day');
// dayDevices
// const nightDevices = devices.filter(device => device.mode === 'night');
// nightDevices
// const dayAndNightDevices = devices.filter(device => device.mode === undefined);
// dayAndNightDevices

// const tarifByHours = Array(TWENTY_FOUR_HOURS);

/* rates.forEach(rate => {
  let { from, to } = rate;
  if (from > to) {
    for (let i = from; i < TWENTY_FOUR_HOURS; i++) {
      tarifByHours[i] = rate.value;
    }
    for (let i = 0; i < to; i++) {
      tarifByHours[i] = rate.value;
    }
  } else {
    for (let i = from; i < to; i++) {
      tarifByHours[i] = rate.value;
      // console.log(i, tarifByHours[i])
    }
  }
}); */

/* const propertyActions = [
  {
    name: 'day',
    check: arg => arg > 6 && arg < 21
  },
  {
    name: 'night',
    check: arg => (arg < 7 && arg >= 0) || arg > 20
  }
]; */
/* const getPropertyAction = arg =>
  propertyActions.find(({ check }) => check(arg)); */

// tarifByHoursObject = Object.assign({}, tarifByHours);
/* tarifObject = tarifByHours.reduce((acc, tarif, hour) => {
  return {
    ...acc,
    [hour]: {
      tarif,
      type: getPropertyAction(hour).name
    }
  };
}, {}); */
// l(tarifObject)

/* function getDevice(tarif, hour) {
  const { name } = getPropertyAction(hour);
  return name;
} */

const createPeriod = (start, duration) =>
  [...Array(duration)].map((_, i) => ((start + i) % 24));

const findStartHour = ({ name, mode, power, duration }) => {
  let attempt = 1;
  let start = mode === 'day' ? dayStartHour : nightStartHour;
  return testPeriod(createPeriod(start, duration));

  function testPeriod(period) {
    for (let hour of period) {
      if (powers[hour] + power > maxPower) {
        if (attempt < 24 - duration) {
          attempt++;
          start = (start + 1) % 24;
          // l(attempt, start, name, powers[hour]);
          testPeriod(createPeriod(start, duration));
        } else {
          console.error(
            `Умный дом не сможет включить прибор ${name} из-за перегрузки по мощности`
          );
          start = null;
        }
        break;
      }
      powers[hour] += power;
      // l(attempt, start, name, powers[hour]);
    }
    return start;
  }
};

devices
  .filter(({ duration }) => duration === 24)
  .forEach(({ name, power }) => {
    Object.keys(schedule).forEach(hour => {
      schedule[hour].push(name);
      powers[hour] += power;
    });
  });

devices
  .filter(device => device.duration < 24)
  .forEach(device => {
    const { name, duration } = device;

    const start = findStartHour(device);
    if (start) {
      // l(name, power, start, duration);
      const period = createPeriod(start, duration);
      for (let hour of period) {
        schedule[hour].push(name);
      }
    }
  });
// l(schedule);
// powers.map((p, i) => l(i, p, schedule[i]));
