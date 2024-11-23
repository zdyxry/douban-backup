import { consola } from 'consola';
import { fetchRSSFeeds, handleRSSFeeds } from './handle-rss';
import handleNotion from './handle-notion';
import handleNeodb from './handle-neodb';
import { ItemStatus } from './types';

async function main(): Promise<void> {
  consola.info('Fetching RSS feeds...');
  const feeds = await fetchRSSFeeds();
  if (feeds.length === 0) {
    consola.info('No new items, exiting...');
    return;
  }

  const normalizedFeeds = handleRSSFeeds(feeds);
  consola.info(`There are total ${normalizedFeeds.length} item(s) need to insert.`);
  const completeFeeds = normalizedFeeds.filter(f => f.status === ItemStatus.Complete);
  consola.info(`There are total ${completeFeeds.length} complete item(s) need to insert.`);

  // if (completeFeeds.length) {
  //   await handleNotion(completeFeeds);
  // }

  consola.info('Syncing to Neodb...');
  await handleNeodb(normalizedFeeds);
}

main();
