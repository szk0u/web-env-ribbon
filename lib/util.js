async function fetchSetgginsAndSave(urls) {
  let allItems = [];
  for (let i = 0;i < urls.length; i++) {
    const url = urls[i];
    const response = await fetch(url, { mode: "cors" });
    const data = await response.json();
    const items = data.items;

    if (typeof items === 'undefined') {
      return;
    }

    allItems = allItems.concat(items)
  }

  browser.storage.local.set({
    settingJsonFromUrl: { items: allItems },
  });
}
