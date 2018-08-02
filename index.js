// import inputData from './data/input'
const { devices, rates } = {
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
const schedule = Object.assign({}, [...Array(TWENTY_FOUR_HOURS)].map((_, i) => []));


const dayDevices = devices.filter(device => device.mode === 'day');
// dayDevices
const nightDevices = devices.filter(device => device.mode === 'night');
// nightDevices
const dayAndNightDevices = devices.filter(device => device.mode === undefined);
// dayAndNightDevices


const tarifByHours = Array(TWENTY_FOUR_HOURS);

rates.forEach(rate => {
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
});

const propertyActions = [
  {
    name: 'day',
    check: arg => arg > 6 && arg < 21
  },
  {
    name: 'night',
    check: arg => (arg < 7 && arg >= 0) || arg > 20
  }
];
const getPropertyAction = arg =>
  propertyActions.find(({ check }) => check(arg));

// tarifByHoursObject = Object.assign({}, tarifByHours);
tarifObject = tarifByHours.reduce((acc, tarif, hour) => {
  return {
    ...acc,
    [hour]: {
      tarif,
      type: getPropertyAction(hour).name
    }
  };
}, {});
// l(tarifObject)

function getDevice(tarif, hour) {
  const { name } = getPropertyAction(hour);
  return name;
}
devices
  .filter(device => device.duration === TWENTY_FOUR_HOURS)
  .forEach(device => {
    Object.keys(schedule).forEach(hour => {
      schedule[hour].push(device.name);
    });
  });

devices
  .filter(device => device.duration < TWENTY_FOUR_HOURS)
  .forEach(device => {
  const { id, name, power, duration, mode } = device;
  let startHour = mode === 'day' ? 10 : 23;
  let currentPower = 0;
  const hours = [...Array(duration)].map(
    (_, i) => (startHour + i > 23 ? i - 1 : startHour + i)
  );
  hours.forEach(hour => {
    schedule[hour].push(name)
    currentPower = schedule[hour].reduce((sum, n) => {
      const {power} = devices.find(d => d.name === n);
      return sum + power;
    }, 0);
    l(schedule[hour], currentPower);
  });
  //l(device.name, hours)
});
l(schedule);
