#!/usr/bin/env zx
import { $, cd } from 'zx';

// Function to create the domain structure
const createDomain = async (domainName: string): Promise<void> => {
  cd(`src/domains`);
  await $`mkdir ${domainName}`;

  // Create the files
  await Promise.all([
    $`touch ${domainName}/api.ts`,
    $`touch ${domainName}/event.ts`,
    $`touch ${domainName}/index.ts`,
    $`touch ${domainName}/request.ts`,
    $`touch ${domainName}/schema.ts`,
    $`touch ${domainName}/service.ts`
  ]);
};

// Main interaction loop
const main = async (): Promise<void> => {
  console.log('Enter the domain name:');

  const domainName: string = (
    await $`read domainName && echo $domainName`
  ).stdout.trim();
  console.log(`Creating domain ${domainName}`);
  // Create the domain
  await createDomain(domainName);
};

// Run the main function
main();
