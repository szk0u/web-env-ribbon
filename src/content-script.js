(async () => {

  if (window.websiteRibbonExtensionHasRun) {
    return;
  }
  window.websiteRibbonExtensionHasRun = true;

  const ribbonAreaDivStyle = `
    position: fixed;
    top: 0px;
    right: 0px;
    width: 200px;
    height: 200px;
    overflow: hidden;
    z-index: 1000;
    pointer-events: none;
  `;

  const ribbonDivStyle = `
    display: inline-block;
    position: absolute;
    padding: 7px 0;
    left: -30px;
    top: 73px;
    /* ribbon_area の width*width + height*height の平方根 */
    width: 282px;
    text-align: center;
    font-size: 18px;
    line-height: 16px;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    pointer-events: auto;
  `;

  const ribbonAreaDivId = 'website-ribbon-ribbon-area-div';

  function mouseOver(e) {
    e.target.style.opacity = "0";
  }

  function mouseOut(e) {
    e.target.style.opacity = "";
  }

  function appendRibbonDiv({text, description, hideOnMouseover, ribbonColor}) {
    if (document.getElementById(ribbonAreaDivId)) {
      return;
    }

    const ribbonAreaDiv = document.createElement("div");
    ribbonAreaDiv.id = ribbonAreaDivId;
    ribbonAreaDiv.style.cssText = ribbonAreaDivStyle;

    const ribbonDiv = document.createElement("div");
    ribbonDiv.style.cssText = ribbonDivStyle;
    if (typeof ribbonColor === 'undefined') {
      ribbonDiv.style.background = 'rgb(255,165,32, 0.6)';
    } else {
      ribbonDiv.style.background = ribbonColor;
    }
    ribbonDiv.innerText = text;
    if (typeof description !== 'undefined') {
      ribbonDiv.title = description;
    }

    ribbonAreaDiv.appendChild(ribbonDiv);
    document.body.appendChild(ribbonAreaDiv);

    if (hideOnMouseover) {
      ribbonDiv.addEventListener('mouseover', mouseOver);
      ribbonDiv.addEventListener('mouseout', mouseOut);
    }
  }

  async function appendRibbon() {
    const settingJsonItem = await browser.storage.local.get("settingJson");
    const setting = settingJsonItem.settingJson;
    if (typeof setting === "undefined") {
      return;
    }

    const settingJsonFromUrlItem = await browser.storage.local.get("settingJsonFromUrl");
    const settingJsonFromUrl = settingJsonFromUrlItem.settingJsonFromUrl;

    let items = setting.items;

    if (typeof settingJsonFromUrl !== 'undefined') {
      items = items.concat(settingJsonFromUrl.items);
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (window.location.host.includes(item.domain)) {
        await appendRibbonDiv(item);
        break;
      }
    }
  }

  function removeRibbon() {
    const ribbonAreaDiv = document.getElementById(ribbonAreaDivId);
    if (ribbonAreaDiv !== null) {
      document.body.removeChild(ribbonAreaDiv);
    }
  }

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "removeRibbon") {
      removeRibbon();
    } else if (message.command === "appendRibbon") {
      appendRibbon();
    }
  });

  const displayRibbon = (await browser.storage.local.get('displayRibbon')).displayRibbon;
  if (typeof displayRibbon === 'undefined' || displayRibbon) {
    appendRibbon();
  }

  // for Ruby on Rails app
  window.addEventListener('turbolinks:load', async () => {
    const storageItem = await browser.storage.local.get('displayRibbon');
    let displayRibbon = storageItem.displayRibbon;
    if (typeof storageItem.displayRibbon === 'undefined') {
      displayRibbon = true;
    }

    if (displayRibbon) {
      appendRibbon();
    } else {
      removeRibbon();
    }
  });
})();
