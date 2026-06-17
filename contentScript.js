const storageAPI = typeof browser !== "undefined" ? browser.storage : chrome.storage;

let video = undefined;

function getVideo(){
    return video === undefined ? document.querySelector('video') : video;
}

function jump(jump, adaptable){
    let video = getVideo();

    let salto = (adaptable) ? jump * video.playbackRate : jump;

    if (video.currentTime + salto < 0){
        video.currentTime = 0;
    }else{
        video.currentTime += salto;
    }
}

function change_speed(max_speed, step_size){
    let video = getVideo();

    let playRate = video.playbackRate + step_size;

    if (playRate > max_speed){
        playRate = 1;
    }else if (playRate < 1) {
        playRate = max_speed;
    }

    video.playbackRate = playRate;
}

function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

if (window.location.href.includes("bigbluebutton")){
    waitForElement(".top-content").then((elem) => {
        elem.addEventListener('click', () => {
            let video = getVideo();
            video.paused ? video.play() : video.pause();
        });
        elem.addEventListener('dblclick', () => {
            elem.querySelector('video').requestFullscreen();
        })
    });

    document.addEventListener('visibilitychange', () =>{
        if (!document.hidden){ 
            // esto deberia solucionar el problema del desfase de imagen y audio
            let video = getVideo();
            video.currentTime = video.currentTime - 1;
        }
    });
    
    document.addEventListener('keydown', function (event) {
        console.log('Tecla presionada:', event.key);
        switch (event.key) {
            case ' ':
                let video = getVideo();

                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
                break;
            case 'ArrowLeft':
                storageAPI.local.get('jump_config')
                .then( 
                    (store) => {
                        let jump_config = store.jump_config ?? { jump: 5, adaptable: true };
                        jump(-Number(jump_config.jump), jump_config.adaptable)
                    }
                );
                break;
            case 'ArrowRight':
                storageAPI.local.get('jump_config')
                .then( 
                    (store) => {
                        let jump_config = store.jump_config ?? { jump: 5, adaptable: true };
                        jump(Number(jump_config.jump), jump_config.adaptable);
                    }
                );
                break;
            case 'ArrowUp':
                storageAPI.local.get('speed_config')
                .then(
                    (store) => {
                        let speed_config = store.speed_config ?? { max_speed: 4, step_size: 0.5 };
                        change_speed(Number(speed_config.max_speed), Number(speed_config.step_size));
                    }
                )
                break;
            case 'ArrowDown':
                storageAPI.local.get('speed_config')
                .then(
                    (store) => {
                        let speed_config = store.speed_config ?? { max_speed: 4, step_size: 0.5 };
                        change_speed(Number(speed_config.max_speed), -Number(speed_config.step_size));
                    }
                )
                break;
        }
    });
}