function getVideo(){
    return document.querySelector('video');
}

const salto = 5;

document.addEventListener('keydown', function (event) {
    console.log('Tecla presionada:', event.key);

    let video = getVideo();

    switch (event.key){
        case ' ':
            if (video.paused){
                video.play();
            }else{
                video.pause();
            }
            break;
        case 'ArrowLeft':
            if (video.currentTime-salto < 0){
                video.currentTime = 0
            }else{
                video.currentTime -= salto;
            }
            break;
        case 'ArrowRight':
            video.currentTime += salto;
            break;
        case 'ArrowUp':
            video.playbackRate = (video.playbackRate == 8) ? 1 : video.playbackRate+0.5;
            break;
        case 'ArrowDown':
            video.playbackRate = (video.playbackRate == 1) ? 8 : video.playbackRate-0.5;
            break;
    }
});