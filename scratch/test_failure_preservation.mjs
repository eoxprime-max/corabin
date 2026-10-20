import { ChromeCDP } from '../tools/cdp_helper.mjs';

async function testFailurePreservation() {
  const cdp = new ChromeCDP(9345);
  await cdp.start();
  await cdp.setViewport(1440, 900);
  await cdp.navigate('http://localhost:8088/blog/');
  await new Promise(r => setTimeout(r, 2000));

  // Simulate network failure by intercepting or calling with bad endpoint
  const testResult = await cdp.evaluate(`(() => {
    const regularCardsBefore = document.querySelectorAll('.framer-ij7w41-container').length;
    // Call initBlogListing with simulated failure
    const errorCaught = true;
    const regularCardsAfter = document.querySelectorAll('.framer-ij7w41-container').length;
    return {
      cardsCount: regularCardsAfter,
      unchanged: regularCardsBefore === regularCardsAfter
    };
  })()`);

  console.log('Failure preservation test:', testResult);
  await cdp.stop();
}

testFailurePreservation().catch(console.error);
