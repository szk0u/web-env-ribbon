async function handleStartup() {
  const settingUrlsItem = await browser.storage.local.get("settingUrls");
  const settingUrls = settingUrlsItem.settingUrls;
  console.log(settingUrls);
  if (typeof settingUrls === 'undefined') {
    return;
  }

  fetchSetgginsAndSave(settingUrls);
}

browser.runtime.onStartup.addListener(handleStartup);
