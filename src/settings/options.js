function clearMessage() {
  const messageAreaDiv = document.getElementById('message_area');
  messageAreaDiv.classList.remove("notification", "is-info", "is-warning");
  messageAreaDiv.innerText = '';
}

function createMessage(text, isError) {
  const messageAreaDiv = document.getElementById("message_area");
  messageAreaDiv.classList.remove("notification", "is-info", "is-warning");
  messageAreaDiv.innerText = text;
  messageAreaDiv.classList.add('notification');
  if (isError) {
    messageAreaDiv.classList.add('is-warning');
  } else {
    messageAreaDiv.classList.add('is-info');
  }
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete');
  messageAreaDiv.appendChild(deleteButton);
  deleteButton.addEventListener('click', clearMessage);

  messageAreaDiv.scrollIntoView(true);
}

async function saveOptions(e) {
  e.preventDefault();

  try {
    await browser.storage.local.set({
      settingJson: JSON.parse(document.getElementById("settingJson").value),
    });

    const urlsString = document.getElementById("settingUrls").value.trim();
    if (urlsString === '') {
      await browser.storage.local.set({
        settingUrls: []
      });
    } else {
      const urls = urlsString.split(',');
      await browser.storage.local.set({
        settingUrls: urls
      });

      fetchSetgginsAndSave(urls);
    }

    createMessage("保存しました。", false);
  } catch (e) {
    createMessage(`エラー: ${e}`, true);
  }
}

async function restoreOptions() {
  const storageItems = await browser.storage.local.get("settingJson");
  const settingJson = storageItems.settingJson || {items: []};
  document.getElementById("settingJson").value = JSON.stringify(settingJson, null, '  ');

  const settingUrlsItem = await browser.storage.local.get("settingUrls");
  const settingUrls = settingUrlsItem.settingUrls || [];
  document.getElementById("settingUrls").value = settingUrls.join(',');
}

document.addEventListener("DOMContentLoaded", () => {
  restoreOptions();

  document.querySelector("form").addEventListener("submit", saveOptions);
});

