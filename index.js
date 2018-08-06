export default function createSchedule ({ devices = [], rates = [], maxPower = 0 } = {}) {

  const schedule = Object.assign({}, [...Array(24)].map(_ => []));
  const powers = new Array(24).fill(0);
  const tarifs = new Array(24).fill(0);
  const devicesPeriod = {};
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
    throw new RangeError('Некорректно определена сетка тарифов');
  }

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

  const tarifObject = tarifs.reduce((acc, tarif, hour) => {
    return Object.assign(acc, {
      [hour]: {
        tarif,
        type: getPropertyAction(hour).name
      }
    });
  }, {});

  const getFirstCheapHour = (acc, item, index) => {
    const [, { tarif }] = item;
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

  const findStartHour = ({ mode, power, duration }) => {
    let attempt = 1;
    let start = mode === 'day' ? dayFirstCheapHour : nightFirstCheapHour;
    return testPeriod(createPeriod(start, duration));

    function testPeriod(period) {
      for (let hour of period) {
        if (powers[hour] + power > maxPower) {
          if (attempt < 24 - duration) {
            attempt++;
            start = (start + 1) % 24;
            testPeriod(createPeriod(start, duration));
          } else {
            start = null;
          }
          break;
        }
        powers[hour] += power;
      }
      return start;
    }
  };

  devices.filter(({ duration }) => duration === 24).forEach(({ id, name, power }) => {
    Object.keys(schedule).forEach(hour => {
      if (powers[hour] + power > maxPower) {
        throw new RangeError(
          `Умный дом не сможет включить ${name} из-за перегрузки по мощности`
        );
      } else {
        schedule[hour].push(id);
        devicesPeriod[id] = createPeriod(0, 24);
        powers[hour] += power;
      }
    });
  });

  devices.filter(device => device.duration < 24).forEach(device => {
    const { id, name, duration } = device;

    const start = findStartHour(device);
    if (start) {
      const period = createPeriod(start, duration);
      devicesPeriod[id] = period;
      for (let hour of period) {
        schedule[hour].push(id);
      }
    } else {
      throw new RangeError(
        `Умный дом не сможет включить ${name} из-за перегрузки по мощности`
      );
    }
  });

  const consumedEnergyValue = Math.round(powers.reduce((acc, power, hour) => {
    acc += (power / 1000) * tarifs[hour];
    return acc;
  }, 0) * 100) / 100;

  const consumedEnergyDevices = Object.keys(devicesPeriod).reduce(
    (acc, deviceId) => {
      const consumedEnergyDevice = Math.round(devicesPeriod[deviceId].reduce(
        (accu, hour) => {
          const { power } = devices.find(({ id }) => id === deviceId);
          accu += (power / 1000) * tarifs[hour];
          return accu;
        },
        0
      ) * 100) / 100;
      return Object.assign(acc, {
        [deviceId]: consumedEnergyDevice
      });
    },
    {}
  );

  return {
    schedule,
    consumedEnergy: {
      value: consumedEnergyValue,
      devices: consumedEnergyDevices
    }
  };
}
