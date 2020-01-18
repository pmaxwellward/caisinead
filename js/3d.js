document.body.className +='fade-out';

window.onload = function() { 
  const vids = document.getElementsByTagName("video");

    for (let i = 0; i < vids.length; i++) {
      if(window.matchMedia("(min-width:500px)").matches) {
      vids[i].autoplay = false;
      vids[i].addEventListener( "mouseover", function(e) { 
        vids[i].play()
      });
      vids[i].addEventListener( "mouseout", function(e) {
        vids[i].pause()
      });
      } else {
        vids[i].autoplay = true;
      }
    }
  document.body.classList.remove('fade-out');
}

document.addEventListener("DOMContentLoaded", function() {
  var lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));

  if ("IntersectionObserver" in window) {
    const options = {
      root: null,
      threshold: .95
    };
    var lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(video) {
        if (video.isIntersecting) {
          for (var source in video.target.children) {
            var videoSource = video.target.children[source];
            if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
              videoSource.src = videoSource.dataset.src;
            }
          }  
          video.target.load();
          video.target.classList.remove("lazy");
          lazyVideoObserver.unobserve(video.target);
        }
      }, options);
    });

    lazyVideos.forEach(function(lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  }
});




