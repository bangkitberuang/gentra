async function verify() {
  const html = await (await fetch('https://gentra.kitt.lt')).text();
  console.log('HTML length:', html.length);
  const match = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
  console.log('Bundle:', match ? match[1] : 'not found');
  if (match) {
    const js = await (await fetch('https://gentra.kitt.lt' + match[1])).text();
    console.log('JS length:', js.length);
    console.log('Includes ErrorBoundary / SAFE MODE:', js.includes('SAFE MODE'));
    console.log('Includes Download:', js.includes('Download'));
    console.log('Includes RotateCcw:', js.includes('RotateCcw'));
    console.log('Includes Instrument Serif:', html.includes('Instrument+Serif'));
  }
}
verify();
