(async () => {
  const listenEvents = () => {
    document.getElementById('website-ribbon_display-ribbon')
      .addEventListener('change', (e) => {

        const checked = e.target.checked;
        browser.storage.local.set({
          displayRibbon: checked
        });

        if (checked) {
          browser.browserAction.setIcon({
            path: "../../icons/ribbon_orange.png"
          });
        } else {
          browser.browserAction.setIcon({
            path: "../../icons/ribbon_gray.png"
          });
        }

        browser.tabs.query({
          currentWindow: true,
          active: true
        }).then(tabs => {
          if (checked) {
            browser.tabs.sendMessage(tabs[0].id, {
              command: 'appendRibbon'
            });
          } else {
            browser.tabs.sendMessage(tabs[0].id, {
              command: 'removeRibbon'
            });
          }
        });
      });

    document.getElementById('open_option_button')
      .addEventListener('click', () => {
        browser.runtime.openOptionsPage();
      });
  };

  document.addEventListener('DOMContentLoaded', async () => {
    const storageItem = await browser.storage.local.get('displayRibbon');
    let displayRibbon = storageItem.displayRibbon;
    if (typeof storageItem.displayRibbon === 'undefined') {
      displayRibbon = true;
    }
    document.getElementById('website-ribbon_display-ribbon').checked = displayRibbon;

    try {
      await browser.tabs.executeScript({file: "/lib/browser-polyfill.min.js"});
      await browser.tabs.executeScript({file: "/src/content-script.js"});
      listenEvents();
    } catch(e) {
      console.log(e);
    }
  });
})();
