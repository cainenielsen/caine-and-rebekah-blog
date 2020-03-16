document.addEventListener('DOMContentLoaded', function() {
    try {
      let app = firebase.app();
      let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
      document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
    } catch (e) {
      console.error(e);
      document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
    }

    console.log("Checking article path.");
    var pathname = window.location.pathname;
        if(pathname == "/p/") {
          console.log("No article chosen.");
        } else {
          if(pathname.includes("/p/")) {
            url = pathname.slice(3);
            console.log("Article path: " + url);
            console.log("Starting database request");
            $.get('/loadData', {slug: url}, function(data, status) {
              console.log("Database response: " + status);
              if(data.id) {
                console.log("Article ID: " + data.id);
                console.log("Article Slug: " + data.slug);
                console.log("Article Title: " + data.title);

                $("#blog-header").text(data.title);
                $("#blog-highlight").css("background-image","url("+ data.highlight +")");

                converter = new showdown.Converter();
                text = data.content,
                html = converter.makeHtml(text);
                
                $("#blog-content").html(html);
              }
            });
          }
        }
  });