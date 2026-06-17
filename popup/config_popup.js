const storageAPI = typeof browser !== "undefined" ? browser.storage : chrome.storage;

function getElements(){
    return {
        jump: document.getElementById('jump'),
        adaptable: document.getElementById('adaptable'),
        max_speed: document.getElementById('max_speed'),
        step_size: document.getElementById('step_size')
    };
}

function loadFields(){
    let campos = getElements();
    storageAPI.local.get('jump_config').then(
        (store) => {
            let jump_config = store.jump_config ?? { jump: 5, adaptable: true };
            campos.jump.value = jump_config.jump;
            campos.adaptable.checked = jump_config.adaptable;
        }
    );
    storageAPI.local.get('speed_config').then(
        (store) => {
            console.log(store)
            let speed_config = store.speed_config ?? { max_speed: 4, step_size: 0.5 };
            campos.max_speed.value = speed_config.max_speed;
            campos.step_size.value = speed_config.step_size;
        }
    );
}

function resetConfig(){
    resetJumpConfig();
    resetSpeedConfig();
}

function resetSpeedConfig(){
    storageAPI.local.set({
        speed_config: {
            max_speed: 4,
            step_size: 0.5
        }
    });
}

function resetJumpConfig(){
    storageAPI.local.set({
        jump_config: {
            jump: 5,
            adaptable: true
        }
    });
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

        document.getElementById('reset_btn').addEventListener('click',
            (ev) => {
                resetConfig();
                loadFields();
            }
        );

        loadFields();
    }
)