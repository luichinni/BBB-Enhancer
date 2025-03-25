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

if (window.location.href.includes("bigbluebutton")){
    document.addEventListener('visibilitychange', () =>{
        if (!document.hidden){ 
            // esto deberia solucionar el problema del desfase de imagen y audio
            let video = getVideo();
            video.currentTime = video.currentTime;
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
                        let jump_config = store.jump_config;
                        jump(-Number(jump_config.jump), jump_config.adaptable)
                    }
                );
                break;
            case 'ArrowRight':
                storageAPI.local.get('jump_config')
                .then( 
                    (store) => {
                        let jump_config = store.jump_config;
                        jump(Number(jump_config.jump), jump_config.adaptable);
                    }
                );
                break;
            case 'ArrowUp':
                storageAPI.local.get('speed_config')
                .then(
                    (store) => {
                        let speed_config = store.speed_config;
                        change_speed(Number(speed_config.max_speed), Number(speed_config.step_size));
                    }
                )
                break;
            case 'ArrowDown':
                storageAPI.local.get('speed_config')
                .then(
                    (store) => {
                        let speed_config = store.speed_config;
                        change_speed(Number(speed_config.max_speed), -Number(speed_config.step_size));
                    }
                )
                break;
        }
    });
}