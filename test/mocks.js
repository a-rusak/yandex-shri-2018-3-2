export default [
  {
    input: {
      devices: [
        {
          id: 'A',
          name: 'test1',
          power: 1000,
          duration: 3
        }
      ],
      rates: [
        {
          from: 0,
          to: 24,
          value: 2
        }
      ],
      maxPower: 1000
    },
    output: {
      schedule: {
        '0': [],
        '1': [],
        '2': [],
        '3': [],
        '4': [],
        '5': [],
        '6': [],
        '7': [],
        '8': [],
        '9': [],
        '10': [],
        '11': [],
        '12': [],
        '13': [],
        '14': [],
        '15': [],
        '16': [],
        '17': [],
        '18': [],
        '19': [],
        '20': [],
        '21': ['A'],
        '22': ['A'],
        '23': ['A']
      },
      consumedEnergy: {
        value: 6,
        devices: {
          A: 6
        }
      }
    }
  },

  {
    input: {
      devices: [
        {
          id: 'A',
          name: 'test1',
          power: 2000,
          duration: 2,
          mode: 'day'
        },
        {
          id: 'B',
          name: 'test1',
          power: 2000,
          duration: 1,
          mode: 'night'
        }
      ],
      rates: [
        {
          from: 0,
          to: 24,
          value: 2
        }
      ],
      maxPower: 2000
    },
    output: {
      schedule: {
        '0': [],
        '1': [],
        '2': [],
        '3': [],
        '4': [],
        '5': [],
        '6': [],
        '7': ['A'],
        '8': ['A'],
        '9': [],
        '10': [],
        '11': [],
        '12': [],
        '13': [],
        '14': [],
        '15': [],
        '16': [],
        '17': [],
        '18': [],
        '19': [],
        '20': [],
        '21': ['B'],
        '22': [],
        '23': []
      },
      consumedEnergy: {
        value: 12,
        devices: {
          A: 8,
          B: 4
        }
      }
    }
  },

  {
    input: {
      devices: [
        {
          id: 'A',
          name: 'test1',
          power: 200,
          duration: 2,
          mode: 'night'
        },
        {
          id: 'B',
          name: 'test1',
          power: 100,
          duration: 5,
          mode: 'night'
        }
      ],
      rates: [
        {
          from: 0,
          to: 24,
          value: 2
        }
      ],
      maxPower: 2000
    },
    output: {
      schedule: {
        '0': ['B'],
        '1': ['B'],
        '2': [],
        '3': [],
        '4': [],
        '5': [],
        '6': [],
        '7': [],
        '8': [],
        '9': [],
        '10': [],
        '11': [],
        '12': [],
        '13': [],
        '14': [],
        '15': [],
        '16': [],
        '17': [],
        '18': [],
        '19': [],
        '20': [],
        '21': ['A', 'B'],
        '22': ['A', 'B'],
        '23': ['B']
      },
      consumedEnergy: {
        value: 1.8,
        devices: {
          A: 0.8,
          B: 1
        }
      }
    }
  },

  {
    input: {
      devices: [
        {
          id: 'A',
          name: 'test1',
          power: 2000,
          duration: 2,
          mode: 'night'
        },
        {
          id: 'B',
          name: 'test1',
          power: 2000,
          duration: 5,
          mode: 'night'
        }
      ],
      rates: [
        {
          from: 0,
          to: 24,
          value: 5
        }
      ],
      maxPower: 2000
    },
    output: {
      schedule: {
        '0': ['B'],
        '1': ['B'],
        '2': ['B'],
        '3': ['B'],
        '4': [],
        '5': [],
        '6': [],
        '7': [],
        '8': [],
        '9': [],
        '10': [],
        '11': [],
        '12': [],
        '13': [],
        '14': [],
        '15': [],
        '16': [],
        '17': [],
        '18': [],
        '19': [],
        '20': [],
        '21': ['A'],
        '22': ['A'],
        '23': ['B']
      },
      consumedEnergy: {
        value: 70,
        devices: {
          A: 20,
          B: 50
        }
      }
    }
  },

  {
    input: {
      devices: [
        {
          id: 'A',
          name: 'test1',
          power: 1000,
          duration: 1,
        }
      ],
      rates: [
        {
          from: 0,
          to: 24,
          value: 1
        }
      ],
      maxPower: 999
    }
  },

];
