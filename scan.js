const { Client } = require('pg'); // We don't have pg, but wait, we don't need it.
const net = require('net');

const regions = [
  'ap-southeast-1',
  'us-east-1',
  'us-west-1',
  'eu-west-1',
  'eu-central-1',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-south-1',
  'sa-east-1',
  'ca-central-1',
  'eu-west-2'
];

async function checkHost(host) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(2000);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(5432, host);
  });
}

async function findRegion() {
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    console.log(`Checking ${host}...`);
    const isUp = await checkHost(host);
    if (isUp) {
      console.log(`FOUND: ${host}`);
      process.exit(0);
    }
  }
  console.log("Not found.");
}

findRegion();
