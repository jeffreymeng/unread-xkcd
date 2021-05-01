const getData = (ids) => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      ['readComics'],
      ({ readComics }) => resolve(readComics)
    );
  });
}

const loadData = async (ids) => {
  const current = new Set(await getData() ?? []);
  for (const id of ids) {
    current.add(id);
  }
  return new Promise((resolve) => {
    chrome.storage.sync.set({
      readComics: Array.from(current)
    }, resolve);
  });
};

const buttons = new Map([
  ['Load Browser History', async () => {
    const permission = await new Promise((resolve) => {
      chrome.permissions.request({
        permissions: ['history']
      }, resolve);
    });
    if (!permission) return alert("Failed to load history.");
    const candidatePages = await new Promise((resolve) => {
      chrome.history.search({ text: 'xkcd' }, resolve);
    });
    chrome.permissions.remove({
      permissions: ['history']
    });
    const ids = candidatePages
      .map(({ url }) => new URL(url))
      .filter(({ host }) => host === 'xkcd.com')
      .filter(({ pathname }) => pathname.match(/^\/\d+\/$/))
      .map(({ pathname }) => parseInt(pathname.match(/\d+/)[0], 10))
      .filter(v => v);
    await loadData(ids);
    alert('History loaded.');
  }],
  ['Export Data', async () => {
    const ids = await getData();
    document.querySelector('textarea').value = JSON.stringify(ids);
  }],
  ['Import Data', async () => {
    const data = document.querySelector('textarea').value;
    let ids = []
    try {
      const parsed = JSON.parse(data);
      ids = parsed.filter(v => typeof(v) === 'number');
    } catch {
      return alert('Invalid data.');
    }
    await loadData(ids);
    alert('Data loaded.');
  }],
  ['Clear Data', async () => {
    const confirmation = document.querySelector('input').value;
    if (confirmation !== 'Permanently Clear Data')
      return alert('Please type "Permanently Clear Data" to confirm.');
    await new Promise((resolve) => {
      chrome.storage.sync.set({
        readComics: []
      }, resolve);
    });
    alert('Data cleared.');
  }],
]);

(async () => {
  await new Promise((resolve) => {
      window.addEventListener('load', resolve);
  });

  for (const button of document.querySelectorAll('button')) {
    button.addEventListener('click', buttons.get(button.textContent));
  }
})();
