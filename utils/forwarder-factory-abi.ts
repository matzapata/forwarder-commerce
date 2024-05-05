export const forwarderFactoryAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'forwarder',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'forwardTo',
        type: 'address',
      },
    ],
    name: 'ForwarderCreated',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_forwardTo',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: '_salt',
        type: 'bytes32',
      },
    ],
    name: 'computeAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_forwardTo',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: '_salt',
        type: 'bytes32',
      },
    ],
    name: 'createForwarder',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
