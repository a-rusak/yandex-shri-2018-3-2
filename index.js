// import inputData from './data/input'
const l = console.log;

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

const dayDevices = devices.filter(device => device.mode === 'day');
// dayDevices
const nightDevices = devices.filter(device => device.mode === 'night');
// nightDevices
const dayAndNightDevices = devices.filter(device => device.mode === undefined);
// dayAndNightDevices

const arr = [...Array(24)].map((_, i) => i);
// const ratesByHour = arr.map(hour => {})
const HOURS_PER_DAY = 24;

const tarifByHours = Array(HOURS_PER_DAY);

rates.forEach(rate => {
  let { from, to } = rate;
  if (from > to) {
    for (let i = from; i < HOURS_PER_DAY; i++) {
      tarifByHours[i] = rate.value;
    }
    for (let i = 0; i < to; i++) {
      tarifByHours[i] = rate.value;
    }
  } else {
    for (let i = from; i < to; i++) {
      tarifByHours[i] = rate.value;
      //console.log(i, tarifByHours[i])
    }
  }
});
tarifByHours.forEach((a, i) => l(i, a));
