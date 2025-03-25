const storageAPI = typeof browser !== "undefined" ? browser.storage : chrome.storage;

function getElements(){
    return {
        jump: document.getElementById('jump'),
        adaptable: document.getElementById('adaptable'),
        max_speed: document.getElementById('max_speed'),
        step_size: document.getElementById('step_size')
    };
}

document.addEventListener('DOMContentLoaded',
    (doc, ev) => {
        document.getElementById('save_btn').addEventListener('click',
            (ev) => {
                let campos = getElements();
                let config = {
                    jump_config: {
                        jump: campos.jump.value,
                        adaptable: campos.adaptable.checked
                    },
                    speed_config: {
                        max_speed: campos.max_speed.value,
                        step_size: campos.step_size.value
                    }
                };
                storageAPI.local.set(config);
                window.close();
            }
        );

        let campos = getElements();
        storageAPI.local.get('jump_config').then(
            (store) => {
                let jump_config = store.jump_config;
                campos.jump.value = jump_config.jump;
                campos.adaptable.checked = jump_config.adaptable;
            }
        );
        storageAPI.local.get('speed_config').then(
            (store) => {
                let speed_config = store.speed_config;
                campos.max_speed.value = speed_config.max_speed;
                campos.step_size.value = speed_config.step_size;
            }
        );
    }
)