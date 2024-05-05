import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const ForwarderFactory = buildModule("ForwarderFactory", (m) => {
    const forwarderFactory = m.contract("ForwarderFactory");

    return { forwarderFactory };
});

export default ForwarderFactory;