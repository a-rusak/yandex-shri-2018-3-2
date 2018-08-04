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

const schedule = Object.assign({}, [...Array(24)].map(_ => []));
const powers = new Array(24).fill(0);
const tarifs = new Array(24).fill(0);
const dayStart = 7; // from readme
const nightStart = 21; // from readme

const createPeriod = (start, duration) =>
  [...Array(duration)].map((_, i) => (start + i) % 24);

rates.forEach(({ from, to, value }) => {
  const duration = from < to ? to - from : 24 - from + to;
  const period = createPeriod(from, duration);
  for (let hour of period) {
    tarifs[hour] = value;
  }
});
if (tarifs.some(tarif => tarif === 0)) {
  throw new RangeError(`Некорректно определена сетка тарифов`);
}
// l(tarifs)

const propertyActions = [
  {
    name: 'day',
    check: arg => arg >= dayStart && arg < nightStart
  },
  {
    name: 'night',
    check: arg => (arg < dayStart && arg >= 0) || arg >= nightStart
  }
];

const getPropertyAction = arg =>
  propertyActions.find(({ check }) => check(arg));

tarifObject = tarifs.reduce((acc, tarif, hour) => {
  return {
    ...acc,
    [hour]: {
      tarif,
      type: getPropertyAction(hour).name
    }
  };
}, {});
l(tarifObject);

/* const getDevice = (tarif, hour) => {
  const { name } = getPropertyAction(hour);
  return name;
} */

const getFirstCheapHour = (acc, item, index) => {
  const [i, { tarif }] = item;
  const compare = () => (acc[1].tarif <= tarif ? acc : item);
  acc = index === 0 ? item : compare();
  return acc;
};

const dayFirstCheapHour = +Object.entries(tarifObject)
  .filter(([, { type }]) => type === 'day')
  .reduce(getFirstCheapHour, {})[0];

let nightFirstCheapHour = +Object.entries(tarifObject)
  .filter(([, { type }]) => type === 'night')
  .map(item => {
    const index = item[0].length === 1 ? 30 + +item[0] : +item[0];
    return [item[0], item[1], index];
  })
  .sort((a, b) => a[2] - b[2])
  .reduce(getFirstCheapHour, {})[0];

const findStartHour = ({ name, mode, power, duration }) => {
  let attempt = 1;
  let start = mode === 'day' ? dayFirstCheapHour : nightFirstCheapHour;
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

devices.filter(({ duration }) => duration === 24).forEach(({ name, power }) => {
  Object.keys(schedule).forEach(hour => {
    schedule[hour].push(name);
    powers[hour] += power;
  });
});

devices.filter(device => device.duration < 24).forEach(device => {
  const { name, duration } = device;

  const start = findStartHour(device);
  if (start) {
    // l(name, power, start, duration);
    const period = createPeriod(start, duration);
    for (let hour of period) {
      schedule[hour].push(name);
    }
  } else {
    throw new RangeError(
      `Умный дом не сможет включить ${name} из-за перегрузки по мощности`
    );
  }
});
l(schedule);
// powers.map((p, i) => l(i, p, schedule[i]));
