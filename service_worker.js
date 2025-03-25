const storageAPI = typeof browser !== "undefined" ? browser.storage : chrome.storage;

const configPorDefecto = {
    jump_config: {
        jump: 5,
        adaptable: true
    },
    speed_config: {
        max_speed: 4,
        step_size: 0.5
    }
};

const runtimeAPI = typeof browser !== "undefined" ? browser.runtime : chrome.runtime;

runtimeAPI.onInstalled.addListener(() => {
    storageAPI.local.get().then(
        (result) => {
            if (result === undefined){
                storageAPI.local.set(configPorDefecto);
            }
        }
    );
});